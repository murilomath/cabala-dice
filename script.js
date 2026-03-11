let d6pool = 0
let playerResults = {}

function addD6(){

d6pool++

document.getElementById("pool").innerHTML =
d6pool + "d6"

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

let comuns=[]
let maestria=[]
let maestriaFinal=[]

for(let i=0;i<d6pool;i++){

let r=random(6)

if(i<6){
comuns.push(r)
}else{
maestria.push(r)
}

}

maestriaFinal=[...maestria]

for(let i=0;i<maestriaFinal.length;i++){

if(maestriaFinal[i]===1){
maestriaFinal[i]=random(6)
}

}

let finalResults=[...comuns,...maestriaFinal]

let sucessos=0
let meio=0
let falhas=0

finalResults.forEach(r=>{

if(r>=target) sucessos++
else if(r===target-1) meio++
else if(r===1) falhas++

})

let html=""

if(d6pool<=6){

html="Resultados: ["+finalResults.join(", ")+"]"

}else{

html="Resultados:<br>"
html+="• Comuns ["+comuns.join(", ")+"]<br>"
html+="• Maestria ["+maestria.join(", ")+"]"

if(JSON.stringify(maestria)!==JSON.stringify(maestriaFinal)){
html+=" -> ["+maestriaFinal.join(", ")+"]"
}

}

html+="<br><br>"
html+="Sucessos: "+sucessos+"<br>"
html+="Meio: "+meio+"<br>"
html+="Falhas: "+falhas

displayLocal(html)

sendRoll(html)

}

function displayLocal(html){

document.getElementById("resultado").innerHTML = html

}

function rollD66(){

let a=random(6)
let b=random(6)

let html="Resultado d66: "+a+""+b

displayLocal(html)

sendRoll(html)

}

function random(max){

return Math.floor(Math.random()*max)+1

}

function sendRoll(result){

OBR.player.getName().then(name=>{

OBR.broadcast.sendMessage("cabala-roll",{
player:name,
result:result
})

OBR.notification.show("🎲 "+name+" rolou dados")

})

}

function updatePlayers(){

let html=""

for(let p in playerResults){

html+="<div class='player'><b>"+p+":</b> "+playerResults[p]+"</div>"

}

document.getElementById("playersList").innerHTML=html

}

OBR.onReady(()=>{

OBR.broadcast.onMessage("cabala-roll",(data)=>{

playerResults[data.player]=data.result

updatePlayers()

})

})
