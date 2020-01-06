class TemplateComponent extends React.Component{
    constructor(props){
        super(props)

        this.props = props

        this.state = {}
    }

    render(){
        return e('div', p({})._, null)
    }
}

class EditableList extends React.Component{
    constructor(props){
        super(props)

        this.props = props

        this.state = {}
    }

    render(){        
        return e('div', p({})._, null)
    }
}
