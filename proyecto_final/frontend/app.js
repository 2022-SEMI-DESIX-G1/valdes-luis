require('dotenv').config();
const express = require('express');
const app = express();
const path = require('path');
const router = express.Router();
var publicPath = path.resolve(__dirname); 
app.use(express.static(publicPath));
router.get('/',function(req,res){
  res.sendFile(path.join(__dirname+'/login.html'));
});
app.use('/', router);
app.listen(process.env.PORT, ()=>{
  console.log("Server corriendo en puerto ",process.env.PORT)
})