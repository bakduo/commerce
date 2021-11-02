# Commerce API by Express

=====================================

- [x] commonjs
- [x] fs
- [x] store in memory and mongo.
- [x] CRUD.
- [x] socket.io
- [x] chat + store
- [x] test api productos
- [x] control and trace
- [x] log request
- [x] eslint config
- [x] vscode config
- [x] pre-condition container
- [x] toke auth
- [x] refactoring
- [x] container
- [x] cluster
- [x] uso y validacion de modelos.
- [x] uso de DTO y DAO
- [x] uso de repository
- [x] injectar configuración para funcionar via secret kubernetes & swarm.
- [x] soporte para correr pm2

# DB

Se utiliza DB mongo para prod y memory para dev.

# Development


Configura variables ejemplo:

```

mkdir log config public/upload public/images

configurar archivo  development.json  y production.json

Este archivo debe estar guardado sobre config/development.json

{
  "app": {
    "port": 3000,
    "site":"localhost",
    "protocol":"http",
    "client":{
      "host":"localhost", => hostname para frontend CORS
      "port":4200
    },
    "graphql": false,
    "uploadfolder":"public/upload",
    "defaultpersistence":"memory", => persistencia por default
    "persistence":{
      "mongo":"wmongo",
      "memory":"memory",
      "mysql":"wknex",
      "sqlite":"wknex",
      "file":"archivo-repository"
    },
    "db1": {
      "user": "usuario valido",
      "passwd": "password valido",
      "host": "hostname valido",
      "port": puerto valido,
      "secure": 1,
      "type": "mongo",
      "connector": "mongodb",
      "dbname": "db valida para nuestra app",
      "schema": {
        "users": "user-schema",
        "credentials": "credential-schema",
        "tokens": "token-schema",
        "productos": "producto-schema",
        "mensajes": "mensaje-schema",
        "carritos": "carrito-schema",
        "ordenes": "orden-schema"
      }
    },
    "db2": {
      "user": "user de session",
      "passwd": "passwd session",
      "host": "hostname session",
      "dbname": "configrar db solo si usa session",
      "port": 0,
      "secure": 1,
      "type": "mongo",
      "connector": "mongodb"
    },
    "emails_providers": [
      {
        "user": "cuenta de un proveedor para usar de salida",
        "passwd": "passwore de un proveedor de salida",
        "server": "servidor de salida",
        "port": "puerto valido de salida"
      }
    ],
    "email_admin": "usuario al que le llegan los mails de envios como admin. llegan regitro y logout.. admin@dom.com. Tiene que ser un mail valido",
    "twilio": {
      "id": "id valido",
      "token": "token valido",
      "fromtel": "telefono celular valido"
    },
    "support_login": "",
    "facebookid": "idfacebook",
    "facebooksecret": "secreto facebook",
    "facebookcallback": "http://localhost:3000/auth/facebook/callback",
    "secret": "secret token"
  }
}

Ejecutar: 

npm run dev => dev

npm start => prod

npm run pm2 => pm2 cluster


```

# Run test


npm run test

Genera los reportes.
