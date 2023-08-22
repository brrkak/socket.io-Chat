import http from "http";
// import WebSocket from "ws";
import express from "express";
import SocketIO from "socket.io";
import { Socket } from "dgram";
import { nextTick } from "process";
const app = express();

app.set("view engine", "pug");
app.set("views", __dirname + "/views");
app.use("/public", express.static(__dirname + "/public"));
app.get("/", (_, res) => res.render("home"));
app.get("/*", (_, res) => res.redirect("/"));

const httpServer = http.createServer(app);
const wsServer = SocketIO(httpServer);

wsServer.on(`connection`, (socket) => {
  socket.on(`join_room`, (roomName) => {
    socket.join(roomName);
    socket.to(roomName).emit(`welcome`);
  });
  socket.on(`offer`, (offer, roomName) => {
    socket.to(roomName).emit(`offer`, offer);
  });
  socket.on(`answer`, (answer, roomName) => {
    socket.to(roomName).emit(`answer`, answer);
  });
  socket.on(`ice`, (ice, roomName) => {
    socket.to(roomName).emit(`ice`, ice);
  });
  socket.on(`message`, (message, roomName) => {
    socket.to(roomName).emit(`message`, message);
  });
  socket.on(`welcome`, (welcome, roomName) => {
    socket.to(roomName).emit(`welcome`, welcome);
  });
  socket.on(`nickname`, (nickname, roomName) => {
    socket.to(roomName).emit(`nickname`, nickname);
  });
});

const handleListen = () => console.log(`Listening on http://localhost:3001`);
httpServer.listen(3001, handleListen);

// instrument(wsServer, {
//   auth: false,
//   mode: "development",
// });

// function publicRooms() {
//   const {
//     sockets: {
//       adapter: { sids, rooms },
//     },
//   } = wsServer;
//   const publicRooms = [];
//   rooms.forEach((_, key) => {
//     if (sids.get(key) === undefined) {
//       publicRooms.push(key);
//     }
//   });
//   return publicRooms;
// }

// function countRoom(roomName) {
//   return wsServer.sockets.adapter.rooms.get(roomName)?.size;
// }

// wsServer.on(`connection`, (socket) => {
//   // wsServer.socketsJoin(`announcement`);
//   socket[`nickname`] = `Anon`;
//   socket.onAny((e) => {
//     console.log(`Socket Event:${e}`);
//   });
//   socket.on(`enter_room`, (roomName, nickname, done) => {
//     socket[`nickname`] = nickname;
//     socket.join(roomName);
//     done();
//     socket.to(roomName).emit(`welcome`, socket.nickname, countRoom(roomName));
//     wsServer.sockets.emit(`room_change`, publicRooms());
//   });
//   socket.on(`disconnecting`, () => {
//     socket.rooms.forEach((room) =>
//       socket.to(room).emit(`bye`, socket.nickname, countRoom(room) - 1)
//     );
//   });
//   socket.on(`disconnect`, () => {
//     wsServer.sockets.emit(`room_change`, publicRooms());
//   });
//   socket.on(`new_message`, (msg, room, done) => {
//     socket.to(room).emit(`new_message`, `${socket.nickname}: ${msg}`);
//     done();
//   });

//   socket.on(`nickname`, (nickname) => (socket["nickname"] = nickname));
// });
