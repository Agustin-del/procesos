const { parentPort } = require('node:worker_threads')

parentPort.on('message', msg => {
  setTimeout(()=> {
    parentPort.postMessage('respuesta procesada') 
  }, 1000)
})
