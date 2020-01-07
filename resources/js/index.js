class App extends TreeComponent{
    constructor(props){
        super(props)
    }

    componentDidMount(){
        this.save()
    }

    save(){
        super.save()
        if(this.textarearef)if(this.textarearef.current){
            this.textarearef.current.value = JSON.stringify(this.state, null, 3)
        }
    }

    parse(){
        if(this.textarearef)if(this.textarearef.current){
            this.state = JSON.parse(this.textarearef.current.value)
            this.save()
            this.setState(this.state)
        }
    }

    render(){
        this.textarearef = React.createRef()
        return e('div', p({})._,
            this.e(EditableList, p({key: UID(), id: "templates", width: 800, dontRollOnSelect: true})._, null),
            e('textarea', p({ref: this.textarearef, onChange: ()=>{}}).w(800).h(550)._, null),
            e('div', {},
                e('button', p({onClick: this.parse.bind(this)})._, "Parse")
            )            
        )
    }
}

ReactDOM.render(
    e(App, {id: "app"}, null),
    document.getElementById('root')
)
