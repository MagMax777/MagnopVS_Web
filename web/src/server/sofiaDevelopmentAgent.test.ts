import test from "node:test";
import assert from "node:assert/strict";
import { readFile, unlink } from "node:fs/promises";
import {
  classifyGeminiError,
  containsCredentialMaterial,
  isAllowedProjectPath,
  readSofiaDevelopmentFile,
  redactSensitiveText,
  runSofiaDevelopmentCheck,
  runSofiaDevelopmentTask,
} from "./sofiaDevelopmentAgent.js";

const root = "C:/workspace/magnopvs";
const fakeAI = (generateContent: (request?: unknown) => Promise<{ text?: string }>) => ({ models: { generateContent } }) as never;
const noWait = async () => undefined;

test("allows project-relative source files and rejects traversal", () => {
  assert.equal(isAllowedProjectPath("src/components/Sofia/SofiaAssistant.tsx", root), true);
  assert.equal(isAllowedProjectPath("README.md", root), true);
  for (const candidate of ["../outside.txt", "C:/secrets.txt", "src/../../outside.ts"]) assert.equal(isAllowedProjectPath(candidate, root), false);
});

test("blocks secrets and generated or dependency directories", () => {
  for (const candidate of [".env", ".env.local", ".npmrc", ".netrc", ".pypirc", "certs/signing.pem", "keys/app.key", "config/credentials.json", ".git/config", "node_modules/react/index.js", "dist/index.html", ".sofia-agent/audit.jsonl"]) {
    assert.equal(isAllowedProjectPath(candidate, root), false, candidate);
  }
});

test("redacts credentials and detects secret material", () => {
  const redacted = redactSensitiveText('GEMINI_API_KEY="do-not-share"\nconst password = "another-secret";');
  assert.equal(redacted.includes("do-not-share"), false);
  assert.equal(redacted.includes("another-secret"), false);
  assert.equal(redacted.match(/\[REDACTED\]/g)?.length, 2);
  assert.equal(containsCredentialMaterial('GEMINI_API_KEY="abcdefghijklmnop1234"'), true);
  assert.equal(containsCredentialMaterial("Actualiza Sof.IA."), false);
});

test("classifies 429 rate limit and quota separately, and distinguishes 503", () => {
  assert.equal(classifyGeminiError(Object.assign(new Error("429 Too Many Requests"), { status: 429 })).code, "GEMINI_RATE_LIMIT");
  assert.equal(classifyGeminiError(Object.assign(new Error("429 quota exceeded"), { status: 429 })).code, "GEMINI_QUOTA_EXCEEDED");
  const unavailable = classifyGeminiError(Object.assign(new Error("503 UNAVAILABLE"), { status: 503, code: "UNAVAILABLE" }));
  assert.equal(unavailable.code, "GEMINI_UNAVAILABLE");
assert.equal(classifyGeminiError(Object.assign(new Error("resource exhausted"), { status: 503 })).code, "GEMINI_UNAVAILABLE");
  assert.equal(unavailable.httpStatus, 503);
  assert.equal(unavailable.retryable, true);
});

test("recognizes timeout, network, and preserves safe context for other errors", () => {
  assert.equal(classifyGeminiError(Object.assign(new Error("request timed out"), { name: "TimeoutError" })).code, "GEMINI_TIMEOUT");
  assert.equal(classifyGeminiError(Object.assign(new Error("fetch failed"), { cause: Object.assign(new Error("socket hang up"), { code: "ECONNRESET" }) })).code, "GEMINI_NETWORK_ERROR");
  const other = classifyGeminiError(Object.assign(new Error("bad request field"), { status: 400, code: "INVALID_ARGUMENT" }));
  assert.equal(other.code, "GEMINI_ERROR");
  assert.equal(other.providerCode, "INVALID_ARGUMENT");
  assert.equal(other.safeMessage, "bad request field");
});

test("local file read uses the project path restrictions and needs no AI client", async () => {
  const result = await readSofiaDevelopmentFile("package.json");
  assert.equal(result.path, "package.json");
  assert.match(result.content, /"scripts"/);
  await assert.rejects(readSofiaDevelopmentFile(".env"), /raíz del proyecto|Ruta inválida/);
});

test("runs a bounded successful mission and writes only inside the project root", async () => {
  const relative = `src/server/.sofia-agent-test-${Date.now()}.tmp`;
  const calls = [
    { operation: "list_files", args: { path: "src/server" } },
    { operation: "plan", args: { summary: "Crear archivo temporal de prueba", actions: ["escribir dentro de la raíz"] } },
    { operation: "write_file", args: { path: relative, content: "managed test payload" } },
    { operation: "finish", args: { summary: "Prueba completada", pending: [] } },
  ];
  const ai = fakeAI(async () => ({ text: JSON.stringify(calls.shift()) }));
  const absolute = `${process.cwd()}/${relative}`;
  try {
    const result = await runSofiaDevelopmentTask(ai, "Crea un archivo temporal de prueba dentro de src/server y finaliza.");
    assert.deepEqual(result.steps.map((step) => step.operation), ["list_files", "plan", "write_file", "finish"]);
    assert.equal((result.report as { success: boolean }).success, true);
    assert.equal(await readFile(absolute, "utf8"), "managed test payload");
  } finally {
    await unlink(absolute).catch(() => undefined);
  }
});

test("does not report success when an operation failed before finish", async () => {
  const calls = [
    { operation: "read_file", args: { path: "package.json" } },
    { operation: "plan", args: { summary: "Cambiar configuración", actions: ["modificar package.json"] } },
    { operation: "write_file", args: { path: "package.json", content: "{}" } },
    { operation: "finish", args: { summary: "El cambio fue aplicado", pending: [] } },
  ];
  const ai = fakeAI(async () => ({ text: JSON.stringify(calls.shift()) }));
  const result = await runSofiaDevelopmentTask(ai, "Cambia la configuración del proyecto.");
  assert.match(String(result.steps[2]?.result), /confirmación explícita/);
  assert.equal((result.report as { done: boolean }).done, false);
  assert.equal((result.report as { success: boolean }).success, false);
  assert.equal((result.report as { code: string }).code, "AGENT_PARTIAL_FAILURE");
});

test("bounds 503 retries and returns a failed report with the last completed read", async () => {
  const delays: number[] = [];
  const contexts: string[] = [];
  let calls = 0;
  const ai = fakeAI(async (request?: unknown) => {
    calls++;
    const context = (request as { contents?: string } | undefined)?.contents ?? "";
    contexts.push(context);
    if (calls === 1) return { text: JSON.stringify({ operation: "read_file", args: { path: "package.json" } }) };
    throw Object.assign(new Error("503 UNAVAILABLE: temporary service outage"), { status: 503, code: "UNAVAILABLE" });
  });
  const result = await runSofiaDevelopmentTask(ai, "Inspecciona package.json y mejora el proyecto.", {
    retryBaseDelayMs: 7,
    sleep: async (milliseconds) => { delays.push(milliseconds); },
  });
  const report = result.report as { done: boolean; success: boolean; code: string; attempts: number; partial: { operationsCompleted: Array<{ operation: string }>; lastReadFile: { path: string; content: string } } };
  assert.equal(calls, 4); // one completed model turn, then exactly three attempts for the next turn
  assert.deepEqual(delays, [7, 14]);
  assert.equal(report.code, "GEMINI_UNAVAILABLE");
  assert.equal(report.attempts, 3);
  assert.equal(report.done, false);
  assert.equal(report.success, false);
  assert.equal(report.partial.operationsCompleted[0]?.operation, "read_file");
  assert.equal(report.partial.lastReadFile.path, "package.json");
  assert.match(report.partial.lastReadFile.content, /"scripts"/);
  assert.ok(result.id);
  assert.ok(contexts[1]?.includes("read_file"), "the same mission context must be used for retry attempts");
});

test("429 is not retried and a provider secret is hidden from the report", async () => {
  let calls = 0;
  const ai = fakeAI(async () => {
    calls++;
    throw Object.assign(new Error("429 quota exceeded GEMINI_API_KEY=abcdefghijklmnop1234"), { status: 429, code: "RESOURCE_EXHAUSTED" });
  });
  const result = await runSofiaDevelopmentTask(ai, "Inspecciona el proyecto.", { sleep: noWait });
  const serialized = JSON.stringify(result.report);
  assert.equal(calls, 1);
  assert.equal((result.report as { code: string }).code, "GEMINI_QUOTA_EXCEEDED");
  assert.equal((result.report as { success: boolean }).success, false);
  assert.equal(serialized.includes("abcdefghijklmnop1234"), false);
});

test("network and timeout retries stop at the same fixed maximum", async () => {
  for (const error of [
    Object.assign(new Error("fetch failed"), { cause: Object.assign(new Error("connection reset"), { code: "ECONNRESET" }) }),
    Object.assign(new Error("request timed out"), { name: "TimeoutError" }),
  ]) {
    let calls = 0;
    const ai = fakeAI(async () => { calls++; throw error; });
    const result = await runSofiaDevelopmentTask(ai, "Continúa la inspección local.", { retryBaseDelayMs: 0, sleep: noWait });
    assert.equal(calls, 3);
    assert.equal((result.report as { success: boolean }).success, false);
    assert.ok(["GEMINI_NETWORK_ERROR", "GEMINI_TIMEOUT"].includes((result.report as { code: string }).code));
  }
});

test("stops a mission when Gemini repeats the same tool call without reporting success", async () => {
  const calls = [
    { operation: "read_file", args: { path: "package.json" } },
    { operation: "plan", args: { summary: "Revisar scripts", actions: [] } },
    { operation: "read_file", args: { path: "package.json" } },
  ];
  const ai = fakeAI(async () => ({ text: JSON.stringify(calls.shift()) }));
  const result = await runSofiaDevelopmentTask(ai, "Inspecciona package.json y prepara un plan sin cambios.");
  assert.equal(result.steps.at(-1)?.operation, "cycle-stop");
  assert.equal((result.report as { success: boolean }).success, false);
  assert.match(String((result.report as { summary: string }).summary), /operación repetida/);
});

test("rejects commands outside the fixed check allowlist", async () => {
  await assert.rejects(runSofiaDevelopmentCheck("whoami"), /Comprobación no permitida/);
});
