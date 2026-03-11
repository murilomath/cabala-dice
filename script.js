function roll(max){
return Math.floor(Math.random()*max)+1
}

function rollD2(){
alert("D2: "+roll(2))
}

function rollD3(){
alert("D3: "+roll(3))
}

function rollD66(){
let a=roll(6)
let b=roll(6)
alert("D66: "+a+""+b)
}

function rollD6(target){

let r=roll(6)

let sucesso=r>=target

alert("Resultado: "+r+" | "+(sucesso?"Sucesso":"Falha"))

}
