import http from "http";
// import WebSocket from "ws";
import express from "express";
import { Server } from "socket.io";
import { Socket } from "dgram";
import { count } from "console";
import { instrument } from "@socket.io/admin-ui";

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
const wsServer = new Server(httpServer, {
  cors: {
    origin: ["https://admin.socket.io"],
    credentials: true,
  },
});

instrument(wsServer, {
  auth: false,
  mode: "development",
});

function publicRooms() {
  const {
    sockets: {
      adapter: { sids, rooms },
    },
  } = wsServer;
  const publicRooms = [];
  rooms.forEach((_, key) => {
    if (sids.get(key) === undefined) {
      publicRooms.push(key);
    }
  });
  return publicRooms;
}

function countRoom(roomName) {
  return wsServer.sockets.adapter.rooms.get(roomName)?.size;
}

wsServer.on(`connection`, (socket) => {
  // wsServer.socketsJoin(`announcement`);
  socket[`nickname`] = `Anon`;
  socket.onAny((e) => {
    console.log(`Socket Event:${e}`);
  });
  socket.on(`enter_room`, (roomName, nickname, done) => {
    socket[`nickname`] = nickname;
    socket.join(roomName);
    done();
    socket.to(roomName).emit(`welcome`, socket.nickname, countRoom(roomName));
    wsServer.sockets.emit(`room_change`, publicRooms());
  });
  socket.on(`disconnecting`, () => {
    socket.rooms.forEach((room) =>
      socket.to(room).emit(`bye`, socket.nickname, countRoom(room) - 1)
    );
  });
  socket.on(`disconnect`, () => {
    wsServer.sockets.emit(`room_change`, publicRooms());
  });
  socket.on(`new_message`, (msg, room, done) => {
    socket.to(room).emit(`new_message`, `${socket.nickname}: ${msg}`);
    done();
  });

  socket.on(`nickname`, (nickname) => (socket["nickname"] = nickname));
});

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
