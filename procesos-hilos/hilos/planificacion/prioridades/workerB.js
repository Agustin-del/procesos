const { parentPort, workerData } = require('node:worker_threads')

setTimeout(() => {
  parentPort.postMessage(`Processed value: ${workerData.value * 2}`)
}, 1000)
