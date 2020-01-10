class SmartDomEvent{
    constructor(ev, e){
        this.ev = ev
        this.e = e        
        this.kind = ev.type        
        this.stopPropagation = false
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
        for(let ip of this.idParentChain().reverse()){                        
            ip.handleEvent(sev)
            if(sev.stopPropagation) return
        }
    }

    addStyle(name, value){
        this.e.style[name] = value
        return this
    }

    focus(){this.e.focus(); return this}
    select(){this.e.select(); return this}
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
    c(x){return this.addStyle("color", x)}
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
    op(x){return this.addStyle("opacity", x)}
    fs(x){return this.addStyle("fontSize", `${x}px`)}
    fw(x){return this.addStyle("fontWeight", x)}
    fwb(){return this.fw("bold")}
    ff(x){return this.addStyle("fontFamily", x)}
    ffm(){return this.ff("monospace")}
    bdrs(x){return this.addStyle("borderStyle", x)}
    bdrw(x){return this.addStyle("borderWidth", `${x}px`)}
    bdrc(x){return this.addStyle("borderColor", x)}
    bdrr(x){return this.addStyle("borderRadius", x)}
    bdr(x,y,z,r){return this.bdrs(x).bdrw(y).bdrc(z).bdrr(`${r}px`)}
    drg(x){return this.sa("draggable", x)}
    drgb(){return this.drg("true")}
    value(){return this.e.value}
    setValue(x){this.e.value = x; return this}
    float(x){return this.addStyle("float", x)}
    ta(x){return this.addStyle("textAlign", x)}
    tac(){return this.ta("center")}

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
                this.numdiv = div().fwb().pad(3).mar(2).ww(60).hh(20).bc("#ddd").c("#00f"),
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
        this.doLater("setFromState", 2000)
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
        this.numdiv.html(`${this.state.value}`)
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

class TextAreaInput_ extends SmartDomElement{
    constructor(props){
        super("textarea", props)
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
function TextAreaInput(props){return new TextAreaInput_(props)}

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

class CheckBoxInput_ extends input_{
    constructor(props){
        super({...{type: "checkbox"}, ...props})
    }

    init(){                
        this.ae("change", this.checkedChanged.bind(this))        
        this.setFromState()
    }

    checkedChanged(){                
        this.state.checked = this.e.checked
        this.storeState()
        if(this.props.changeCallback) this.props.changeCallback(this.state.checked)
    }

    setFromState(){
        this.state.checked = this.state.checked || false
        this.e.checked = this.state.checked
        this.storeState()
    }
}
function CheckBoxInput(props){return new CheckBoxInput_(props)}

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
        let ip = this.idParent()

        if(this.editOn){
            let options = this.idParent().props.isContainer ?
                [
                    {value: "editablelist", display: "Editable List"},
                    {value: "editablelistcontainer", display: "Editable List Container"},
                    {value: "slider", display: "Slider"},
                    {value: "text", display: "Text"},
                    {value: "textarea", display: "Text Area"},
                    {value: "date", display: "Date"},
                    {value: "time", display: "Time"},
                    {value: "datetime", display: "Date Time"},
                    {value: "color", display: "Color"},
                    {value: "checkbox", display: "Checkbox"},
                ]
            :
                [{value: "scalar", display: "Scalar"}]            
            this.editDiv.x().a(
                div().ww(ip.optionEditDivWidth).hh(ip.height)
                    .bc(ip.optionEditDivBackgroundColor)
                    .pad(ip.optionEditDivPadding)
                    .mar(ip.optionEditDivMargin).a(
                        Combo({
                            changeCallback: this.change.bind(this),
                            selected: this.props.option.kind,
                            options: options
                        }).fs(ip.optionEditComboFontSize)
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

    optionHandler(option){
        return this.idParent().optionClicked.bind(this.idParent(), option, this)         
    }

    labeledOptionElement(option, element){
        let ip = this.idParent()

        this.labelDiv = div().ww(ip.optionLabelWidth)
            .marr(ip.optionLabelMarginRight).pad(ip.optionLabelPadding)
            .fs(ip.optionLabelFontSize)
            .bdr(ip.optionLabelBorderStyle, ip.optionLabelBorderWidth, ip.optionLabelBorderColor, ip.optionLabelBorderRadius)
            .bc(ip.optionLabelBackgroundColor).cp()
            .html(option.display)
            .ae("click", this.optionHandler(option))

        return div().dfc().a(
            this.labelDiv,            
            element
        )
    }

    elementForOption(){
        let option = this.props.option
        let isContainer = false
        let label = null
        let ip = this.idParent()

        switch(this.props.option.kind){
            case "editablelistcontainer":                
                isContainer = true
                label = option.display
            case "editablelist":                            
                return this.labeledOptionElement(
                    option,
                    EditableList({
                        optionChild: true,
                        idParent: ip,
                        isContainer: isContainer,
                        label: label,
                        id: option.value,
                        width: ip.childEditableListWidth,
                        height: ip.height
                    })
                )
            case "slider":                            
                return this.labeledOptionElement(
                    option,
                    Slider({
                        idParent: ip,
                        id: option.value
                    })
                )
            case "text":                            
                return this.labeledOptionElement(
                    option,
                    TextInput({
                        idParent: ip,
                        id: option.value
                    })
                    .fs(ip.widgetFontSize).ffm()                    
                    .pad(ip.widgetPadding)
                    .ww(ip.widgetWidth)
                )
            case "textarea":                            
                return this.labeledOptionElement(
                    option,
                    TextAreaInput({
                        idParent: ip,
                        id: option.value
                    }).fs(ip.widgetFontSize).pad(ip.widgetPadding)
                )
            case "date":                            
                return this.labeledOptionElement(
                    option,
                    DateInput({
                        idParent: ip,
                        id: option.value
                    }).fs(ip.widgetFontSize).pad(ip.widgetPadding)
                )
            case "time":                            
                return this.labeledOptionElement(
                    option,
                    TimeInput({
                        idParent: ip,
                        id: option.value
                    }).fs(ip.widgetFontSize).pad(ip.widgetPadding)
                )
            case "datetime":                            
                return this.labeledOptionElement(
                    option,
                    DateTimeInput({
                        idParent: ip,
                        id: option.value
                    }).fs(ip.widgetFontSize).pad(ip.widgetPadding)
                )
            case "color":                            
                return this.labeledOptionElement(
                    option,
                    ColorInput({
                        idParent: ip,
                        id: option.value
                    }).fs(ip.widgetFontSize).pad(ip.widgetPadding)
                )
            case "checkbox":                            
                return this.labeledOptionElement(
                    option,
                    CheckBoxInput({
                        idParent: ip,
                        id: option.value
                    }).hh(ip.optionCheckBoxSize).ww(ip.optionCheckBoxSize)
                )
            default:
                return div().addStyle("width", "100%").tac().cp().html(option.display)
                    .ae("click", this.optionHandler(option))
        }        
    }

    isSelected(){
        return this.props.option.value == this.idParent().state.selected.value
    }

    enableChanged(){
        let ip = this.idParent()

        this.elementDiv            
            .bc(this.isSelected() ? ip.optionSelectedBackgroundColor : ip.optionBackgroundColor)

        this.elementDiv
            .op(this.enableCheckBox.state.checked ? ip.optionEnabledOpacity : ip.optionDisabledOpacity)
    }

    build(){
        let option = this.props.option
        let ip = this.idParent()

        this.dragBox = div({
                ev: "dragstart dragenter dragover dragleave drop",
                do: "dragoption", option: option
            })
            .ww(ip.dragBoxSize).hh(ip.dragBoxSize).mar(ip.optionButtonLeftMargin)
            .cm().drgb().bc(ip.dragBoxColor)

        this.editOptionButton = Button("_", this.editKind.bind(this))
            .fs(ip.optionButtonFontSize).marl(ip.optionButtonLeftMargin).bc(ip.editOptionButtonColor)

        this.enableCheckBox = CheckBoxInput({
            changeCallback: this.enableChanged.bind(this),
            idParent: ip, id: option.value + "#enable"
        })

        this.deleteButton = Button("X", ip.delOption.bind(ip, option))
            .fs(ip.optionButtonFontSize).marl(ip.optionButtonLeftMargin).bc(ip.deleteButtonColor)

        this.elementDiv = div().ww(ip.elementDivWidth).dfc().por().mar(2).pad(2)
            .fs(ip.optionElementDivFontSize)

        this.x().a(
            div().dfc().a(
                this.dragBox,
                this.editOptionButton,                
                this.enableCheckBox,
                this.elementDiv.a(
                    this.elementForOption(),
                    this.editDiv = div().zi(ip.editDivZIndex).poa()
                ),                  
                this.deleteButton,                
            )
        )

        this.enableChanged()
    }

    init(){                
        this.build()
    }
}
function OptionElement(props){return new OptionElement_(props)}

class EditableList_ extends SmartDomElement{
    constructor(props){
        super("div", props)
    }

    init(){                        
        this.width                          = this.props.width || 400
        this.height                         = this.props.height || 20        

        this.containerPadding               = 2
        this.selectedPadding                = 2    
        this.selectedDivBackgroundColor     = "#ddd"
        this.selectedDivColor               = "#00f"
        this.selectedDivFontSize            = this.height * 0.9
        this.optionsDivBorderColor          = "#aaa"
        this.optionsDivBakcgroundColor      = "#ddd"
        this.optionsDivMinHeight            = 550
        this.optionsDivZIndex               = 10
        this.optionsDivBorderWidth          = this.height / 6
        this.optionsDivBorderStyle          = "solid"
        this.containerButtonMargin          = 2
        this.optionLabelFontSize            = this.selectedDivFontSize * 0.85
        this.optionLabelBorderStyle         = "solid"
        this.optionLabelBorderWidth         = 1
        this.optionLabelBorderColor         = "#aaa"
        this.optionLabelBorderRadius        = 5
        this.optionLabelBackgroundColor     = "#dfc"
        this.optionLabelMarginRight         = 2
        this.optionLabelPadding             = 2
        this.optionEnabledOpacity           = 1
        this.optionDisabledOpacity          = 0.5
        this.optionBackgroundColor          = "#eee"
        this.optionSelectedBackgroundColor  = "#7f7"
        this.dragOptionHighlightColor       = "#ff0"
        this.dragOptionOverColor            = "#0f0"
        this.dragBoxColor                   = "#00f"
        this.dragBoxSize                    = this.height * 0.7
        this.deleteButtonColor              = "#faa"
        this.editOptionButtonColor          = "#ddd"
        this.optionButtonFontSize           = this.height / 2
        this.optionElementDivFontSize       = this.height * 0.8
        this.optionButtonLeftMargin         = 2
        this.optionCheckBoxSize             = this.height * 0.8
        this.editDivZIndex                  = 20
        this.widgetFontSize                 = this.height * 0.9
        this.widgetPadding                  = 2        
        this.optionEditDivBackgroundColor   = "#f00"
        this.optionEditDivPadding           = 2
        this.optionEditDivMargin           = -2        
        this.optionEditComboFontSize        = this.height * 0.75
        this.containerRolledBackgroundColor = "#77f"
        this.containerBackgroundColor       = "#eee"
        this.optionsDivTop                  = this.height + 2 * ( this.containerPadding + this.selectedPadding )        
        
        this.optionLabelWidth               = this.height * 4
        this.optionsLeftControlWidth        = 35 + this.height * 0.85
        this.optionsRightControlWidth       = 45 + this.height * 0.8
        this.optionControlsWidth            = this.optionsLeftControlWidth + this.optionsRightControlWidth

        this.optionsDivLeft                 = this.props.optionChild ? - ( this.optionLabelWidth + this.optionsLeftControlWidth ) : 0

        this.elementDivWidth                = this.width + this.optionLabelWidth

        this.optionEditDivWidth             = this.elementDivWidth - 2 * this.optionEditDivPadding
        
        this.optionsDivWidth                = this.elementDivWidth + this.optionControlsWidth
        
        this.widgetWidth                    = this.width * 0.96

        this.childEditableListWidth         = this.width * 0.87
        

        this.selectedDiv = div().ww(this.width).hh(this.height).pad(this.selectedPadding)
            .ae("click", this.switchRoll.bind(this))
            .fwb().fs(this.selectedDivFontSize)
            .bc(this.selectedDivBackgroundColor).c(this.selectedDivColor)

        this.optionsDiv = div().poa().ovfys().zi(this.optionsDivZIndex)            
            .ww(this.optionsDivWidth).mih(this.optionsDivMinHeight)
            .t(this.optionsDivTop).l(this.optionsDivLeft)
            .bdr(this.optionsDivBorderStyle, this.optionsDivBorderWidth, this.optionsDivBorderColor)
            .bc(this.optionsDivBakcgroundColor)
        
        this.container = div().por().dfc().pad(this.containerPadding)
        
        this.container.a(
            this.selectedDiv,
            Button(">", this.switchRoll.bind(this)).marl(this.containerButtonMargin),
            Button("+", this.addOption.bind(this)).marl(this.containerButtonMargin),            
            this.optionsDiv
        )
        
        this.ffm().ac("unselectable").dib()

        this.a(this.container)

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
            sev.stopPropagation = true            
            switch(sev.kind){
                case "dragstart":
                    this.draggedElement = sev.e
                    this.draggedOption = this.draggedElement.props.option
                    this.draggedElement.bc(this.dragOptionHighlightColor)
                    break
                case "dragover":
                    sev.ev.preventDefault()
                    sev.e.bc(this.dragOptionOverColor)
                    this.draggedElement.bc(this.dragOptionHighlightColor)
                    break
                case "dragleave":
                    sev.ev.preventDefault()
                    sev.e.bc(this.dragBoxColor)
                    this.draggedElement.bc(this.dragOptionHighlightColor)
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

        if(this.props.isContainer && (!this.props.showSelected)){
            this.selectedDiv.html(this.props.label ? this.props.label : "")
        }else{
            if(this.state.selected){
                this.selectedDiv.html(this.state.selected.display)
            }else this.selectedDiv.x()
        }        
    }

    switchRoll(){        
        this.state.rolled = !this.state.rolled
        this.container.bc(this.state.rolled ? this.containerRolledBackgroundColor : this.containerBackgroundColor)
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
        opt = {
            kind: this.props.isContainer ? "editablelist" : "scalar",
            value: value, display: display
        }
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
