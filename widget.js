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
    }
    * { box-sizing: border-box; }
    body { margin: 0; font-family: var(--font); }

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
      background: var(--black);
      border-radius: 50%;
      cursor: pointer;
      box-shadow: 0 4px 18px rgba(0,0,0,0.2);
      z-index: 10001;
      transition: background 0.3s, transform 0.3s;
    }
    #aigento-launcher:hover { background: #222; transform: scale(1.05); }
    .launcher-icon { width:100%; height:100%; object-fit: contain; }

    /* Chat Widget */
    #aigento-chat {
      position: fixed;
      bottom: calc(96px + env(safe-area-inset-bottom));
      right: 24px;
      width: 370px;
      height: 500px;
      background: var(--white);
      border-radius: var(--radius);
      box-shadow: 0 12px 24px rgba(0,0,0,0.2);
      display: flex;
      flex-direction: column;
      overflow: hidden;
      z-index: 9999;
      border: 1px solid #e0e0e0;
    }

    /* Header */
    #aigento-header {
      background: linear-gradient(90deg, #111, #222);
      color: var(--white);
      padding: 14px 16px;
      font-weight: 600;
      font-size: 14px;
      display: flex;
      align-items: center;
      position: relative;
    }
    .aigento-headline { margin: 0; font-size: 14px; }
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
      background: var(--gray);
      flex-grow: 1;
      padding: 14px 16px;
      overflow-y: auto;
      font-size: 14px;
      display: flex;
      flex-direction: column;
    }
    .msg {
      max-width: 80%;
      padding: 10px 14px;
      border-radius: 12px;
      box-shadow: 0 2px 4px rgba(0,0,0,0.05);
      margin-bottom: 8px;
      background: var(--bot-bg);
      color: #333;
    }
    .msg.user { background: var(--user-bg); color: var(--black); align-self: flex-end; }
    .msg.bot  { align-self: flex-start; }
    .msg p    { margin: 0; line-height: 1.4; }

    /* Input */
    #aigento-input {
      padding: 12px;
      display: flex;
      gap: 8px;
      background: var(--white);
      border-top: 1px solid #e0e0e0;
    }
    #chat-input {
      flex-grow: 1;
      border-radius: 12px;
      border: 1px solid #ccc;
      padding: 10px 12px;
      font-size: 14px;
      outline: none;
      color: var(--black);
    }
    #aigento-send {
      width: 42px;
      height: 42px;
      background: linear-gradient(135deg, #333, #111);
      color: white;
      border: none;
      border-radius: 50%;
      font-size: 18px;
      cursor: pointer;
      display: flex;
      align-items: center;
      justify-content: center;
      transition: transform 0.2s, background 0.3s;
    }
    #aigento-send:hover { background: linear-gradient(135deg, #555, #222); transform: translateY(-2px); }

    /* Desktop override: launcher altijd zichtbaar */
    @media (min-width: 481px) {
      #aigento-launcher {
        display: flex !important;
      }
    }

    /* Mobile adjustments */
    @media (max-width: 480px) {
      #aigento-launcher {
        right: 16px;
        bottom: env(safe-area-inset-bottom, 16px);
      }
      #aigento-chat {
        bottom: 0;
        right: 0;
        width: 100vw;
        height: 100vh;
        border-radius: 0;
      }
      #chat-input { font-size: 16px; }
      .msg { font-size: 15px; }
      .aigento-headline { font-size: 16px; }
    }
  `;
  document.head.appendChild(style);

  // Inject HTML
  document.body.insertAdjacentHTML('beforeend', `
    <div id="aigento-launcher">
      <img src="${base}logo-white.png" alt="Ainita logo" class="launcher-icon" />
    </div>
    <div id="aigento-chat">
      <div id="aigento-header">
        <div class="aigento-brand">
          <p class="aigento-headline">⚡ Slimme hulp binnen seconden</p>
        </div>
        <span>×</span>
      </div>
      <div id="aigento-body">
        <div class="msg bot">
          <p>👋 Hoi! Ik ben <strong>Ainita</strong>, je slimme assistent. Stel me gerust al je vragen!</p>
        </div>
      </div>
      <div id="aigento-input">
        <input type="text" id="chat-input" placeholder="Typ je bericht..." />
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
  const closeBtn = document.querySelector("#aigento-header span");
  let chatOpen = true;

  function toggleAigento(){
    chatOpen = !chatOpen;
    widget.style.display   = chatOpen ? "flex" : "none";
    launcher.style.display = chatOpen ? "none" : "flex";
  }
  window.toggleAigento = toggleAigento;

  // Start geopend op desktop & mobiel, launcher alleen mobiel verborgen
  widget.style.display   = "flex";
  launcher.style.display = window.innerWidth > 480 ? "flex" : "none";

  launcher.addEventListener("click", toggleAigento);
  closeBtn.addEventListener("click", toggleAigento);
  send.addEventListener("click", sendMessage);
  input.addEventListener("keypress", e => { if (e.key === "Enter") sendMessage(); });

  function formatText(text){
    const lines = text.split("\n").map(l => l.trim()).filter(Boolean);
    return lines.length > 1
      ? lines.map(l => `<p>${l}</p>`).join("")
      : `<p>${lines[0] || text}</p>`;
  }

  function appendMessage(role, text){
    const msg = document.createElement("div");
    msg.className = \`msg \${role}\`;
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
    indicator.innerHTML = "<p><strong>Ainita</strong> is aan het typen...</p>";
    body.appendChild(indicator);
    body.scrollTop = body.scrollHeight;

    try {
      const res = await fetch("https://respondo.app.n8n.cloud/webhook/0f29e441-cb43-4397-a6d9-dd5a0ef0bb1a", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ message })
      });
      const data = await res.json();
      document.getElementById("typing-indicator")?.remove();
      appendMessage("bot", data.response || "🤖 Geen antwoord ontvangen.");
    } catch {
      document.getElementById("typing-indicator")?.remove();
      appendMessage("bot", "⚠️ Er ging iets mis bij het ophalen van het antwoord.");
    }
  }
})();
