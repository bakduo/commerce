let fs = require('fs'),
  http = require('http'),
  https = require('https');
let Stream = require('stream').Transform;
const cwd = process.cwd();

/**
 * [DownloadImage Se utiliza esta clase para poder almacenar las imagenes de los avatar de los usuarios]
 */
class DownloadImage {
  constructor() {
    this.path = `${cwd}` + '/public/images/';
  }

  downloadImage = (url, filename, callback) => {
    let client = http;

    const pathFile = this.path + filename;
    
    if (url.toString().indexOf('https') === 0) {
      client = https;
    }

    client
      .request(url, function (response) {
        let data = new Stream();
        response.on('data', function (chunk) {
          data.push(chunk);
        });

        response.on('end', function () {
          fs.writeFileSync(pathFile, data.read());
        });
      })
      .end();
  };
}

module.exports = DownloadImage;
