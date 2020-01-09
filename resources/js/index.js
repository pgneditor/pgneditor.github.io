class App extends SmartDomElement{
    constructor(props){
        super("div", props)

        this.a(
            EditableList({id: "templates", isContainer: true, label: "Templates", width: 600, height: 20}),            
            Button("Reset", function(){
                localStorage.clear()
                document.location.reload()
            }).float("right")
            
        )
    }

    handleEvent(sev){                    
    }
}

document.getElementById("root").appendChild(new App({id: "smartdomapp"}).e)
