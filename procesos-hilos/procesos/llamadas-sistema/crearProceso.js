const { spawn } = require('node:child_process')

const child = spawn('node', ['-e', 'console.log("what did i want to say?")'])

child.stdout.on('data', msg => {
    console.log(msg.toString())
})

child.on('exit', code => {
    console.log(`child process exited with code ${code}`)
})
