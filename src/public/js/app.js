const messageList = document.querySelector(`ul`);
const nickForm = document.querySelector(`#nick`);
const messageForm = document.querySelector(`#message`);

const socket = new WebSocket(`ws://${window.location.host}`);

function makeMessage(type, payload) {
  const msg = { type, payload };
  return JSON.stringify(msg);
}

function handleOpen() {
  console.log(`Connected to Server🖐`);
}

socket.addEventListener(`open`, () => {
  console.log(`Connected to Server 🖐`); // chrome창 콘솔에 출력
});

socket.addEventListener(`message`, (message) => {
  const li = document.createElement(`li`);
  li.innerText = message.data;
  messageList.append(li);
});

socket.addEventListener(`close`, () => {
  console.log(`Disconnected from Server ❌`); // backend에서 서버를 닫을때 Chrome창 콘솔에 출력
});

// setTimeout(() => {
//   socket.send(`hello from the Browser`); // backend로 메세지를 보냄 10초뒤 터미널에 출력
// }, 10000);
function handleSubmit(e) {
  e.preventDefault();
  const input = messageForm.querySelector(`input`);
  socket.send(makeMessage(`new_message`, input.value));
  input.value = "";
}

function handleNickSubmit(e) {
  e.preventDefault();
  const input = nickForm.querySelector(`input`);
  socket.send(makeMessage(`nickname`, input.value));
  input.value = "";
}

messageForm.addEventListener(`submit`, handleSubmit);
nickForm.addEventListener(`submit`, handleNickSubmit);
