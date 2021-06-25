var jsonResponse
function getProductData(callBack){
    function waiting(){
        
    }
    async function fetcher(){
        return fetch('https://vsa.pythonanywhere.com/api',{
            method:'post',
            body:JSON.stringify({"token":"bla","key":"bla2","funcion":"getProductInfo","data":""})
        })
        .then(response=>{return response.json()})
        .then(data=>{
            var response=data
            jsonResponse=response
            callBack(data)
        })
        }
    jsonResponse=""

    fetcher=fetcher.bind(jsonResponse)
    fetcher()
    
    

}

function callbackGetProductData(datos)
{
    console.log("callback")
    console.log(datos)
}

getProductData(callbackGetProductData)
