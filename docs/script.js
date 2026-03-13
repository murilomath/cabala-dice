const META_KEY = "cabala-dice/history";
const LOCAL_KEY = "cabala-dice/local-history";
const diceCountEl = document.getElementById("dice-count");
const resultEl = document.getElementById("result");
const historyListEl = document.getElementById("history-list");
const typeButtons = [...document.querySelectorAll("button[data-type]")];
const modeButtons = [...document.querySelectorAll("button[data-mode]")];

const state = {
  type: "d6",
  mode: "normal",
  diceCount: 1,
  playerId: "local-player",
  playerName: "Jogador",
  obrReady: false,
};

const rollDie = (sides) => Math.floor(Math.random() * sides) + 1;

function applyActiveClass(buttons, matcher) {
  buttons.forEach((button) => button.classList.toggle("active", matcher(button)));
}

function targetForMode(mode) {
  if (mode === "adv") return 4;
  if (mode === "des") return 6;
  return 5;
}

function formatRoll(entry) {
  const rolls = entry.rolls.join(", ");
  const detail =
    entry.type === "d66"
      ? `resultado ${entry.total}`
      : `sucessos ${entry.successes}, falhas críticas(1) ${entry.critFailures}`;
  return `${entry.playerName}: ${entry.type.toUpperCase()} [${rolls}] → ${detail}`;
}

function renderOwnResult(entry) {
  resultEl.innerHTML = `<h2>Sua última rolagem</h2><p>${formatRoll(entry)}</p>`;
}

function renderHistory(history, ownId) {
  if (!history.length) {
    historyListEl.innerHTML = "<li>Nenhuma rolagem registrada.</li>";
    return;
  }

  historyListEl.innerHTML = "";
  history.forEach((entry) => {
    const li = document.createElement("li");
    li.textContent = `${entry.playerId === ownId ? "(Você) " : ""}${formatRoll(entry)}`;
    historyListEl.append(li);
  });
}

function saveLocalRoll(entry) {
  const key = "cabala-dice/local-history";
  function readLocalHistory() {
  try {
    const raw = globalThis.localStorage?.getItem(LOCAL_KEY);
    const history = raw ? JSON.parse(raw) : [];
    return Array.isArray(history) ? history : [];
  } catch {
    return [];
  }
}

function writeLocalHistory(history) {
  try {
    globalThis.localStorage?.setItem(LOCAL_KEY, JSON.stringify(history));
  } catch {
    // sandboxed iframes can block localStorage
  }
}
  const next = [entry, ...others].slice(0, 20);
  writeLocalHistory(next);
  renderHistory(next, state.playerId);
}

async function saveRoll(entry) {
const OBR = globalThis.OBR;
  if (!state.obrReady || !OBR) {    
    saveLocalRoll(entry);
    return;
  }
  
  const metadata = await OBR.room.getMetadata();
  const existing = Array.isArray(metadata[META_KEY]) ? metadata[META_KEY] : [];
  const others = existing.filter((item) => item.playerId !== entry.playerId);
  await OBR.room.setMetadata({ ...metadata, [META_KEY]: [entry, ...others] });
}

function makeRoll() {
  if (state.type === "d66") {
    const tens = rollDie(6);
    const ones = rollDie(6);
    return {
      type: "d66",
      mode: "normal",
      rolls: [tens, ones],
      total: tens * 10 + ones,
      successes: 0,
      critFailures: 0,
    };
  }

  const target = targetForMode(state.mode);
  const rolls = Array.from({ length: state.diceCount }, () => rollDie(6));
  return {
    type: "d6",
    mode: state.mode,
    rolls,
    total: null,
    successes: rolls.filter((value) => value >= target).length,
    critFailures: rolls.filter((value) => value === 1).length,
  };
}

function wireControls() {
  typeButtons.forEach((button) => {
    button.addEventListener("click", () => {
      state.type = button.dataset.type;
      applyActiveClass(typeButtons, (item) => item === button);
    });
  });

  modeButtons.forEach((button) => {
    button.addEventListener("click", () => {
      const selected = button.dataset.mode;
      state.mode = state.mode === selected ? "normal" : selected;
      applyActiveClass(modeButtons, (item) => item.dataset.mode === state.mode);
    });
  });

  document.getElementById("decrease").addEventListener("click", () => {
    state.diceCount = Math.max(1, state.diceCount - 1);
    diceCountEl.textContent = String(state.diceCount);
  });

  document.getElementById("increase").addEventListener("click", () => {
    state.diceCount = Math.min(20, state.diceCount + 1);
    diceCountEl.textContent = String(state.diceCount);
  });

  document.getElementById("roll").addEventListener("click", async () => {
    const entry = {
      ...makeRoll(),
      playerId: state.playerId,
      playerName: state.playerName,
      timestamp: Date.now(),
    };
    renderOwnResult(entry);
    await saveRoll(entry);
  });
}

function initLocalMode() {
  const history = readLocalHistory();
  renderHistory(history, state.playerId);
  const own = history.find((entry) => entry.playerId === state.playerId);
  if (own) renderOwnResult(own);
}

function initObrWhenReady(attempt = 0) {
  const OBR = globalThis.OBR;
  if (!OBR?.onReady) {
    if (attempt < 100) {
      setTimeout(() => initObrWhenReady(attempt + 1), 50);
    }
    return;
  }
  
  OBR.onReady(async () => {
    const player = await OBR.player.getPlayer();
    state.obrReady = true;
    state.playerId = player.id;
    state.playerName = player.name || "Jogador";

    const metadata = await OBR.room.getMetadata();
    const history = Array.isArray(metadata[META_KEY]) ? metadata[META_KEY] : [];
    renderHistory(history, state.playerId);

    const own = history.find((entry) => entry.playerId === state.playerId);
    if (own) renderOwnResult(own);

    OBR.room.onMetadataChange((nextMetadata) => {
      const nextHistory = Array.isArray(nextMetadata[META_KEY]) ? nextMetadata[META_KEY] : [];
      renderHistory(nextHistory, state.playerId);
    });
  });
}

wireControls();
initLocalMode();
initObrWhenReady();
