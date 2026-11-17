import { GoogleGenAI } from "@google/genai";
import { readFile, stat } from "node:fs/promises";
import path from "node:path";
import { createInterface } from "node:readline/promises";
import { execFileSync } from "node:child_process";
import { stdin, stdout } from "node:process";
import { runSofiaDevelopmentCheck, runSofiaDevelopmentTask, readSofiaDevelopmentFile, redactSensitiveText } from "./sofiaDevelopmentAgent.js";

type AgentAI = Parameters<typeof runSofiaDevelopmentTask>[0];
const EXPECTED_ROOT = String.raw`D:\MagnopVS\MagnopVS_Project\11- Ecosistema\MagnopVS_Web\web`;
const MAX_TASK_CHARS = 4000;
const EXPECTED_OWNER_SID = "S-1-5-21-3490579665-1738431559-3152549-500";

export function isAuthorizedWindowsOwner(sid: string): boolean {
  return sid === EXPECTED_OWNER_SID;
}

function currentWindowsSid(): string {
  const output = execFileSync("C:\\Windows\\System32\\whoami.exe", ["/user", "/fo", "csv", "/nh"], { encoding: "utf8", windowsHide: true, timeout: 3000 });
  const sid = output.match(/S-1-\d+(?:-\d+)+/)?.[0];
  if (!sid) throw new Error("No se pudo validar la identidad local de Windows.");
  return sid;
}

export function isAuthorizedLocalProjectRoot(cwd = process.cwd()): boolean {
  const normalize = (value: string) => path.resolve(value).replace(/[\\/]+$/, "").toLowerCase();
  return normalize(cwd) === normalize(EXPECTED_ROOT);
}

function assertProjectRoot(cwd = process.cwd()): void {
  if (!isAuthorizedWindowsOwner(currentWindowsSid())) throw new Error("Esta cuenta Windows no está autorizada para ejecutar el agente local.");
  if (!isAuthorizedLocalProjectRoot(cwd)) {
    throw new Error(`El agente solo se puede iniciar desde la raíz autorizada: ${EXPECTED_ROOT}`);
  }
}

function getAI(): AgentAI {
  const apiKey = process.env.GEMINI_API_KEY;
  if (!apiKey) throw new Error("Falta GEMINI_API_KEY en el entorno local del servidor. No se mostró ni registró su valor.");
  return new GoogleGenAI({ apiKey }) as AgentAI;
}

export async function executeLocalMission(
  ai: AgentAI,
  task: string,
  options: { readOnly?: boolean; confirmSensitiveWrite?: (relativePath: string) => Promise<boolean> } = {},
) {
  assertProjectRoot();
  if (!task.trim() || task.length > MAX_TASK_CHARS) throw new Error("La misión debe tener entre 1 y 4000 caracteres.");
  return runSofiaDevelopmentTask(ai, task, options);
}

async function askOwnerToConfirmSensitiveWrite(relativePath: string): Promise<boolean> {
  if (!stdin.isTTY || !stdout.isTTY) {
    console.error(`Cambio sensible bloqueado en ${relativePath}: requiere una consola interactiva.`);
    return false;
  }
  const prompt = createInterface({ input: stdin, output: stdout });
  try {
    const answer = await prompt.question(`\nCambio sensible: ${relativePath}\nEscribe exactamente AUTORIZO ${relativePath} para permitirlo: `);
    return answer.trim() === `AUTORIZO ${relativePath}`;
  } finally {
    prompt.close();
  }
}

function printMissionResult(result: Awaited<ReturnType<typeof executeLocalMission>>): void {
  const safeSteps = result.steps.map((step) => {
    const item = step.result && typeof step.result === "object" ? step.result as Record<string, unknown> : {};
    return {
      operation: step.operation,
      ...(typeof item.path === "string" ? { path: item.path } : {}),
      ...(typeof item.check === "string" ? { check: item.check, exitCode: item.exitCode } : {}),
      ...(step.operation === "error" ? { error: redactSensitiveText(String(step.result)).slice(0, 300) } : {}),
      ...(step.operation === "provider-error" ? { error: item } : {}),
      ...(step.operation === "cycle-stop" ? { reason: redactSensitiveText(String(step.result)).slice(0, 300) } : {}),
    };
  });
  let report = JSON.stringify(result.report) ?? "{}";
  if (/(?:API[_-]?KEY|SECRET|TOKEN|PASSWORD|PRIVATE[_-]?KEY)\s*[:=]\s*["']?[A-Za-z0-9/+_-]{16,}/i.test(report)) {
    report = "{\"summary\":\"El informe fue ocultado por contener un patrón parecido a una credencial.\"}";
  } else {
    report = redactSensitiveText(report);
  }
  const safeReport = JSON.parse(report) as Record<string, unknown>;
  const partial = safeReport.partial as { lastReadFile?: { path?: string; content?: string } } | undefined;
  if (partial?.lastReadFile) partial.lastReadFile = { path: partial.lastReadFile.path, content: "[consulta el contenido con el comando read]" };
  console.log(JSON.stringify({ missionId: result.id, operations: safeSteps, report: safeReport }, null, 2));
}

async function getLastMissionStatus(): Promise<Record<string, unknown> | null> {
  const auditPath = path.join(process.cwd(), ".sofia-agent", "audit.jsonl");
  const raw = await readFile(auditPath, "utf8").catch(() => "");
  const events = raw.split(/\r?\n/).filter(Boolean).flatMap((line) => {
    try { return [JSON.parse(line) as Record<string, unknown>]; } catch { return []; }
  });
  const start = [...events].reverse().find((event) => event.action === "task-start" && typeof event.id === "string");
  if (!start) return null;
  const missionEvents = events.filter((event) => event.id === start.id);
  const terminal = [...missionEvents].reverse().find((event) => ["task-finish", "task-stop", "task-limit"].includes(String(event.action)));
  const completed = missionEvents.filter((event) => event.action === "tool" && event.ok === true).map((event) => ({
    operation: event.operation,
    ...(typeof event.path === "string" ? { path: event.path } : {}),
    ...(typeof event.check === "string" ? { check: event.check, exitCode: event.exitCode } : {}),
  }));
  const lastRead = [...missionEvents].reverse().find((event) => event.action === "tool" && event.ok === true && event.operation === "read_file" && typeof event.path === "string");
  return {
    id: start.id,
    status: terminal?.action === "task-finish" ? "completed" : terminal ? "incomplete" : "started",
    ...(typeof terminal?.code === "string" ? { code: terminal.code } : {}),
    ...(typeof terminal?.summary === "string" ? { summary: terminal.summary } : {}),
    completedOperations: completed,
    lastReadFile: lastRead && typeof lastRead.path === "string" ? { path: lastRead.path } : null,
  };
}
export async function runSofiaDevelopmentCommand(
  command: "status" | "audit" | "mission" | "test" | "read",
  options: { task?: string; path?: string; ai?: AgentAI; confirmSensitiveWrite?: (relativePath: string) => Promise<boolean> } = {},
): Promise<unknown> {
  assertProjectRoot();
  if (command === "status") {
    const packageJson = JSON.parse(await readFile(path.join(process.cwd(), "package.json"), "utf8")) as { scripts?: Record<string, string> };
    const dependenciesPresent = await stat(path.join(process.cwd(), "node_modules", "tsx")).then(() => true, () => false);
    const serverSource = await readFile(path.join(process.cwd(), "server.ts"), "utf8");
    const publicChat = serverSource.includes('app.post("/api/sofia/chat"');
    const publicDevEndpoint = serverSource.includes("/api/sofia/development") || serverSource.includes("mountSofiaDevelopmentEndpoint");
    const status = {
      projectRoot: EXPECTED_ROOT,
      localLauncher: "available",
      geminiCredentialConfigured: Boolean(process.env.GEMINI_API_KEY),
      dependenciesPresent,
      localEntryPresent: await stat(path.join(process.cwd(), "src", "server", "sofiaDevelopmentCli.ts")).then(() => true, () => false),
      chatEndpointPresent: publicChat,
      publicDevelopmentEndpointPresent: publicDevEndpoint,
      scripts: Object.keys(packageJson.scripts ?? {}),
      lastMission: await getLastMissionStatus(),
    };
    console.log(JSON.stringify(status, null, 2));
    return status;
  }
  if (command === "read") {
    if (!options.path) throw new Error("read requiere una ruta relativa con -Path.");
    const result = await readSofiaDevelopmentFile(options.path);
    console.log(JSON.stringify(result, null, 2));
    return result;
  }
  if (command === "audit" || command === "mission") {
    const task = command === "audit"
      ? "Realiza una auditoría técnica de solo lectura. Inspecciona estructura, scripts y archivos fuente relevantes. No escribas archivos ni ejecutes comprobaciones. Entrega hallazgos verificados y pendientes."
      : options.task ?? "";
    if (command === "mission") {
      if (!task.trim() || task.length > MAX_TASK_CHARS) throw new Error("Misión inválida: proporciona -Task de hasta 4000 caracteres.");
      console.log(`Misión solicitada:\n${task}`);
    }
    const ai = options.ai ?? getAI();
    const result = await executeLocalMission(ai, task, {
      readOnly: command === "audit",
      confirmSensitiveWrite: options.confirmSensitiveWrite ?? askOwnerToConfirmSensitiveWrite,
    });
    printMissionResult(result);
    return result;
  }
  const results: Array<{ check: string; exitCode: number | string; output: string }> = [];
  for (const check of ["lint", "test", "build"]) {
    const result = await runSofiaDevelopmentCheck(check);
    results.push(result);
    console.log(`\n=== ${check.toUpperCase()} (exit ${result.exitCode}) ===\n${result.output}`);
    if (result.exitCode !== 0) break;
  }
  const summary = { passed: results.every((result) => result.exitCode === 0), results: results.map(({ check, exitCode }) => ({ check, exitCode })) };
  console.log(JSON.stringify(summary, null, 2));
  if (!summary.passed) throw new Error("Una comprobación falló; test se detuvo para evitar continuar con errores.");
  return summary;
}

function parseArgs(argv: string[]): { command: "status" | "audit" | "mission" | "test" | "read"; task?: string; path?: string } {
  const command = argv[0];
  if (!["status", "audit", "mission", "test", "read"].includes(command)) throw new Error("Uso: sofia-dev.ps1 status|audit|mission -Task <descripción>|read -Path <ruta>|test");
  const rest = argv.slice(1);
  if (command === "read") {
    if (rest.length !== 2 || rest[0] !== "--path" || !rest[1]) throw new Error('Uso: sofia-dev.ps1 read -Path "ruta/relativa"');
    return { command, path: rest[1] };
  }
  if (command !== "mission") {
    if (rest.length) throw new Error(`El comando ${command} no admite argumentos adicionales.`);
    return { command: command as "status" | "audit" | "test" };
  }
  if (rest.length !== 2 || rest[0] !== "--task" || !rest[1]) throw new Error('Uso: sofia-dev.ps1 mission -Task "Descripción de la tarea"');
  return { command, task: rest[1] };
}

if (process.argv[1] && path.resolve(process.argv[1]).toLowerCase() === path.resolve("src/server/sofiaDevelopmentCli.ts").toLowerCase()) {
  try {
    const args = parseArgs(process.argv.slice(2));
    if (args.command === "mission" && process.stdin.isTTY) {
      const prompt = createInterface({ input: stdin, output: stdout });
      try {
        const answer = await prompt.question("\nEl propietario inicia esta misión local. Escribe INICIAR MISION para continuar: ");
        if (answer.trim() !== "INICIAR MISION") throw new Error("Misión cancelada por el propietario.");
      } finally { prompt.close(); }
    } else if (args.command === "mission") {
      throw new Error("Las misiones requieren una consola PowerShell interactiva del propietario.");
    }
    await runSofiaDevelopmentCommand(args.command, { task: args.task, path: args.path });
  } catch (error) {
    console.error(error instanceof Error ? error.message : "El agente local se detuvo por un error.");
    process.exitCode = 1;
  }
}
