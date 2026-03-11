let d6pool = 0

function addD6(){

d6pool++

document.getElementById("pool").innerHTML =
d6pool + "d6"

}

function clearDice(){

d6pool = 0

document.getElementById("pool").innerHTML =
"0d6"

document.getElementById("resultado").innerHTML = ""

}

function rollD66(){

let a = random(6)
let b = random(6)

document.getElementById("resultado").innerHTML =
"Resultado: " + a + "" + b

}

function roll(mode){

if(d6pool === 0) return

let target = 5

if(mode === "vantagem") target = 4
if(mode === "desvantagem") target = 6

let resultados = []
let html = []

let sucessos = 0
let meio = 0
let falhas = 0

for(let i=0;i<d6pool;i++){

let r = random(6)

resultados.push(r)

if(r >= target){

sucessos++
html.push("<span class='sucesso'>"+r+"</span>")

}

else if(r === target-1){

meio++
html.push("<span class='meio'>"+r+"</span>")

}

else if(r === 1){

falhas++
html.push("<span class='falha'>"+r+"</span>")

}

else{

html.push(r)

}

}

let texto =
"Resultados: [" + html.join(", ") + "]"

texto += "<br><br>Sucessos: " + sucessos
texto += "<br>Meio Sucesso: " + meio
texto += "<br>Falhas: " + falhas

document.getElementById("resultado").innerHTML = texto

}

function random(max){

return Math.floor(Math.random()*max)+1

}
