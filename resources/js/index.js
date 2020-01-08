class App extends SmartDomElement{
    constructor(props){
        super("div", props)

        this.w(200).h(100).bc("#afa")

        let controlpanel = div({id: "controlpanel"}).a(
            button({ev: "click mouseover mouseout", id: "loadbutton", do: "load"}).bc("#ffd").mar(10).html("Load"),
            button({ev: "click mouseover mouseout", id: "savebutton", do: "save"}).bc("#ffd").mar(10).html("Save")
        )

        this.a(
            div().h(1),
            div().mar(10).pad(10).bc("#ffa").html("SmartDom"),
            controlpanel
        )
    }

    handleEvent(sev){            
        switch(sev.kind){
            case "click":
                window.alert(sev.do)
                break
            case "mouseover":
                sev.e.bc("#0f0")
                break
            case "mouseout":
                sev.e.bc("#ffd")
                break
        }
    }
}

document.getElementById("root").appendChild(new App({id: "app"}).e)
