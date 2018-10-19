const app = require('express')();
const server = require('http').createServer(app);
const path = require('path');

module.exports = function getServer() {
  return new Promise((resolve, reject) => {
    app.get('/', (req, res) => {
      res.sendFile(path.join(`${__dirname}/view.html`));
    });

    const port = 8080;
    server.listen(port, (err) => {
      if (err) return reject(err);
      console.log('Server running at', port);
      return resolve(true);
    });
  });
};
