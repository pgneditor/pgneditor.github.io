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
        this.height = this.props.height || 18
    }

    render(){        
        return e('div', p({}).dfc()._,
            e('div', p({}).w(this.width).h(this.height).pad(2).bc("#eee")._, null)
        )
    }
}
