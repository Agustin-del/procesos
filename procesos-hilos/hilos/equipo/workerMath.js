const { parentPort, workerData } = require('node:worker_threads')

function calculate(operation, value){
  switch(operation){
    case 'square': return value * value
    case 'double': return value * 2
    default: return null
  }
} 

const result = calculate(workerData.operation,  workerData.value)
parentPort.postMessage(result)
