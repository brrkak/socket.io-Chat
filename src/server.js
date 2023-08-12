import http from "http";
// import WebSocket from "ws";
import express from "express";
import SocketIO from "socket.io";
import { Socket } from "dgram";
const app = express();

app.set("view engine", "pug");
app.set("views", __dirname + "/views");
app.use("/public", express.static(__dirname + "/public"));
app.get("/", (_, res) => res.render("home"));
app.get("/*", (_, res) => res.redirect("/"));

const handleListen = () => console.log(`Listening on http://localhost:3000`);
// app.listen(3000, handleListen);
const httpServer = http.createServer(app);

// const wss = new WebSocket.Server({ server });
const wsServer = SocketIO(httpServer);

// const sockets = [];
// wss.on("connection", (socket) => {
//   sockets.push(socket);
//   socket["nickname"] = "Anon";
//   console.log(`Connected to Browser 🖐`); // 터미널 콘솔 출력
//   socket.on(`close`, () => console.log(`Disconnected from the Browser ❌`)); // chrome 창 닫을때 터미널에 출력
//   socket.on(`message`, (msg) => {
//     const message = JSON.parse(msg);
//     switch (message.type) {
//       case `new_message`:
//         sockets.forEach((aSockets) =>
//           aSockets.send(`${socket.nickname}:  ${message.payload}`)
//         );
//       case `nickname`:
//         socket["nickname"] = message.payload;
//     }
//   });
// });
httpServer.listen(3000, handleListen);
