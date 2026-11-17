import test from "node:test";
import assert from "node:assert/strict";
import { appendFile, mkdir, readFile, readdir, rm, writeFile } from "node:fs/promises";
import path from "node:path";
import { execFile } from "node:child_process";
import { promisify } from "node:util";
import { executeLocalMission, isAuthorizedLocalProjectRoot, isAuthorizedWindowsOwner, runSofiaDevelopmentCommand } from "./sofiaDevelopmentCli.js";

const execFileAsync = promisify(execFile);

test("only the pinned Windows owner SID is authorized", () => {
  assert.equal(isAuthorizedWindowsOwner("S-1-5-21-3490579665-1738431559-3152549-500"), true);
  assert.equal(isAuthorizedWindowsOwner("S-1-0-0"), false);
});

test("only the configured Windows project root is an authorized launcher location", () => {
  assert.equal(isAuthorizedLocalProjectRoot(process.cwd()), true);
  assert.equal(isAuthorizedLocalProjectRoot("D:/other/project"), false);
});

test("the public server keeps chat and has no development mission route; frontend has no maintenance controls or key", async () => {
  const server = await readFile("server.ts", "utf8");
  const frontend = await readFile("src/components/Sofia/SofiaAssistant.tsx", "utf8");
  assert.match(server, /app\.post\("\/api\/sofia\/chat"/);
  assert.doesNotMatch(server, /\/api\/sofia\/development|mountSofiaDevelopmentEndpoint/);
  assert.doesNotMatch(frontend, /\/api\/sofia\/development|Misiones de desarrollo|GEMINI_API_KEY|SOFIA_DEV_AGENT_TOKEN/);
  assert.match(frontend, /fetch\("\/api\/sofia\/chat"/);
});

test("the PowerShell launcher can report local status without exposing the Gemini credential", async () => {
  const { stdout } = await execFileAsync("powershell.exe", ["-NoProfile", "-File", "scripts/sofia-dev.ps1", "status"], { cwd: process.cwd(), timeout: 60_000, windowsHide: true });
  assert.match(stdout, /geminiCredentialConfigured/);
  assert.doesNotMatch(stdout, /GEMINI_API_KEY\s*[:=]\s*[^\s]+/i);
});

test("the PowerShell launcher reads a project file locally without using the Gemini provider", async () => {
  const { stdout } = await execFileAsync("powershell.exe", ["-NoProfile", "-File", "scripts/sofia-dev.ps1", "read", "-Path", "package.json"], { cwd: process.cwd(), timeout: 60_000, windowsHide: true });
  assert.match(stdout, /"path": "package\.json"/);
  assert.match(stdout, /scripts/);
  assert.doesNotMatch(stdout, /GEMINI_API_KEY\s*[:=]\s*[^\s]+/i);
});

test("an authorized local mission reuses the agent, backs up modified files, and audits its result", async () => {
  const id = Date.now();
  const relative = `src/server/sofia-cli-fixture-${id}.txt`;
  const absolute = path.join(process.cwd(), relative);
  const auditPath = path.join(process.cwd(), ".sofia-agent", "audit.jsonl");
  await mkdir(path.dirname(absolute), { recursive: true });
  await writeFile(absolute, "original fixture", "utf8");
  const backupDir = path.join(process.cwd(), ".sofia-agent", "backups");
  const beforeBackups = new Set(await readdir(backupDir).catch(() => [] as string[]));
  const previousAudit = await readFile(auditPath, "utf8").catch(() => "");
  const calls = [
    { operation: "read_file", args: { path: "package.json" } },
    { operation: "plan", args: { summary: "Actualizar fixture controlado", actions: ["modificar fixture de prueba"] } },
    { operation: "write_file", args: { path: relative, content: "updated fixture" } },
    { operation: "finish", args: { summary: "Prueba de misión local completada", pending: [] } },
  ];
  const ai = { models: { generateContent: async () => ({ text: JSON.stringify(calls.shift()) }) } } as never;
  let backupPath: string | undefined;
  try {
    const result = await runSofiaDevelopmentCommand("mission", {
      task: "Actualiza el fixture de prueba local.",
      ai,
      confirmSensitiveWrite: async () => false,
    }) as Awaited<ReturnType<typeof executeLocalMission>>
    assert.deepEqual(result.steps.map((step) => step.operation), ["read_file", "plan", "write_file", "finish"]);
    const write = result.steps[2]?.result as { backup?: string };
    assert.ok(write.backup, "existing file write must create a backup");
    backupPath = path.join(backupDir, `${write.backup}.bak`);
    assert.equal(await readFile(absolute, "utf8"), "updated fixture");
    assert.equal(await readFile(backupPath, "utf8"), "original fixture");
    const audit = await readFile(auditPath, "utf8");
    assert.ok(audit.length > previousAudit.length);
    const newEvents = audit.slice(previousAudit.length);
    assert.match(newEvents, /task-start/);
    assert.match(newEvents, /Actualiza el fixture de prueba local/);
    assert.match(newEvents, /task-finish/);
    assert.match(newEvents, /Prueba de misión local completada/);
  } finally {
    await writeFile(absolute, "original fixture", "utf8");
    await rm(absolute, { force: true });
    if (backupPath) await rm(backupPath, { force: true });
    // Leave audit records intact as the agent's operation history.
    const currentBackups = await readdir(backupDir).catch(() => [] as string[]);
    assert.ok(currentBackups.length >= beforeBackups.size);
  }
});

test("local mission confirms sensitive paths and a declined confirmation denies the write", async () => {
  const calls = [
    { operation: "read_file", args: { path: "package.json" } },
    { operation: "plan", args: { summary: "Sensitive file confirmation", actions: ["update package scripts"] } },
    { operation: "write_file", args: { path: "package.json", content: "{}" } },
    { operation: "finish", args: { summary: "Sensitive change denied", pending: [] } },
  ];
  const ai = { models: { generateContent: async () => ({ text: JSON.stringify(calls.shift()) }) } } as never;
  const result = await executeLocalMission(ai, "Inspect and update package scripts", {
    confirmSensitiveWrite: async (relativePath) => {
      assert.equal(relativePath, "package.json");
      return false;
    },
  });
  assert.match(String(result.steps[2]?.result), /confirmación explícita del propietario/);
});
test("read-only audit mode rejects model-requested writes", async () => {
  const relative = `src/server/sofia-readonly-${Date.now()}.tmp`;
  const calls = [
    { operation: "list_files", args: { path: "src/server" } },
    { operation: "plan", args: { summary: "Read-only inspection", actions: ["inspect only"] } },
    { operation: "write_file", args: { path: relative, content: "must not be written" } },
    { operation: "finish", args: { summary: "Write correctly denied", pending: [] } },
  ];
  const ai = { models: { generateContent: async () => ({ text: JSON.stringify(calls.shift()) }) } } as never;
  const result = await executeLocalMission(ai, "Perform a read-only audit.", { readOnly: true });
  assert.match(String(result.steps[2]?.result), /solo lectura/);
  await assert.rejects(readFile(relative, "utf8"));
});
test("an explicitly approved sensitive write proceeds only after the exact local path confirmation", async () => {
  const relative = `src/server/sofiaDevelopmentAgent-approval-${Date.now()}.ts`;
  const absolute = path.join(process.cwd(), relative);
  const backupDir = path.join(process.cwd(), ".sofia-agent", "backups");
  await writeFile(absolute, "original sensitive fixture", "utf8");
  let backupPath: string | undefined;
  const calls = [
    { operation: "read_file", args: { path: "package.json" } },
    { operation: "plan", args: { summary: "Approved sensitive fixture", actions: ["change sensitive test fixture"] } },
    { operation: "write_file", args: { path: relative, content: "approved fixture" } },
    { operation: "finish", args: { summary: "Approved fixture updated", pending: [] } },
  ];
  const ai = { models: { generateContent: async () => ({ text: JSON.stringify(calls.shift()) }) } } as never;
  try {
    const result = await executeLocalMission(ai, "Update the sensitive fixture after owner approval.", {
      confirmSensitiveWrite: async (path) => path === relative,
    });
    assert.equal(result.steps[2]?.operation, "write_file");
    const write = result.steps[2]?.result as { backup?: string };
    assert.ok(write.backup);
    backupPath = path.join(backupDir, `${write.backup}.bak`);
    assert.equal(await readFile(absolute, "utf8"), "approved fixture");
    assert.equal(await readFile(backupPath, "utf8"), "original sensitive fixture");
  } finally {
    await rm(absolute, { force: true });
    if (backupPath) await rm(backupPath, { force: true });
  }
});
