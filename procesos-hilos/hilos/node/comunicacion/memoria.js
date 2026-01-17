const { Worker, parentPort, isMainThread, workerData} = require('worker_threads')

if(isMainThread){
  let sharedBuffer = new SharedArrayBuffer(4)
  let arrayBuffer = new Int32Array(sharedBuffer)
  arrayBuffer[0] = 20
  console.log('antes del worker: ', arrayBuffer)
  const worker =  new Worker(__filename, {workerData:sharedBuffer})

  worker.on('message',  ()=> {
    console.log('despues del worker: ', arrayBuffer)
  })
} else {
  let arrayBuffer = new Int32Array(workerData)
  arrayBuffer[0] = 42
  parentPort.postMessage('done')
}
