import cluster from 'cluster';
import os from 'os';
import { runApplication } from './app';

const CPUS = os.cpus().length;

function runPrimary() {
  console.log("Total Number of Cores: %o", CPUS)
  console.log("Master %o is running", process.pid)

  // Fork workers
  for (let i = 0; i < CPUS; i++) {
    const fork = cluster.fork();
    // fork.on('message', (index: number) => {
    //   console.log('Thread index: %s', index)
    // })
    fork.send(i);
  }

  // process is clustered on a core and process id is assigned
  cluster.on("online", (worker) => {
    console.log("Worker %o is listening", worker.process.pid)
  })

  cluster.on("exit", (worker) => {
    // Could use this to ressurect the worker automatically
    console.log("Worker %o died", worker.process.pid)
  })
}

function runWorker() {
  const cb = (index: number) => {
    // Unregister immediately current listener for message
    process.off("message", cb)

    // Run application
    console.log("Worker %o started", process.pid)
    runApplication(index)
  }

  process.on("message", cb)
}

export function runCluster() {
  if (cluster.isPrimary) {
    runPrimary();
  } else {
    runWorker();
  }
}
