const express = require('express')
const app = express()
const axios = require("axios").default
const cors = require("cors");

const { PORT = 3000 } = process.env;
const CACHE_POK = {};
const CACHE_LOC = {};
const CACHE_EVO = {};
const path = `https://pokeapi.co/api/v2/pokemon/`;

app.use(cors());

app.get('/pokemon/:nombre',  async function (req, res) {
  const name = req.params.nombre;
  const url = path+`${name}`;
  if (CACHE_POK[name]) {
    res.json({data: JSON.parse(CACHE_POK[name]), isCached: true });
  }else{
    let responseData = await responseDataUrl(url);
    res.json({data: responseData, isCached: false});
    CACHE_POK[name] = JSON.stringify(responseData);
  }

});

app.get('/locations/:nombre',  async function (req, res) {
  const name = req.params.nombre;
  const url = path+`${name}`;
  if (CACHE_LOC[name]) {
      res.json({data: JSON.parse(CACHE_LOC[name]), isCached: true });
  }else{
      let responseData = await responseDataUrl(url);
      let responseDataLoc = await responseDataUrl(responseData.location_area_encounters);
      res.json({data: responseDataLoc, isCached: false});
      CACHE_LOC[name] = JSON.stringify(responseDataLoc);
  }

});

app.get('/evolution/:nombre',  async function (req, res) {
  const name = req.params.nombre;
  let responseCadena = [];
  let responseEvolutionDet = [];
  try {
  const url = path+`${name}`;
  
  if (CACHE_EVO[name]) {
      res.json({data: JSON.parse(CACHE_EVO[name]), isCached: true });
  }else{

  let responseData = await responseDataUrl(url);

  let responseData_sp = await responseDataUrl(responseData.species.url);
  let responsesEvo = await responseDataUrl(responseData_sp.evolution_chain.url);
  let responseEnvolves = [responsesEvo.chain.evolves_to];

  let hname = responsesEvo.chain.species.name;
  const urlhevo = path+`${hname}`;
          
  let responseDataInfoh = await responseDataUrl(urlhevo);
  responseEvolutionDet.push({name: responseDataInfoh.name, apariencia: responseDataInfoh.sprites.front_default});
                      
      while (responseEnvolves[0] !== undefined && responseEnvolves[0].length !== 0) {
          responseCadena = responseEnvolves.shift();
          
      for (const [i] of responseCadena.entries()) {
          responseEnvolves.push(responseCadena[i].evolves_to);
  
              let xname = responseCadena[i].species.name;
              const urlevo = path+`${xname}`;
              
              let responseDataInfo = await responseDataUrl(urlevo);
              responseEvolutionDet.push({name: responseDataInfo.name, apariencia: responseDataInfo.sprites.front_default});
      
      }
      }

      res.json({data: responseEvolutionDet, isCached: false});
      CACHE_EVO[name] = JSON.stringify(responseEvolutionDet);
 }

      
} catch {
  
     res.json({data: 'InvalidPokemon'});
}

});

async function responseDataUrl(url) {
  try {
    const { data } = await axios.get(url);
    response = data;
  } catch {
    response = 'InvalidPokemon';
  }
  return response;
}

app.listen(PORT, () => {
    console.log(`Running on port ${PORT}...`);
  });