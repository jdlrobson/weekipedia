var fs = require('fs');
var week = {};
var filename = `weekly.json`;

function load() {
  return new Promise(function (resolve, reject) {
    fs.readFile(filename, (err, data) => {
      if (err) {
        resolve({ pages: [] });
      } else {
        resolve(JSON.parse(data.toString()));
      }
    });
  })
}

function save( json ) {
  return new Promise(function (resolve, reject) {
    fs.writeFile(filename, JSON.stringify(json), function (err) {
      if (err) {
        reject();
      } else {
        resolve();
      }
    });
  })
}

export default {
  load: load,
  save: save
}