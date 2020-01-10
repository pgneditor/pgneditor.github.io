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
