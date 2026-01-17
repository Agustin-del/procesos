const { fork } = require('node:child_process')

const startTime = process.hrtime()

const child = fork('child.js')

child.on('exit', () =>{
  const diff = process.hrtime(startTime)
  console.log(`El proceso hijo terminó después de ${diff[0]} segundos y ${diff[1] / 1000000} milisegundos`)
})

child.send({action:'start'})
