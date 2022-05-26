// Set config defaults when creating the instance
const axios = require("axios").default
var pokemon_api = axios.create({
    baseURL: 'https://pokeapi.co/api/v2/pokemon/'
  });

var prompt = require('prompt');
prompt.start();
prompt.get(['Nombre'], function (err, result) {
    
  pokemon_api.get(result.Nombre)
    .then(function (response) { 
        
        var speciesPokemon = axios.create({
            baseURL: response.data.species.url
          });

          speciesPokemon.get()
            .then(function (responsesPok) { 
                
                var evolutionPokemon = axios.create({
                    baseURL: responsesPok.data.evolution_chain.url
                });

                    evolutionPokemon.get()
                        .then(function (responsesEvo) { 
                            
                            let responseCadena = [];
                            let responseEvolution  = [[responsesEvo.data.chain.species.name]];
                            let responseEnvolves = [responsesEvo.data.chain.evolves_to];
                        
                            while (responseEnvolves[0] !== undefined && responseEnvolves[0].length !== 0) {
                                responseCadena = responseEnvolves.shift();
                                
                            for (const [i] of responseCadena.entries()) {
                                responseEvolution.push(responseCadena[i].species.name);
                                responseEnvolves.push(responseCadena[i].evolves_to);
                            }
                            }
                            console.log(`Evoluciones: ${responseEvolution}`);
                        })
            })

      console.log(`Id: ${response.data.id}, Nombre: ${response.data.name}, Weight: ${response.data.weight}, Height: ${response.data.height}, Habilidades: ${response.data.abilities.map((ability) => {return `${ability.ability.name}, `;}).join("")}`);
    })
    .catch(function(error) {
      if(error.response) {
        console.log("Request was made and server responded with a non 200 status");
        console.log(error.response.data);
        console.log(error.response.status);
        console.log(error.response.headers);
        
      }
      else if (error.request) {
        console.log("Request was made, but no response was received");
        console.log(error.request);
      }
      else {
        console.log("Something happened setting up the request");
        console.log(error.message);      
      }    
  })
});