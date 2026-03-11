let d6pool = 0
let history = []

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

if(r>=target){

sucessos++

}else if(r===target-1){

meio++

}else if(r===1){

falhas++

}

})

let html=""

if(d6pool<=6){

html="Resultados: ["+colorize(finalResults,target)+"]"

}else{

html="Resultados:<br>"
html+="• Comuns ["+colorize(comuns,target)+"]<br>"
html+="• Maestria ["+maestria.join(", ")+"]"

if(JSON.stringify(maestria)!==JSON.stringify(maestriaFinal)){

html+=" -> ["+colorize(maestriaFinal,target)+"]"

}

}

html+="<br><br>"
html+="Sucessos: "+sucessos+"<br>"
html+="Meio Sucesso: "+meio+"<br>"
html+="Falhas: "+falhas

addHistory(html)

document.getElementById("resultado").innerHTML =
html + renderHistory()

}

function colorize(arr,target){

return arr.map(r=>{

if(r>=target) return "<span style='color:green;font-weight:bold'>"+r+"</span>"
if(r===target-1) return "<span style='color:orange;font-weight:bold'>"+r+"</span>"
if(r===1) return "<span style='color:red;font-weight:bold'>"+r+"</span>"
return r

}).join(", ")

}

function addHistory(text){

history.unshift(text)

if(history.length>3){

history.pop()

}

}

function renderHistory(){

if(history.length===0) return ""

let html="<hr><b>Últimos lançamentos</b><br>"

history.forEach((h,i)=>{

html+="<br>"+(i+1)+") "+h+"<br>"

})

return html

}

function rollD66(){

let a=random(6)
let b=random(6)

let html="Resultado d66: "+a+""+b

addHistory(html)

document.getElementById("resultado").innerHTML = html
document.getElementById("history").innerHTML = renderHistory()

}

function random(max){

return Math.floor(Math.random()*max)+1

}
