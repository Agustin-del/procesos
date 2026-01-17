const net = require('net')

const client = net.createConnection({port:8080}, () => {
  console.log('conectado al servidor')
  client.write('Hola servidor')

  client.on('data', data => {
    console.log('Servidor: ', data.toString())
    client.end()
  })
})
