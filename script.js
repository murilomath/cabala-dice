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

if(d6pool === 0) return

let resultados=[]

for(let i=0;i<d6pool;i++){

resultados.push(random(6))

}

let texto =
"Rolou "+d6pool+"d6<br>"+
"Resultados: ["+resultados.join(", ")+"]"

addMessage({
player:"Você",
text:texto
})

}

function rollD66(){

let a=random(6)
let b=random(6)

let texto="Rolou d66 → "+a+""+b

addMessage({
player:"Você",
text:texto
})

}

function random(max){

return Math.floor(Math.random()*max)+1

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
