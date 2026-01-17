const { spawn } = require('node:child_process')

const child = spawn('node', ['child-unref.js'], {
  detached:true,
  stdio:'ignore'
})

child.unref()

console.log(`PID del hijo: ${child.pid}`)
console.log('El padre termina ahora')
process.exit()
