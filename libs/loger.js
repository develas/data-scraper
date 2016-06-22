var winston = require('winston');



var loger = new (winston.Logger)({
    transports: [
      new (winston.transports.File)({
        level: 'error',
        filename: './libs/log.txt',
        maxsize: 5242880,
              maxFiles: 5,
              colorize: false
      }),
      new (winston.transports.Console)({
        colorize: true,
        level: 'info'
      })
    ]
  })


module.exports = loger;