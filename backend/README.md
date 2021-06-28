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
mkdir db;

dev:

PORT=8082
DBTYPE="memory" or file
DBPATH=""
DBPATHPRODUCTOS="db/store_dev.json"
DBPATHCARRITO="db/store_carrito_dev.json"

test:

PORT=8081
DBTYPE="file" or file
DBPATH=""
DBPATHPRODUCTOS="db/store_test.json"
DBPATHCARRITO="db/store_carrito_test.json"
```

# Run dev

```

npm run dev

```

# Run test

```
mkdir db

npm run test

```

# Run prod fake

production.env

```
mkdir db

PORT=8080
DBTYPE="memory" or file
DBPATH=""
DBPATHPRODUCTOS="db/store.json"
DBPATHCARRITO="db/store_carrito.json"

npm start

```

