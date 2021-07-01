function cookies2JSON(){
    return document.cookie.split(';').map(function(c) {
        return c.trim().split('=').map(decodeURIComponent);
      }).reduce(function(a, b) {
        try {
          a[b[0]] = JSON.parse(b[1]);
        } catch (e) {
          a[b[0]] = b[1];
        }
        return a;
      }, {});
}

class App extends React.Component{
    constructor(props){
        super(props)
        var foo=(funcion,data)=>this.callApi(funcion,data)
        let arrayComponents=
        [
            {'texto':'CAJA','component':<Caja callApi={foo}></Caja>},
            {'texto':'VER STOCK','component':<ConsultaStock></ConsultaStock>},
            {'texto':'INGRESOS','component':<Ingresos></Ingresos>},
            {'texto':'ENVIOS ML','component':<EnviosML callApi={foo}/>}
        ]
        let JSON_cookies=cookies2JSON()
        this.token=JSON_cookies.token
        this.key=JSON_cookies.key
          
        console.log(JSON_cookies)
        this.state={menu:arrayComponents}
        this.state['visibilty']=this.setVisibilty(this.props.indexVisible)
        this.state['authorized']=false
        this.callApi("checkValidateToken","").then((response)=>{this.setState({authorized:response.data}); console.log(this.state.authorized)})      
        this.fetchFromApi=this.callApi.bind(this)
        
    }
    async callApi(funcion,data){
        let response = await fetch('https://vsa.pythonanywhere.com/api',{
                method:'post',
                body:JSON.stringify({"token":this.token||"","key":this.key||"","funcion":funcion,"data":data})
            })
            if (response.status==401){
                this.authorized=false
            }
        console.log({"token":this.token,"key":this.key,"funcion":funcion,"data":data})
        let JSONresponse=await response.json()
        return JSONresponse
    }
    setVisibilty(index){
        let tempVisibilty=this.state.menu.map((value,indexMap)=>{
            if (index==indexMap){return "tabVisible"}
            else{return "tabHidden"}
        })
        return tempVisibilty
    }
    render(){
        if (this.state.authorized){
        return <div>
            <div>
                {
                    this.state.menu.map((menu,index)=>{
                        return <button id={index} key={index} onClick={(e)=>{this.setState({visibilty:this.setVisibilty(e.target.id)})}}>{menu.texto}</button>
                                    })
                }
            </div>
            <hr></hr>
            <div>
            {
                    this.state.menu.map((menu,index)=>{
                        return <div key={index} index={index} className={this.state.visibilty[index]}>{menu.component}</div>
                                    })
                }
            </div>
        </div>
            }
        
        else{
            return <Login loguear={(estado)=>this.setState({authorized:estado})} callApi={(funcion,data)=>this.callApi(funcion,data)}></Login>
        }
        }
}

        //
window.onload = ()=>{
    var b=ReactDOM.render(<App indexVisible={0}></App>, document.getElementById('container'));
}
