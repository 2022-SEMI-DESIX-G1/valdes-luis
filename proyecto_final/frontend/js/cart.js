((Utils) => {
    const App = {
        htmlElements: {
            documentDOM: document,
            cart: [],
            dataInfo: [],
            coin: '$',
            cartDOM: document.querySelector('#cart'),
            subtotalDOM: document.querySelector('#subtotal'),
            itbmsDOM: document.querySelector('#itbms'),
            totalDOM: document.querySelector('#total'),
            clearDOM: document.querySelector('#clear'),
            mainDOM: document.querySelector('#main'),
            sectionDOM: document.querySelector('#allContent'),
            session: sessionStorage.getItem("userLogin"),
            role: sessionStorage.getItem("role"),
            varLocalStorage: window.localStorage,
        },
        init: () => {
            if (App.htmlElements.session) {
                App.htmlElements.documentDOM.addEventListener(
                    "DOMContentLoaded",
                    App.handlers.renderProducts
                );
            } else {
                App.htmlElements.documentDOM.addEventListener(
                    "DOMContentLoaded",
                    App.handlers.renderNotLogged
                );
            }
            App.htmlElements.clearDOM.addEventListener(
                "click",
                App.handlers.clearCart
            );
        },
        handlers: {
            renderProducts: async (e) => {
                e.preventDefault();
                const response = await Utils.getProductos();
                let db = response;
                App.htmlElements.dataInfo = db;
                App.handlers.getCartDataLocalStorage();
                App.handlers.renderCart();
            }, 
            renderNotLogged: async (e) => {
                e.preventDefault();
                const renderedTemplateNotLoggedOn = App.templates.notLoggedCard();
                App.htmlElements.mainDOM.innerHTML = renderedTemplateNotLoggedOn;
                App.htmlElements.sectionDOM.style.display = "none";
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
                const firstNode = document.createElement('tr');
                const secondNode = document.createElement('td');
                const thirdNode = document.createElement('div');
                thirdNode.classList.add('row');
                const fourNode = document.createElement('div');
                fourNode.classList.add('col-md-3', 'text-left');
                const fiveNodeImg = document.createElement('img');
                fiveNodeImg.classList.add('img-fluid', 'd-none', 'd-md-block', 'rounded', 'mb-2', 'shadow');
                const image = `../assets/img/products/${myItem[0].imagen}`
                fiveNodeImg.setAttribute('src', image);
                const sixNode = document.createElement('div');
                sixNode.classList.add('col-md-9', 'text-left', 'mt-sm-2');
                const sevenNodeTitle = document.createElement('h4');
                sevenNodeTitle.textContent = myItem[0].nombre;
                const eightNodeSKU = document.createElement('p');
                eightNodeSKU.classList.add('font-weight-light');
                eightNodeSKU.textContent = `SKU: ${myItem[0].codigo}`;
                // Price Updated & Quantity
                let priceCart = (Math.round(myItem[0].precio_oferta * 100) / 100).toFixed(2);
                let priceTotal = (Math.round(myItem[0].precio_oferta * numUnitItem * 100) / 100).toFixed(2);
                const nineNodePrice = document.createElement('td');
                nineNodePrice.textContent = priceCart;
                const tenNodeQuantity = document.createElement('td');
                const elevenNodeInputQuantity = document.createElement('p');  
                elevenNodeInputQuantity.setAttribute("type", "number");
                elevenNodeInputQuantity.classList.add('form-control', 'form-control-lg', 'text-center');
                elevenNodeInputQuantity.textContent = numUnitItem;
                const nodePriceTotal = document.createElement('td');
                nodePriceTotal.textContent = priceTotal;
                const twelveNode = document.createElement('td');
                twelveNode.classList.add('actions');
                const thirtheenNode = document.createElement('div');
                thirtheenNode.classList.add('text-right');
                const fourtheenNodeBtnUpdate = document.createElement('button');
                fourtheenNodeBtnUpdate.classList.add('btn', 'btn-white', 'border-secondary', 'bg-white', 'btn-md', 'mb-2');
                /*const fivetheenNodeIcon = document.createElement('i');
                fivetheenNodeIcon.classList.add('fas', 'fa-sync');*/
                const sixteenNodeBtnDelete = document.createElement('button');
                sixteenNodeBtnDelete.classList.add('fas', 'fa-trash','btn', 'btn-white', 'border-secondary', 'bg-white', 'btn-md', 'mb-2');
                sixteenNodeBtnDelete.style.marginLeft = '1rem';
                sixteenNodeBtnDelete.dataset.item = item;
                sixteenNodeBtnDelete.addEventListener('click',  App.handlers.deleteCartItem);
                firstNode.appendChild(secondNode);
                secondNode.appendChild(thirdNode);
                thirdNode.appendChild(fourNode);
                fourNode.appendChild(fiveNodeImg);
                thirdNode.appendChild(sixNode);
                sixNode.appendChild(sevenNodeTitle);
                sixNode.appendChild(eightNodeSKU);
                firstNode.appendChild(nineNodePrice);
                firstNode.appendChild(tenNodeQuantity);
                tenNodeQuantity.appendChild(elevenNodeInputQuantity);
                firstNode.appendChild(nodePriceTotal);
                firstNode.appendChild(twelveNode);
                thirtheenNode.appendChild(sixteenNodeBtnDelete);
                twelveNode.appendChild(thirtheenNode);
                /*thirtheenNode.appendChild(fourtheenNodeBtnUpdate);
                fourtheenNodeBtnUpdate.appendChild(fivetheenNodeIcon);*/
                App.htmlElements.cartDOM.appendChild(firstNode);
            });
        App.htmlElements.subtotalDOM.textContent = App.handlers.calculateSubtotal();
        App.htmlElements.itbmsDOM.textContent = App.handlers.calculateItbms();
        App.htmlElements.totalDOM.textContent = App.handlers.calculateTotal();
        },
        deleteCartItem: async (e) => {
            e.preventDefault();
            const id = e.target.dataset.item;
            App.htmlElements.cart = App.htmlElements.cart.filter(function (cartId) {
                return cartId !== id;
            });
            App.handlers.saveCartInLocalStorage();
            App.handlers.renderCart();
            App.handlers.getCartDataLocalStorage();
        },
        saveCartInLocalStorage: () => {
            App.htmlElements.varLocalStorage.setItem('cart', JSON.stringify(App.htmlElements.cart));
        },
        getCartDataLocalStorage: () => {
            if (App.htmlElements.varLocalStorage.getItem('cart') !== null) {
                App.htmlElements.cart = JSON.parse(App.htmlElements.varLocalStorage.getItem('cart'));
            }
        },
        clearCart: () => {
            App.htmlElements.cart = [];
            App.handlers.renderCart();
            localStorage.clear();
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
        calculateItbms: () => {
            return App.htmlElements.cart.reduce(() => {
                return Number(App.handlers.calculateSubtotal()) * 0.07;
            }, 0).toFixed(2);
        },
        calculateTotal: () => {
            return App.htmlElements.cart.reduce(() => {
                return Number(App.handlers.calculateSubtotal()) + Number(App.handlers.calculateItbms());
            }, 0).toFixed(2);
        },
    },
    templates: {
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