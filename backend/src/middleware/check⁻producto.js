//Uso middleware a nivel de ruta porque me permite agregar funcionalidad  sin modificar mucho el codigo original

class CheckProducto {
  constructor() {}

  checkString = async (type) => {
    let valido = {
      status: false,
      kind: type,
    };

    if (typeof type === 'string') {
      valido.status = true;
      return valido;
    }
    return valido;
  };

  checkNumber = async (type) => {
    let valido = {
      status: false,
      kind: type,
    };

    if (typeof type === 'number' || typeof type === 'string') {
      valido.status = true;
      return valido;
    }
    return valido;
  };

  checkItems = async (vector, callbackCheck) => {
    let resultadoTest = { status: true };

    for (let i = 0; i < vector.length; i++) {
      const resultado = await callbackCheck(vector[i]);

      if (!resultado.status) {
        resultadoTest = {
          status: false,
          type: 'number',
          value: resultado.kind,
        };
        break;
      }
    }
    return resultadoTest;
  };

  checkBody = async ({
    title,
    thumbail,
    price,
    code,
    stock,
    description,
    name,
  }) => {
    let vectorNumber = [];
    let vectorString = [];

    let resultadoTest = { status: true };

    if (
      title === undefined ||
      title === null ||
      thumbail === undefined ||
      thumbail === null ||
      price === undefined ||
      price === null ||
      code === undefined ||
      code === null ||
      stock === undefined ||
      stock === null ||
      description === undefined ||
      description === null ||
      name === undefined ||
      name === null
    ) {
      resultadoTest = {
        status: false,
        type: 'Invalid',
        value: 'Parameter inmcomplete',
      };

      return resultadoTest;
    }

    vectorString.push(title);
    vectorString.push(thumbail);
    vectorString.push(description);
    vectorString.push(name);

    vectorNumber.push(code);
    vectorNumber.push(stock);
    vectorNumber.push(price);

    const resultadoTestNumber = await this.checkItems(
      vectorNumber,
      this.checkNumber
    );
    const resultadoTestString = await this.checkItems(
      vectorString,
      this.checkString
    );

    if (!resultadoTestNumber.status || !resultadoTestString.status) {
      resultadoTest = {
        status: false,
        type: 'Invalid',
        value: 'Parameter inmcomplete',
      };
    }

    return resultadoTest;
  };

  checkFields = async (req, res, next) => {
    let final = true;

    const resultado = await this.checkBody(req.body);

    if (resultado.status) {
      final = false;
    }

    req.customblock = final;
    req.customerror = resultado;

    next();
  };
}

module.exports = CheckProducto;
