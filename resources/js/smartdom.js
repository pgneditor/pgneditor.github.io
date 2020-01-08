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
                this.e.addEventListener(kind, this.handleEventAgent.bind(this))
            }
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

    w(x){return this.addStyle("width", `${x}px`)}
    h(x){return this.addStyle("height", `${x}px`)}
    bc(x){return this.addStyle("backgroundColor", x)}
    mar(x){return this.addStyle("margin", `${x}px`)}
    pad(x){return this.addStyle("padding", `${x}px`)}

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
