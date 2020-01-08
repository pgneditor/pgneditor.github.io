class App extends SmartDomElement{
    constructor(props){
        super("div", props)

        this.a(
            EditableList({id: "defaultTemplate"})
        )
    }

    handleEvent(sev){                    
    }
}

document.getElementById("root").appendChild(new App({id: "smartdomapp"}).e)
