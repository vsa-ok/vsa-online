class Login extends React.Component{
    constructor(props){
        super(props)
    }
    makeLogin(u,p){
        this.props.callApi('login',{'user':this.vsaUser,'pass':this.vsaPass})
        .then((response)=>{
            document.cookie="token="+response.data.token+";expires=86300"
            document.cookie="key="+response.data.key+";expires=86300"
            //this.props.loguear(response.data)
            location.reload()
        })

    }
    render(){
        return <div>
            <label>Usuario</label>
            <br/>
            <input id='vsaUser' onChange={(e)=>this.vsaUser=e.target.value}></input>
            <br/>
            <label>Contraseña</label>
            <br/>
            <input id='vsaPass' onChange={(e)=>this.vsaPass=e.target.value}></input>
            <br/>
            <button onClick={()=>this.makeLogin(this.vsaUser,this.vsaPass)}>Mandar</button>
        </div>
    }
}