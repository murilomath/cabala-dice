let pool = []

function addDie(type){

pool.push(type)

updatePool()

}

function updatePool(){

document.getElementById("pool").innerHTML =
"Dados: " + pool.join(", ")

}

function clearDice(){

pool = []

updatePool()

document.getElementById("resultado").innerHTML = ""

}

function roll(mode){

let results = []
let sucessos = 0

pool.forEach(die => {

if(die === "d2"){

let r = random(2)
results.push("d2:"+r)

}

if(die === "d3"){

let r = random(3)
results.push("d3:"+r)

}

if(die === "d66"){

let r1 = random(6)
let r2 = random(6)
results.push("d66:"+r1+""+r2)

}

if(die === "d6"){

let r = random(6)

let success = false

if(mode === "normal") success = r >= 5
if(mode === "vantagem") success = r >= 4
if(mode === "desvantagem") success = r === 6

if(success) sucessos++

results.push("d6:"+r)

}

})

let texto = "Resultados:<br>" + results.join(", ")

if(pool.includes("d6")){

texto += "<br>Sucessos (d6): " + sucessos

}

document.getElementById("resultado").innerHTML = texto

}

function random(max){

return Math.floor(Math.random()*max)+1

}
