function random(max){
return Math.floor(Math.random()*max)+1;
}

function rollD2(){
let r = random(2);
alert("D2: "+r);
}

function rollD3(){
let r = random(3);
alert("D3: "+r);
}

function rollD66(){
let d1 = random(6);
let d2 = random(6);
alert("D66: "+d1+""+d2);
}

function rollD6(tipo){

let r = random(6);
let sucesso=false;

if(tipo=="normal"){
sucesso = r>=5;
}

if(tipo=="vantagem"){
sucesso = r>=4;
}

if(tipo=="desvantagem"){
sucesso = r==6;
}

alert("D6: "+r+" | "+(sucesso ? "Sucesso" : "Falha"));

}
