const { Worker, isMainThread} = require('node:worker_threads')

if(isMainThread) {
  const sharedBuffer = new SharedArrayBuffer(4)
  const sharedArray = new Int32Array(sharedBuffer)

  sharedArray[0] = 0

  console.log(`Antes del worker: ${sharedArray[0]}`)
 
  const worker = new Worker(__filename, {workerData:sharedBuffer})

  worker.on('exit', () => {
    console.log(`Después del worker: ${sharedArray[0]}`)
  })

} else {

  const {workerData} = require('worker_threads')
  
  const sharedArray = new Int32Array(workerData)
  
  Atomics.add(sharedArray, 0, 10)
}
