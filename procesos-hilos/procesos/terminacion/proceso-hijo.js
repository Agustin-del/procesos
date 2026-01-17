const { spawn } = require('node:child_process')

const child = spawn('node', ['-e', "setInterval(()=> process.stdout.write('soy infumable'), 500)"])
console.log('PID proceso hijo: ', child.pid)

child.stdout.on('data', msg => {
  console.log(msg.toString())
})
setTimeout(() => {
  console.log('terminando proceso hijo')

  process.kill(child.pid)
}, 3000)

