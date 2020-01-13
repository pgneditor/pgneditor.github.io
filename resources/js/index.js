class App extends SmartDomElement{
    stream(){
        this.njr = new NdjsonReader("https://lichess.org/games/export/lishadowapps?max=10", game=>{
            console.log(game)
        })
        
        this.njr.stream()
    }

    constructor(props){
        super("div", props)

        this.a(
            EditableList({
                id: "templates",
                showSelected: true,
                isContainer: true,
                label: "Templates",
            }),            
            div().a(
                this.statetext = TextAreaInput().w(800).h(400)
            ),
            Button("Stream", this.stream.bind(this)),
            Button("Reset", function(){
                localStorage.clear()
                document.location.reload()
            }).float("right"),
            Button("Serialize", function(){
                this.statetext.setValue(JSON.stringify(Object.fromEntries(Object.entries(localStorage).map(entry=>[entry[0], JSON.parse(entry[1])])), null, 3))
            }.bind(this)).float("right"),
            Button("Copy", function(){
                this.statetext.focus().select()
                document.execCommand("copy")
            }.bind(this)).float("right"),
            Button("Parse", function(){
                Object.entries(JSON.parse(this.statetext.value())).forEach(entry=>localStorage.setItem(entry[0], JSON.stringify(entry[1])))
                document.location.reload()
            }.bind(this)).float("right"),
            Button("Fetch", function(){
                simpleFetch("resources/blob/state.json", {}, function(response){
                    if(response.ok){
                        this.statetext.setValue(response.content)
                    }else{
                        window.alert("Error: Failed to fetch.")
                    }
                }.bind(this))
            }.bind(this)).float("right")
        )
    }

    handleEvent(sev){                    
        switch(sev.do){
            case "handleWidgetButtonPressed":
                let m = sev.path.match(/^smartdomapp\/templates\/([^\/]+)/)
                if(m){
                    let username = getLocal(m[0] + "/username").text
                    let password = getLocal(m[0] + "/password").text
                    console.log(username, password)
                }
                break
        }
    }
}

document.getElementById("root").appendChild(new App({id: "smartdomapp"}).e)
