const connection = require('../bd/conections');
const { response } = require('express');
const cors = require("cors");
const axios = require("axios").default
const path = `https://pokeapi.co/api/v2/pokemon/`;


const getPokemon = async (req, res = response) => {

    const pname = req.params.name;
    const url = path+`${pname}`;
    let pokcollection = "pokemon";
    let infopokemon = await getData(pname, pokcollection);

          if(infopokemon){
            let datapokemon = await getDataAll(pname, pokcollection);
            res.json({data: datapokemon.responseData});

          }else{
            let responseData = await responseDataUrl(url);
            await insertData(pname, responseData, pokcollection);
            res.json({data: responseData});
          }

}

const getLocation = async (req, res = response) => {

    const lname = req.params.name;
    const url = path+`${lname}`;
    let loccollection = "location";
    let infolocpokemon = await getData(lname, loccollection);

          if(infolocpokemon){
                let datalocpokemon = await getDataAll(lname, loccollection);
                res.json({data: datalocpokemon.responseData});

          }else{
                let responseData = await responseDataUrl(url);
                let responseDataLoc = await responseDataUrl(responseData.location_area_encounters);
                await insertData(lname, responseDataLoc, loccollection);
                res.json({data: responseDataLoc});
          }
}

const getEvolution = async (req, res = response) => {

  const ename = req.params.name;
  let responseCadena = [];
  let responseEvolutionDet = [];
  try {
    
    const url = path+`${ename}`;
    let evocollection = "evolution";
    let infoevopokemon = await getData(ename, evocollection);

            if(infoevopokemon){
              let dataevopokemon = await getDataAll(ename, evocollection);
              res.json({data: dataevopokemon.responseData});
            }else{
              
                  let responseData = await responseDataUrl(url);
                
                  let responseData_sp = await responseDataUrl(responseData.species.url);
                  let responsesEvo = await responseDataUrl(responseData_sp.evolution_chain.url);
                  let responseEnvolves = [responsesEvo.chain.evolves_to]; 
                
                  let hname = responsesEvo.chain.species.name;
                  const urlhevo = path + `${hname}`;
                          
                  let responseDataInfoh = await responseDataUrl(urlhevo); 

                  responseEvolutionDet.push({name: responseDataInfoh.name, apariencia: responseDataInfoh.sprites.front_default});
                                      
                      while (responseEnvolves[0] !== undefined && responseEnvolves[0].length !== 0) {
                          responseCadena = responseEnvolves.shift();
                          
                      for (const [i] of responseCadena.entries()) {
                          responseEnvolves.push(responseCadena[i].evolves_to);
                  
                              let xname = responseCadena[i].species.name;
                              const urlevo = path + `${xname}`;
                              
                              let responseDataInfo = await responseDataUrl(urlevo);
                              responseEvolutionDet.push({name: responseDataInfo.name, apariencia: responseDataInfo.sprites.front_default});
                      
                      }
                      }
                      await insertData(ename, responseEvolutionDet , evocollection);
                      res.json({data: responseEvolutionDet});
      }   
  } catch {
    
       res.json({data: 'InvalidPokemon'});
  }
}

async function responseDataUrl(url) {
    try {
      const { data } = await axios.get(url);
      infopokemon = data;
    } catch {
        infopokemon = 'InvalidPokemon';
    }
    return infopokemon;
  }

async function insertData( xname, responseData, collection) {
          const db = await connection(); 
          let insertpokemon = "";
          let pokinsert = await db.collection(collection).insertOne({ name: xname, responseData });
          if(pokinsert ){
            insertpokemon = true;
          }else{
            insertpokemon = false;
          }
          return(insertpokemon);

  }

  async function getData(xname, collection) {

          const db = await connection();
          let pokvalue = await db.collection(collection).findOne({ name: xname });
          return(pokvalue);
  }

  async function getDataAll(xname, xcollection) {

    const db = await connection(); 
    let pokvalue = await db.collection(xcollection).findOne({ name: xname });
    return(pokvalue);
}

module.exports = {
    getPokemon,
    getLocation,
    getEvolution
}