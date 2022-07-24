((Utils) => {
    const App = {      
        htmlElements: {
        responseForm: document.querySelector("#response-form"),
        responsePost: document.querySelector("#responsepost"),
        InputEmail: document.querySelector("#email"),
        InputPassword: document.querySelector("#password"),
        btnSubmit: document.querySelector("#signin"),
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
          const email = App.htmlElements.InputEmail.value;
          const password = App.htmlElements.InputPassword.value;
          const usuario =     {
                                  email: email,
                                  password: password,
                              };
          const response = await Utils.postUsuarioLogin({ usuario }); 
          const success = response.data.ok;
          if (success === true){
            sessionStorage.setItem("userLogin", email);
            sessionStorage.setItem("role", response.data.role);
            window.location.href = "../index.html";
          }else{
            const renderedTemplateError = App.templates.errorCard();
            App.htmlElements.responsePost.innerHTML = renderedTemplateError;
          }
          App.htmlElements.responseForm.reset();
        },
      },
      templates: {
        successCard: () => `<div class='alert alert-success' role='alert'>
                              Ha iniciado sesión correctamente. 
                            </div>`,             
        errorCard: () => `<div class='alert alert-danger' role='alert'>
                            Credenciales incorrectos.  
                          </div>`,
      },
    };
    App.init();
  })(document.Utils);