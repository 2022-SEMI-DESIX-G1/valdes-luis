((Utils) => {
    const App = {      
        htmlElements: {
          documentDOM: document,
          responsePost: document.querySelector("#responsePost"),
          role: sessionStorage.getItem("role"),
          dataPedidos: [],
      },
      init: () => {
        if (App.htmlElements.role === "ADMINISTRADOR") {
          App.htmlElements.documentDOM.addEventListener(
            "DOMContentLoaded",
            App.handlers.renderPedidos
          );
      } else {
          App.htmlElements.documentDOM.addEventListener(
              "DOMContentLoaded",
              App.handlers.renderNotLogged
          );
        }
      },
      handlers: {
        renderNotLogged: async (e) => {
          e.preventDefault();
          const renderedTemplateNotLoggedOn = App.templates.notLoggedCard();
          App.htmlElements.mainDOM.innerHTML = renderedTemplateNotLoggedOn;
        },
        renderPedidos: async (e) => {
          e.preventDefault();
          const response = await Utils.getPedidos(); 
          App.htmlElements.dataPedidos = response;
          const success = response.data.ok;
          if (success === true){
            const renderedTemplateSuccess = App.templates.successCard();
            App.htmlElements.responsePost.innerHTML = renderedTemplateSuccess;
          }else{
            const renderedTemplateError = App.templates.errorCard();
            App.htmlElements.responsePost.innerHTML = renderedTemplateError;
          } 
        },
      },
      templates: {
        successCard: () => {
                let celdas =  ``;
                let det_art =  ``;
                let responseDataPedidos = App.htmlElements.dataPedidos
                let response = responseDataPedidos.data.pedidos;
                for (i = 0; i < response.length; i++) {
                    det_art =  ``;
                    for (j = 0; j < response[i].articulos.length; j++) {
                        det_art += `<tr>
                                    ${`<td>${response[i].articulos[j].codigo}</td>`} 
                                    ${`<td>${response[i].articulos[j].cantidad}</td>`} 
                                    ${`<td>${response[i].articulos[j].precio}</td>`} 
                                    ${`<td>${response[i].articulos[j].precio_oferta}</td>`} 
                                    </tr>`;
                    }
                    let cont_art =  `<tr>
                                        <tr class="table-active text-white bg-dark  font-weight-bold">
                                          <td>Codigo</td>
                                          <td>Cantidad</td>
                                          <td>Precio</td>
                                          <td>Precio Oferta</td>
                                        </tr>
                                        ${det_art} 
                                    </tr>`;
                    celdas += `<tr class="table-active font-weight-bold">
                                  ${`<td class="font-weight-bold">${response[i].pedido}</td>`} 
                                  ${`<td class="font-weight-bold">${response[i].email}</td>`} 
                                  ${`<td class="font-weight-bold">${response[i].fecha}</td>`} 
                                  ${`<td class="font-weight-bold">${response[i].metodo_envio}</td>`}
                                  ${`<td class="font-weight-bold">${response[i].metodo_pago}</td>`}
                                  ${`<td class="font-weight-bold">${response[i].subtotal}</td>`} 
                                  ${`<td class="font-weight-bold">${response[i].flete}</td>`} 
                                  ${`<td class="font-weight-bold">${response[i].itbm}</td>`} 
                                  ${`<td class="font-weight-bold">${response[i].total}</td>`} 
                              </tr> ${cont_art}`;
                }
                let contenido_tabla =  `<thead>
                                        <tr class="table-active text-white bg-dark font-weight-bold">
                                          <th>Pedido</th>
                                          <th>Cliente</th>
                                          <th>Fecha</th>
                                          <th>Metodo Envio</th>
                                          <th>Metodo Pago</th>
                                          <th>SubTotal</th>
                                          <th>Flete</th>
                                          <th>Itbm</th>
                                          <th>Total</th>
                                        </tr>
                                        ${celdas} 
                                    </thead>`;
                let tarjeta = `<div class="container">
                                  <H4>Detalle de Pedidos</H4>
                                  <div class="d-flex justify-content-center align-items-center">
                                      <table class="table table-sm table-bordered">
                                          ${contenido_tabla}
                                      </table>
                                  </div>
                              </div>`;
                return tarjeta;
        },
        errorCard: () => console.log("no trae los pedidos"),
        notLoggedCard: () => `<div class="container">
                                <div class="d-flex justify-content-center align-items-center" style="height: 100vh">
                                    <div class="text-center">
                                        <img class="mb-4" src="../assets/img/page/logo.png" style="width: 250px; height: 200px"/>
                                        <h5 class="mb-3">Acceso restringido</h5>
                                        <p class="mb-3">Solo usuarios que sean administradores</p>
                                        <a class="btn btn-warning btn-lg" href="../index.html" role="button">Regresar a Inicio</a>
                                    </div>
                                </div>
                            </div>`
      },
    };
    App.init();
  })(document.Utils);