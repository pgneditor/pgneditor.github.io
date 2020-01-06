class App extends React.Component{
    constructor(props){
        super(props)

        this.props = props

        this.state = {}
    }

    render(){
        return e('div', p({})._,
            e(EditableList, p({})._, null)
        )
    }
}

ReactDOM.render(
    e(App, {}, null),
    document.getElementById('root')
)
