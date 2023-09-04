export function dispatch<T extends any[], R, D extends { [key: string]: (...args: any[]) => any }>(
  fn: (...args: T) => R,
  args: T,
  dependencies?: D,
): Promise<R> {
  return new Promise((resolve, reject) => {
    const fnString = fn.toString();
    const argsString = args.map((arg) => JSON.stringify(arg)).join(",");
    const depsString = dependencies
      ? Object.entries(dependencies)
        .map(([key, val]) => `const ${key} = ${val.toString()};`)
        .join("\n")
      : "";

    const workerCode = `
      ${depsString}
      (async () => {
        try {
          const result = await (${fnString})(${argsString});
          self.postMessage({ type: 'completed', data: result });
        } catch (error) {
          self.postMessage({ type: 'error', error: error });
        }
      })();
    `;

    const blob = new Blob([workerCode], { type: "application/javascript" });
    const workerScript = URL.createObjectURL(blob);
    const worker = new Worker(workerScript, {
      type: "module",
    });

    worker.onmessage = (
      { data }: MessageEvent<{ type: "completed"; data: any } | { type: "error"; error: Error }>,
    ) => {
      if (data.type === "completed") {
        resolve(data.data);
      } else if (data.type === "error") {
        reject(new Error(data.error.message));
      }

      worker.terminate();
    };
  });
}
