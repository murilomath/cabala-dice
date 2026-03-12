export function rollD6(n){

let results = []

for(let i=0;i<n;i++){
results.push(Math.floor(Math.random()*6)+1)
}

return results
}

export function countResults(results,mode){

let success = 0
let critFail = 0

for(let r of results){

if(r==1) critFail++

if(mode=="dis"){
if(r==6) success++
}

if(mode=="nor"){
if(r>=5) success++
}

if(mode=="adv"){
if(r>=4) success++
}

}

return {success,critFail}

}

export function rollD66(){

let d1 = Math.floor(Math.random()*6)+1
let d2 = Math.floor(Math.random()*6)+1

return d1*10 + d2

}
