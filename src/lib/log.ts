type Level = "info" | "warn" | "error";

function ts(): string {
  return new Date().toISOString();
}

function emit(level: Level, scope: string, message: string, ...rest: unknown[]): void {
  const line = `${ts()} [${level}] [${scope}] ${message}`;
  if (level === "warn") console.warn(line, ...rest);
  else if (level === "error") console.error(line, ...rest);
  else console.log(line, ...rest);
}

export function logInfo(scope: string, message: string, ...rest: unknown[]): void {
  emit("info", scope, message, ...rest);
}

export function logWarn(scope: string, message: string, ...rest: unknown[]): void {
  emit("warn", scope, message, ...rest);
}

export function logError(scope: string, message: string, ...rest: unknown[]): void {
  emit("error", scope, message, ...rest);
}
