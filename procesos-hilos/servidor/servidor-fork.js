const { fork } = require('node:child_process')
const http = require('node:http')
const { performance } = require('node:perf_hooks')

const server = http.createServer((req, res) => {
    const start = performance.now()
    const child = fork('child.js')
    console.log(`Tiempo de creación del proceso: ${performance.now() - start} ms`)
    child.send('calculate')

    child.on('message', (result) => {
        res.end(`Resultado del cálculo: ${result}`)
        console.log(`Tiempo de envío y recepción de respuesta: ${performance.now() - start} ms`)
        child.kill()
    })
})
server.listen(3001, () => {
    console.log('Servidor en http://localhost:3001')
})
