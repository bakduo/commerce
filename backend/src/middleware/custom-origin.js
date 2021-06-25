//Uso middleware a nivel de ruta porque me permite agregar funcionalidad  sin modificar mucho el codigo original

class CustomOrigin {

    constructor(){
        
    }

    checkOrigin(req,res,next){
            
        req.rendercustom = true;  
        if (req.headers['content-type']){
            if (req.headers['content-type']==='application/json'){
                req.rendercustom=false;
            }
         }
        next();
    }

    checkForm(req,res,next){

        let final = true;

        const error ={};

        let kind = "";
        let validateKind="";
        let ok1 = false;
        let ok2 = false;
        let ok3 = false;

        if (req.body.title && req.body.price && req.body.thumbail){

            ok1 = (typeof req.body.title === 'string' || req.body.title instanceof String);
            ok2 = (typeof req.body.thumbail === 'string' || req.body.thumbail instanceof String)
            ok3 = (typeof req.body.price === 'number')
            
            if (ok1 && ok2 && ok3){
                final = false;
            }
        }

        if (req.body.title===undefined || req.body.title===null){
            kind=kind + ' title';
        }

        if (req.body.thumbail===undefined || req.body.thumbail===null){
            kind=kind  + ' thumbail';
        }

        if (req.body.price===undefined || req.body.price===null){
            kind=kind + ' price';
        }

        if (!ok1){
            validateKind=validateKind + " title";
        }
        if (!ok2){
            validateKind=validateKind + " thumbail";
        }
        if (!ok3){
            validateKind=validateKind + " price";
        }

        error.kind = "Required:" + kind;

        error.descript ="Invalid:"+ validateKind;
        
        req.customblock = final;

        req.customerror = error;
        
        next();
        
    }

    checkIdGet(req,res,next){
        
        let final = true;
        
        if (req.params.id){

            if ((typeof req.params.id === 'number') || (typeof req.params.id === 'string')){
                final = false;
            }
        }

        req.customblock = final;

        next();

    }

    checkIdPost(req,res,next){
        
        let final = true;
        
        if (req.body.id){

            if ((typeof req.body.id === 'number') || (typeof req.body.id === 'string')){
                final = false;
            }
        }

        req.customblock = final;

        next();

    }

}

module.exports = CustomOrigin;