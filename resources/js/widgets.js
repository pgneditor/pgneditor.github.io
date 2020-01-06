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

        this.width = this.props.width || 200
        this.height = this.props.height || 20

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

    render(){        
        return e('div', p({className: "unselectable"}).por().dib().bc("#aa0")._,
            e('div', p({}).dfc()._,
                e('div', p({onClick: this.switchroll.bind(this)}).mar(2).ww(this.width).hh(this.height).pad(2).bc("#eee")._, this.state.selected ? this.state.selected : ""),
                e('button', p({onClick: this.switchroll.bind(this)}).mar(1).fs(this.height - 6)._, ">"),
                e('button', p({onClick: this.add.bind(this)}).mar(1).fs(this.height - 6)._, "+"),
                e('div', p({}).cup().bc("#aaf").ww(this.width + 100).ovfysc().poa().show(this.state.rolled).t(this.height + 8)._,
                    this.state.options.map(o=>
                        e('div', p({key: "optionflex" + o[0]}).dfc()._,
                            e('div', p({onClick: this.select.bind(this, o[0]),key: o[0]}).ww(this.width + 50).pad(1).bc(this.state.selected == o[0] ? "#7f7" : "#aff").mar(2)._, o[1]),
                            e('button', p({onClick: this.delopt.bind(this, o[0])}).bc("#fcc")._, "X")
                        )
                    )
                )
            )
        )
    }
}
