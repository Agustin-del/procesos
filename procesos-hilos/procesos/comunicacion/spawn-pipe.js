const {spawn} = require('child_process')

const ls = spawn('ls', ['-lh', '/usr'])

ls.stdout.pipe(process.stdout)


