var prompt = require('prompt');
prompt.start();
prompt.get(['Numero'], function (err, result) {
    var x = 0;
    var y = 1;
    var z = 0;
    for (i=0;i<result.Numero;i++){
        console.log(x);
        z = x + y;
        x = y;
        y = z;
        }
  });