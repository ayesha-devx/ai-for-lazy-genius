import https from 'https';

const options = {
  hostname: 'api-inference.huggingface.co',
  port: 443,
  path: '/status',
  method: 'GET',
  headers: {
    'Authorization': 'Bearer ',
    'Content-Type': 'application/json'
  }
};

const req = https.request(options, (res) => {
  console.log(`Status: ${res.statusCode}`);
  console.log("Headers:", res.headers);
  res.on('data', (d) => {
    process.stdout.write(d);
  });
});

req.on('error', (e) => {
  console.error(e);
});

req.end();
