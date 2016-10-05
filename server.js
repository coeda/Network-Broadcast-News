const net = require('net');
let clients = [];

const server = net.createServer((request) => {
  request.name = request.remoteAddress + ':' + request.remotePort;
  request.write('Welcome ' + request.name + '\n');
  broadcast(request.name + ' has joined the chat', request.name);
  request.write('What is your name?');

  request.on('data', (data) => {
      data.toString();
      data = data.slice(0, data.length - 1);
    if(request.name === request.remoteAddress + ':' + request.remotePort){
      request.name = data;
      console.log('\n' + data);
    } else {
      broadcast(request.name + ': ' + data, request);
    }

  });
  request.on('end', () => {
    console.log('Connection Terminated');
    let selectedIndex = clients.indexOf(request);
    clients.splice(selectedIndex, 1);
  });


  function broadcast(message, sender) {
    clients.forEach(function (client) {
      if (client === sender) {
        return;
      } else {
        client.write(message);
      }
    });
    process.stdout.write(message);
  }


  clients.push(request);
});

server.listen({ port: 6969, 'host': '0.0.0.0'}, () => {
  const address = server.address();
  console.log(`Opened server on ${address.port}`);

});


process.stdin.on('readable', () => {
  var chunk = process.stdin.read();
    if (chunk !== null) {
      clients.forEach(function(client) {
        client.write('ADMIN: ' + chunk);
      });
    }
});
