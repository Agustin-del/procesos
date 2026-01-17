const { parentPort, workerData } = require('node:worker_threads')

function formatDate(operation, date){
  switch(operation){
    case 'format': return new Date(date).toLocaleString()
    case 'timestamp': return Date.now()
    default: return null
  }
}

const result = formatDate(workerData.operation, workerData.date)
parentPort.postMessage(result)
