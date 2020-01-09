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

        this.timeouts = {}
    }

    doLater(func, delay){        
        if(this[func]){            
            let to = this.timeouts[func]
            if(to) clearTimeout(to)
            this.timeouts[func] = null
            this.timeouts[func] = setTimeout(this[func].bind(this), delay)
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
                return {}
            }
        }else{
            return {}
        }
    }

    storeState(){        
        if(this.id){
            let store = JSON.stringify(this.state)                                                
            localStorage.setItem(this.path(), store)
        }
    }

    idParent(){
        if(this.props.idParent) return this.props.idParent
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
    mart(x){return this.addStyle("marginTop", `${x}px`)}
    marr(x){return this.addStyle("marginRight", `${x}px`)}    
    marb(x){return this.addStyle("marginBottom", `${x}px`)}
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
    value(){return this.e.value}
    setValue(x){this.e.value = x; return this}
    float(x){return this.addStyle("float", x)}

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

class Button_ extends button_{
    constructor(caption, callback){
        super()
        this.html(caption)
        this.ae("click", callback)
    }
}
function Button(caption, callback){return new Button_(caption, callback)}

class input_ extends SmartDomElement{
    constructor(props){
        super("input", props)
        
        this.sa("type", this.props.type)
    }
}
function input(props){return new input_(props)}

class Slider_ extends SmartDomElement{
    constructor(props){
        super("div", props)

        this.sliderWidth = this.props.sliderWidth || 150
        this.textWidth = this.props.textWidth || 150

        this.a(
            div().dfc().a(
                this.slider = input({type: "range"}).ww(this.sliderWidth).ae("input", this.sliderChanged.bind(this)),
                this.text = input({type: "text"}).ww(this.textWidth).marl(3).ae("keyup", this.textChanged.bind(this)),
            )
        )
    }

    sliderChanged(){
        this.state.value = this.slider.value()        
        this.setFromState()
    }

    textChanged(){
        let m = this.text.value().match(/([\d]+)[^\d]+([\d]+)[^\d]+([\d]+)[^\d]+([\d]+)/)
        if(m){            
            [ this.state.value, this.state.min, this.state.max, this.state.step ] = m.slice(1,5).map(x=>parseInt(x));            
        }        
        this.doLater("setFromState", 3000)
    }

    setFromState(){
        this.state.min = this.state.min || 0
        this.state.max = this.state.max || 100
        this.state.step = this.state.step || 1
        this.state.value = this.state.value || 0
        this.slider.sa("min", this.state.min)
        this.slider.sa("max", this.state.max)
        this.slider.sa("step", this.state.step)
        this.slider.setValue(this.state.value)
        this.text.setValue(`${this.state.value} [ ${this.state.min} - ${this.state.max} ... ${this.state.step} ]`)
        this.storeState()
    }

    init(){        
        this.setFromState()
    }
}
function Slider(props){return new Slider_(props)}

class TextInput_ extends input_{
    constructor(props){
        super({...{type: "text"}, ...props})
    }

    init(){        
        this.ae("keyup", this.textChanged.bind(this))
        this.ae("change", this.textChanged.bind(this))
        this.setFromState()
    }

    textChanged(){        
        this.state.text = this.value()
        this.storeState()
    }

    setFromState(){
        this.state.text = this.state.text || ""
        this.setValue(this.state.text)
        this.storeState()
    }
}
function TextInput(props){return new TextInput_(props)}

class DateInput_ extends input_{
    constructor(props){
        super({...{type: "date"}, ...props})
    }

    init(){        
        this.ae("keyup", this.dateChanged.bind(this))
        this.ae("change", this.dateChanged.bind(this))
        this.setFromState()
    }

    dateChanged(){        
        this.state.date = this.value()
        this.storeState()
    }

    setFromState(){
        this.state.date = this.state.date || "2020-01-01"
        this.setValue(this.state.date)
        this.storeState()
    }
}
function DateInput(props){return new DateInput_(props)}

class TimeInput_ extends input_{
    constructor(props){
        super({...{type: "time"}, ...props})
    }

    init(){        
        this.ae("keyup", this.timeChanged.bind(this))
        this.ae("change", this.timeChanged.bind(this))        
        this.setFromState()
    }

    timeChanged(){        
        this.state.time = this.value()
        this.storeState()
    }

    setFromState(){
        this.state.time = this.state.time || "00:00"
        this.setValue(this.state.time)
        this.storeState()
    }
}
function TimeInput(props){return new TimeInput_(props)}

class DateTimeInput_ extends input_{
    constructor(props){
        super({...{type: "datetime-local"}, ...props})
    }

    init(){        
        this.ae("keyup", this.dateTimeChanged.bind(this))
        this.ae("change", this.dateTimeChanged.bind(this))        
        this.setFromState()
    }

    dateTimeChanged(){        
        this.state.dateTime = this.value()
        this.storeState()
    }

    setFromState(){
        this.state.dateTime = this.state.dateTime || "2020-01-01T00:00"
        this.setValue(this.state.dateTime)
        this.storeState()
    }
}
function DateTimeInput(props){return new DateTimeInput_(props)}

class ColorInput_ extends input_{
    constructor(props){
        super({...{type: "color"}, ...props})
    }

    init(){        
        this.ae("keyup", this.colorChanged.bind(this))
        this.ae("change", this.colorChanged.bind(this))        
        this.setFromState()
    }

    colorChanged(){        
        this.state.color = this.value()
        this.storeState()
    }

    setFromState(){
        this.state.color = this.state.color || "#ffffff"
        this.setValue(this.state.color)
        this.storeState()
    }
}
function ColorInput(props){return new ColorInput_(props)}

class ComboOption_ extends SmartDomElement{
    constructor(props){
        super("option", props)
    }

    init(){
        this.sa("value", this.props.value).html(this.props.display)
        if(this.props.selected) this.sa("selected", true)
    }
}
function ComboOption(props){return new ComboOption_(props)}

class Combo_ extends SmartDomElement{
    constructor(props){
        super("select", props)
    }

    change(){
        if(this.props.changeCallback) this.props.changeCallback(this.value())
    }

    init(){
        this.ae("change", this.change.bind(this))
        this.a(
            this.props.options.map(option=>(
                ComboOption({value: option.value, display: option.display, selected: option.value == this.props.selected})
            ))
        )
    }
}
function Combo(props){return new Combo_(props)}

class OptionElement_ extends SmartDomElement{
    constructor(props){
        super("div", props)

        this.editOn = false
    }

    change(kind){
        this.props.option.kind = kind        
        this.editOn = false
        this.build()
        this.idParent().storeState()
    }

    buildEditDiv(){
        if(this.editOn){
            let options = this.idParent().props.isContainer ?
                [
                    {value: "editablelist", display: "Editable List"},
                    {value: "editablelistcontainer", display: "Editable List Container"},
                    {value: "slider", display: "Slider"},
                    {value: "text", display: "Text"},
                    {value: "date", display: "Date"},
                    {value: "time", display: "Time"},
                    {value: "datetime", display: "Date Time"},
                    {value: "color", display: "Color"},
                ]
            :
                [{value: "scalar", display: "Scalar"}]            
            this.editDiv.x().a(
                div().ww(this.idParent().width).hh(this.idParent().height).bc("#f00").pad(2).mar(-2).a(
                    Combo({changeCallback: this.change.bind(this), selected: this.props.option.kind, options: options}).fs(this.idParent().height - 6)
                )
            )            
        }else{
            this.editDiv.x()
        }
    }

    editKind(){
        this.editOn = !this.editOn
        this.buildEditDiv()
    }

    labelWidth(){
        return this.idParent().height * 4
    }

    optionHandler(option){
        return this.idParent().optionClicked.bind(this.idParent(), option, this)         
    }

    labeledOptionElement(option, element){
        return div().dfc().a(
            div().cp().ww(this.labelWidth()).html(option.display).ae("click", this.optionHandler(option)),
            element
        )
    }

    elementForOption(){
        let option = this.props.option
        let isContainer = false
        let label = null
        switch(this.props.option.kind){
            case "editablelistcontainer":                
                isContainer = true
                label = option.display
            case "editablelist":                            
                return this.labeledOptionElement(
                    option,
                    EditableList({idParent: this.idParent(), isContainer: isContainer, label: label, id: option.value, width: this.idParent().width - this.idParent().extrawidth - this.labelWidth() * 0.6, height: this.idParent().height})
                )
            case "slider":                            
                return this.labeledOptionElement(
                    option,
                    Slider({idParent: this.idParent(), id: option.value})
                )
            case "text":                            
                return this.labeledOptionElement(
                    option,
                    TextInput({idParent: this.idParent(), id: option.value}).fs(this.idParent().height - 5).pad(2)
                )
            case "date":                            
                return this.labeledOptionElement(
                    option,
                    DateInput({idParent: this.idParent(), id: option.value}).fs(this.idParent().height - 5).pad(2)
                )
            case "time":                            
                return this.labeledOptionElement(
                    option,
                    TimeInput({idParent: this.idParent(), id: option.value}).fs(this.idParent().height - 5).pad(2)
                )
            case "datetime":                            
                return this.labeledOptionElement(
                    option,
                    DateTimeInput({idParent: this.idParent(), id: option.value}).fs(this.idParent().height - 5).pad(2)
                )
            case "color":                            
                return this.labeledOptionElement(
                    option,
                    ColorInput({idParent: this.idParent(), id: option.value}).fs(this.idParent().height - 5).pad(2)
                )
            default:
                return div().cp().html(option.display).ae("click", this.optionHandler(option))
        }
    }

    build(){
        let option = this.props.option
        this.x().a(
            div().dfc().a(
                div({ev: "dragstart dragenter dragover dragleave drop", do: "dragoption", option: option}).cm().drg(true).mar(2).ww(this.dragBoxSize).hh(this.dragBoxSize).bc("#00f"),
                Button("_", this.editKind.bind(this)).fs(this.idParent().height / 2).marl(2).bc("#ddd"),
                div().dfc().por().ww(this.idParent().width).mar(2).pad(2).fs(this.idParent().height - 4).bc(option.value == this.idParent().state.selected.value ? "#0f0" : "#eee").a(
                    this.elementForOption(),
                    this.editDiv = div().zi(20).poa()
                ),                  
                Button("X", this.idParent().delOption.bind(this.idParent(), option)).fs(this.idParent().height / 2).marl(2).bc("#faa"),                
            )
        )
    }

    init(){        
        this.dragBoxSize = this.idParent().height * 0.7        
        this.build()
    }
}
function OptionElement(props){return new OptionElement_(props)}

class EditableList_ extends SmartDomElement{
    constructor(props){
        super("div", props)
    }

    init(){                        
        this.width = this.props.width || 400
        this.height = this.props.height || 20        

        this.extrawidth = 65 + this.height * 1.5

        this.containerPadding = 2
        this.selectedPadding = 2    
        
        this.ffm().ac("unselectable").dib().a(this.container = div().por().dfc().pad(this.containerPadding).a(
            this.selectedDiv = div().ae("click", this.switchRoll.bind(this)).fs(this.height - 4).pad(this.selectedPadding).ww(this.width).hh(this.height).bc("#ddd"),
            Button(">", this.switchRoll.bind(this)).marl(2),
            Button("+", this.addOption.bind(this)).marl(2),            
            this.optionsDiv = div().bdr("solid", this.height / 6, "#aaa").bc("#ddd").zi(10).mih(400).ww(this.width + this.extrawidth).ovfys().poa().t(this.height + 2 * ( this.containerPadding + this.selectedPadding ))
        ))

        this.buildOptions()

        this.state.rolled = !this.state.rolled
        this.switchRoll()
    }

    optionClicked(option, oe){                
        if(oe.editOn) return
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
                    this.draggedElement = sev.e
                    this.draggedOption = this.draggedElement.props.option
                    this.draggedElement.bc("#ff0")
                    break
                case "dragover":
                    sev.ev.preventDefault()
                    sev.e.bc("#0f0")
                    this.draggedElement.bc("#ff0")
                    break
                case "dragleave":
                    sev.ev.preventDefault()
                    sev.e.bc("#00f")
                    this.draggedElement.bc("#ff0")
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
            OptionElement({option: option})
        ))        
        if(this.props.isContainer){
            this.selectedDiv.html(this.props.label ? this.props.label : "")
        }else{
            if(this.state.selected){
                this.selectedDiv.html(this.state.selected.display)
            }else this.selectedDiv.x()
        }        
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
        opt = {kind: this.props.isContainer ? "editablelist" : "scalar", value: value, display: display}
        this.state.options.push(opt)
        this.state.selected = opt
        this.buildOptions()
        this.storeState()
        if(!this.state.rolled){
            this.switchRoll()
        }
    }
}
function EditableList(props){return new EditableList_(props)}
