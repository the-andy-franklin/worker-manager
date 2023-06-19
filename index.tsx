/// <reference no-default-lib="true" />
/// <reference lib="dom" />
/// <reference lib="dom.iterable" />
/// <reference lib="dom.asynciterable" />
/// <reference lib="deno.ns" />

export class WorkerManager {
  workers: Map<string, Worker> = new Map();

  createWorker(name: string, script: string) {
    const worker = new Worker(import.meta.resolve(script), {
      type: "module",
    });
    this.workers.set(name, worker);

    worker.onmessage = (event) => {
      const { target, message } = event.data;
      if (target) {
        this.sendMessage(target, message);
      }
    };
  }

  sendMessage(target: string, message: string) {
    const worker = this.workers.get(target);
    if (worker) {
      worker.postMessage({ message });
    }
  }

  broadcastMessage(message: string) {
    for (const worker of this.workers.values()) {
      worker.postMessage({ message });
    }
  }

  terminateWorker(name: string) {
    const worker = this.workers.get(name);
    if (worker) {
      worker.terminate();
      this.workers.delete(name);
    }
  }

  terminateAllWorkers() {
    for (const worker of this.workers.values()) {
      worker.terminate();
    }
    this.workers.clear();
  }
}
