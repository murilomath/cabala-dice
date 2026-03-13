import OBR from "https://unpkg.com/@owlbear-rodeo/sdk@latest/dist/index.mjs"

let dice = 0

function rollD6(n){
  let results = []
  for(let i=0;i<n;i++){
    results.push(Math.floor(Math.random()*6)+1)
  }
  return results
}

function countResults(results,mode){

  let success = 0
  let critFail = 0

  for(let r of results){

    if(r==1) critFail++

    if(mode=="Desvantagem"){
      if(r==6) success++
    }

    if(mode=="Normal"){
      if(r>=5) success++
    }

    if(mode=="Vantagem"){
      if(r>=4) success++
    }

  }

  return {success,critFail}
}

function rollD66(){
  let d1 = Math.floor(Math.random()*6)+1
  let d2 = Math.floor(Math.random()*6)+1
  return d1*10 + d2
}

let log = []

window.addEventListener("DOMContentLoaded", () => {

  updateDice()

  document.getElementById("d6").onclick = () => {
    if(dice<12) dice++
    updateDice()
  }

  document.getElementById("cancel").onclick = () => {
    dice=0
    updateDice()
  }

  document.getElementById("dis").onclick = () => doRoll("Desvantagem")
  document.getElementById("nor").onclick = () => doRoll("Normal")
  document.getElementById("adv").onclick = () => doRoll("Vantagem")

  document.getElementById("d66").onclick = () => {

    let result = rollD66()

    log.unshift({
      player:"Jogador",
      type:"d66",
      result
    })

    renderHistory()

  }

})

function updateDice(){
  document.getElementById("dice-count").innerText=dice
}

function doRoll(mode){

  if(dice==0) return

  let results = rollD6(dice)

  let {success,critFail} = countResults(results,mode)

  log.unshift({
    player:"Jogador",
    dice,
    mode,
    results,
    success,
    critFail
  })

  renderHistory()

}

function renderHistory(){

  let html=""

  for(let r of log){

    if(r.type=="d66"){

      html+=`
      <div>
      <b>${r.player}</b> rolou d66 → ${r.result}
      </div>
      <hr>
      `

    }else{

      html+=`
      <div>
      <b>${r.player}</b> ${r.dice}d6 (${r.mode})<br>
      [ ${r.results.join(", ")} ]<br>
      Sucessos: ${r.success} |
      Falhas Críticas: ${r.critFail}
      </div>
      <hr>
      `
    }

  }

  document.getElementById("history").innerHTML=html

}
