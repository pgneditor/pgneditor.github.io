const e = React.createElement

/////////////////////////////////////////////////////
// widget utils
class ComponentProps_{
    constructor(objopt){
        this.obj = objopt || {}
    }

    addstyle = function(name, value){
        if(!this.obj.style) this.obj.style = {}
        this.obj.style[name] = value
        return this
    }

    w(x){this.addstyle("width", x + "px");return this}
    miw(x){this.addstyle("minWidth", x + "px");return this}
    maw(x){this.addstyle("maxWidth", x + "px");return this}
    ww(x){return this.miw(x).maw(x)}
    h(x){this.addstyle("height", x + "px");return this}
    mih(x){this.addstyle("minHeight", x + "px");return this}
    mah(x){this.addstyle("maxHeight", x + "px");return this}
    hh(x){return this.mih(x).mah(x)}
    t(x){this.addstyle("top", x + "px");return this}
    l(x){this.addstyle("left", x + "px");return this}
    bc(x){this.addstyle("backgroundColor", x);return this}
    mar(x){this.addstyle("margin", x + "px");return this}
    pad(x){this.addstyle("padding", x + "px");return this}
    disp(x){this.addstyle("display", x);return this}
    show(x){return this.disp(x ? "initial" : "none")}
    dib(){this.addstyle("display", "inline-block");return this}
    fd(x){this.addstyle("flexDirection", x);return this}
    ai(x){this.addstyle("alignItems", x);return this}    
    dfc(){return this.disp("flex").ai("center")}
    dfcc(){return this.disp("flex").fd("column").ai("center")}
    ff(x){this.addstyle("fontFamily", x);return this}
    fs(x){this.addstyle("fontSize", x + "px");return this}
    ffm(){return this.ff("monospace")}
    pos(x){this.addstyle("position", x);return this}
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
    get _(){return this.obj}
}
function p(objopt){return new ComponentProps_(objopt)}
/////////////////////////////////////////////////////

