
const express = require("express");
const server = express();
server.use(express.static("./"));
server.listen(8080, () => console.log("Dev server started."));
