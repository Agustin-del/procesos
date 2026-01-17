const net = require('net')

const server = net.createServer(socket => {
  socket.write('Hola desde el servidor')
  socket.pipe(socket)
})

server.listen(8080, () => {
  console.log('servidor corriendo en http://localhost:8080')
})
