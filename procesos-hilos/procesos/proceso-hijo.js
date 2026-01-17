process.on('message', (msg) => {
  if(msg.action === 'start') {
    let count = 0
    while(count < 1e9) count++
    console.log('Proceso hijo finalizó su trabajo')
    process.exit()
  }
})
