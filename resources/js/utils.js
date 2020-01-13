Array.prototype.itoj = function(i, j){    
    while(i != j){
        const n = j > i ? i + 1 : i - 1;
        [ this[i], this[n] ] = [ this[n], this[i] ]
        i = n
    }
}

function UID(){
    return "uid_" + Math.random().toString(36).substring(2,12)
}

function cloneObject(obj){
    return JSON.parse(JSON.stringify(obj))
}

function simpleFetch(url, params, callback){
    fetch(url, params).then(
        (response)=>response.text().then(
            (text)=>{                
                callback({ok: true, content: text})
            },
            (err)=>{
                console.log("get response text error", err)
                callback({ok: false, status: "Error: failed to get response text."})
            }
        ),
        (err)=>{
            console.log("fetch error", err)
            callback({ok: false, status: "Error: failed to fetch."})
        }
    )
}

function storeLocal(key, obj){
    localStorage.setItem(key, JSON.stringify(obj))
}

function getLocal(key, def){
    let stored = localStorage.getItem(key)
    if(stored) return JSON.parse(stored)
    return def
}

class NdjsonReader{
    constructor(url, processLineFunc){
        this.url = url
        this.processLineFunc = processLineFunc
    }

    read(){
        this.reader.read().then(
            (chunk)=>{
                if(chunk.done){
                    return
                }
                let content = this.pendingChunk + new TextDecoder("utf-8").decode(chunk.value)
                let closed = content.match(/\n$/)
                let hasline = content.match(/\n/)
                let lines = content.split("\n")                
                if(hasline){
                    if(!closed){
                        this.pendingChunk = lines.pop()
                    }
                    for(let line of lines){
                        if(line != "") this.processLineFunc(JSON.parse(line))
                    }
                    this.read()
                }else{
                    this.pendingChunk += content
                }
            },
            err=>{
                console.log(err)
            }
        )
    }

    stream(){        
        fetch(this.url, {
            headers: {
                "Accept": "application/x-ndjson"
            }            
        }).then(
            response=>{        
                this.pendingChunk = ""
                this.reader = response.body.getReader()
                this.read()        
            },
            err=>{
                console.log(err)
            }
        )
    }
}