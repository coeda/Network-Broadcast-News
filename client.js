const net = require('net');

const options = {
  'port': 6969,
  'host': '0.0.0.0'
};

const client = net.connect(options, () => {
  console.log('Connected to server');
});

client.on('data', (data) => {
  console.log(data.toString());
});

function floodFunc(message){
  client.write(message);
}

process.stdin.on('readable', () => {
  var chunk = process.stdin.read();
    if (chunk !== null) {
      chunk = chunk.toString();
      if(chunk.slice(0, 6) === '/flood'){
        setInterval( function() {floodFunc(chunk.slice(7)); }, 15);
      } else {
        client.write(chunk);
      }

    }
});

