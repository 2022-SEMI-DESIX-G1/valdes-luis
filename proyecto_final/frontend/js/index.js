((Utils) => {
    const App = {      
        htmlElements: {
        responseForm: document.querySelector("#response-form"),
        responsePost: document.querySelector("#responsepost"),
        InputNombre: document.querySelector("#nombre"),
        InputTelefono: document.querySelector("#telefono"),
        InputDireccion: document.querySelector("#direccion"),
        InputEmail: document.querySelector("#email"),
        InputPassword: document.querySelector("#password"),
        btnSubmit: document.querySelector("#signup"),
      },
      init: () => {
        App.htmlElements.btnSubmit.addEventListener(
          "click",
          App.handlers.FormOnSubmit
        );
      },
      handlers: {
        FormOnSubmit: async (e) => {
          e.preventDefault();
          const nombre = App.htmlElements.InputNombre.value;
          const telefono = App.htmlElements.InputTelefono.value;
          const direccion = App.htmlElements.InputDireccion.value;
          const email = App.htmlElements.InputEmail.value;
          const password = App.htmlElements.InputPassword.value;
          const usuario =     {
                                  nombre: nombre,
                                  telefono: telefono,
                                  direccion: direccion,
                                  email: email,
                                  password: password,
                                  role: 'CLIENTES'
                              };
          const response = await Utils.postUsuario({usuario,}); 
          const success = response.data.ok;
          if (success === true){
            const renderedTemplateSuccess = App.templates.successCard();
            App.htmlElements.responsePost.innerHTML = renderedTemplateSuccess;
            App.htmlElements.responseForm.reset();
          }else{
            const renderedTemplateError = App.templates.errorCard();
            App.htmlElements.responsePost.innerHTML = renderedTemplateError;
          }
        },
      },
      templates: {
        successCard: () => `<div class='alert alert-success' role='alert'>
                              Su usuario ha sido creado exitosamente. Favor <a href="../login.html">inicia sesión</a>.  
                            </div>`,
        errorCard: () => `<div class='alert alert-danger' role='alert'>
                            Este correo ya existe favor coloca otro.  
                          </div>`,
      },
    };
    App.init();
  })(document.Utils);