((Utils) => {
    const App = {
        htmlElements: {
        documentDOM: document,
        cart: [],
        dataInfo: [],
        coin: '$',
        productDOM: document.querySelector('#products'),
        productAddedDOM: document.querySelector('#product-added'),
        varLocalStorage: window.localStorage,
        session: sessionStorage.getItem("userLogin"),
        mainDOM: document.querySelector('#main'),
        sectionDOM: document.querySelector('#section'),
        navbarDOM: document.querySelector('#navbar'),
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
        },
        handlers: {
            renderNotLogged: async (e) => {
                e.preventDefault();
                const renderedTemplateNotLoggedOn = App.templates.notLoggedCard();
                App.htmlElements.mainDOM.innerHTML = renderedTemplateNotLoggedOn;
                App.htmlElements.sectionDOM.style.display = "none";
            }, 
            renderProducts: async (e) => {
                e.preventDefault();
                const product = await Utils.getProductos();
                product.forEach((info) => {
                    const nodeFirst = document.createElement('div');
                    nodeFirst.classList.add('row', 'justify-content-center', 'mb-3');
                    const nodeSecond = document.createElement('div');
                    nodeSecond.classList.add('col-md-12', 'col-xl-10');
                    const nodeThird = document.createElement('div');
                    nodeThird.classList.add('card', 'shadow-0', 'border', 'rounded-3');
                    const nodeFour = document.createElement('div');
                    nodeFour.classList.add('card-body');
                    const nodeFive = document.createElement('div');
                    nodeFive.classList.add('row');
                    // Image
                    const nodeDivImageFirst = document.createElement('div');
                    nodeDivImageFirst.classList.add('col-md-12', 'col-lg-3', 'col-xl-3', 'mb-4', 'mb-lg-0');
                    const nodeDivImageSecond = document.createElement('div');
                    nodeDivImageSecond.classList.add('bg-image', 'hover-zoom', 'ripple', 'rounded', 'ripple-surface', 'inner');
                    const imageProduct = document.createElement('img');
                    const image = `../assets/img/products/${info.imagen}`
                    imageProduct.setAttribute('src', image);
                    imageProduct.classList.add('w-100');
                    // Column Left
                    const nodeDivLeft = document.createElement('div');
                    nodeDivLeft.classList.add('col-md-6', 'col-lg-6', 'col-xl-6');
                    // Name
                    const nameProduct = document.createElement('h5');
                    nameProduct.textContent = info.nombre;
                    // SKU
                    const nodeDivSKU = document.createElement('div');
                    nodeDivSKU.classList.add('d-flex', 'flex-row');
                    const createSKU = document.createElement('span');
                    createSKU.textContent = `SKU: ${info.codigo}`;
                    // Category
                    const nodeDivCategory = document.createElement('div');
                    nodeDivCategory.classList.add('mt-1', 'mb-0', 'text-muted', 'small');
                    const createTextCategory = document.createElement('span');
                    createTextCategory.textContent = `Categoría: `;
                    const createCategory = document.createElement('span');
                    createCategory.textContent = info.categoria;
                    // Brand
                    const nodeDivBrand = document.createElement('div');
                    nodeDivBrand.classList.add('mb-2', 'text-muted', 'small');
                    const createTextBrand = document.createElement('span');
                    createTextBrand.textContent = `Marca: `;
                    const createBrand = document.createElement('span');
                    createBrand.textContent = info.marca;
                    // Description
                    const createDescription = document.createElement('p');
                    createDescription.classList.add('text-truncate', 'mb-4', 'mb-md-0');
                    createDescription.textContent = info.descripcion;
                    // Column Right
                    const nodeSix = document.createElement('div');
                    nodeSix.classList.add('col-md-6', 'col-lg-3', 'col-xl-3', 'border-sm-start-none', 'border-start');
                    const nodeDivPrice = document.createElement('div');
                    nodeDivPrice.classList.add('d-flex', 'flex-row', 'align-items-center', 'mb-1');
                    //Format Price
                    let priceDiscountTwoDecimals = (Math.round(info.precio_oferta * 100) / 100).toFixed(2);
                    let priceTwoDecimals = (Math.round(info.precio * 100) / 100).toFixed(2);
                    let priceBlank = "";
                    // Price Discount
                    let discount = (info.precio - info.precio_oferta);
                    const createPriceDiscount = document.createElement('span');
                    createPriceDiscount.classList.add('text-danger');
                    const subPriceDiscount = document.createElement('s');
                    if (discount === 0){
                        subPriceDiscount.textContent = `${priceBlank}`;
                    }else{
                        subPriceDiscount.textContent = `${App.htmlElements.coin}${priceTwoDecimals}`;
                    }
                    // Price
                    const createPrice = document.createElement('h4');
                    createPrice.classList.add('mb-1', 'me-1');
                    createPrice.textContent = `${App.htmlElements.coin}${priceDiscountTwoDecimals}`;
                    // Inventory
                    const createInventory = document.createElement('h6');
                    createInventory.classList.add('text-success');
                    createInventory.textContent = `Inventario: ${info.inventario}`;
                    // Div buttons - More info & Add to cart
                    const nodeDivButtons = document.createElement('div');
                    nodeDivButtons.classList.add('d-flex', 'flex-column', 'mt-4');
                    //More information
                    const createButtonMoreInfo = document.createElement('button');
                    createButtonMoreInfo.classList.add('btn', 'btn-primary', 'btn-sm');
                    createButtonMoreInfo.textContent = 'Más información';
                    //Add to cart
                    const createButtonAddToCart = document.createElement('button');
                    createButtonAddToCart.classList.add('btn', 'btn-outline-primary', 'btn-sm', 'mt-2');
                    createButtonAddToCart.textContent = 'Añadir al carrito';
                    createButtonAddToCart.setAttribute('marcador', info.codigo);
                    createButtonAddToCart.addEventListener('click', App.handlers.addProductToCart);
                    nodeFirst.appendChild(nodeSecond);
                    nodeSecond.appendChild(nodeThird);
                    nodeThird.appendChild(nodeFour);
                    nodeFour.appendChild(nodeFive);
                    nodeFive.appendChild(nodeDivImageFirst);
                    nodeDivImageFirst.appendChild(nodeDivImageSecond);
                    nodeDivImageSecond.appendChild(imageProduct);
                    nodeFive.appendChild(nodeDivLeft);
                    nodeDivLeft.appendChild(nameProduct); // Name
                    nodeDivLeft.appendChild(nodeDivSKU); // Div - SKU
                    nodeDivSKU.appendChild(createSKU); // SKU
                    nodeDivLeft.appendChild(nodeDivCategory); // Div - Category
                    nodeDivCategory.appendChild(createTextCategory); // Text - Category
                    nodeDivCategory.appendChild(createCategory); // Category
                    nodeDivLeft.appendChild(nodeDivBrand); // Div - Brand
                    nodeDivBrand.appendChild(createTextBrand); // Text - Brand
                    nodeDivBrand.appendChild(createBrand); // Brand
                    nodeDivLeft.appendChild(createDescription); // Description
                    nodeFive.appendChild(nodeSix);
                    nodeSix.appendChild(nodeDivPrice);
                    nodeDivPrice.appendChild(createPrice);
                    nodeDivPrice.appendChild(createPriceDiscount);
                    createPriceDiscount.appendChild(subPriceDiscount);
                    nodeSix.appendChild(createInventory);
                    nodeSix.appendChild(nodeDivButtons);
                    nodeDivButtons.appendChild(createButtonMoreInfo);
                    nodeDivButtons.appendChild(createButtonAddToCart);
                    App.htmlElements.productDOM.appendChild(nodeFirst);
                });
                App.handlers.getCartDataLocalStorage();
            }, 
            addProductToCart: async (e) => {
                e.preventDefault();
                App.htmlElements.cart.push(e.target.getAttribute('marcador'))
                App.handlers.saveCartInLocalStorage();
                App.handlers.renderProductAdded();
            },
            renderProductAdded: () => {
                const nodeDivAdded = document.createElement('div');
                nodeDivAdded.classList.add('alert', 'container', 'position-sticky', 'top-0', 'alert-primary', 'hide');
                nodeDivAdded.setAttribute("role", "alert");
                nodeDivAdded.textContent = 'Producto añadido al carrito!'

                // Delete alert after one second (1000)
                setTimeout(function(){
                nodeDivAdded.style.display = "none";
                }, 1000)

                App.htmlElements.productAddedDOM.appendChild(nodeDivAdded);
            },
            saveCartInLocalStorage: () => {
            App.htmlElements.varLocalStorage.setItem('cart', JSON.stringify(App.htmlElements.cart));
            },
            getCartDataLocalStorage: () => {
            if (App.htmlElements.varLocalStorage.getItem('cart') !== null) {
                App.htmlElements.cart = JSON.parse(App.htmlElements.varLocalStorage.getItem('cart'));
                }
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