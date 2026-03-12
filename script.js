const BIN_ID = "69b2042cc3097a1dd519d875"
const API_KEY = "$2a$10$HOVUh/bHfj0omLxLjV4MkOg61K7Eh9vOJJ8arytfEuqmsqHGRCIh."

const URL = "https://api.jsonbin.io/v3/b/" + BIN_ID

let d6pool = 0

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

async function sendMessage(text){

let player="Você"

if(typeof OBR !== "undefined"){
player = await OBR.player.getName()
}

let res = await fetch(URL,{
headers:{
"X-Master-Key":API_KEY
}
})

let data = await res.json()

let chat = data.record.chat || []

chat.push({
player:player,
text:text,
time:Date.now()
})

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

loadChat()

}

function addMessage(data){

let chat=document.getElementById("chat")

let div=document.createElement("div")

div.className="msg"

div.innerHTML =
"<span class='player'>"+data.player+":</span><br>"+data.text

chat.appendChild(div)

chat.scrollTop=chat.scrollHeight

}

async function loadChat(){

let res = await fetch(URL,{
headers:{
"X-Master-Key":API_KEY
}
})

let data = await res.json()

let chat=document.getElementById("chat")

chat.innerHTML=""

data.record.chat.forEach(addMessage)

}

setInterval(loadChat,2000)

loadChat()
