process.on('SIGINT', () => {
  console.log('llegó sigint')
  process.exit()
})

setInterval(() => {}, 1000)
