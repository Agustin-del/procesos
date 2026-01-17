const { Worker } = require('node:worker_threads')
const http = require('node:http')
const { performance } = require('perf_hooks')

const server = http.createServer((req, res) => {
    const start = performance.now()
    const worker = new Worker('./worker.js')
    console.log(`Tiempo de creación del thread: ${performance.now() - start} ms`)
    
    worker.on('message', (data) => {
        res.end(`Resultado del cálculo: ${data}`)
        console.log(`Tiempo de envío y recepción de respuesta: ${performance.now() - start}`)
    })
    
    worker.postMessage('calculate')
})

server.listen(3000, () => {
    console.log('Servidor escuchando en http://localhost:3000')
})
