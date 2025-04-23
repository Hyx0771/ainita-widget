// widget.js
(function(){
  const script = document.currentScript;
  const base   = script.src.substring(0, script.src.lastIndexOf('/') + 1);

  // Inject CSS
  const style = document.createElement('style');
  style.textContent = `
    :root {
      --black: #111;
      --white: #fff;
      --gray: #f4f4f4;
      --radius: 16px;
      --font: 'Inter', sans-serif;
      --bot-bg: #fafafa;
      --user-bg: #fff;
      --text-color: #333;
    }
    * { box-sizing: border-box; }
    body { margin:0; font-family: var(--font) !important; }

    /* Forceer alle tekstkleuren */
    #aigento-chat, 
    #aigento-chat * {
      color: var(--text-color) !important;
      background-color: transparent !important;
    }

    /* Launcher knop */
    #aigento-launcher {
      position: fixed;
      bottom: calc(24px + env(safe-area-inset-bottom));
      right: 24px;
      width: 60px;
      height: 60px;
      display: flex;
      justify-content: center;
      align-items: center;
      background: var(--black) !important;
      border-radius: 50% !important;
      cursor: pointer;
      box-shadow: 0 4px 18px rgba(0,0,0,0.2) !important;
      z-index: 10001 !important;
      transition: background .3s, transform .3s !important;
    }
    #aigento-launcher:hover { background: #222 !important; transform: scale(1.05) !important; }
    .launcher-icon { width: 100%; height: 100%; object-fit: contain !important; }

    /* Chat Widget */
    #aigento-chat {
      position: fixed;
      bottom: calc(96px + env(safe-area-inset-bottom));
      right: 24px;
      width: 370px;
      height: 500px;
      background: var(--white) !important;
      border-radius: var(--radius) !important;
      box-shadow: 0 12px 24px rgba(0,0,0,0.2) !important;
      display: flex;
      flex-direction: column;
      overflow: hidden;
      z-index: 9999 !important;
      border: 1px solid #e0e0e0 !important;
    }

    /* Header */
    #aigento-header {
      background: linear-gradient(90deg, #111, #222) !important;
      color: var(--white) !important;
      padding: 14px 16px !important;
      font-weight: 600 !important;
      font-size: 14px !important;
      display: flex;
      align-items: center;
      position: relative;
    }
    .aigento-headline { margin: 0; font-size: 14px !important; }
    #aigento-header span {
      position: absolute;
      right: 16px;
      cursor: pointer;
      font-size: 16px;
      opacity: .7;
      transition: opacity .2s;
    }
    #aigento-header span:hover { opacity: 1; }

    /* Body */
    #aigento-body {
      background: var(--gray) !important;
      flex-grow: 1;
      padding: 14px 16px !important;
      overflow-y: auto;
      display: flex;
      flex-direction: column;
    }
    .msg {
      max-width: 80%;
      padding: 10px 14px !important;
      border-radius: 12px !important;
      box-shadow: 0 2px 4px rgba(0,0,0,0.05) !important;
      margin-bottom: 8px !important;
    }
    .msg.user { background: var(--user-bg) !important; align-self: flex-end; }
    .msg.bot  { background: var(--bot-bg) !important; align-self: flex-start; }
    .msg p    { margin: 0; line-height: 1.4 !important; }

    /* Input */
    #aigento-input {
      padding: 12px !important;
      display: flex;
      gap: 8px;
      background: var(--white) !important;
      border-top: 1px solid #e0e0e0 !important;
    }
    #chat-input {
      flex-grow: 1;
      border-radius: 12px !important;
      border: 1px solid #ccc !important;
      padding: 10px 12px !important;
      font-size: 14px !important;
      outline: none;
    }
    #aigento-send {
      width: 42px;
      height: 42px;
      background: linear-gradient(135deg,#333,#111) !important;
      color: #fff !important;
      border: none;
      border-radius: 50% !important;
      font-size: 18px !important;
      cursor: pointer;
      display: flex;
      align-items: center;
      justify-content: center;
      transition: transform .2s, background .3s !important;
    }
    #aigento-send:hover { background: linear-gradient(135deg,#555,#222) !important; transform: translateY(-2px) !important; }

    /* Mobile adjustments */
    @media(max-width:480px){
      #aigento-launcher {
        right: 16px;
        bottom: env(safe-area-inset-bottom,16px) !important;
      }
      #aigento-chat {
        bottom: 0 !important;
        right: 0 !important;
        width: 100vw !important;
        height: 100vh !important;
        border-radius: 0 !important;
      }
      #chat-input { font-size: 16px !important; }
      .msg { font-size: 15px !important; }
      .aigento-headline { font-size: 16px !important; }
    }
  `;
  document.head.appendChild(style);

  // Inject HTML
  document.body.insertAdjacentHTML('beforeend', `
    <div id="aigento-launcher">
      <img src="${base}logo-white.png" alt="Ainita logo" class="launcher-icon">
    </div>
    <div id="aigento-chat">
      <div id="aigento-header">
        <div class="aigento-brand"><p class="aigento-headline">⚡ Slimme hulp binnen seconden</p></div>
        <span>×</span>
      </div>
      <div id="aigento-body">
        <div class="msg bot"><p>👋 Hoi! Ik ben <strong>Ainita</strong>, je slimme assistent. Stel me gerust al je vragen!</p></div>
      </div>
      <div id="aigento-input">
        <input type="text" id="chat-input" placeholder="Typ je bericht...">
        <button id="aigento-send">📤</button>
      </div>
    </div>
  `);

  // Bind events & logic
  const launcher = document.getElementById("aigento-launcher");
  const widget   = document.getElementById("aigento-chat");
  const body     = document.getElementById("aigento-body");
  const input    = document.getElementById("chat-input");
  const send     = document.getElementById("aigento-send");
  const closeBtn = document.querySelector('#aigento-header span');
  let chatOpen = true;

  function toggleAigento(){
    chatOpen = !chatOpen;
    widget.style.display = chatOpen ? "flex" : "none";
  }
  window.toggleAigento = toggleAigento;

  launcher.addEventListener("click", toggleAigento);
  closeBtn.addEventListener("click", toggleAigento);
  send.addEventListener("click", sendMessage);
  input.addEventListener("keypress", e => { if(e.key==="Enter") sendMessage(); });

  function formatText(text){
    const lines = text.split("\n").map(l=>l.trim()).filter(Boolean);
    return lines.length>1
      ? lines.map(l=>`<p>${l}</p>`).join("")
      : `<p>${lines[0]||text}</p>`;
  }

  function appendMessage(role, text){
    const msg = document.createElement("div");
    msg.className = `msg ${role}`;
    msg.innerHTML = formatText(text);
    body.appendChild(msg);
    body.scrollTop = body.scrollHeight;
  }

  async function sendMessage(){
    const message = input.value.trim();
    if(!message) return;
    appendMessage("user", message);
    input.value = "";
    const indicator = document.createElement("div");
    indicator.className = "msg bot";
    indicator.id = "typing-indicator";
    indicator.innerHTML = `<p><strong>Ainita</strong> is aan het typen...</p>`;
    body.appendChild(indicator);
    body.scrollTop = body.scrollHeight;

    try {
      const res = await fetch("https://respondo.app.n8n.cloud/webhook/0f29e441-cb43-4397-a6d9-dd5a0ef0bb1a", {
        method:"POST",
        headers:{"Content-Type":"application/json"},
        body:JSON.stringify({ message })
      });
      const data = await res.json();
      document.getElementById("typing-indicator")?.remove();
      appendMessage("bot", data.response||"🤖 Geen antwoord ontvangen.");
    } catch {
      document.getElementById("typing-indicator")?.remove();
      appendMessage("bot","⚠️ Er ging iets mis bij het ophalen van het antwoord.");
    }
  }
})();
