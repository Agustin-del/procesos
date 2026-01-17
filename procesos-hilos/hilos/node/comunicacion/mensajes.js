const {Worker, isMainThread, parentPort} = require('worker_threads')

if(isMainThread){
  const worker = new Worker(__filename)

  worker.on('message', msg => console.log('Thread: ', msg))

  worker.postMessage('Hola desde el main')
} else {
  parentPort.on('message', msg => {
    console.log('Padre: ', msg)
    parentPort.postMessage('Hola desde el thread')
  })
}
