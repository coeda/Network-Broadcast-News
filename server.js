const net = require('net');
let clients = [];
let clientName = ['ADMIN'];
let lastTime;
let kicked = false;

const server = net.createServer((request) => {
  lastTime = Date.now();
  request.name = request.remoteAddress + ':' + request.remotePort;
  request.write('Welcome ' + request.name + '\n');
  request.write('What is your name?');

  request.on('data', (data) => {
    let currentTime = Date.now();
    if((currentTime - lastTime) < 150){
        let searchedClient = clientName.indexOf(request.name.toString());
        if(searchedClient !== -1){
          clients.forEach((client) => {
            if(client.name.toString() === request.name.toString()){
              kicked = true;
              client.write('ADMIN: You have been kicked for flooding');
              client.end();
            }
          });
        }
    } else {
      data.toString();
      data = data.slice(0, data.length - 1);
      if(clientName.indexOf(data.toString()) !== -1){
          return request.write('please enter a different name');
      }
      else if(request.name === request.remoteAddress + ':' + request.remotePort){
          request.name = data;
          clientName.push(data.toString());
            broadcast(request.name + ' has joined the chat', request.name);
      } else {
        broadcast(request.name + ': ' + data, request);
      }
      lastTime = currentTime;
    }


  });

  request.on('end', () => {
    console.log('Connection Terminated');
    let selectedIndex = clients.indexOf(request);
    let selectedName = clientName.indexOf(request.name.toString());
    clients.splice(selectedIndex, 1);
    clientName.splice(selectedName, 1);
    if(kicked === true){
      broadcast(request.name + ' has been kicked');
    } else {
      broadcast(request.name + ' has left the chat');
    }
    kicked = false;
  });


  function broadcast(message, sender) {
    clients.forEach(function (client) {
      if (client === sender) {
        return;
      } else {
        client.write(message);
      }
    });
    process.stdout.write(message + '\n');
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
      chunk = chunk.toString();
      if(chunk.slice(0,5) === '/kick'){
        chunk = chunk.slice(6, chunk.length - 1);
        let searchedClient = clientName.indexOf(chunk);
        if(searchedClient !== -1){
          clients.forEach((client) => {
            if(client.name.toString() === chunk){
              client.write('ADMIN: You have been kicked');
              client.end();
            }
          });
        }
      } else {
        clients.forEach(function(client) {
          client.write('ADMIN: ' + chunk.slice(0, chunk.length -1));
        });
    }
    }
});
