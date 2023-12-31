const socket = io();

const welcome = document.getElementById(`welcome`);
const form = welcome.querySelector(`form`);
const room = document.getElementById(`room`);

let roomName;

room.hidden = true;

function addMessage(message) {
  const ul = room.querySelector(`ul`);
  const li = document.createElement(`li`);
  li.innerText = message;
  ul.appendChild(li);
}
function handleRoomSubmit(e) {
  e.preventDefault();

  const roomNameInput = form.querySelector("#roomName");
  const nickNameInput = form.querySelector("#name");
  socket.emit("enter_room", roomNameInput.value, nickNameInput.value, showRoom);
  roomName = roomNameInput.value;
  roomNameInput.value = "";
  const changeNameInput = room.querySelector("#name input");
  changeNameInput.value = nickNameInput.value;
}

function handleMessageSubmit(e) {
  e.preventDefault();
  const input = room.querySelector(`#msg input`);
  const value = input.value;
  socket.emit(`new_message`, input.value, roomName, () => {
    addMessage(`You: ${value}`);
  });
  input.value = "";
}

function handleNicknameSubmit(e) {
  e.preventDefault();
  const input = room.querySelector(`#name input`);
  socket.emit(`nickname`, input.value);
}

function showRoom() {
  welcome.hidden = true;
  room.hidden = false;

  const h3 = room.querySelector(`h3`);
  h3.innerText = `Room ${roomName}`;
  const msgForm = room.querySelector(`#msg`);
  const nameForm = room.querySelector(`#name`);

  msgForm.addEventListener(`submit`, handleMessageSubmit);
  nameForm.addEventListener(`submit`, handleNicknameSubmit);
}

form.addEventListener(`submit`, handleRoomSubmit);

socket.on(`welcome`, (user, newCount) => {
  const h3 = room.querySelector(`h3`);
  h3.innerText = `Room ${roomName} (${newCount})`;
  addMessage(`${user} arrived!`);
});

socket.on(`bye`, (left, newCount) => {
  const h3 = room.querySelector(`h3`);
  h3.innerText = `Room ${roomName} (${newCount})`;
  addMessage(`${left} left.`);
});

socket.on(`new_message`, addMessage);

socket.on(`room_change`, (rooms) => {
  const roomList = welcome.querySelector(`ul`);
  roomList.innerHTML = ``;
  if (rooms.length === 0) {
    return;
  }
  rooms.forEach((room) => {
    const li = document.createElement(`li`);
    li.innerText = room;
    roomList.append(li);
  });
});

// socket.on
// const messageList = document.querySelector(`ul`);
// const nickForm = document.querySelector(`#nick`);
// const messageForm = document.querySelector(`#message`);

// const socket = new WebSocket(`ws://${window.location.host}`);

// function makeMessage(type, payload) {
//   const msg = { type, payload };
//   return JSON.stringify(msg);
// }

// function handleOpen() {
//   console.log(`Connected to Server🖐`);
// }

// socket.addEventListener(`open`, () => {
//   console.log(`Connected to Server 🖐`); // chrome창 콘솔에 출력
// });

// socket.addEventListener(`message`, (message) => {
//   const li = document.createElement(`li`);
//   li.innerText = message.data;
//   messageList.append(li);
// });

// socket.addEventListener(`close`, () => {
//   console.log(`Disconnected from Server ❌`); // backend에서 서버를 닫을때 Chrome창 콘솔에 출력
// });

// // setTimeout(() => {
// //   socket.send(`hello from the Browser`); // backend로 메세지를 보냄 10초뒤 터미널에 출력
// // }, 10000);
// function handleSubmit(e) {
//   e.preventDefault();
//   const input = messageForm.querySelector(`input`);
//   socket.send(makeMessage(`new_message`, input.value));
//   input.value = "";
// }

// function handleNickSubmit(e) {
//   e.preventDefault();
//   const input = nickForm.querySelector(`input`);
//   socket.send(makeMessage(`nickname`, input.value));
//   input.value = "";
// }

// messageForm.addEventListener(`submit`, handleSubmit);
// nickForm.addEventListener(`submit`, handleNickSubmit);
