const config = require('../config/index');
const UserModel = require('../model/user-model');
const logger = config.logger;
const bcrypt = require('bcrypt');
const phoneUtil =
  require('google-libphonenumber').PhoneNumberUtil.getInstance();

const DownloadImage = require('../util/downloadimage');
const isImageURL = require('image-url-validator').default;
  
class UserApi {

  constructor(repo,credential){
    this.repo = repo;
    this.credential = credential;
    this.model = new UserModel()
  }

  findOne = async (email) => {
    const user = await this.repo.find({query:{key:'email',value:email}})
    if (user){
      return user;
    }
    return false;
  }

  deleteOne = async (id) => {
    const user = await this.repo.deleteById(id);
    if (user){
      return user;
    }
    return false;
  }

  getAll = async () => {
    const listaUsers = await this.repo.getItems();
    if (listaUsers) {
        return listaUsers;
    }
    return false;
  }

  add = async (user) => {
    
    const {role, nombre,email,direccion,tel,avatar,edad,pais,password} = user;

    const edadNumber = Number(edad);
    
    const valid = this.model.validate({nombre,email,edad:edadNumber,direccion,tel,avatar});
    
    if (valid){

      let roleUser="user";
      if (role){
        roleUser = role;
      }

      const exists = await this.repo.find({query:{key:'email',value:email}})

      if (!exists){
        try {
          if (!phoneUtil.isValidNumber(phoneUtil.parse(tel, pais), pais)) {
            return {
              SUCCESS: false,
              fail: 'El telefono no es valido',
            };
          }  
        } catch (error) {
          return {
            SUCCESS: false,
            fail: 'El telefono no es valido',
          };
        }
        
        try {
          let avatarValid = await isImageURL(avatar); 
          if (!avatarValid) {
            return {
              SUCCESS: false,
              fail: 'La imagen de usuario no es valida',
            };
          }
        } catch (error) {
          return {
            SUCCESS: false,
            fail: 'La imagen de usuario no es valida',
          };
        }
        
        const download = new DownloadImage();
        
        download.downloadImage(avatar, nombre);

        const userGenerated = await this.repo.save({nombre,email,edad:edadNumber,direccion,tel,avatar,role:roleUser});
        
        if (userGenerated){
          const newPassword = bcrypt.hashSync(
            password,
            bcrypt.genSaltSync(11),
            null
          );
          
          await this.credential.save({
            user: userGenerated,
            password: newPassword,
          });

          logger.debug("Usuario generado");

          return {
            SUCCESS: userGenerated,
            fail: false
          }
        }
      }else{
        return {
          SUCCESS: false,
          fail: 'Usuario ya existe.'
        };    
      }
    }
    return {
            SUCCESS: false,
            fail: 'Los parametros para registro no son validos'
          };
  }
}

module.exports = UserApi;