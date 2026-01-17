process.on('message', request => {
  console.log(`process: ${process.pid} processing request: ${request}`)
  const result = request * 2
  console.log(`process: ${process.pid} finished processing request ${request}, result: ${result}`)
  process.send('done')
})
