const META_KEY_PREFIX = "cabala-dice/room";
const LEGACY_META_KEY = "cabala-dice/history";
const LOCAL_KEY_PREFIX = "cabala-dice/local-history";
const LOCAL_PLAYER_KEY = "cabala-dice/player";
const ROLL_BROADCAST_CHANNEL = "cabala-dice/roll";
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
  roomId: "default-room",
  obrReady: false,
  historyByPlayer: new Map(),
  obrRoomMetadata: {},
  obrPartyPlayers: [],
};

function getLocalRoomId() {
  const params = new URLSearchParams(globalThis.location?.search ?? "");
  return params.get("room") || "default-room";
}

function getLocalHistoryKey(roomId) {
  return `${LOCAL_KEY_PREFIX}/${roomId}`;
}

function getPlayerMetaKey(roomId, playerId) {
  return `${META_KEY_PREFIX}/${roomId}/player/${playerId}`;
}

function readRoomHistoryFromMetadata(metadata, roomId) {
  const prefix = `${META_KEY_PREFIX}/${roomId}/player/`;
  const entries = Object.entries(metadata)
    .filter(([key]) => key.startsWith(prefix))
    .map(([, value]) => value)
    .filter((value) => value && typeof value === "object");

  if (entries.length) {
    return entries.sort((a, b) => (b.timestamp ?? 0) - (a.timestamp ?? 0));
  }

  const legacy = Array.isArray(metadata[LEGACY_META_KEY]) ? metadata[LEGACY_META_KEY] : [];
  return legacy.sort((a, b) => (b.timestamp ?? 0) - (a.timestamp ?? 0));
}

function readPartyHistory(players, roomId) {
  const keyPrefix = `${META_KEY_PREFIX}/${roomId}/player/`;
  return players
    .map((player) => player?.metadata || {})
    .flatMap((metadata) =>
      Object.entries(metadata)
        .filter(([key]) => key.startsWith(keyPrefix))
        .map(([, value]) => value)
    )
    .filter((value) => value && typeof value === "object");
}

function getObrHistory() {
  return dedupeAndSortHistory([
    ...readRoomHistoryFromMetadata(state.obrRoomMetadata, state.roomId),
    ...readPartyHistory(state.obrPartyPlayers, state.roomId),
  ]);
}

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

function dedupeAndSortHistory(history) {
  const byPlayer = new Map();
  history.forEach((entry) => {
    if (!entry?.playerId) return;
    const existing = byPlayer.get(entry.playerId);
    if (!existing || (entry.timestamp ?? 0) > (existing.timestamp ?? 0)) {
      byPlayer.set(entry.playerId, entry);
    }
  });

  return [...byPlayer.values()]
    .sort((a, b) => (b.timestamp ?? 0) - (a.timestamp ?? 0))
    .slice(0, 20);
}

function setHistory(history) {
  state.historyByPlayer = new Map(history.map((entry) => [entry.playerId, entry]));
  renderHistory(history, state.playerId);
}

function upsertHistoryEntry(entry) {
  if (!entry?.playerId) return;
  const existing = state.historyByPlayer.get(entry.playerId);
  if (existing && (existing.timestamp ?? 0) >= (entry.timestamp ?? 0)) return;

  state.historyByPlayer.set(entry.playerId, entry);
  const sorted = [...state.historyByPlayer.values()]
    .sort((a, b) => (b.timestamp ?? 0) - (a.timestamp ?? 0))
    .slice(0, 20);
  state.historyByPlayer = new Map(sorted.map((item) => [item.playerId, item]));
  renderHistory(sorted, state.playerId);
}

function readLocalHistory() {
  try {
    const raw = globalThis.localStorage?.getItem(getLocalHistoryKey(state.roomId));
    const history = raw ? JSON.parse(raw) : [];
    return Array.isArray(history) ? history : [];
  } catch {
    return [];
  }
}

function writeLocalHistory(history) {
  try {
    globalThis.localStorage?.setItem(getLocalHistoryKey(state.roomId), JSON.stringify(history));
  } catch {
    // sandboxed iframes can block localStorage
  }
}

function saveLocalRoll(entry) {
  const existing = readLocalHistory();
  const next = dedupeAndSortHistory([entry, ...existing]);
  writeLocalHistory(next);
  setHistory(next);
}

async function saveRoll(entry) {
  const OBR = globalThis.OBR;
  if (!state.obrReady || !OBR) { 
    saveLocalRoll(entry);
    return;
  }
  
  const key = getPlayerMetaKey(state.roomId, state.playerId);
  const writeOperations = [];

  if (OBR.player?.setMetadata) {
    writeOperations.push(OBR.player.setMetadata({ [key]: entry }));
  }

  if (OBR.room?.setMetadata) {
    writeOperations.push(OBR.room.setMetadata({ [key]: entry }));
  }

  await Promise.allSettled(writeOperations);

  if (OBR.broadcast?.sendMessage) {
    await OBR.broadcast.sendMessage(ROLL_BROADCAST_CHANNEL, {
      roomId: state.roomId,
      entry,
    });
  }

  upsertHistoryEntry(entry);
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
  state.roomId = getLocalRoomId();
  try {
    const raw = globalThis.localStorage?.getItem(LOCAL_PLAYER_KEY);
    const parsed = raw ? JSON.parse(raw) : null;
    if (parsed?.id) {
      state.playerId = parsed.id;
      state.playerName = parsed.name || "Jogador";
    } else {
      const generated = {
        id: `web-${globalThis.crypto?.randomUUID?.() || Date.now()}`,
        name: "Jogador (web)",
      };
      state.playerId = generated.id;
      state.playerName = generated.name;
      globalThis.localStorage?.setItem(LOCAL_PLAYER_KEY, JSON.stringify(generated));
    }
  } catch {
    state.playerId = `web-${Date.now()}`;
    state.playerName = "Jogador (web)";
  }

  const history = readLocalHistory();
  setHistory(history);
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
    const room = await OBR.room.getRoom();
    state.obrReady = true;
    state.playerId = player.id;
    state.playerName = player.name || "Jogador";
    state.roomId = room?.id || "default-room";

    state.obrRoomMetadata = await OBR.room.getMetadata();

    if (OBR.party?.getPlayers) {
      state.obrPartyPlayers = await OBR.party.getPlayers();
    }

    const history = getObrHistory();
    setHistory(history);

    const own = history.find((entry) => entry.playerId === state.playerId);
    if (own) renderOwnResult(own);

    OBR.room.onMetadataChange((nextMetadata) => {
      state.obrRoomMetadata = nextMetadata;
      setHistory(getObrHistory());
    });

    if (OBR.party?.onChange) {
      OBR.party.onChange((players) => {
        state.obrPartyPlayers = players;
        setHistory(getObrHistory());
      });
    }
  });

  if (OBR.broadcast?.onMessage) {
      OBR.broadcast.onMessage(ROLL_BROADCAST_CHANNEL, (message) => {
        const data = message?.data;
        if (!data || data.roomId !== state.roomId || !data.entry) return;
        upsertHistoryEntry(data.entry);
      });
    }
}

wireControls();
initLocalMode();
initObrWhenReady();
