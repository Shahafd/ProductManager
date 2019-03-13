const http = require("http");
const express = require("express");
const cores = require("cors");
const productsRouter = require("./routers/producesRouter");
const app = express();
app.use(cores());
app.use("/api/products", productsRouter);


app.set("port", 3000);
const server = http.createServer(app);
server.listen(3000);
