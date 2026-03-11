let d6pool = 0

function addD6(){
d6pool++
document.getElementById("pool").innerHTML = d6pool + "d6"
}

function clearDice(){
d6pool = 0
document.getElementById("pool").innerHTML = "0d6"
document.getElementById("resultado").innerHTML = ""
}

function roll(mode){

if(d6pool === 0) return

let target = 5
if(mode==="vantagem") target = 4
if(mode==="desvantagem") target = 6

let resultados=[]

for(let i=0;i<d6pool;i++){
resultados.push(random(6))
}

let sucessos=0
let meio=0
let falhas=0

resultados.forEach(r=>{
if(r>=target) sucessos++
else if(r===target-1) meio++
else if(r===1) falhas++
})

let html="Resultados: ["+resultados.join(", ")+"]<br><br>"
html+="Sucessos: "+sucessos+"<br>"
html+="Meio: "+meio+"<br>"
html+="Falhas: "+falhas

displayLocal(html)

sendRoll(html)

}

function rollD66(){

let a=random(6)
let b=random(6)

let html="Resultado d66: "+a+""+b

displayLocal(html)

sendRoll(html)

}

function displayLocal(html){
document.getElementById("resultado").innerHTML = html
}

function random(max){
return Math.floor(Math.random()*max)+1
}

function sendRoll(result){

OBR.player.getName().then(name=>{

OBR.broadcast.sendMessage("cabala.roll",{
player:name,
result:result
})

})

}

function updatePlayers(rolls){

let html=""

for(let p in rolls){
html+="<div class='player'><b>"+p+":</b> "+rolls[p]+"</div>"
}

document.getElementById("playersList").innerHTML = html

}

OBR.onReady(()=>{

OBR.broadcast.onMessage("cabala.roll", async (data)=>{

let player = await OBR.player.getRole()

if(player === "GM"){

let metadata = await OBR.room.getMetadata()

let rolls = metadata.rolls || {}

rolls[data.player] = data.result

await OBR.room.setMetadata({rolls})

}

})

OBR.room.onMetadataChange((metadata)=>{

if(metadata.rolls){
updatePlayers(metadata.rolls)
}

})

})
