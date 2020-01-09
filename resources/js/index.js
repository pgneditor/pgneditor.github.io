class App extends SmartDomElement{
    constructor(props){
        super("div", props)

        this.a(
            EditableList({id: "templates", showSelected: true, isContainer: true, label: "Templates", width: 600, height: 22}),            
            div().a(
                this.statetext = TextAreaInput().w(800).h(400)
            ),
            Button("Reset", function(){
                localStorage.clear()
                document.location.reload()
            }).float("right"),
            Button("Serialize", function(){
                this.statetext.setValue(JSON.stringify(Object.fromEntries(Object.entries(localStorage).map(entry=>[entry[0], JSON.parse(entry[1])])), null, 3))
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
    }
}

document.getElementById("root").appendChild(new App({id: "smartdomapp"}).e)
