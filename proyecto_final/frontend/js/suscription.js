((Utils) => {
    const App = {      
        htmlElements: {
        responseForm: document.querySelector("#response-form"),
        responsePost: document.querySelector("#responsepost"),
        inputEmail: document.querySelector("#email"),
        btnSubmit: document.querySelector("#btnSubmit"),
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
          const email = App.htmlElements.inputEmail.value;
          const suscriptor =     {
                                  email: email,
                              };
          const response = await Utils.postSuscripcion({ suscriptor,}); 
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
        successCard: () => `
        <div class='alert alert-success alert-dismissible fade show' role='alert'>
            Gracias por registrarte en nuestro boletín. Pronto recibirás promociones y ofertas. 
            <button type="button" class="close" data-dismiss="alert" aria-label="Close">
                <span aria-hidden="true">&times;</span>
            </button> 
        </div>`,
        errorCard: () => `
        <div class='alert alert-danger alert-dismissible fade show' role='alert'>
            Este correo ya está suscrito a nuestro boletín.  
            <button type="button" class="close" data-dismiss="alert" aria-label="Close">
                <span aria-hidden="true">&times;</span>
            </button>
        </div>`,
      },
    };
    App.init();
  })(document.Utils);