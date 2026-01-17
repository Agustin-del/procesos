const { Worker, MessageChannel } = require('node:worker_threads')

const worker = new Worker('./worker.js')

const { port1, port2 } = new MessageChannel()

worker.postMessage({port:port1}, [port1])

const buffer = Buffer.from('hola mundo')
port2.postMessage(buffer)

port2.on('message', (buffer) => {
    console.log(`Datos recibidos: ${buffer.toString()}`)
})

