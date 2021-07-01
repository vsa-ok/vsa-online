
async function getProductData(){
        let response = await fetch('http://vsa.pythonanywhere.com/at',{
            method:'get'
        })
        let texto = await response.json()
        return texto

}

function callbackGetProductData(datos)
{
    console.log("callback")
    console.log(datos)
}

var a = getProductData()
a.then((s)=>{console.log(s)})
console.log(a)
console.log("aca    ")
