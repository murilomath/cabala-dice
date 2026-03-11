let dice = 0
let target = 5

function setMode(value){
target = value
roll()
}

function addDie(){
dice++
roll()
}

function clearDice(){
dice = 0
document.getElementById("dados").innerHTML = "Dados: 0"
document.getElementById("resultado").innerHTML = ""
}

function roll(){

if(dice === 0) return

let resultados = []
let sucessos = 0

for(let i=0;i<dice;i++){

let r = Math.floor(Math.random()*6)+1

resultados.push(r)

if(r >= target){
sucessos++
}

}

document.getElementById("dados").innerHTML =
"Dados: "+dice

document.getElementById("resultado").innerHTML =
"Rolagem: "+resultados.join(", ") +
"<br>Sucessos: "+sucessos

}
