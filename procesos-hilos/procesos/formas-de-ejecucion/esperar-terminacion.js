const { spawn } = require('node:child_process')

const worker = spawn('node', ['worker-spawn.js'])

worker.on('exit', (code) => {
  if(code === 0){
    console.log('Proceso hijo terminó')
    console.log('Puedo hacer cosas acá')
  } else {
    console.log('Hijo terminó con error')
  }
})

worker.on('message', msg => {
  console.log('Mensaje del hijo: ' + msg.toString())
})

console.log('También puedo seguir haciendo cosas acá')
