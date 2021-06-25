
//Patron modulo
(()=>{

    //TODO FIX
    let clientId = "";
    const MSG_SIZE=100;
    const datos = document.getElementById("producto");
    const boton = document.getElementById("boton1");
    const textarea = document.getElementById("chatarea");
    const textarea2 = document.getElementById("msgtext1");
    const email = document.getElementById("usermail");
    const boton2 = document.getElementById("boton2");
    
    boton.addEventListener('click',procesar);
    boton2.addEventListener("click",appendMessage);

    function validateEmail(email) {
        const res = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
        return res.test(String(email).toLowerCase());
      }

    function escapeHTML(str) {
        str = str + "''";
        var out = "''";
        for(var i=0; i<str.length; i++) {
            if(str[i] === '<') {
                out += '&lt;';
            } else if(str[i] === '>') {
                out += '&gt;';
            } else if(str[i] === "'") {
                out += '&#39;';
            } else if(str[i] === '"') {
                out += '&quot;';
            } else {
                out += str[i];
            }
        }
        return out;
   }
   
    function appendMessage(){
        
        const texto = textarea2.value;
        const tiempo = new Date();
        const parser =  tiempo.getDay() +  "/" + tiempo.getMonth() + "/" + tiempo.getFullYear() + " " + tiempo.getHours() + ":" + tiempo.getMinutes() + ":" + tiempo.getSeconds();
        const securemsg = escapeHTML(texto);

        if (validateEmail(email.value)){
            if (securemsg.length < MSG_SIZE){
                const chat = "<b>"+ email.value +  "</b>: " + "<i>" + securemsg + "</i> " + "[" + parser + "]" ;
                textarea.innerHTML = textarea.innerHTML + "<br>" + chat;
                const msg = {
                    msg:securemsg,
                    tiempo:parser,
                    user:email.value
                }
                sc.sendMsg("appendmsg",msg);
            }else{
                alert("La longitud del mensaje es muy grande.")
            }
        }else{
            alert("Email no valido");
        }
    }

    function procesar(){
        
        const title =  datos.elements.namedItem("title").value || null  ; 
        const precio = datos.elements.namedItem("price").value || null; 
        const thumbail = datos.elements.namedItem("thumbail").value || null;

        let valid = false;

        if (title && precio && thumbail){
            const ok1 = (typeof title === 'string');
            const ok2 = (typeof thumbail === 'string')
            const ok3 = isNaN(precio)
            valid = ((ok1 && ok2) && !ok3)
        }
        
        if (valid){

            const producto = {
                title:title,
                price: precio,
                thumbail: thumbail,
            }
    
            sc.sendMsg('procesar',producto);
            
        }else{
            alert("Datos invalidos");
        }

        //clean formulario
        datos.reset();

    }

    document.addEventListener('DOMContentLoaded',()=>{
        
    })

})();