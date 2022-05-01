((Utils) => {
    const App = {
        htmlElements: {
            form: document.querySelector('#fibonacci'),
            input: document.querySelector('#size'),
            response: document.querySelector('#response')
        },
        init: () => {
            App.htmlElements.form.addEventListener('submit', App.handlers.onFormSubmit);
            App.htmlElements.response.addEventListener('click', App.handlers.onCardClick);
        },
        utils: {
            ...Utils.methods,
        },
        templates: {
            card: (n) => {
                return `<div class="card">${n}</div>`;
            }
        },
        handlers: {
            onCardClick: (e) => {
                if(e.target.className === 'card') {
                    var mensaje;
                    var opcion = confirm("Desea eliminar la tarjeta seleccionada.");
                    if (opcion == true) {
                        e.target.remove();
                        mensaje = "Has eliminado correctamente la tarjeta.";
                    } else {
                        mensaje = "Has decidido Cancelar la accion.";
                    }
                    document.getElementById("Confirmacion").innerHTML = mensaje;
                }
            },
            onFormSubmit: (e) => {
                e.preventDefault();

                App.htmlElements.response.innerHTML = '';

                const n = App.htmlElements.input.value;
                App.utils.fibonacci(n).forEach(value => {
                    App.htmlElements.response.innerHTML += App.templates.card(value);
                });
            }
        }
    };
    App.init();
})(document.Utils);