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
    }

    w(x){this.addstyle("width", x + "px");return this}
    h(x){this.addstyle("height", x + "px");return this}
    t(x){this.addstyle("top", x + "px");return this}
    l(x){this.addstyle("left", x + "px");return this}
    bc(x){this.addstyle("backgroundColor", x);return this}
    mar(x){this.addstyle("margin", x + "px");return this}
    pad(x){this.addstyle("padding", x + "px");return this}
    disp(x){this.addstyle("display", x);return this}
    dib(){this.addstyle("display", "inline-block");return this}
    fd(x){this.addstyle("flexDirection", x);return this}
    ai(x){this.addstyle("alignItems", x);return this}    
    dfcc(){return this.disp("flex").fd("column").ai("center")}
    ff(x){this.addstyle("fontFamily", x);return this}
    fs(x){this.addstyle("fontSize", x + "px");return this}
    ffm(){return this.ff("monospace")}
    pos(x){this.addstyle("position", x);return this}
    por(){return this.pos("relative")}
    poa(){return this.pos("absolute")}
    get _(){return this.obj}
}
function p(objopt){return new ComponentProps_(objopt)}
/////////////////////////////////////////////////////

