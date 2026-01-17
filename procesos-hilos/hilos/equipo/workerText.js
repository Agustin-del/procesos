const { parentPort, workerData } = require('node:worker_threads')

function processText(operation, text){
  switch(operation){
    case 'uppercase': return text.toUpperCase()
    case 'reverse': return text.split('').reverse().join('')
    default: return null
  }
}

const result = processText(workerData.operation, workerData.text)
parentPort.postMessage(result)
