class User {

    email;
    
    id;

    constructor(){
        this.email="";
        this.id="";
    }

    setId(id){
        this.id=id;
    }

    getId(){
        this.id;
    }

    setMail(m){
        this.email = m;
    }

    getMail(){
        return this.email;
    }

}