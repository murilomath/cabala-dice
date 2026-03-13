import OBR from "https://unpkg.com/@owlbear-rodeo/sdk@latest/dist/index.mjs"
import { rollD6, countResults, rollD66 } from "./modules/dice.js"
import { addLog, listenLogs } from "./modules/log.js"

let dice = 0

window.addEventListener("DOMContentLoaded", async () => {

  await OBR.onReady()

  updateDice()

  document.getElementById("d6").onclick = () => {
    if (dice < 12) dice++
    updateDice()
  }

  document.getElementById("cancel").onclick = () => {
    dice = 0
    updateDice()
  }

  document.getElementById("dis").onclick = () => doRoll("dis")
  document.getElementById("nor").onclick = () => doRoll("nor")
  document.getElementById("adv").onclick = () => doRoll("adv")

  document.getElementById("d66").onclick = async () => {

    let result = rollD66()

    let player = (await OBR.player.get()).name

    await addLog({
      player,
      type: "d66",
      result,
      time: Date.now()
    })

  }

  listenLogs(renderHistory)

})

function updateDice() {
  document.getElementById("dice-count").innerText = dice
}

async function doRoll(mode) {

  if (dice == 0) return

  let results = rollD6(dice)

  let { success, critFail } = countResults(results, mode)

  let player = (await OBR.player.get()).name

  await addLog({
    player,
    dice,
    mode,
    results,
    success,
    critFail,
    time: Date.now()
  })

}

function renderHistory(log) {

  let html = ""

  for (let r of log) {

    if (r.type === "d66") {

      html += `
      <div>
      <b>${r.player}</b> rolou d66 → ${r.result}
      </div>
      `

    } else {

      html += `
      <div>
      <b>${r.player}</b> ${r.dice}d6 (${r.mode})<br>
      ${r.results.join(", ")}<br>
      Sucessos: ${r.success} |
      Falhas Críticas: ${r.critFail}
      </div>
      <hr>
      `
    }

  }

  document.getElementById("history").innerHTML = html

}
