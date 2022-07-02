((Utils) => {
  const App = {
    htmlElements: {
      pokemonFinderForm: document.querySelector("#pokemon-finder-form"),
      btnSubmit: document.querySelector("#search"),
      btnclearForm: document.querySelector("#clean"),
      pokemonFinderInput: document.querySelector("#pokemon-finder-query"),
      pokemonFinderOutput: document.querySelector("#pokemon-finder-response"),
      pokemonCheckSprites: document.querySelector("#sprites"),
      pokemonCheckLocations: document.querySelector("#locations"),
      pokemonCheckEvolutions: document.querySelector("#evolutions"),
      cadena: [],
      locations: [],
    },
    init: () => {
      App.htmlElements.btnSubmit.addEventListener(
        "click",
        App.handlers.pokemonFinderFormOnSubmit
      );

      App.htmlElements.btnclearForm.addEventListener(
        "click", 
        App.handlers.clearForm
      );

    },
    handlers: {
      pokemonFinderFormOnSubmit: async (e) => {
        e.preventDefault();
        App.htmlElements.pokemonFinderOutput.style.display = "block";
        const query = App.htmlElements.pokemonFinderInput.value;
      
        try {
          const response = await Utils.getPokemon({query,});
          const ValidPokemon = response.data;
          
                if(ValidPokemon == 'InvalidPokemon'){
                      const renderedTemplateError = App.templates.errorCard();
                      App.htmlElements.pokemonFinderOutput.innerHTML = renderedTemplateError;
                     
                }else{
                        const response_evo = await Utils.getEvolution({query,});
                        App.htmlElements.cadena = response_evo;
                        const response_loc = await Utils.getLocations({query,}); 
                        App.htmlElements.locations = response_loc;
                        
                      const renderedTemplate = App.templates.render({response,});
                      App.htmlElements.pokemonFinderOutput.innerHTML = renderedTemplate;
                }

        } catch (error) {
          const renderedTemplateError = App.templates.errorCard();
          App.htmlElements.pokemonFinderOutput.innerHTML = renderedTemplateError;
          
        }
      },
      clearForm: (e) => {
        e.preventDefault();
        App.htmlElements.pokemonFinderOutput.style.display = "none";
        App.htmlElements.pokemonFinderInput.value = "";
        const renderedTemplateBlank = App.templates.blankCard();
        App.htmlElements.pokemonFinderOutput.innerHTML = renderedTemplateBlank;
      },
    },
    templates: {
      render: ({response }) => {
        const renderMap = App.templates.pokemonCard
        return renderMap
          ? renderMap(response.data)
          : App.templates.errorCard();
      },
      errorCard: () => `<div class="container">
                        <div class="contents">
                              <p>
                                <h1>
                                  Invalid Pokemon.
                                </h1>
                              </p>
                        </div>
                      </div>`,
      blankCard: () => ``,
      pokemonCard: ({id, name, weight, height, sprites, abilities}) => {
        const pokevolution = App.htmlElements.cadena.data;
        const pokelocations = App.htmlElements.locations.data;

        let cell_location = '';
        let cell_chance = '';
        let cell_max_level = '';
        let cell_min_level = '';
        let cell_method_name = '';
        let cell_subtotal = '';
        let cell_total = '';
        let cell_version  = '';
  
        pokelocations.forEach(function(elemento) {
                      cell_location = `<tr><td colspan="5">${elemento.location_area.name}</td></tr>`;
                      let VersionDetails= elemento.version_details;
                      VersionDetails.forEach(function(elementoVd) {
                                cell_version = `<td>${elementoVd.version.name}</td>`;
                                let EncounterDetails = Object.keys(elementoVd.encounter_details); 
                                for(let i=0; i< EncounterDetails.length; i++){
                                  let EncDetailsIndex = EncounterDetails[i];
                                  let EncDetailsValue = elementoVd.encounter_details[EncDetailsIndex];
                                  if(EncDetailsValue) {
                                        cell_chance = `<td>${EncDetailsValue.chance}</td>`;
                                        cell_max_level = `<td>${EncDetailsValue.max_level}</td>`;
                                        cell_min_level = `<td>${EncDetailsValue.min_level}</td>`;
                                    let MethodName= EncDetailsValue.method;
                                        
                                        cell_method_name = `<td>${MethodName.name}</td>`;
                                        cell_subtotal += `<tr>
                                                          ${cell_version} 
                                                           ${cell_chance} 
                                                           ${cell_max_level} 
                                                           ${cell_min_level}
                                                           ${cell_method_name} 
                                                        </tr>`;
                                  }
                                }
                    })

                    cell_total +=  `<tr>${cell_location} 
                                          <tr>
                                          <td>Version</td>
                                          <td>Chance</td>
                                          <td>Max Level</td>
                                          <td>Min Level</td>
                                          <td>Method Name</td>
                                        </tr>
                                        ${cell_subtotal} 
                                    </tr>`;
                    cell_subtotal = '';
         })
         

        let container_general = '';
        let container_sprites = '';
        let container_sprites_tmp = '';
        let container_evolutions = '';
        let container_locations = '';

        let CheckedSprites = App.htmlElements.pokemonCheckSprites.checked;
        let CheckedLocations = App.htmlElements.pokemonCheckLocations.checked;
        let CheckedEvolutions = App.htmlElements.pokemonCheckEvolutions.checked;

        let claves = Object.keys(sprites); 
        for(let i=0; i< claves.length - 2; i++){
          let clave = claves[i];
          let valor = sprites[clave];
          if(valor) {
            container_sprites_tmp += `<div class="contents">
                                        <h3>${clave}
                                          <img src="${valor}" width='100px' height='100px'  alt="" />
                                        </h3>
                                      </div>`;
          }
        }
            
           if(CheckedSprites){
                container_sprites = `<div class="container">
                                    <h2>Sprites</h2>
                                          ${container_sprites_tmp}
                                    </div>`;
           }else{
                container_sprites = ``;
           }

          if(CheckedEvolutions){
                container_evolutions = `<div class="container">
                                        <h2>Evolutions</h2>
                                        ${pokevolution.map((elemento) => {return `<div class="contents"><h3>${elemento.name}<img src="${elemento.apariencia}"  width='100px' height='100px' alt="" /></h3></div>`;}).join("")}
                                        </div>`;
            }else{
                container_evolutions = ``;
            }

            if(CheckedLocations){

                  container_locations = `<div class="container">
                                          <h2>Locations</h2>
                                          <div class="contents_tabla">
                                          <table>
                                          ${cell_total}
                                          </table>
                                          </div>
                                          </div>`;
          }else{
                container_locations = ``;
          }

          container_general = `<div class="container">
                                  <h2>General Information</h2>
                                  <div>
                                  <img src="${sprites.front_default}" width='150px' height='150px' alt="" />
                                  <img src="${sprites.back_default}" width='150px' height='150px' alt="" />
                                  </div>
                                  <div class="contents_header">
                                  <h2>${name} (${id})</h2>
                                  </div>
                                  <div class="contents_header">
                                    <h2>weight/height:&nbsp</h2>
                                    <h3> ${weight}/${height}</h3>
                                  </div>
                                  <div class="contents_header">
                                    <h2>Abilities:&nbsp</h2>
                                    <h3>
                                       ${abilities.map((ability) => {return `<p>${ability.ability.name}</p>`;}).join("")}
                                    </h3>
                                  </div></div>`;

        return `${container_general}${container_sprites}${container_evolutions}${container_locations}`;
      },
    },
  };
  App.init();
})(document.Utils);