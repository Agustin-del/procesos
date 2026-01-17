const { fork } = require('node:child_process')

const worker = fork('worker.js')

worker.on('message', msg => {
  console.log('mensaje del hijo: ' + msg)
})

console.log('El proceso padre sigue ejecutándose')
