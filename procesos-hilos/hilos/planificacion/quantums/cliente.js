const axios = require('axios')

async function sendTask(value, priority) {
  await axios.post('http://localhost:3000/task', {
    workerFile: './worker.js',
    data: {value},
    priority
  })
}

(async () => {
  await sendTask(5, 1)
  await sendTask(10, 3)
  await sendTask(7, 2)
})()
