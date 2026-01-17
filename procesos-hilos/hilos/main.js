const { Worker, isMainThread, parentPort, workerData } = require('node:worker_threads')

const startTime = process.hrtime()

const worker = new Worker(__filename, {
  workerData: {action:'start'}
})

worker.on('message', (msg) => {
  if(msg === 'done'){
    const diff = process.hrtime(startTime)
    console.log(`El hilo terminó después de ${diff[0]} segundos y ${diff[1] / 1000000} milisegundos`)
    process.exit()
  }
})

if (!isMainThread) {
  const {action} = workerData

  if(action === 'start') {
    let count = 0
    while(count < 1e9) count++
    parentPort.postMessage('done')
  }
}

