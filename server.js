const express = require('express');

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
  response.send('Performance example');
});

// This endpoint will only answer after 9 seconds, because
// it runs the block delay function. If you would open a
// second tab, the endpoint would answer only after at
// least 18 seconds
app.get('/timer', (_, response) => {
  delay(9000);
  response.send('Hi');
});

app.listen(3000);
