((Utils) => {
    const App = {
        htmlElements: {
            documentDOM: document,
            cart: [],
            dataInfo: [],
            dataYappy: [],
            articulos: [],
            coin: '$',
            hvalueShipping: 0,
            hnameShipping: "",
            buttonDOM: document.querySelector('#button'),
            cartDOM: document.querySelector('#infoCart'),
            shippingDOM: document.querySelector('#infoShipping'),
            nameDOM: document.querySelector('#name'),
            emailDOM: document.querySelector('#email'),
            addressDOM: document.querySelector('#address'),
            phoneDOM: document.querySelector('#phone'),
            quantityDOM: document.querySelector('#cantidad'),
            priceDOM: document.querySelector('#precio'),
            subtotalDOM: document.querySelector('#subtotal'),
            itbmsDOM: document.querySelector('#itbms'),
            totalDOM: document.querySelector('#total'),
            mainDOM: document.querySelector('#main'),
            infoDOM: document.querySelector('#info-user'),
            sectionDOM: document.querySelector('#allContent'),
            buttonNormalDOM: document.querySelector('#btnSubmit'),
            session: sessionStorage.getItem("userLogin"),
            varLocalStorage: window.localStorage,
        },
        init: () => {
            if (App.htmlElements.session) {
                App.htmlElements.buttonNormalDOM.addEventListener(
                    "click",
                    App.handlers.AddOrder
                );
                App.htmlElements.documentDOM.addEventListener(
                    "DOMContentLoaded",
                    App.handlers.renderProducts,
                );
                App.htmlElements.documentDOM.addEventListener(
                    "DOMContentLoaded",
                    App.handlers.renderInfo
                );
                App.htmlElements.documentDOM.addEventListener('input', (e) => {
                    "DOMContentLoaded"
                    if(e.target.getAttribute('name')=="payment") {
                        sessionStorage.setItem("metodoPago", e.target.value);
                        if(e.target.value == "Yappy"){
                            App.htmlElements.buttonNormalDOM.style.display = "none";
                            App.handlers.renderButtonYappy();
                            
                        }else {
                            App.handlers.renderButtonNormal(),
                            App.htmlElements.buttonNormalDOM.style.display = "block";
                        }
                    }
                });
                App.htmlElements.documentDOM.addEventListener('input', (e) => {
                    "DOMContentLoaded"
                    if(e.target.getAttribute('name')=="shipping") {
                        let nameShipping;
                        let valueShipping;
                        if (e.target.value == "Retiro en local"){
                            nameShipping = e.target.value;
                            valueShipping = 0.00;
                            App.htmlElements.hvalueShipping = valueShipping;
                            App.htmlElements.hnameShipping = nameShipping;
                            App.handlers.renderShipping();
                            App.handlers.calculateSubtotalPlusShipping();
                        } else if (e.target.value == "Delivery a Ciudad de Panamá") {
                            nameShipping = e.target.value;
                            valueShipping = 3.00;
                            App.htmlElements.hvalueShipping = valueShipping;
                            App.htmlElements.hnameShipping = nameShipping;
                            App.handlers.renderShipping();
                            App.handlers.calculateSubtotalPlusShipping();
                        } else if (e.target.value == "Delivery al interior del país") {
                            nameShipping = e.target.value;
                            valueShipping = 7.50;
                            App.htmlElements.hvalueShipping = valueShipping;
                            App.htmlElements.hnameShipping = nameShipping;
                            App.handlers.renderShipping();
                            App.handlers.calculateSubtotalPlusShipping();
                        }
                    }
                    App.handlers.renderProducts();
                });
            } else {
                App.htmlElements.documentDOM.addEventListener(
                    "DOMContentLoaded",
                    App.handlers.renderNotLogged
                );
            }
        },
        handlers: {
            numberOrder: async () => {
                var val = Math.floor(1000 + Math.random() * 9000);
                sessionStorage.setItem("numeroPedido", val);
                return val;
            },
            renderButtonNormal: async () => {
                await App.handlers.numberOrder();
                const renderTemplateButtonNormal = App.templates.buttonNormal();
                App.htmlElements.buttonDOM.innerHTML = renderTemplateButtonNormal;
            },
            renderButtonYappy: async () => {
                const paramYappy = {
                    ptotal: App.handlers.calculateTotal(),
                    psubtotal: App.handlers.calculateSubtotalPlusShipping(),
                    pshipping: 0,
                    pdiscount: 0,
                    ptaxes: App.handlers.calculateItbms(),
                    porderId: await App.handlers.numberOrder(),
                    ptelefono: "60000000"
                }
                const response = await Utils.getYappy({ paramYappy }); 
                App.htmlElements.dataYappy = response;
                const renderTemplateButtonYappy = App.templates.buttonYappy();
                App.htmlElements.buttonDOM.innerHTML = renderTemplateButtonYappy;
            },
            renderNotLogged: async (e) => {
                e.preventDefault();
                const renderedTemplateNotLoggedOn = App.templates.notLoggedCard();
                App.htmlElements.mainDOM.innerHTML = renderedTemplateNotLoggedOn;
                App.htmlElements.sectionDOM.style.display = "none";
            }, 
            renderInfo: async (e) => {
                e.preventDefault();
                const email = App.htmlElements.session;
                const response = await Utils.obtainUserInfo({ email }); 
                const success = response.data.ok;

                if (success === true){
                    App.htmlElements.nameDOM.value = response.data.usuario.nombre;
                    App.htmlElements.emailDOM.value = response.data.usuario.email;
                    App.htmlElements.addressDOM.value = response.data.usuario.direccion;
                    App.htmlElements.phoneDOM.value = response.data.usuario.telefono;
                } else {
                    console.log("ha ocurrido algún error");
                }
            },
            renderProducts: async () => {
                    const response = await Utils.getProductos();
                    let db = response;
                    App.htmlElements.dataInfo = db;
                    App.handlers.getCartDataLocalStorage();
                    App.handlers.renderCart();
                    App.handlers.renderShipping();
                    App.handlers.renderSubtotal();
                    App.handlers.renderItbms();
                    App.handlers.renderTotal();
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
                App.handlers.renderCart();
                localStorage.clear();
            },
            AddOrder: async (e) => {
                e.preventDefault();
                App.handlers.getCartDataLocalStorage();
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
                     App.htmlElements.articulos.push(articulo);
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
                                      articulos: App.htmlElements.articulos
                                    };
                const response = await Utils.postPedido({pedido,}); 
                const success = response.data.ok;
                if (success === true) {
                    App.handlers.clearCart();
                    window.location.href = "../index.html";
                } else {
                    console.log("No se ha borrado de su carrito");
                }
            },
            renderCart: () => {
                App.htmlElements.cartDOM.textContent = '';
                const cartWithoutDuplicate = [...new Set(App.htmlElements.cart)];
                let db = App.htmlElements.dataInfo;
                cartWithoutDuplicate.forEach((item) => {
                    const myItem = db.filter((itemBD) => {
                        return itemBD.codigo === item;
                    });
                    const numUnitItem = App.htmlElements.cart.reduce((total, itemId) => {
                        return itemId === item ? total += 1 : total;
                    }, 0);
                    const firstNode = document.createElement('li');
                    firstNode.classList.add('list-group-item', 'd-flex', 'justify-content-between', 'lh-sm');
                    const secondNode = document.createElement('div');
                    const thirdNode = document.createElement('h6');
                    thirdNode.classList.add('my-0');
                    thirdNode.setAttribute("id", "nombre");
                    thirdNode.textContent = myItem[0].nombre;
                    const fourNode = document.createElement('small');
                    fourNode.classList.add('text-muted');
                    fourNode.setAttribute("id", "precio");
                    fourNode.textContent = `x ${numUnitItem}`;
                    let priceTotal = (Math.round(myItem[0].precio_oferta * numUnitItem * 100) / 100).toFixed(2);
                    const fiveNode = document.createElement('span');
                    fiveNode.classList.add('text-muted');
                    fiveNode.setAttribute("id", "precio");
                    fiveNode.textContent = `${App.htmlElements.coin} ${priceTotal}`
                    firstNode.appendChild(secondNode);
                    secondNode.appendChild(thirdNode);
                    secondNode.appendChild(fourNode);
                    firstNode.appendChild(fiveNode);
                    App.htmlElements.cartDOM.appendChild(firstNode);
                });
            },
            renderShipping: () => {
                let valueShipping = App.htmlElements.hvalueShipping;
                let nameShipping = App.htmlElements.hnameShipping;
                let shippingPrice = (Math.round(valueShipping * 100) / 100).toFixed(2);
                const renderTemplateShipping = App.templates.templateShipping({ nameShipping, shippingPrice});
                App.htmlElements.shippingDOM.innerHTML = renderTemplateShipping;
                sessionStorage.setItem("metodoEnvio", nameShipping);
                sessionStorage.setItem("shippingPrice", shippingPrice);
            },
            renderSubtotal: () => {
                const renderTemplateSubtotal = App.templates.templateSubtotal();
                App.htmlElements.subtotalDOM.innerHTML = renderTemplateSubtotal;
                sessionStorage.setItem("subtotal", App.handlers.calculateSubtotalPlusShipping());
            },
            renderItbms: () => {
                const renderTemplateItbms = App.templates.templateItbms();
                App.htmlElements.itbmsDOM.innerHTML = renderTemplateItbms;
                sessionStorage.setItem("itbms", App.handlers.calculateItbms());
            },
            renderTotal: () => {
                const renderTemplateTotal = App.templates.templateTotal();
                App.htmlElements.totalDOM.innerHTML = renderTemplateTotal;
                sessionStorage.setItem("total", App.handlers.calculateTotal());
            },
            calculateSubtotal: () => {
                const db = App.htmlElements.dataInfo;
                return App.htmlElements.cart.reduce((subtotal, item) => {
                    const myItem = db.filter((itemBD) => {
                        return itemBD.codigo === item;
                    });
                    return subtotal + myItem[0].precio_oferta; 
                }, 0).toFixed(2);
            },
            calculateSubtotalPlusShipping: () => {
                return App.htmlElements.cart.reduce(() => {
                    return Number(App.handlers.calculateSubtotal()) + App.htmlElements.hvalueShipping;
                }, 0).toFixed(2);
            },
            calculateItbms: () => {
                return App.htmlElements.cart.reduce(() => {
                    return Number(App.handlers.calculateSubtotalPlusShipping()) * 0.07;
                }, 0).toFixed(2);
            },
            calculateTotal: () => {
                return App.htmlElements.cart.reduce(() => {
                    return Number(App.handlers.calculateSubtotalPlusShipping()) + Number(App.handlers.calculateItbms());
                }, 0).toFixed(2);
            },
            getCartDataLocalStorage: () => {
                if (App.htmlElements.varLocalStorage.getItem('cart') !== null) {
                    App.htmlElements.cart = JSON.parse(App.htmlElements.varLocalStorage.getItem('cart'));
                }
            },
        },
        templates: {
            templateCart: ({myItem, numUnitItem, priceTotal}) => `
                <div>
                    <h6 class="my-0" id="nombre">${myItem[0].nombre}</h6>
                    <small class="text-muted" id="cantidad">x ${numUnitItem}</small>
                </div>
                <span class="text-muted" id="precio">${App.htmlElements.coin} ${priceTotal}</span>
            `,
            templateShipping: ({nameShipping, shippingPrice}) => `
                <div class="text-success">
                    <h6 class="my-0">Método de envío</h6>
                    <small>${nameShipping}</small>
                </div>
                <span class="text-success">${App.htmlElements.coin} ${shippingPrice}</span>
            `,
            templateSubtotal: () => `
            <span>Subtotal</span>
            <strong>${App.htmlElements.coin} ${App.handlers.calculateSubtotalPlusShipping()}</strong>
            `,
            templateItbms: () => `
            <span>Itbms</span>
            <strong>${App.htmlElements.coin} ${App.handlers.calculateItbms()}</strong>
            `,
            templateTotal: () => `
            <span>Total</span>
            <strong>${App.htmlElements.coin} ${App.handlers.calculateTotal()}</strong>
            `,
            buttonNormal: () => ``,
            buttonYappy: () => {
                let responseDataYappy = App.htmlElements.dataYappy
                let url = responseDataYappy.data.url;
                let success = responseDataYappy.data.success;
                let container_buttons = "";
                if (success === true){
                container_buttons = `<div class="container">
                                <a href="${url}" id="link-yappy" class="yappy-logo">
                                <button class="ecommerce yappy blue" id="bg-payment" type="button">Pagar&nbsp;con&nbsp;<img src="https://pagosbg.bgeneral.com/assets/img/yappy-logo-brand.svg"/></button>
                                </a>
                               </div>`;
                } else {
                  container_buttons = "";
                }
                return `${container_buttons}`;
              },
            notLoggedCard: () => `
            <div class="container">
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
        }
    }
    App.init();
})(document.Utils);