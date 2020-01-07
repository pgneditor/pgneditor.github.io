const IGNORE_OBJ = true

class TreeComponent extends React.Component{
    constructor(props){
        super(props)

        this.props = props

        this.parent = props.parent

        this.id = props.id

        this.idLabel = props.idLabel || this.id

        this.state = {}

        if(this.isroot()){
            let stored = localStorage.getItem(this.id)
            if(stored){
                this.state = JSON.parse(stored)
            }
        }else{
            let parentstate = this.parent.state

            if(!parentstate[this.id]){
                parentstate[this.id] = this.state
            }else{
                this.state = parentstate[this.id]
            }
        }
    }

    isroot(){
        return !this.parent
    }

    root(){
        if(this.isroot()) return this
        return this.parent.root()
    }

    save(){
        if(this.isroot()){            
            localStorage.setItem(this.id, JSON.stringify(this.state))            
        }else{
            this.parent.state[this.id] = this.state
            this.root().save()
        }
    }

    e(kind, props, childs){        
        return e(kind, {...{parent: this}, ...props}, childs)
    }

    render(){
        return e('div', p({})._, null)
    }
}

class EditableList extends TreeComponent{
    constructor(props){
        super(props)

        this.width = this.props.width || 250
        this.height = this.props.height || 20

        this.dhc = this.props.dragHandleColor || "#00f"
        
        this.dontRollOnSelect = this.props.dontRollOnSelect        

        if(!this.state.options){
            this.state.options = []
        }

        if(this.props.dontRoll){            
            this.state.rolled = false
            this.save()
        }
    }

    getOptionByValue(value){
        return this.state.options.find(o=>o[0]==value)
    }

    add(ev){
        if(ev) ev.stopPropagation()
        let value = window.prompt("Add option :")
        if(value){
            let display = value
            let valueparts = value.split(":")
            let isClone = false
            if(valueparts.length > 1){
                value = valueparts[0]
                display = valueparts.slice(1).join(":")                     
                if(display.match(/^\*/)){
                    isClone = true
                    display = display.substring(1)
                    let curropt = this.getOptionByValue(this.state.selected)
                    if(curropt){
                        let currdisplay = curropt[1]
                        let currdisplayobj = JSON.parse(currdisplay)
                        currdisplayobj.idLabel = display
                        currdisplayobj.id = value
                        display = JSON.stringify(currdisplayobj)
                        console.log(display)
                        this.state[value] = cloneObject(this.state[this.state.selected])
                    }else{
                        window.alert("Nothing to clone.")
                        return
                    }
                }
            }            
            let opt = this.getOptionByValue(value)
            if(opt && (!isClone)){
                [ opt[0], opt[1] ] = [ value, display ]                
            }else{
                this.state.options.push([value, display])
            }            
            this.checkParentSelect()
            this.state.selected = value
            this.state.rolled = true            
            this.build()
        }
    }

    checkParentSelect(){
        if(this.parent){
            if(this.parent.select){
                this.parent.state.selected = this.id
                this.parent.build()
            }
        }        
    }

    switchroll(ev){        
        if(ev) ev.stopPropagation()
        this.checkParentSelect()
        this.state.rolled = !this.state.rolled
        this.build()
    }

    select(value, ev){        
        if(ev) ev.stopPropagation()
        this.state.selected = value
        if(!this.dontRollOnSelect) this.switchroll()
        else this.build()
    }

    delopt(value){
        this.state.options = this.state.options.filter(o=>o[0]!=value)
        this.state.selected = this.state.options.length ? this.state.options[0][0] : null
        this.build()
    }

    build(){        
        this.save()
        this.setState(this.state)
    }

    indexOfValue(value){
        for(let i=0; i<this.state.options.length; i++) if(this.state.options[i][0] == value) return i
        return null
    }

    optionDrag(value, ev){
        ev.persist()
        switch(ev.type){
            case "dragstart":
                this.draggedi = this.indexOfValue(value)
                this.draggede = ev.target
                this.draggede.style.backgroundColor = "#777"
                break
            case "dragenter": if(ev.target != this.draggede) ev.target.style.backgroundColor = "#ff0"; break
            case "dragover": ev.preventDefault(); break
            case "dragleave": if(ev.target != this.draggede) ev.target.style.backgroundColor = this.dhc; break            
            case "drop":
                ev.target.style.backgroundColor = this.dhc
                this.draggede.style.backgroundColor = this.dhc
                let dropi = this.indexOfValue(value)
                this.state.options.itoj(this.draggedi, dropi)
                this.build()
                break
        }
    }

    componentDidUpdate(){
        if(!this.selref.current) return
        this.selref.current.scrollIntoView({block: "center"})
    }

    elementForDisplay(display, ignoreObj){                
        try{            
            let dobj = JSON.parse(display)                        
            if(ignoreObj) return this.idLabel                        
            let isThisSelected = this.state.selected == dobj.id            
            return e('div', p({}).dfc()._,
                e('div', p({}).ww(100)._, dobj.idLabel),
                this.e(EditableList, p({key: UID(), id: dobj.id, dontRoll: !isThisSelected,  width: this.width - 200})._, null),
            )
        }catch(err){
            return display
        }
    }

    render(){                        
        this.selref = React.createRef()

        return e('div', p({className: "unselectable"}).ff("monospace").por().dib().bc(this.state.rolled ? "#77f" : "#bbb")._,
            e('div', p({}).dfc()._,
                e('div', p({onClick: this.switchroll.bind(this)}).fs(this.height - 3).mar(2).ww(this.width).hh(this.height).pad(2).padl(4).bc("#eee")._, this.state.selected ? this.elementForDisplay(this.getOptionByValue(this.state.selected)[1], IGNORE_OBJ) : this.idLabel),
                e('button', p({onClick: this.switchroll.bind(this)}).mar(1).fs(this.height - 6)._, ">"),
                e('button', p({onClick: this.add.bind(this)}).mar(1).fs(this.height - 6)._, "+"),
                e('div', p({}).zi(10).cup().bc("#aaf").bdr("dotted", 5, "#77f").mih(200).mah(400).ww(this.width + 50).marl(1).ovfysc().poa().show(this.state.rolled).t(this.height + 8)._,
                    this.state.options.map(o=>
                        e('div', p({ref: this.state.selected == o[0] ? this.selref : null, key: "optionflex" + o[0]}).dfc()._,
                            e('div', p({}).ww(this.height - 4).hh(this.height - 4).bc(this.dhc).mar(2).marl(5).drag(this.optionDrag.bind(this, o[0]))._, null),
                            e('div', p({onClick: this.select.bind(this, o[0]),key: o[0]}).ww(this.width - 24).pad(1).bc(this.state.selected == o[0] ? "#7f7" : "#aff").mar(2)._, this.elementForDisplay(o[1])),
                            e('button', p({onClick: this.delopt.bind(this, o[0])}).fs(this.height - 9).marl(2).bc("#fcc")._, "X")
                        )
                    )
                )
            )
        )
    }
}
