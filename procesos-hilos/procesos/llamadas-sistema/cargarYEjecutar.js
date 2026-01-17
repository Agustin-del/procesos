const {exec} = require('child_process')

exec('ls -l', (error, stdout, stderr) => {
  if(error) {
    console.error (`Error: ${error.message}`)
    return
  }

  console.log(stdout)
  
})
