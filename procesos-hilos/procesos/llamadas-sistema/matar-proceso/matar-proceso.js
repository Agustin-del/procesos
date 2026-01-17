const { fork } = require ('node:child_process')

const child = fork('child.js')

child.on('message', msg => {
    console.log(msg)
})

child.on('exit', (code, signal) => {
    console.log(`Process en with code: ${code} and signal: ${signal}`)
})

setTimeout(() => {
    child.exitCode = 1
    child.kill()
}, 1000);