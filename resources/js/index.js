class App extends TreeComponent{
    constructor(props){
        super(props)
    }

    componentDidMount(){
        this.save()
    }

    render(){
        return e('div', p({})._,
            this.e(EditableList, p({id: "templates"})._, null)
        )
    }
}

ReactDOM.render(
    e(App, {id: "app"}, null),
    document.getElementById('root')
)
