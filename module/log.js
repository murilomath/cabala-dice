import OBR from "@owlbear-rodeo/sdk"

const KEY = "cabala-dice-log"

export async function addLog(entry){

let metadata = await OBR.room.getMetadata()

let log = metadata[KEY] ?? []

log.unshift(entry)

if(log.length>20) log.pop()

await OBR.room.setMetadata({
[KEY]: log
})

}

export function listenLogs(callback){

OBR.room.onMetadataChange(metadata=>{
callback(metadata[KEY] ?? [])
})

}
