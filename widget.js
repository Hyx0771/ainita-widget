// widget.js
(function(){
  const script = document.currentScript;
  const base   = script.src.slice(0, script.src.lastIndexOf('/') + 1);

  // 1) Inject CSS
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

    /* Launcher */
    #aigento-launcher {
      position: fixed;
      bottom: calc(24px + env(safe-area-inset-bottom));
      right: 24px;
      width: 60px;
      height: 60px;
      background: var(--black);
      border-radius: 50%;
      display: flex;
      align-items: center;
      justify-content: center;
      cursor: pointer;
      box-shadow: 0 4px 18px rgba(0,0,0,0.2);
      z-index: 10001;
      transition: background .3s, transform .3s;
    }
    #aigento-launcher:hover {
      background: #222;
      transform: scale(1.05);
    }
    .launcher-icon {
      width: 100%;
      height: 100%;
      object-fit: contain;
    }

    /* Chat window */
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
      font-size: 14px;
      font-weight: 600;
      display: flex;
      align-items: center;
      position: relative;
    }
    .aigento-headline {
      margin: 0;
      font-size: 14px;
    }
    #aigento-header .close-btn {
      position: absolute;
      right: 16px;
      font-size: 16px;
      cursor: pointer;
      opacity: .7;
      transition: opacity .2s;
    }
    #aigento-header .close-btn:hover {
      opacity: 1;
    }

    /* Body */
    #aigento-body {
      background: var(--gray);
      flex: 1;
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
    .msg.user {
      align-self: flex-end;
      background: var(--user-bg);
      color: var(--black);
    }
    .msg.bot {
      align-self: flex-start;
    }
    .msg p {
      margin: 0;
      line-height: 1.4;
    }

    /* Input */
    #aigento-input {
      display: flex;
      gap: 8px;
      padding: 12px;
      background: var(--white);
      border-top: 1px solid #e0e0e0;
    }
    #chat-input {
      flex: 1;
      padding: 10px 12px;
      font-size: 14px;
      border: 1px solid #ccc;
      border-radius: 12px;
      outline: none;
      color: var(--black);
    }
    #aigento-send {
      width: 42px;
      height: 42px;
      background: linear-gradient(135deg, #333, #111);
      border: none;
      border-radius: 50%;
      display: flex;
      align-items: center;
      justify-content: center;
      font-size: 18px;
      color: #fff;
      cursor: pointer;
      transition: transform .2s, background .3s;
    }
    #aigento-send:hover {
      background: linear-gradient(135deg, #555, #222);
      transform: translateY(-2px);
    }

    /* Desktop: always show launcher */
    @media (min-width: 481px) {
      #aigento-launcher { display: flex !important; }
    }

    /* Mobile: full-screen chat, launcher toggle */
    @media (max-width: 480px) {
      #aigento-chat {
        width: 100vw;
        height: 100vh;
        bottom: 0 !important;
        right: 0 !important;
        border-radius: 0;
      }
      #aigento-launcher {
        right: 16px;
        bottom: env(safe-area-inset-bottom, 16px);
      }
      #chat-input { font-size: 16px; }
      .msg { font-size: 15px; }
      .aigento-headline { font-size: 16px; }
    }
  `;
  document.head.appendChild(style);

  // 2) Inject HTML
  document.body.insertAdjacentHTML('beforeend', `
    <div id="aigento-launcher">
      <img src="${base}logo-white.png" class="launcher-icon" alt="Ainita" />
    </div>
    <div id="aigento-chat">
      <div id="aigento-header">
        <p class="aigento-headline">⚡ Slimme hulp binnen seconden</p>
        <span class="close-btn">×</span>
      </div>
      <div id="aigento-body">
        <div class="msg bot"><p>👋 Hoi! Ik ben <strong>Ainita</strong>, je slimme assistent. Stel me gerust al je vragen!</p></div>
      </div>
      <div id="aigento-input">
        <input id="chat-input" type="text" placeholder="Typ je bericht…" />
        <button id="aigento-send">📤</button>
      </div>
    </div>
  `);

  // 3) Logic & events
  const launcher = document.getElementById('aigento-launcher');
  const widget   = document.getElementById('aigento-chat');
  const body     = document.getElementById('aigento-body');
  const input    = document.getElementById('chat-input');
  const send     = document.getElementById('aigento-send');
  const closeBtn = document.querySelector('#aigento-header .close-btn');

  let chatOpen = true;

  function updateLauncher() {
    const isMobile = window.innerWidth <= 480;
    launcher.style.display = chatOpen
      ? (isMobile ? 'none' : 'flex')
      : 'flex';
  }

  function toggleAigento() {
    chatOpen = !chatOpen;
    widget.style.display = chatOpen ? 'flex' : 'none';
    updateLauncher();
  }

  function formatText(text) {
    return text
      .split('\n')
      .map(l => l.trim())
      .filter(Boolean)
      .map(l => `<p>${l}</p>`)
      .join('');
  }

  function appendMessage(role, text) {
    const msg = document.createElement('div');
    msg.className = `msg ${role}`;
    msg.innerHTML = formatText(text);
    body.appendChild(msg);
    body.scrollTop = body.scrollHeight;
  }

  async function sendMessage() {
    const message = input.value.trim();
    if (!message) return;
    appendMessage('user', message);
    input.value = '';
    const loader = document.createElement('div');
    loader.className = 'msg bot';
    loader.id = 'typing-indicator';
    loader.innerHTML = `<p><strong>Ainita</strong> is aan het typen…</p>`;
    body.appendChild(loader);
    body.scrollTop = body.scrollHeight;

    try {
      const res = await fetch('https://respondo.app.n8n.cloud/webhook/0f29e441-cb43-4397-a6d9-dd5a0ef0bb1a', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ message })
      });
      const data = await res.json();
      document.getElementById('typing-indicator')?.remove();
      appendMessage('bot', data.response || '🤖 Geen antwoord ontvangen.');
    } catch {
      document.getElementById('typing-indicator')?.remove();
      appendMessage('bot', '⚠️ Er ging iets mis bij het ophalen van het antwoord.');
    }
  }

  // initialize
  widget.style.display   = 'flex';
  updateLauncher();

  launcher.addEventListener('click', toggleAigento);
  closeBtn.addEventListener('click', toggleAigento);
  send.addEventListener('click', sendMessage);
  input.addEventListener('keypress', e => { if (e.key === 'Enter') sendMessage(); });
  window.addEventListener('resize', updateLauncher);
})();
