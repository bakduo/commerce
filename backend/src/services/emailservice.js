const nodemailer = require('nodemailer');

const config = require('../config/index.js');

const logger = config.logger;

class EmailService {
    constructor(){
        this.hosts="";
        this.port=-1;
        this.user="";
        this.passwd="";
        this.from="";
        this.smtp=null;
    }

    initialize({server,port,user,passwd}){
        try {
            const transporter = nodemailer.createTransport({
                host: server,
                port: Number(port),
                auth: {
                    user: user,
                    pass: passwd
                }
            });
            this.smtp = transporter;
            
        } catch (error) {
            logger.error(error);
            throw new Error("Not possible create transport");
        }
    }

    setFrom(f){
        this.from=f;
    }

    getFrom(){
        return this.from;
    }

    //destructuration
    generateMessage(subject,to,data){
        const buildDataEmail = {
            from:this.getFrom(),
            to:to,
            subject:subject,
            html:data
        }
        return buildDataEmail;
    }

    send(subject,to,data){
        try {
            this.smtp.sendMail(this.generateMessage(subject,to,data), (err, info) => {
                if (err) {
                    
                    logger.error(err);
                    return err
                }
                logger.info(info);
            });
        }catch(error) {
            logger.error(error);
            throw new Error("Error al generar SMTP send");
        }
    }
}

module.exports = EmailService;