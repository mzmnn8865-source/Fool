/* ماژول ۴: اتصال رابط کاربری به انجین تولید */
const $ = (id) => document.getElementById(id);
const chat = $("chat"), input = $("input"), sendBtn = $("send"), typing = $("typing");
let ready = false, busy = false;

function setStatus(state, msg) {
  $("statusText").textContent = msg;
  $("dot").className = "dot " + (state === "ready" ? "ready" : state === "error" ? "error" : "");
  ready = state === "ready";
  update();
}
function update() { sendBtn.disabled = !ready || busy; input.disabled = !ready || busy; if (ready && !busy) input.focus(); }

function addMsg(role, text, isError = false) {
  const m = document.createElement("div"); m.className = "msg " + role;
  const b = document.createElement("div"); b.className = "bubble" + (isError ? " error" : ""); b.textContent = text;
  m.appendChild(b); chat.appendChild(m); chat.scrollTop = chat.scrollHeight;
  return b;
}

async function send() {
  const text = input.value.trim();
  if (!text || !ready || busy) return;
  input.value = ""; busy = true; update();
  addMsg("user", text);
  const bubble = addMsg("ai", ""); typing.hidden = false;
  const reply = await Generator.generateResponse(text, 60, (partial) => {
    bubble.textContent = partial; chat.scrollTop = chat.scrollHeight;
  });
  bubble.textContent = reply;
  typing.hidden = true; busy = false; update();
  chat.scrollTop = chat.scrollHeight;
}

sendBtn.addEventListener("click", send);
input.addEventListener("keydown", (e) => { if (e.key === "Enter" && !e.isComposing) { e.preventDefault(); send(); } });
Generator.loadModel(setStatus).catch(() => {});
