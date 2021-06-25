class App  extends React.Component{
    constructor(props){
        super(props)
        this.state={retorno:this.props.children}

    }
    llamar(){
        console.log(this.state)
        var datas={'key':"bla5",'value':'texto5'}
        var arrayNuevo={retorno: [ ...this.state.retorno,datas]}
        this.setState(arrayNuevo)
        console.log(this.state)
    }
    render(){
        console.log("render")
        return(
            <Parent>{this.state.retorno}</Parent>
        )
    }
    
}
class Parent extends React.Component{
    constructor(props){
        super(props)
        this.state={texto:""}
    }
    
    render(){
        return(
            <div>
                
                <Textbox>{(e)=>this.setState({texto:e})}</Textbox>
                <label>{this.state.texto}</label>
            </div>
        )
}
}
class Textbox extends React.Component{
    render(){return <div><input onKeyPress={(e)=>{if (e.charCode==13) {e.target.value=""; this.setState({value:""}); this.props.children(this.state.value)}}} onChange={(event)=>this.setState({value:event.target.value})}></input></div>}
}
var b=ReactDOM.render(<Parent></Parent>, document.getElementById('container'));
