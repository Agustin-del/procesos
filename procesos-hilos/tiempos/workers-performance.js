const { Worker, isMainThread, parentPort } = require('worker_threads')
const { performance } = require('perf_hooks')

if(isMainThread) {
    const start = performance.now()
    const worker = new Worker(__filename)

    worker.on('message', msg => {
        console.log(`Mensaje del worker: ${msg}`)
        console.log(`⏱ Tiempo con worker_threads: ${performance.now() - start} ms`)
        process.exit(0)
    })

    worker.postMessage('Hola desde el padre')
} else {
    parentPort.on('message', msg => {
        parentPort.postMessage('Respuesta desde el hijo')
    })
}
