class Textbox extends React.Component{
    constructor(props){
        super(props)
        try{
        this.state={value:props.datos.texto}
        }catch(error){
            this.state={value:""}
        }
    }
    render(){return <div><input onKeyPress={(e)=>{if (e.charCode==13) {e.target.value=""; this.setState({value:""}); this.props.children(this.state.value)}}} onChange={(event)=>this.setState({value:event.target.value})} defaultValue={this.state.value}></input></div>}
}

class Celda extends React.Component{
    constructor(props){
        super(props)
        this.state={texto:this.props.data.texto,editando:false}
        this.myRef= React.createRef();
    }
    textboxCallBack=(texto)=>{
        
        this.props.children({"quien":this.props.data.quien,"valor":texto})
        this.setState({editando:false})        
    }
    editar()
    {
        this.setState({editando:true})
    }
    render(){

        if (this.state.editando){
            return <Textbox datos={{"texto":this.state.texto}}>{(e)=>{this.textboxCallBack(e)}}</Textbox>

        }else{
            return <td onDoubleClick={this.editar.bind(this)}>{this.state.texto}</td>
        }
    }
}
class Producto  extends React.Component{
    render(){
        return <tr>
            {                
                        this.props.columnas.map((key)=>{
                            if (this.props.columnas.includes(key)){
                                return <Celda key={key} data={{'quien':key,'texto':this.props.data[key]||""}}>
                                    {(e)=>this.props.data.updateProduct(Object.assign({}, e,{'ean':this.props.data.ean}))}
                                </Celda>}
                                })
                        
            }
        </tr>
    }
}


class Escaneados extends React.Component{
    constructor(props){
        super(props)
        this.state={
            productosEscaneados:[],
            montoTotal:this.total,
            totalProductos:0,
            columnas:['ean','sku','nombre','precio','cantidad']
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
        console.log(infoProduct)
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
        index=-1 //COMO NO SUMO MAS LAS CANTIDADES AL ESCANEAR, POR ESO DEJO INDEX=-1
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
                        <th className="th_1">stock</th>
                    </tr>
                    {
                        this.state.productosEscaneados.map((heading)=>{
                            return <Producto key={heading.ean} data={heading} columnas={this.state.columnas} />})
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
        this.props.children(datos)

    }
    render(){
        return <div>
            <label>Escanear producto:</label>
            <Textbox>{(e)=>{this.textboxCallBack(e)}}</Textbox>
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
        this.valorAnterior=this.state.value
    }
    handler_select(e){
        console.log(this)
        this.setState({value:e.target.value})
        
        //LLAMAR AL PARENT this.getProductData.bind(this)()
    }
    componentDidUpdate(){
        if (this.valorAnterior!=this.state.value){
            this.props.getProductData()
            this.valorAnterior=this.state.value
        }
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
class Caja extends React.Component{
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
        this.login.bind(this)()    
        
        
    }

    getProductData(){
        async function fetcher(){
            this.setState({status:"DESCARGANDO DATOS..."})
            this.setState({enableBtnGuardar:false})
            return fetch('https://vsa.pythonanywhere.com/api',{
                method:'post',
                body:JSON.stringify({"token":"bla","key":"bla2","funcion":"getProductInfo","data":{'tipoPedido':this.ref_typesOfSales.current.state.value}})
            })
            .then(response=>{return response.json()})
            .then(data=>{
                var response=data
                this.allProducts=response
                this.setState({status:"OK, LISTO PARA EMPEZAR"})
                this.setState({enableBtnGuardar:true})

            })
            }
        fetcher=fetcher.bind(this)
        fetcher()    

    }
    
    
    getProductsDetails(skus){
        async function fetcher(skus){
            this.setState({status:"DESCARGANDO DATOS..."})
            this.setState({enableBtnGuardar:false})
            return fetch('https://vsa.pythonanywhere.com/api',{
                method:'post',
                body:JSON.stringify({"token":"bla","key":"bla2","funcion":"getProductsDetails","data":{'sku':skus}})
            })
            .then(response=>{return response.json()})
            .then(datos=>{
                var response=datos
                let datosDescargados=response.data.map((s)=>({['sku']:s['Referencia interna'],['stock']:"P:"+s['Cantidad prevista']+"/F:"+s['cantidad_fisica']}))
                this.setState({status:"STOCK DESCARGADO"})
                let newProductosEscaneados=[]
                for (const producto of this.ref_escaneados.current.state.productosEscaneados){
                    let copy={};
                    Object.assign(copy, producto);
                    try{
                        copy['stock']=datosDescargados.find((e)=>{return e.sku==copy.sku}).stock
                    }
                    catch(error){
                        copy['stock']="-"
                    }
                    newProductosEscaneados.push(copy)
                }
                this.ref_escaneados.current.setState({productosEscaneados:[]},()=>{
                    this.ref_escaneados.current.setState({productosEscaneados:newProductosEscaneados})})
                console.log(this.ref_escaneados.current.state.productosEscaneados)
                this.setState({enableBtnGuardar:true})

            })
            }
        fetcher=fetcher.bind(this)
        fetcher(skus)    
    }
    login(){
        async function fetcher(){
            return fetch('https://vsa.pythonanywhere.com/api',{
                method:'post',
                body:JSON.stringify({"token":"bla","key":"bla2","funcion":"login","data":""})
            })
            .then(response=>{return response.json()})
            .then(data=>{
                this.setState({listTypesOfSales:data.data})
                this.getProductData.bind(this)()
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
         })||""
        let tempData= {'sku':dataEncontrada.sku||"",'nombre':dataEncontrada.nombre||"",'precio':dataEncontrada.precio||""}
        let jsonProductos = Object.assign({}, params, tempData); 
        console.log(jsonProductos)
        this.ref_escaneados.current.addProducto(jsonProductos)
    }
    clickGuardar(){
        console.log(this.ref_typesOfSales.current.state)
        let datosGuardar={
            'tipoVenta':this.ref_typesOfSales.current.state.value,
            'productosEscaneados':this.ref_escaneados.current.state.productosEscaneados,
            'dataAdicional':this.ref_dataAdicional.current.state.value
        }
        console.log(datosGuardar)
        this.saveSalesData(datosGuardar)
    }
    clickEmpezarNuevo(){
        this.ref_escaneados.current.clearProducts()
        this.setState({status:"OK, LISTO PARA EMPEZAR"})
    }
    clickCheckStock(){
        let newColumnas=[...this.ref_escaneados.current.state.columnas]
        console.log(newColumnas)
        if (!newColumnas.includes("stock")){
            newColumnas.push("stock")
            this.ref_escaneados.current.setState({columnas:newColumnas})

        }
        
        let listSkus=this.ref_escaneados.current.state.productosEscaneados.map((s)=>s.sku||false)
        //buscar datos de productos
        this.getProductsDetails(listSkus)

    }
    render(){
        return (
        <div>
            <TypesOfSale ref={this.ref_typesOfSales} getProductData={()=>this.getProductData()}>{this.state.listTypesOfSales}</TypesOfSale>
            <label>Info adicional: </label>
            <Textbox ref={this.ref_dataAdicional}>{()=>{}}</Textbox>
            <ProductInput>{(e)=>this.handlerAddProduct(e)}</ProductInput>
            <div>-</div>
            <Escaneados ref={this.ref_escaneados} totalProductos={0} callbackTotalProductos={this.callbackTotalProductos.bind(this)}> </Escaneados>
            <Total></Total>
            <div>Total de productos distintos: {this.state.totalProductos}</div>
            <button disabled={!this.state.enableBtnGuardar} onClick={this.clickGuardar.bind(this)}>Guardar</button>
            <button onClick={this.clickEmpezarNuevo.bind(this)}>Empezar nuevo</button>
            <button onClick={this.clickCheckStock.bind(this)}>Chequear stock</button>
            <div>{this.state.status}</div>
            </div>)
    }
    

}
class ConsultaStock extends React.Component{
    render(){
        return(<div>
            <label>Escanear producto:</label>
            <Textbox>{(s)=>{console.log(s)}}</Textbox>

            </div>)

    }
}
class Ingresos extends React.Component{
    render(){
        return <label>Ingresos</label>
    }
}
class App extends React.Component{
    constructor(props){
        super(props)
        this.state={menu:['CAJA','VER STOCK','INGRESOS']}
        this.state['visibilty']=this.setVisibilty(0)
        
    }
    setVisibilty(index){
        let tempVisibilty=this.state.menu.map((value,indexMap)=>{
            if (index==indexMap){
                return "tabVisible"
            }
            else{
                return "tabHidden"
            }

        })
        console.log(index)
        return tempVisibilty
    }
    render(){
        return <div>
            <div>
                {
                    this.state.menu.map((nombre,index)=>{
                        return <button id={index} key={index} onClick={(e)=>{this.setState({visibilty:this.setVisibilty(e.target.id)})}}>{nombre}</button>
                                    })
                }
            </div>
            <hr></hr>
            <div>
                <div index={0} className={this.state.visibilty[0]}><Caja></Caja></div>
                <div index={1} className={this.state.visibilty[1]}><ConsultaStock></ConsultaStock></div>
                <div index={2} className={this.state.visibilty[2]}><Ingresos></Ingresos></div>
            </div>
        </div>
            }
        }
        
//fetch('http://google.com.ar')
//    .then(response => response.json())
//    .then(json => console.log(json));

var b=ReactDOM.render(<App></App>, document.getElementById('container'));
