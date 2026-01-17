const { Worker } = require('node:worker_threads')
const http = require('node:http')

http.createServer((req, res) => {
  const worker = new Worker('./worker.js')
  worker.on('message', msg => {
    res.writeHead(200)
    res.end(msg)
  })

  worker.postMessage('Procesamiento de la solicitud')
}).listen(3000, ()=> {
  console.log('Servidor escuchando en http://localhost:3000')
})

