export function updateDiceCounter(count) {
  const el = document.getElementById("dice-count")
  if (el) el.innerText = count
}

export function showResult(success, critFail) {

  const result = document.getElementById("result")

  result.innerHTML = `
    <div>Sucessos: <span class="roll-success">${success}</span></div>
    <div>Falhas Críticas: <span class="roll-fail">${critFail}</span></div>
  `
}

export function renderHistory(log) {

  const history = document.getElementById("history")

  if (!history) return

  history.innerHTML = ""

  log.forEach(entry => {

    let card = document.createElement("div")
    card.className = "roll-card"

    if (entry.type === "d66") {

      card.innerHTML = `
      <div class="roll-player">${entry.player}</div>
      <div class="roll-results">d66 → ${entry.result}</div>
      `

    } else {

      card.innerHTML = `
      <div class="roll-player">${entry.player}</div>
      <div class="roll-results">${entry.dice}d6 (${entry.mode})</div>
      <div class="roll-results">[ ${entry.results.join(" , ")} ]</div>
      <div>
        <span class="roll-success">Sucessos: ${entry.success}</span>
        |
        <span class="roll-fail">Falhas: ${entry.critFail}</span>
      </div>
      `
    }

    history.appendChild(card)

  })

}
