class App extends React.Component{
    constructor(props){
        super(props)

        this.props = props

        this.state = {}
    }

    render(){
        return e('div', {className: "blink_me"}, "Welcome to Pgneditor GitHub IO.")
    }
}

ReactDOM.render(
    e(App, {}, null),
    document.getElementById('root')
)
