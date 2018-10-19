var app = require("express")();
var server = require("http").createServer(app);
const path = require("path");

app.get("/pagination", function(req, res) {
  res.sendFile(path.join(__dirname + "/view.html"));
});

const port = 8080;
server.listen(port, function(err) {
  if (err) console.log(err);
  console.log("Server running at", port);
});
