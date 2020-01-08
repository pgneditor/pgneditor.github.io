class SmartDomEvent{
    constructor(ev, e){
        this.ev = ev
        this.e = e        
        this.kind = ev.type        
    }

    get do(){return this.e.props.do}
}

class SmartDomElement{
    constructor(tagName, propsOpt){
        this.e = document.createElement(tagName)
        this.props = propsOpt || {}

        this.id = this.props.id || null

        this.childs = []
        this.parent = null

        if(this.props.ev){
            for(let kind of this.props.ev.split(" ")){
                this.ae(kind, this.handleEventAgent.bind(this))
            }
        }
    }

    mountedSmart(){
        this.state = this.getStoredState()                        
        if(this.init) this.init()
    }

    getStoredState(){
        if(this.id){            
            let stored = localStorage.getItem(this.path())                        
            if(stored){                
                return JSON.parse(stored)
            }else{
                return {empty: true}
            }
        }else{
            return {empty: true}
        }
    }

    storeState(){
        if(this.id){
            let store = JSON.stringify(this.state)                                    
            localStorage.setItem(this.path(), store)
        }
    }

    idParent(){
        let current = this
        do{
            current = current.parent            
            if(current) if(current.id) return current
        }while(current)
        return null
    }

    idParentChain(){
        let chain = []
        let current = this
        while(current){                             
            chain.unshift(current)
            current = current.idParent()
        }
        return chain
    }

    pathList(){
        return this.idParentChain().map(ip=>ip.id ? ip.id : "*")
    }

    path(){
        return this.pathList().join("/")
    }

    handleEvent(sev){
        // should be implemented in subclasses
    }

    handleEventAgent(ev){                
        let sev = new SmartDomEvent(ev, this)
        for(let ip of this.idParentChain()){                        
            ip.handleEvent(sev)
        }
    }

    addStyle(name, value){
        this.e.style[name] = value
        return this
    }

    ae(kind, callback){this.e.addEventListener(kind, callback); return this}
    x(){this.e.innerHTML = ""; return this}
    w(x){return this.addStyle("width", `${x}px`)}
    miw(x){return this.addStyle("minWidth", `${x}px`)}
    maw(x){return this.addStyle("maxWidth", `${x}px`)}
    ww(x){return this.miw(x).maw(x)}
    h(x){return this.addStyle("height", `${x}px`)}
    mih(x){return this.addStyle("minHeight", `${x}px`)}
    mah(x){return this.addStyle("maxHeight", `${x}px`)}
    hh(x){return this.mih(x).mah(x)}
    t(x){return this.addStyle("top", `${x}px`)}
    l(x){return this.addStyle("left", `${x}px`)}
    bc(x){return this.addStyle("backgroundColor", x)}
    mar(x){return this.addStyle("margin", `${x}px`)}
    marl(x){return this.addStyle("marginLeft", `${x}px`)}
    marr(x){return this.addStyle("marginRight", `${x}px`)}
    pad(x){return this.addStyle("padding", `${x}px`)}
    disp(x){return this.addStyle("display", x)}    
    df(x){return this.disp("flex")}    
    dib(x){return this.disp("inline-block")}    
    show(x){return this.disp(x ? "initial" : "none")}
    ai(x){return this.addStyle("alignItems", x)}    
    jc(x){return this.addStyle("justifyContent", x)}    
    dfc(){return this.df().ai("center")}
    pos(x){return this.addStyle("position", x)}    
    por(){return this.pos("relative")}
    poa(){return this.pos("absolute")}
    ovf(x){return this.addStyle("overflow", x)}
    ovfs(){return this.ovf("scroll")}
    ovfx(x){return this.addStyle("overflowX", x)}
    ovfxs(){return this.ovfx("scroll")}
    ovfy(x){return this.addStyle("overflowY", x)}
    ovfys(){return this.ovfy("scroll")}
    cur(x){return this.addStyle("cursor", x)}
    cp(){return this.cur("pointer")}
    cm(){return this.cur("move")}
    sa(key, value){this.e.setAttribute(key, value); return this}
    ac(x){return this.sa("class", x)}
    zi(x){return this.addStyle("zIndex", x)}
    fs(x){return this.addStyle("fontSize", `${x}px`)}
    ff(x){return this.addStyle("fontFamily", x)}
    ffm(){return this.ff("monospace")}
    bdrs(x){return this.addStyle("borderStyle", x)}
    bdrw(x){return this.addStyle("borderWidth", x)}
    bdrc(x){return this.addStyle("borderColor", x)}
    bdr(x,y,z){return this.bdrs(x).bdrw(y).bdrc(z)}
    drg(x){return this.sa("draggable", x)}

    html(x){this.e.innerHTML = x; return this}

    a(...childs){
        let childList = []
        for(let child of childs){
            if(child instanceof Array) childList = childList.concat(child)
            else childList.push(child)
        }
        for(let child of childList){
            child.parent = this
            this.childs.push(child)
            this.e.appendChild(child.e)
            child.mountedSmart()
        }        
        return this
    }
}

class div_ extends SmartDomElement{
    constructor(propsOpt){
        super("div", propsOpt)
    }
}
function div(props){return new div_(props)}

class button_ extends SmartDomElement{
    constructor(propsOpt){
        super("button", propsOpt)
    }
}
function button(props){return new button_(props)}

class Button_ extends button{
    constructor(caption, callback){
        super()
        this.html(caption)
        this.ae("click", callback)
    }
}
function Button(caption, callback){return new Button_(caption, callback)}

class EditableList_ extends SmartDomElement{
    constructor(props){
        super("div", props)
    }

    init(){
        this.width = this.props.width || 200
        this.height = this.props.height || 20        

        this.extrawidth = 45

        this.containerPadding = 2
        this.selectedPadding = 2
        
        this.ffm().ac("unselectable").dib().a(this.container = div().por().dfc().pad(this.containerPadding).a(
            this.selectedDiv = div().ae("click", this.switchRoll.bind(this)).fs(this.height - 4).pad(this.selectedPadding).ww(this.width).hh(this.height).bc("#ddd"),
            Button(">", this.switchRoll.bind(this)).marl(2),
            Button("+", this.addOption.bind(this)).marl(2),
            this.optionsDiv = div().bdr("solid", this.height / 6, "#aaa").bc("#ddd").zi(10).mih(50).ww(this.width + this.extrawidth).ovfys().poa().t(this.height + 2 * ( this.containerPadding + this.selectedPadding ))
        ))

        this.buildOptions()

        this.state.rolled = !this.state.rolled
        this.switchRoll()
    }

    optionClicked(option){
        this.state.selected = option
        this.state.rolled = true        
        this.buildOptions()
        this.switchRoll()
    }

    delOption(option){
        this.state.options = this.state.options.filter(opt=>opt.value != option.value)
        if(this.state.options.length) this.state.selected = this.state.options[0]
        else this.state.selected = null
        this.buildOptions()
        this.storeState()
    }

    handleEvent(sev){
        if(sev.do == "dragoption"){
            switch(sev.kind){
                case "dragstart":
                    this.draggedOption = sev.e.props.option
                    sev.e.bc("#ff0")
                    break
                case "dragover":
                    sev.ev.preventDefault()
                    sev.e.bc("#0f0")
                    break
                case "dragleave":
                    sev.ev.preventDefault()
                    sev.e.bc("#00f")
                    break
                case "drop":
                    let dropOption = sev.e.props.option
                    let i = this.state.options.findIndex(opt=>opt.value == this.draggedOption.value)
                    let j = this.state.options.findIndex(opt=>opt.value == dropOption.value)
                    this.state.options.itoj(i,j)
                    this.buildOptions()
                    this.storeState()
                    break
            }
        }
    }

    buildOptions(){
        if(!this.state.options) this.state.options = []
        if(!this.state.selected && this.state.options.length) this.state.selected = this.state.options[0]
        this.optionsDiv.x().a(this.state.options.map(option=>
            div().dfc().a(
                div({ev: "dragstart dragenter dragover dragleave drop", do: "dragoption", option: option}).cm().drg(true).mar(2).ww(this.height * 0.7).hh(this.height * 0.7).bc("#00f"),
                div().ww(this.width - 30).mar(2).pad(2).fs(this.height - 4).cp().ae("click", this.optionClicked.bind(this, option)).html(option.display).bc(option.value == this.state.selected.value ? "#0f0" : "#eee"),
                Button("X", this.delOption.bind(this, option)).fs(this.height / 2).marl(2).bc("#faa")
            )
        ))
        if(this.state.selected){
            this.selectedDiv.html(this.state.selected.display)
        }else this.selectedDiv.x()
    }

    switchRoll(){        
        this.state.rolled = !this.state.rolled
        this.container.bc(this.state.rolled ? "#77f" : "#eee")
        this.optionsDiv.show(this.state.rolled)
        this.storeState()
    }

    findOptionByValue(value){
        return this.state.options.find(option=>option.value == value)
    }

    addOption(){
        let value = window.prompt("Option vaue :")
        if(!value) value = ""        
        let display = window.prompt("Option display :")
        if(!display) display = value        
        let opt = this.findOptionByValue(value)
        if(opt){
            opt.display = display
            this.state.selected = opt
            this.buildOptions()
            this.storeState()
            return
        }
        opt = {value: value, display: display}
        this.state.options.push(opt)
        this.state.selected = opt
        this.buildOptions()
        this.storeState()
    }
}
function EditableList(props){return new EditableList_(props)}