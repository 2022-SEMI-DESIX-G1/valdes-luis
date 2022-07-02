require('dotenv').config();
const express = require('express');
const app = express();
const path = require('path');
const router = express.Router();

// Obtener el directorio del frontend.
var publicPath = path.resolve(__dirname); 

// Deja disponibles los archivos para uso del index.html.
app.use(express.static(publicPath));

//despliega el index.html
router.get('/',function(req,res){
  res.sendFile(path.join(__dirname+'/index.html'));
});

//adiciona la ruta
app.use('/', router);
//inicia el puerto
app.listen(process.env.PORT, ()=>{
  console.log("Server ejecutandose en puerto ",process.env.PORT)
})