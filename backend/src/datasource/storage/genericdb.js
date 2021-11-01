class GenericDB {
  //caso ejemplo una DB memory

  constructor() {}

  getType() {
    throw new Error('implement concrete class')
  }

  find = async (custom) => {
    throw new Error('implement concrete class')
  }

  replaceAll = async (data) => {
    throw new Error('implement concrete class')
  };

  deleteAll = async () =>{
    throw new Error('implement concrete class')
  }

  setMathItem = async (match) => {
    throw new Error('implement concrete class')
  };

  clear = async () => {
    throw new Error('implement concrete class')
  };

  getIndex = async (id) => {
    throw new Error('implement concrete class')
  };

  getItemsOther = async (id,modelname) => {
    throw new Error('implement concrete class')
  };

  getItems = async () => {
    throw new Error('implement concrete class')
  };

  getId = async (id) => {
    throw new Error('implement concrete class')
  };

  delete = async (item) => {
    throw new Error('implement concrete class')
  };

  deleteById = async (id) => {
    throw new Error('implement concrete class')
  };

  updateById = async (id, producto) => {
    throw new Error('implement concrete class')
  };

  getSize = async () => {
    throw new Error('implement concrete class')
  };

  save = async (p) => {
    throw new Error('implement concrete class')
  };

  searchItem = async (value, expression_equal) => {
    throw new Error('implement concrete class')
  };
}

module.exports = GenericDB;