const BIN_ID = "69b2042cc3097a1dd519d875"
const API_KEY = "$2a$10$HOVUh/bHfj0omLxLjV4MkOg61K7Eh9vOJJ8arytfEuqmsqHGRCIh."

const URL = "https://api.jsonbin.io/v3/b/" + BIN_ID

let d6pool = 0
let lastMessageTime = 0
let playerName = "Jogador"

async function initPlayer(){

if(typeof OBR !== "undefined"){

try{

await OBR.onReady()

playerName = await OBR.player.getName()

}catch(e){}

}

}

function addD6(){

if(d6pool < 12){
d6pool++
}

updatePool()

}

function updatePool(){

document.getElementById("pool").innerText =
d6pool + "d6"

}

async function roll(mode){

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

sendMessage(playerName,texto)

}

async function rollD66(){

let a=random(6)
let b=random(6)

let texto = "Rolou d66 → "+a+""+b

sendMessage(playerName,texto)

}

function random(max){
return Math.floor(Math.random()*max)+1
}

async function sendMessage(player,text){

let res = await fetch(URL,{
headers:{
"X-Master-Key":API_KEY
}
})

let data = await res.json()

let chat = data.record.chat || []

let message={
player:player,
text:text,
time:Date.now()
}

chat.push(message)

if(chat.length > 50){
chat.shift()
}

await fetch(URL,{
method:"PUT",
headers:{
"Content-Type":"application/json",
"X-Master-Key":API_KEY
},
body:JSON.stringify({chat:chat})
})

}

function addMessage(data){

let chat=document.getElementById("chat")

let div=document.createElement("div")

div.className="msg"

div.innerHTML =
"<span class='player'>"+data.player+":</span><br>"+data.text

chat.appendChild(div)

}

async function loadChat(){

let res = await fetch(URL,{
headers:{
"X-Master-Key":API_KEY
}
})

let data = await res.json()

let chat = data.record.chat || []

chat.forEach(msg=>{

if(msg.time > lastMessageTime){

addMessage(msg)

lastMessageTime = msg.time

let chatBox=document.getElementById("chat")
chatBox.scrollTop = chatBox.scrollHeight

}

})

}

async function start(){

await initPlayer()

loadChat()

setInterval(loadChat,2000)

}

start()
