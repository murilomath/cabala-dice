let qty = 2;

function changeDice(n){

qty += n;

if(qty < 1) qty = 1;

document.getElementById("qty").innerText = qty;

}

function getMode(){

let radios = document.getElementsByName("mode");

for(let r of radios){

if(r.checked) return r.value;

}

}

function rollD2(){

let r = Math.floor(Math.random()*2)+1;

show("1d2 → "+r);

}

function rollD3(){

let r = Math.floor(Math.random()*3)+1;

show("1d3 → "+r);

}

function rollD66(){

let d1 = Math.floor(Math.random()*6)+1;
let d2 = Math.floor(Math.random()*6)+1;

show("1d66 → "+(d1*10+d2)+" ("+d1+","+d2+")");

}

function rollD6(){

let mode = getMode();

let threshold = 5;

if(mode === "adv") threshold = 4;

let results = [];
let success = 0;

for(let i=0;i<qty;i++){

let r = Math.floor(Math.random()*6)+1;

results.push(r);

if(mode === "dis"){

if(r === 6) success++;

}else{

if(r >= threshold) success++;

}

}

show(qty+"d6 → "+results.join(", ")+" | Sucessos: "+success);

}

function show(text){

document.getElementById("result").innerText = text;

}