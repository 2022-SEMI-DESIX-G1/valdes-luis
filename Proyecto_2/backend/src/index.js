require('dotenv').config();
const express = require('express');
const cors = require('cors');

const app = express();

//CORS
app.use( cors() );

//Parseo y lectura del body
app.use( express.json() )

//rutas
app.use('/', require('./routes/pokemon'));

app.listen(process.env.PORT, ()=>{
    console.log("Server ejecutandose en puerto ",process.env.PORT)
})