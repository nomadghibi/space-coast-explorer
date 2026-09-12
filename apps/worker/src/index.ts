export function workerHealth() {
  return { status: "ok", service: "worker" } as const;
}
