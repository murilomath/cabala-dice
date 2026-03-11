let d6pool = 0

let chatHistory = []

function addD6(){

d6pool++

document.getElementById("pool").innerText =
d6pool + "d6"

}

function clearDice(){

d6pool = 0

document.getElementById("pool").innerText = "0d6"

}

function roll(mode){

if(d6pool===0) return

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

let texto =
"Rolou "+d6pool+"d6<br>"+
"Resultados: ["+resultados.join(", ")+"]<br>"+
"Sucessos: "+sucessos+
" | Meio: "+meio+
" | Falhas: "+falhas

sendMessage(texto)

}

function rollD66(){

let a=random(6)
let b=random(6)

let texto="Rolou d66 → "+a+""+b

sendMessage(texto)

}

function random(max){

return Math.floor(Math.random()*max)+1

}

function sendMessage(text){

if(typeof OBR==="undefined"){

addMessage({player:"Você",text:text})

return

}

OBR.player.getName().then(async name=>{

let message={
player:name,
text:text,
time:Date.now()
}

let metadata = await OBR.room.getMetadata()

let chat = metadata.cabalaChat || []

chat.push(message)

await OBR.room.setMetadata({
cabalaChat:chat
})

})

}

function addMessage(data){

let chat=document.getElementById("chat")

let div=document.createElement("div")

div.className="msg"

div.innerHTML=
"<span class='player'>"+data.player+":</span><br>"+data.text

chat.appendChild(div)

chat.scrollTop=chat.scrollHeight

}

function renderChat(history){

let chat=document.getElementById("chat")

chat.innerHTML=""

history.forEach(m=>{

addMessage(m)

})

}

if(typeof OBR !== "undefined"){

OBR.onReady(async ()=>{

let metadata = await OBR.room.getMetadata()

renderChat(metadata.cabalaChat || [])

OBR.room.onMetadataChange((metadata)=>{

renderChat(metadata.cabalaChat || [])

})

})

}
