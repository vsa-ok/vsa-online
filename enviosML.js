class EnviosML extends React.Component{
    constructor(props){
        super(props)
        this.state={envios:[],ultimaActualizacion:""}
        this.activar()
        setInterval(() => {
            this.activar()
        },60000);
        
    }
    activar(){
        this.props.callApi("getMLShippings","").then((response)=>
            {this.setState({envios:response.data})
            this.setState({ultimaActualizacion:Date()})}
            )
    }
    render(){
        return (<div>
            <strong><label>Ultima Actualización: </label></strong><label>{this.state.ultimaActualizacion}</label><p/>
            <table cellSpacing="0" cellPadding="0"> 
                <tbody>{
                this.envioAnterior=""
                }
                {                    
                    this.state.envios.map((envio,index)=>{
                        if (this.envioAnterior!=envio.direccion){
                            var clase='border_top'
                        }else{
                            var clase=''
                        }
                        this.envioAnterior=envio.direccion
                        var colorFondo=""
                        if (envio.estado=="ready_to_ship" && envio.sub_estado=="ready_to_print"){
                            colorFondo='yellow'
                        }
                        else if (envio.estado=="shipped" && envio.sub_estado=="out_for_delivery"){
                            colorFondo='burlywood'
                        }else if(envio.estado=="delivered"){
                            colorFondo='aquamarine'
                        }else if(envio.sub_estado=="delivery_failed"){
                            colorFondo='red'
                        }
                        var tipoEnvio=""
                        if (envio.tipo=="drop_off"){
                            tipoEnvio="Correo"

                        }else if(envio.tipo=="self_service"){
                            tipoEnvio="Flex"
                        }
                        

                        
                        return <tr key={envio.orderID} style={{'backgroundColor':colorFondo}} className={clase}>
                            <td>{envio.orderID}</td>
                            <td>{envio.shippingID}</td>
                            <td>{envio.titulo}</td>
                            <td>{envio.nombre}</td>
                            <td>{envio.direccion}</td>
                            <td>{envio.ciudad}</td>
                            <td>{envio.estado}</td>
                            <td>{envio.sub_estado}</td>
                            <td>{tipoEnvio}</td>
                            </tr>
                                    })
                }
                </tbody>
            </table>
        </div>)
    }
}