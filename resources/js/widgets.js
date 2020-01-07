class TreeComponent extends React.Component{
    constructor(props){
        super(props)

        this.props = props

        this.parent = props.parent

        this.id = props.id

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

        if(!this.state.options){
            this.state.options = []
        }
    }

    getOptionByValue(value){
        return this.state.options.find(o=>o[0]==value)
    }

    add(){
        let value = window.prompt("Add option :")
        if(value){
            if(!this.getOptionByValue(value)){
                this.state.options.push([value, value])
            }
            this.state.selected = value
            this.state.rolled = false
            this.build()
        }
    }

    switchroll(){
        this.state.rolled = !this.state.rolled
        this.build()
    }

    select(value){
        this.state.selected = value
        this.switchroll()
    }

    delopt(value){
        this.state.options = this.state.options.filter(o=>o[0]!=value)
        this.state.selected = this.state.options.length ? this.state.options[0][0] : null
        this.build()
    }

    build(){
        this.parent.state[this.id] = this.state
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
        this.selref.current.scrollIntoView({block: "center"})
    }

    render(){        
        this.selref = React.createRef()

        return e('div', p({className: "unselectable"}).ff("monospace").por().dib().bc(this.state.rolled ? "#77f" : "#bbb")._,
            e('div', p({}).dfc()._,
                e('div', p({onClick: this.switchroll.bind(this)}).fs(this.height - 3).mar(2).ww(this.width).hh(this.height).pad(2).padl(4).bc("#eee")._, this.state.selected ? this.state.selected : ""),
                e('button', p({onClick: this.switchroll.bind(this)}).mar(1).fs(this.height - 6)._, ">"),
                e('button', p({onClick: this.add.bind(this)}).mar(1).fs(this.height - 6)._, "+"),
                e('div', p({}).cup().bc("#aaf").mah(290).ww(this.width + 60).marl(1).ovfysc().poa().show(this.state.rolled).t(this.height + 8)._,
                    this.state.options.map(o=>
                        e('div', p({ref: this.state.selected == o[0] ? this.selref : null, key: "optionflex" + o[0]}).dfc()._,
                            e('div', p({}).ww(this.height - 4).hh(this.height - 4).bc(this.dhc).mar(2).marl(5).drag(this.optionDrag.bind(this, o[0]))._, null),
                            e('div', p({onClick: this.select.bind(this, o[0]),key: o[0]}).ww(this.width - 14).pad(1).bc(this.state.selected == o[0] ? "#7f7" : "#aff").mar(2)._, o[1]),
                            e('button', p({onClick: this.delopt.bind(this, o[0])}).fs(this.height - 9).marl(2).bc("#fcc")._, "X")
                        )
                    )
                )
            )
        )
    }
}
