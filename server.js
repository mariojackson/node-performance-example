const express = require('express');
const cluster = require('cluster');

const app = express();

// This will block the node server, because it runs
// on the event loop instead of the thread pool
// like network or file operations.
function delay(duration) {
  const startTime = Date.now();
  while (Date.now() - startTime < duration) {
    // Doesn't do anything
  }
}

app.get('/', (_, response) => {
  response.send(`Performance example. Pid: ${process.pid}`);
});

// This endpoint will only answer after 9 seconds, because
// it runs the block delay function. If you would open a
// second tab, the endpoint would answer only after at
// least 18 seconds
app.get('/timer', (_, response) => {
  delay(9000);
  response.send(`Hi! ${process.pid}`);
});

// Start 2 clusters. This makes it so that 2 parallel requests
// to the /timer endpoint won't block each other anymore. But,
// a 3rd parallel requests will still have to wait until one
// of the first two requests is finished, since we are only
// creating 2 forks.
if (cluster.isMaster) {
  console.log('Master has been started');
  cluster.fork();
  cluster.fork();
} else {
  console.log('Worker has been started');
  app.listen(3000);
}
