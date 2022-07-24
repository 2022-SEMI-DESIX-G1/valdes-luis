
((Utils) => {
    const App = {      
        htmlElements: {
          documentDOM: document,
          mainDOM: document.querySelector('#main'),
          responseForm: document.querySelector("#response-form"),
          responsePost: document.querySelector("#responsepost"),
          inputCodigo: document.querySelector("#codigo"),
          inputNombre: document.querySelector("#nombre"),
          inputDescripcion: document.querySelector("#descripcion"),
          inputEmpaque: document.querySelector("#empaque"),
          inputPrecio: document.querySelector("#precio"),
          inputPrecioOferta: document.querySelector("#precio_oferta"),
          inputCategoria: document.querySelector("#categoria"),
          inputMarca: document.querySelector("#marca"),
          inputInventario: document.querySelector("#inventario"),
          inputImagen: document.querySelector("#imagen"),
          btnSubmit: document.querySelector("#crear"),
          role: sessionStorage.getItem("role"),
      },
      init: () => {
        if (App.htmlElements.role === "ADMINISTRADOR") {
          App.htmlElements.btnSubmit.addEventListener(
            "click",
            App.handlers.FormOnSubmit
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
        FormOnSubmit: async (e) => {
          e.preventDefault();

          const codigo = App.htmlElements.inputCodigo.value;
          const nombre = App.htmlElements.inputNombre.value;
          const descripcion = App.htmlElements.inputDescripcion.value;
          const empaque = App.htmlElements.inputEmpaque.value;
          const precio = App.htmlElements.inputPrecio.value;
          const precio_oferta = App.htmlElements.inputPrecioOferta.value;
          const categoria = App.htmlElements.inputCategoria.value;
          const marca = App.htmlElements.inputMarca.value;
          const inventario = App.htmlElements.inputInventario.value;
          const imagen = App.htmlElements.inputImagen;
          
          if (imagen.files.length === 0) {
            alert('Debes rellenar todos los campos');
            return
        }

        let file = imagen.files[0];

        let formData = new FormData();
        formData.set('file', file);

        const responsefile = await Utils.postFile({formData,});
        const successfile = responsefile.data.ok;
        const filename = responsefile.data.filename;
                
        if (successfile === true){
                const producto =     {
                                        codigo: codigo,
                                        nombre: nombre,
                                        descripcion: descripcion,
                                        empaque: empaque,
                                        precio: precio,
                                        precio_oferta: precio_oferta,
                                        categoria: categoria,
                                        marca: marca,
                                        inventario: inventario,
                                        imagen: filename
                                    };
                const response = await Utils.postProducto({producto,}); 
                const renderedTemplateSuccess = App.templates.successCard();
                App.htmlElements.responsePost.innerHTML = renderedTemplateSuccess;
          }else{
            const renderedTemplateError = App.templates.errorCard();
            App.htmlElements.responsePost.innerHTML = renderedTemplateError;
          }

          App.htmlElements.responseForm.reset();
          
        },
      },
      templates: {
        successCard: () => `<div class='alert alert-success alert-dismissible fade show' role='alert'>
                              Producto subido exitosamente. 
                              <button type="button" class="close" data-dismiss="alert" aria-label="Close">
                                <span aria-hidden="true">&times;</span>
                              </button> 
                            </div>`,
        errorCard: () => `<div class='alert alert-danger alert-dismissible fade show' role='alert'>
                            Ya existe un producto con este código.
                            <button type="button" class="close" data-dismiss="alert" aria-label="Close">
                              <span aria-hidden="true">&times;</span>
                            </button> 
                          </div`,
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