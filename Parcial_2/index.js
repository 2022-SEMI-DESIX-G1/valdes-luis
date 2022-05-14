((Utils) => {
  const App = {
    htmlElements: {
      pokemonFinderForm: document.querySelector("#pokemon-finder-form"),
      btnSubmit: document.querySelector("#buscar"),
      btnclearForm: document.querySelector("#clear"),
      pokemonFinderSearchType: document.querySelector(
        "#pokemon-finder-search-type"
      ),
      pokemonFinderInput: document.querySelector("#pokemon-finder-query"),
      pokemonFinderOutput: document.querySelector("#pokemon-finder-response"),
      cadena: [],
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
        const searchType = App.htmlElements.pokemonFinderSearchType.value;
        console.log({ searchType });
        try {
          const response = await Utils.getPokemon({
            query,
            searchType,
          });

          if( searchType === 'pokemon'){
              const speciesPokemon = await Utils.getEvolution(response.species.url);
              const evolutionPokemon = await Utils.getEvolution(speciesPokemon.evolution_chain.url);
              App.htmlElements.cadena = App.pokemonevolution.getPokEvolutionResponse(evolutionPokemon);
          }
          const renderedTemplate = App.templates.render({
            searchType,
            response,
          });
          
        App.htmlElements.pokemonFinderOutput.innerHTML = renderedTemplate;

        } catch (error) {
          const renderedTemplateError = App.templates.errorCard();
          App.htmlElements.pokemonFinderOutput.innerHTML = renderedTemplateError;
        }
      },
      clearForm: (e) => {
        e.preventDefault();
        App.htmlElements.pokemonFinderOutput.style.display = "none";
        App.htmlElements.pokemonFinderInput.value = "";
        App.htmlElements.pokemonFinderSearchType.value = "";
      },
    },
    pokemonevolution: {
      getPokEvolutionResponse: (evolutionPokemon) => {

         let responseCadena = [];
         let responseEvolution  = [[evolutionPokemon.chain.species.name]];
         let responseEnvolves = [evolutionPokemon.chain.evolves_to];
     
         while (responseEnvolves[0] !== undefined && responseEnvolves[0].length !== 0) {
               responseCadena = responseEnvolves.shift();
              
          for (const [i] of responseCadena.entries()) {
            responseEvolution.push(responseCadena[i].species.name);
            responseEnvolves.push(responseCadena[i].evolves_to);
          }
         }

        return responseEvolution;
        
      },
    },
    templates: {
      render: ({ searchType, response }) => {
        const renderMap = {
          'ability': App.templates.abilityCard,
          'pokemon': App.templates.pokemonCard,
        };
        return renderMap[searchType]
          ? renderMap[searchType](response)
          : App.templates.errorCard();
      },
      errorCard: () => `<div class="prp_card">
                        <div class="pock_card">
                          <div>
                              <p>
                                <h1>
                                  No Existen Resultados para su busqueda.
                                </h1>
                              </p>
                          </div>
                        </div>
                      </div>`,
      pokemonCard: ({ id, name, weight, height, sprites, abilities}) => {
        const pokevolution = App.htmlElements.cadena;

        return `<div class="prp_card""><div class="pock_card">
                <div>
                  <p>
                    <h1>
                        ${name} (${id})
                    </h1>
                  </p>
                  <p>
                    <h2>Sprites</h2>
                  </p>
                    <img src="${sprites.front_default}" alt="" />
                    <img src="${sprites.back_default}" alt="" />
                  <p>
                    <h2>Evolution chain</h2>
                  </p>
                  <ul>
                    ${pokevolution.map((elemento) => {return `<li>${elemento}</li>`;}).join("")}
                  </ul>
                </div>
                <div>
                  <p>
                    <h2>weight/height</h2>
                  </p>
                  <p>
                    ${weight}/${height}
                  </p>
                  <p>
                    <h2>Abilities</h2>
                  </p>
                  <ul>
                    ${abilities.map((ability) => {return `<li>${ability.ability.name}</li>`;}).join("")}
                  </ul>
                  </div>
                  </div></div>`;
      },
      abilityCard: ({ id, name, pokemon }) => {
        console.log(pokemon);
        const pokemonList = pokemon.map(
          ({ pokemon, is_hidden }) =>
            `<li><a target="_blank" href="">${pokemon.name}${
              is_hidden ? App.htmlElements.hidden : ""
            }</a></li>`
        );

        return `<div class="prp_card">
                  <div class="pock_card">
                    <div>
                        <p>
                          <h1>
                              ${name} (${id})
                          </h1>
                        </p>
                        <ul>
                        ${pokemonList.join("")}
                      </ul>
                    </div>
                  </div>
                </div>`;
      },
    },
  };
  App.init();
})(document.Utils);