Array.prototype.itoj = function(i, j){    
    while(i != j){
        const n = j > i ? i + 1 : i - 1;
        [ this[i], this[n] ] = [ this[n], this[i] ]
        i = n
    }
}

function UID(){
    return "uid_" + Math.random().toString(36).substring(2,12)
}

function cloneObject(obj){
    return JSON.parse(JSON.stringify(obj))
}

/////////////////////////////////////////////////////
// widget utils
const e = React.createElement

class ComponentProps_{
    constructor(objopt){
        this.obj = objopt || {}
    }

    addstyle = function(name, value){
        if(!this.obj.style) this.obj.style = {}
        this.obj.style[name] = value
        return this
    }

    bdrst(x){return this.addstyle("borderStyle", x)}
    bdrw(x){return this.addstyle("borderWidth", x + "px")}
    bdrc(x){return this.addstyle("borderColor", x)}
    bdr(x,y,z){return this.bdrst(x).bdrw(y).bdrc(z)}
    zi(x){return this.addstyle("zIndex", x)}
    w(x){return this.addstyle("width", x + "px")}
    miw(x){return this.addstyle("minWidth", x + "px")}
    maw(x){return this.addstyle("maxWidth", x + "px")}
    ww(x){return this.miw(x).maw(x)}
    h(x){return this.addstyle("height", x + "px")}
    mih(x){return this.addstyle("minHeight", x + "px")}
    mah(x){return this.addstyle("maxHeight", x + "px")}
    hh(x){return this.mih(x).mah(x)}
    t(x){return this.addstyle("top", x + "px")}
    l(x){return this.addstyle("left", x + "px")}
    bc(x){return this.addstyle("backgroundColor", x)}
    mar(x){return this.addstyle("margin", x + "px")}
    marl(x){return this.addstyle("marginLeft", x + "px")}
    marr(x){return this.addstyle("marginRight", x + "px")}
    pad(x){return this.addstyle("padding", x + "px")}
    padl(x){return this.addstyle("paddingLeft", x + "px")}
    padr(x){return this.addstyle("paddingRight", x + "px")}
    disp(x){return this.addstyle("display", x)}
    show(x){return this.disp(x ? "initial" : "none")}
    dib(){return this.addstyle("display", "inline-block")}
    fd(x){return this.addstyle("flexDirection", x)}
    ai(x){return this.addstyle("alignItems", x)}    
    dfc(){return this.disp("flex").ai("center")}
    dfcc(){return this.disp("flex").fd("column").ai("center")}
    ff(x){return this.addstyle("fontFamily", x)}
    fs(x){return this.addstyle("fontSize", x + "px")}
    ffm(){return this.ff("monospace")}
    pos(x){return this.addstyle("position", x)}
    por(){return this.pos("relative")}
    poa(){return this.pos("absolute")}
    ovf(x){return this.addstyle("overflow", x)}
    ovfsc(){return this.ovf("scroll")}
    ovfx(x){return this.addstyle("overflowX", x)}
    ovfxsc(){return this.ovfx("scroll")}
    ovfy(x){return this.addstyle("overflowY", x)}
    ovfysc(){return this.ovfy("scroll")}
    cur(x){return this.addstyle("cursor", x)}
    cup(){return this.cur("pointer")}
    drag(handler){
        this.cur("move")
        this.obj.draggable = true
        this.obj.onDragStart = handler
        this.obj.onDragEnter = handler
        this.obj.onDragOver = handler
        this.obj.onDragLeave = handler
        this.obj.onDragEnd = handler
        this.obj.onDrop = handler
        return this
    }
    get _(){return this.obj}
}
function p(objopt){return new ComponentProps_(objopt)}
/////////////////////////////////////////////////////

