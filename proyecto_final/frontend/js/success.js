((Utils) => {
    const App = {      
        htmlElements: {
            documentDOM: document,
            responsePost: document.querySelector("#responsepost"),
            session: sessionStorage.getItem("userLogin"),
            cart: [],
            varLocalStorage: window.localStorage,
      },
      init: () => {
        if (App.htmlElements.session) {
            App.htmlElements.documentDOM.addEventListener(
                "DOMContentLoaded",
                App.handlers.AddOrder
            );
        } else {
            App.htmlElements.documentDOM.addEventListener(
                "DOMContentLoaded",
                App.handlers.renderNotLogged
            );
        }
      },
      handlers: {
        renderNotLogged: async () => {
            const renderedTemplateNotLoggedOn = App.templates.notLoggedCard();
            App.htmlElements.mainDOM.innerHTML = renderedTemplateNotLoggedOn;
        }, 
        dateOrder: async () => {
            let date = new Date();
            let dateFormat;
            let day = date.getDate()
            let month = date.getMonth() + 1
            let year = date.getFullYear()
            if(month < 10){
              dateFormat = `${day}/0${month}/${year}`;
            } else {
              dateFormat =`${day}/${month}/${year}`;
            }
            return dateFormat;
        },
        clearCart: () => {
            App.htmlElements.cart = [];
            localStorage.clear();
        },
        numberOrder: async () => {
            var val = Math.floor(1000 + Math.random() * 9000);
            return val;
        },
        AddOrder: async (e) => {
          e.preventDefault();
          App.handlers.getCartDataLocalStorage();
          const articulos = [];
          let i = 1;
          const db = await Utils.getProductos();
          const cartWithoutDuplicate = [...new Set(App.htmlElements.cart)];
          cartWithoutDuplicate.forEach((item) => {
              const myItem = db.filter((itemBD) => {
                  return itemBD.codigo === item;
              });
              const codigo  = myItem[0].codigo;
              const cantidad = App.htmlElements.cart.reduce((total, itemId) => {
                  return itemId === item ? total += 1 : total;
              }, 0);
              const precio = myItem[0].precio;
              const precio_oferta = myItem[0].precio_oferta;
              const articulo = {
                                codigo: codigo,
                                cantidad: cantidad,
                                precio: precio,
                                precio_oferta: precio_oferta,
                                linea: i
                              };
               articulos.push(articulo);
               i++; 
          });
          const pedido =     {
                                pedido: sessionStorage.getItem("numeroPedido"),
                                fecha:  await App.handlers.dateOrder(),
                                email: App.htmlElements.session,
                                metodo_pago: sessionStorage.getItem("metodoPago"),
                                metodo_envio: sessionStorage.getItem("metodoEnvio"),
                                subtotal: sessionStorage.getItem("subtotal"),
                                itbm: sessionStorage.getItem("itbms"),
                                flete: sessionStorage.getItem("shippingPrice"),
                                total: sessionStorage.getItem("total"),
                                articulos: articulos
                              };
          const response = await Utils.postPedido({pedido,}); 
          const success = response.data.ok;
          if (success === true){
            App.handlers.clearCart();
            const renderedTemplateSuccess = App.templates.successCard();
            App.htmlElements.responsePost.innerHTML = renderedTemplateSuccess;
          }else{
            console.log("No se ha borrado de su carrito");
            const renderedTemplateError = App.templates.errorCard();
            App.htmlElements.responsePost.innerHTML = renderedTemplateError;
          }
        },
        getCartDataLocalStorage: () => {
          if (App.htmlElements.varLocalStorage.getItem('cart') !== null) {
              App.htmlElements.cart = JSON.parse(App.htmlElements.varLocalStorage.getItem('cart'));
          }
        },
      },
      templates: {
        successCard: () => `<div class="container">
                                <div class="d-flex justify-content-center align-items-center" style="height: 100vh">
                                    <div class="text-center">
                                        <img class="mb-4" src="../assets/img/page/success.png" style="width: 250px; height: 200px"/>
                                        <h5 class="mb-3">Gracias por su compra.</h5>
                                        <p class="mb-3">Vuelva pronto, lo esperamos...</p>
                                        <a class="btn btn-warning btn-lg" href="../index.html" role="button">Inicio</a>
                                        <a class="btn btn-warning btn-lg" href="../product.html" role="button">Productos</a>
                                    </div>
                                </div>
                            </div>`,
        errorCard: () => `<div class="contenedor">
                            <div class="contenido">
                                  <p>
                                    <h5>
                                      El pedido ya existe.
                                    </h5>
                                  </p>
                            </div>
                          </div>`,
        notLoggedCard: () => `<div class="container">
                                <div class="d-flex justify-content-center align-items-center" style="height: 100vh">
                                    <div class="text-center">
                                        <img class="mb-4" src="../assets/img/page/logo.png" style="width: 250px; height: 200px"/>
                                        <h5 class="mb-3">Acceso restringido</h5>
                                        <p class="mb-3">Solo usuarios que hayan iniciado sesión</p>
                                        <a class="btn btn-warning btn-lg" href="../login.html" role="button">Iniciar sesión</a>
                                        <a class="btn btn-warning btn-lg" href="../register.html" role="button">Registrarse</a>
                                    </div>
                                </div>
                            </div>`
      },
    };
    App.init();
  })(document.Utils);