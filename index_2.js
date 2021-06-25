class Textbox extends React.Component{
    render(){return <div><input onKeyPress={(e)=>{if (e.charCode==13) {e.target.value=""; this.setState({value:""}); this.props.children(this.state.value)}}} onChange={(event)=>this.setState({value:event.target.value})}></input></div>}
}

class Celda extends React.Component{
    constructor(props){
        super(props)
        this.state={texto:this.props.data.texto,editando:false}
        this.myRef= React.createRef();
    }
    textboxCallBack=(texto)=>{
        
        this.props.data.updateProduct({"ean":this.props.data.ean,"quien":this.props.data.quien,"valor":texto})
        this.setState({editando:false})        
    }
    editar()
    {
        this.setState({editando:true})
    }
    render(){

        if (this.state.editando){
            return <Textbox datos={{"texto":this.state.texto,"parentCallBack":this.textboxCallBack}} />

        }else{
            return(
                <td onDoubleClick={this.editar.bind(this)}>{this.state.texto}</td>
            )
        }
    }
}

class Producto  extends React.Component{
    constructor(props){
        super(props)
        this.state={ean:this.props.data.ean,precio:this.props.data.precio,cantidad:this.props.data.cantidad,sku:this.props.data.sku,nombre:this.props.data.nombre}
        this.myRef= React.createRef();
        
    }

    render(){
        return <tr ref={this.myRef}>
            
            <Celda data={{'quien':'ean',texto:this.state.ean,'ean':this.state.ean,'updateProduct':this.props.data.updateProduct}} />
            <Celda data={{'quien':'sku',texto:this.state.sku,'ean':this.state.ean,'updateProduct':this.props.data.updateProduct}} />
            <Celda data={{'quien':'nombre',texto:this.state.nombre,'ean':this.state.ean,'updateProduct':this.props.data.updateProduct}} />
            <Celda data={{'quien':'precio',texto:this.state.precio,'ean':this.state.ean,'updateProduct':this.props.data.updateProduct}} />
            <Celda data={{'quien':'cantidad',texto:this.state.cantidad,'ean':this.state.ean,'updateProduct':this.props.data.updateProduct}} />
        </tr>;
    }
}

class Escaneados extends React.Component{
    constructor(props){
        super(props)
        this.state={
            productosEscaneados:[],montoTotal:this.total,totalProductos:0
        }
        this.myRef= React.createRef();
        this.updateProduct=this.updateProduct.bind(this)
    }
    total(){
        var mt= this.state.productosEscaneados.reduce(function (a, b) {
            var cantidad = parseFloat(b['cantidad']||0)
            try{
                var precio=parseFloat(b['precio'].replace(",",".")||0)
            }
            catch(error){
                var precio=0
            }
            return (a + cantidad*precio)
        },0)
        return mt.toFixed(2)
    }
    
    updateProduct(infoProduct){
        var index=this.state.productosEscaneados.findIndex(x=>x.ean==infoProduct.ean)
        if (index!=-1){
            var tempProductosEscaneados=this.state.productosEscaneados.map(l => Object.assign({}, l));
            tempProductosEscaneados[index][infoProduct.quien]=infoProduct.valor
            this.setState({productosEscaneados:[]},()=>{
            this.setState({productosEscaneados:tempProductosEscaneados})})
            }
    }
    clearProducts()
    {
        this.setState({productosEscaneados:[]})
    }
    addProducto(infoProduct){
        console.log(infoProduct)
        infoProduct.updateProduct=this.updateProduct
        var index=this.state.productosEscaneados.findIndex(x=>x.ean==infoProduct.ean)
        if (index!=-1){
            var cant=parseInt(parseInt(infoProduct.cantidad)||1)
            var parametros={'ean':infoProduct.ean,'quien':'cantidad','valor':cant}
            this.updateProduct(parametros)
        }else{
            if (infoProduct.cantidad==undefined){
                infoProduct.cantidad=1
            }
            this.setState({productosEscaneados: [ ...this.state.productosEscaneados,infoProduct]})        
        }
    }
    componentDidUpdate(){
        if (this.totalProductos!=this.state.productosEscaneados.length){

            this.props.callbackTotalProductos(this.state.productosEscaneados.length)
            this.totalProductos=this.state.productosEscaneados.length
        }

        //
    }

    render() { 
             
        return (
            <div>
                <table><tbody>
                    <tr>
                        <th className="th_0">EAN</th>
                        <th className="th_1">SKU</th>
                        <th className="th_2">Descripcion</th>
                        <th className="th_1">precio</th>
                        <th className="th_1">cantidad</th>
                    </tr>
                    {
                        this.state.productosEscaneados.map(function (heading){
                            return <Producto key={heading.ean} data={heading} />})
                    }
                    </tbody>
                    </table>
                    <b>-</b>
                    <div>Monto Total: ${this.total()}</div>
            </div>
                
        );
    }
    
}
class ProductInput extends React.Component{
    constructor(props){
        super(props)
        this.lastInput=""
        console.log("product")
    }
    textboxCallBack=(paramsCallBack)=>{
        if (paramsCallBack==""){return}
        if (paramsCallBack<100){
            var datos={'ean':this.lastInput,'cantidad':paramsCallBack}
        }else{
            var datos={'ean':paramsCallBack}            
            this.lastInput=String(paramsCallBack)
        }
        this.props.children.parentHandler(datos)

    }
    render(){
        return <div>
            <label>Escanear producto:</label>
            <Textbox datos={{texto:"","parentCallBack":this.textboxCallBack}} />
            </div>
    }
}
class Total extends React.Component{
    constructor(props){
        super(props)

    }
    render(){
        return <div></div>
        
    }

}

class TypesOfSale extends React.Component{
    constructor(props){
        super(props)
        this.state={types:this.props.children,value:1}
    }
    handler_select(e){
        console.log(this)
        this.setState({value:e.target.value})
    }
    render(){
        //console.log(this.props.children[1])
        return <div>
            <label>Tipo de venta: </label>
            <select value={this.state.value} onChange={this.handler_select.bind(this)} name="">
                {                
                Object.entries(this.props.children).map(function ([idArray,type]){
                    let id=Object.keys(type)[0]
                    //console.log(type)
                    return <option value={id}>{id+": "+type[id]}</option>})
                }
            </select>
        </div>
    }
    
}
class App extends React.Component{
    constructor(props){
        super(props)
        this.ref_escaneados = React.createRef();
        this.ref_typesOfSales = React.createRef();
        this.ref_dataAdicional = React.createRef();
        this.handlerAddProduct=this.handlerAddProduct.bind(this)    
        this.allProducts=""
        this.listTypesOfSales=[]
        this.state={
            status:"",btnGuardarEnabled:false,
            totalProductos:this.props.totalProductos,
            enableBtnGuardar:false,listTypesOfSales:[],
            infoAdicional:""
        }
        this.getProductData.bind(this)()
        this.login.bind(this)()    
    }

    getProductData(){
        async function fetcher(){
            return fetch('https://vsa.pythonanywhere.com/api',{
                method:'post',
                body:JSON.stringify({"token":"bla","key":"bla2","funcion":"getProductInfo","data":""})
            })
            .then(response=>{return response.json()})
            .then(data=>{
                var response=data
                this.allProducts=response
                this.setState({status:"OK, LISTO PARA EMPEZAR"})
            })
            }
        fetcher=fetcher.bind(this)
        fetcher()    
    }
    login(){
        async function fetcher(){
            return fetch('https://vsa.pythonanywhere.com/api',{
                method:'post',
                body:JSON.stringify({"token":"bla","key":"bla2","funcion":"login","data":""})
            })
            .then(response=>{return response.json()})
            .then(data=>{
                console.log(data.data)
                this.setState({listTypesOfSales:data.data})
            })
            }
        fetcher=fetcher.bind(this)
        fetcher()    
    }
    saveSalesData(productData){
        async function fetcher(productData){
            return fetch('https://vsa.pythonanywhere.com/api',{
                method:'post',
                body:productData})
            .then(response=>{return response.json()})
            .then(data=>{
                if (data.data.status=="ok"){
                    this.setState({status:"ORDEN GENERADA. COMPROBANTE N°: "+String(data.data.idComprobante).padStart(5,"0")})
                    
                    this.setState({enableBtnGuardar:false})
                    
                }
                else{
                    this.setState({enableBtnGuardar:true})
                    this.setState({status:"FALLÓ AL GUARDAR"})
                }

            })
            }
        fetcher=fetcher.bind(this)
        fetcher(JSON.stringify({"token":"bla","key":"bla2","funcion":"saveProductInfo","data":productData}))    
    }
    callbackTotalProductos(totalProductos){
        this.setState({'totalProductos':totalProductos})
        this.setState({enableBtnGuardar:!!totalProductos})

    }
    handlerAddProduct(params){
        var dataEncontrada=this.allProducts.data.find((item) => {
            return item.ean == params.ean
         })
        let tempData= {'sku':dataEncontrada.sku,'nombre':dataEncontrada.nombre,'precio':dataEncontrada.precio}
        let jsonProductos = Object.assign({}, params, tempData); 
        console.log(jsonProductos)
        this.ref_escaneados.current.addProducto(jsonProductos)
    }
    clickGuardar(){
        let datosGuardar={
            'tipoVenta':this.ref_typesOfSales.current.state.value,
            'productosEscaneados':this.ref_escaneados.current.state.productosEscaneados,
            'dataAdicional':this.ref_dataAdicional.current.state.texto
        }
        this.saveSalesData(datosGuardar)
    }
    clickEmpezarNuevo(){
        this.ref_escaneados.current.clearProducts()
        this.setState({status:"OK, LISTO PARA EMPEZAR"})
    }
    render(){
        return (
        <div>
            <TypesOfSale ref={this.ref_typesOfSales}>{this.state.listTypesOfSales}</TypesOfSale>
            <label>Info adicional: </label>
            <Textbox ref={this.ref_dataAdicional} datos={{texto:""}} />
            <ProductInput>{{'parentHandler':this.handlerAddProduct}}</ProductInput>
            <div>-</div>
            <Escaneados ref={this.ref_escaneados} totalProductos={0} callbackTotalProductos={this.callbackTotalProductos.bind(this)}> </Escaneados>
            <Total></Total>
            <div>Total de productos distintos: {this.state.totalProductos}</div>
            <button disabled={!this.state.enableBtnGuardar} onClick={this.clickGuardar.bind(this)}>Guardar</button>
            <button onClick={this.clickEmpezarNuevo.bind(this)}>Empezar nuevo</button>
            <div>{this.state.status}</div>
            </div>)
    }
    

}
//fetch('http://google.com.ar')
//    .then(response => response.json())
//    .then(json => console.log(json));

var b=ReactDOM.render(<App></App>, document.getElementById('container'));
