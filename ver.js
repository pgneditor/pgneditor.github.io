const fs = require('fs')

let html = fs.readFileSync('index.html').toString()

for(let matcher of [
    [new RegExp('resources\/js\/[^"]+', 'g'), new RegExp('(resources\/js\/[a-zA-Z0-9\.]+)')],
    [new RegExp('resources\/css\/[^"]+', 'g'), new RegExp('(resources\/css\/[a-zA-Z0-9\.]+)')]
]){
    for(let wholematch of html.match(matcher[0])){
        const path = wholematch.match(matcher[1])[1]        
        const mtimeMs = fs.statSync(path).mtimeMs
        const wholereplace = path + "?ver=" + mtimeMs
        if(wholematch != wholereplace){
            console.log("versioning", path)
            html = html.replace(wholematch, wholereplace)
        }        
    }
}

fs.writeFileSync('index.html', html)
