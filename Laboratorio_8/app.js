const express = require('express')
const app = express()

app.get('/:numero', function (req, res) {
  const numero = req.params.numero;
  let Fibonachi = [];
  var x = 0;
  var y = 1;
  var z = 0;
  for (i=0;i<numero;i++){
      Fibonachi.push(x);
      z = x + y;
      x = y;
      y = z;
      }
      res.json({Secuencia: Fibonachi})
})

app.listen(3000)