const express = require('express');
const routerImagen = express.Router();
const config = require('../config/index');
const path = require('path');

routerImagen.get('/upload/:image',(req,res,next)=>{
    if (req.params.image){
      return res.sendFile(path.resolve(path.resolve(config.uploadfolder+"/"+req.params.image)));
    }
    return res.status("404").json('Resource not found');
});
module.exports = routerImagen;