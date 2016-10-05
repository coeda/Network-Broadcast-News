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

process.stdin.on('readable', () => {
  var chunk = process.stdin.read();
    if (chunk !== null) {
      client.write(chunk);
    }
});