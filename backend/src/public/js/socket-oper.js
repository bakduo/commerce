//Patron modulo
const sc = (()=>{

        const socket = io();

        const textarea = document.getElementById("chatarea");
    
        socket.on('renderproductos',(data)=>{

            console.log("cargar productos");
            const template = `<center>
            <h1>Listado de productos</h1>
        </center>

        {{#if state }}
        <table class="table">
            <thead class="table-dark">
                <tr>
                
                <th scope="col">Nombre</th>
                <th scope="col">Precio</th>
                <th scope="col">Foto</th>

                </tr>
            </thead>
            <tbody>
                
        
                {{#if productos}}
                    {{#each productos}}
                        <tr>
                        <td>{{this.title}}</td>
                        <td>{{this.price}}</td>
                        <td>
                            <img alt="image" src="{{this.thumbail}}"
                                width="50" height="50" />
                            </td>
                        </tr>
                    {{/each}}
                {{/if}}

            </tbody>
        </table>

        {{else}}
        <table class="table">
            <thead class="table-dark">
                <tr>
                
                <th scope="col">Nombre</th>
                <th scope="col">Precio</th>
                <th scope="col">Foto</th>

                </tr>
            </thead>
            <tbody>
            </tbody>
        </table>
        <h1><center>No se encontrarón productos</center></h1>
        {{/if}}`

            let renderProductos = Handlebars.compile(template);
            
            document.getElementById('datos').innerHTML = renderProductos({
                productos:data,state:true,
            });
        
        });
        
    socket.on("getClient",(data)=>{

        socket.emit('getproductos',{});
        socket.emit('getmsg',{})
        
    });

    socket.on("connection",(data)=>{
        
        console.log("Conexion cliente");

    })

    socket.on("reloadmsg",(data)=>{

        const chat = "<b>"+ data.user +  "</b>: " + "<i>" + data.msg + "</i> " + "[" + data.tiempo + "]" ;
        textarea.innerHTML = textarea.innerHTML + "<br>" + chat;
    });

    socket.on("overflow",(data)=>{
        alert("Maximo msg permitidos")
    });

    socket.on("rendermsg",items=>{

        items.forEach(element => {
            const chat = "<b>"+ element.user +  "</b>: " + "<i>" + element.msg + "</i> " + "[" + element.tiempo + "]" ;
            textarea.innerHTML = textarea.innerHTML + "<br>" + chat;
        });

    })

    function sendMsg(msg,data){
        socket.emit(msg,data);
    }

    return {
        sendMsg
    };

})();