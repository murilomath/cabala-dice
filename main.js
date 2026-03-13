import OBR from "https://unpkg.com/@owlbear-rodeo/sdk@latest/dist/index.mjs"

let diceType = "d6"
let diceCount = 1
let mode = "normal"

const META_KEY = "cabala.dice.log"

await OBR.onReady()

document.getElementById("d6").onclick = () => diceType="d6"
document.getElementById("d66").onclick = () => diceType="d66"

document.getElementById("adv").onclick = () => mode="adv"
document.getElementById("des").onclick = () => mode="des"

document.getElementById("more").onclick = () =>{
diceCount=Math.min(12,diceCount+1)
updateCount()
}

document.getElementById("less").onclick = () =>{
diceCount=Math.max(1,diceCount-1)
updateCount()
}

document.getElementById("roll").onclick = rollDice

updateCount()

function updateCount(){
document.getElementById("diceCount").innerText=diceCount
}

function d6(){
return Math.floor(Math.random()*6)+1
}

function rollDice(){

if(diceType==="d66"){
rollD66()
return
}

let results=[]
for(let i=0;i<diceCount;i++){
results.push(d6())
}

let success=0
let crit=0

for(let r of results){

if(r===1)crit++

if(mode==="normal" && r>=5)success++
if(mode==="des" && r===6)success++
if(mode==="adv" && r>=4)success++

}

sendRoll({
type:"d6",
dice:diceCount,
mode,
results,
success,
crit
})

}

function rollD66(){

let r1=d6()
let r2=d6()

let result=r1*10+r2

sendRoll({
type:"d66",
result
})

}

async function sendRoll(data){

let player=(await OBR.player.get()).name

let roll={
player,
time:Date.now(),
...data
}

let metadata=await OBR.room.getMetadata()

let log=metadata[META_KEY]||[]

log.unshift(roll)

log=log.slice(0,30)

await OBR.room.setMetadata({
[META_KEY]:log
})

}

OBR.room.onMetadataChange(metadata=>{
render(metadata[META_KEY]||[])
})

async function init(){
let metadata=await OBR.room.getMetadata()
render(metadata[META_KEY]||[])
}

init()

function render(log){

let html=""

for(let r of log){

if(r.type==="d66"){

html+=`
<div class="roll">
<b>${r.player}</b> d66 → ${r.result}
</div>
`

}else{

html+=`
<div class="roll">
<b>${r.player}</b> ${r.dice}d6 (${r.mode})<br>
[ ${r.results.join(", ")} ]<br>
Sucessos: ${r.success} | Falhas críticas: ${r.crit}
</div>
`
}

}

document.getElementById("history").innerHTML=html

}
