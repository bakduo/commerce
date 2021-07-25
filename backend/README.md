# Example API by Express

=====================================

- [x] commonjs
- [x] fs
- [x] store in memory and reload by files.
- [x] CRUD.
- [x] socket.io
- [x] chat + store
- [x] test api productos
- [x] control and trace
- [x] log request
- [x] eslint config
- [x] vscode config
- [x] pre-condition container
- [x] fake-token-auth + fakeauthorize
- [x] refactoring
- [ ] container
- [ ] cluster

# DB

Para el caso de uso de dbstore se usan reposositorys y como no hay DB store mongo fisica se simula cada colección de forma independiente con store files.

# Development


Configura variables example:

```

sqlite.env

PORT=8080
DBTYPE_PRINCIPAL="sqlite"

nosql.env

PORT=8080

DBTYPE_PRINCIPAL="mongo"
DBTYPE_PRINCIPAL_USER="user"
DBTYPE_PRINCIPAL_DBNAME="db"
DBTYPE_PRINCIPAL_PASSWD="pass"
DBTYPE_PRINCIPAL_HOST="server"
DBTYPE_PRINCIPAL_PORT=puerto


mysql.env

PORT=8080
DBTYPE_PRINCIPAL="mysql"
DBTYPE_PRINCIPAL_USER="user"
DBTYPE_PRINCIPAL_DBNAME="database"
DBTYPE_PRINCIPAL_PASSWD="pass"
DBTYPE_PRINCIPAL_HOST="server"
DBTYPE_PRINCIPAL_PORT=puerto


mkdir db 

npm run sqlite

npm run nosql

npm run mysql

PD: Remember appy migrate knex for persistence

```

# Run test

