((Utils) => {
    const App = {      
        htmlElements: {
          documentDOM: document,
          mainDOM: document.querySelector('#main'),
          responseForm: document.querySelector("#response-form"),
          responsePost: document.querySelector("#responsepost"),
          InputNombre: document.querySelector("#nombre"),
          InputPassword: document.querySelector("#password"),
          InputEmail: document.querySelector("#email"),
          InputDireccion: document.querySelector("#direccion"),
          InputTelefono: document.querySelector("#telefono"),
          InputRole: document.querySelector("#role"),
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

          const nombre = App.htmlElements.InputNombre.value;
          const password = App.htmlElements.InputPassword.value;
          const email = App.htmlElements.InputEmail.value;
          const direccion = App.htmlElements.InputDireccion.value;
          const telefono = App.htmlElements.InputTelefono.value;
          const role = App.htmlElements.InputRole.value;
            
          const usuario =     {
                                  nombre: nombre,
                                  password: password,
                                  email: email,
                                  direccion: direccion,
                                  telefono: telefono,
                                  role: role,
                              };

          const response = await Utils.postUsuario({usuario,}); 

          const success = response.data.ok;

          if (success === true){
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
                              Su usuario se ha creado exitosamente.
                              <button type="button" class="close" data-dismiss="alert" aria-label="Close">
                                <span aria-hidden="true">&times;</span>
                              </button> 
                            </div`,
        errorCard: () => `<div class='alert alert-danger alert-dismissible fade show' role='alert'>
                            Este correo ya está registrado.
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