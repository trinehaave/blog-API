const express = require('express');
const morgan = require('morgan');

const blogPostsRouter = require('./blogPostsRouter');
const app = express();

app.use(morgan('common'));

app.use('/blog-posts', blogPostsRouter);

let server;

function runServer() {
  const port = process.env.PORT || 8080;
  return new Promise((resolve, reject) => {
    server = app.listen(port, () => {
      console.log(`Your app is listening on port ${port}`);
      resolve(server);
    }).on('error', err => {
      reject(err)
    });
  });
}

function closeServer() {
  return new Promise((resolve, reject) => {
    console.log('closing server');
    server.close(err => {
      if(err) {
        reject(err);
        return;
      }
      resolve();
    });
  });
}


if (require.main === module) {
  runServer().catch(err => console.log(err));
};

module.exports = {app, runServer, closeServer};