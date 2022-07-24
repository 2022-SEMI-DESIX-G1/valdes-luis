((Utils) => {
    const App = { 
        htmlElements: {
            documentDOM: document,
            mainDOM: document.querySelector("#main"),
            session: sessionStorage.getItem("userLogin"),
            role: sessionStorage.getItem("role"),
            responseForm: document.querySelector("#response-form"),
            responsePost: document.querySelector("#responsepost"),
            inputEmail: document.querySelector("#email"),
            btnSubmit: document.querySelector("#btnSubmit"),
            footerDOM: document.querySelector("#footerDiv"),
        },
        init: () => {
            if (App.htmlElements.role === "CLIENTE") {
                App.htmlElements.documentDOM.addEventListener(
                    "DOMContentLoaded",
                    App.handlers.renderTemplate
                );
                App.htmlElements.btnSubmit.addEventListener(
                    "click",
                    App.handlers.FormOnSubmit
                );
            } else if (App.htmlElements.role === "ADMINISTRADOR") {
                App.htmlElements.documentDOM.addEventListener(
                    "DOMContentLoaded",
                    App.handlers.renderAdmin
                );
            } 
            else {
                App.htmlElements.documentDOM.addEventListener(
                    "DOMContentLoaded",
                    App.handlers.renderNotLogged
                );
            }
        },
        handlers: {
            renderTemplate: async (e) => {
                e.preventDefault();
                const renderedTemplateLoggedOn = App.templates.LoggedCard();
                App.htmlElements.mainDOM.innerHTML = renderedTemplateLoggedOn;
            },
            renderAdmin: async (e) => {
                e.preventDefault();
                App.htmlElements.footerDOM.style.display = "none";
                const renderedAdminLogged = App.templates.AdminCard();
                App.htmlElements.mainDOM.innerHTML = renderedAdminLogged;
            },
            renderNotLogged: async (e) => {
                e.preventDefault();
                const renderedTemplateNotLoggedOn = App.templates.notLoggedCard();
                App.htmlElements.mainDOM.innerHTML = renderedTemplateNotLoggedOn;
            },
            FormOnSubmit: async (e) => {
                e.preventDefault();
                const email = App.htmlElements.inputEmail.value;
                const suscriptor = {
                                        email: email,
                                    };
                const response = await Utils.postSuscripcion({ suscriptor }); 
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
            AdminCard: () => `
            <nav class="navbar navbar-expand-lg navbar-light bg-light">
                <a class="navbar-brand" href="#">
                <img src="../assets/img/page/logo.png" width="60" height="50" alt="">
                </a>
                <button class="navbar-toggler" type="button" data-toggle="collapse" data-target="#navbarNavAltMarkup" aria-controls="navbarNavAltMarkup" aria-expanded="false" aria-label="Toggle navigation">
                    <span class="navbar-toggler-icon"></span>
                </button>
                <div class="collapse navbar-collapse" id="navbarNavAltMarkup">
                    <div class="navbar-nav">
                    <a class="nav-item nav-link active" href="index.html">Inicio<span class="sr-only">(current)</span></a>
                    <a class="nav-item nav-link" href="../add_product.html">Productos</a>
                    <a class="nav-item nav-link" href="../add_user.html">Usuarios</a>
                    <a class="nav-item nav-link" href="../pedidos.html">Pedidos</a>
                    <a class="nav-item nav-link" href="../logout.html">Cerrar sesión</a>
                    </div>
                </div>
            </nav>

            <div class="jumbotron jumbotron-fluid">
                <div class="container">
                    <h1 class="display-4">Panel de administrador</h1>
                    <p class="lead">Aquí podras crear usuarios, añadir productos y visualizar los pedidos, entre otras 
                    funciones más.</p>
                </div>
            </div>

            <!-- Finish Navbar -->
            `,
            LoggedCard: () => `
            <nav class="navbar navbar-expand-lg navbar-light bg-light">
                <a class="navbar-brand" href="#">
                <img src="../assets/img/page/logo.png" width="60" height="50" alt="">
                </a>
                <button class="navbar-toggler" type="button" data-toggle="collapse" data-target="#navbarNavAltMarkup" aria-controls="navbarNavAltMarkup" aria-expanded="false" aria-label="Toggle navigation">
                    <span class="navbar-toggler-icon"></span>
                </button>
                <div class="collapse navbar-collapse" id="navbarNavAltMarkup">
                    <div class="navbar-nav">
                    <a class="nav-item nav-link active" href="index.html">Inicio<span class="sr-only">(current)</span></a>
                    <a class="nav-item nav-link" href="product.html">Productos</a>
                    <a class="nav-item nav-link" href="cart.html">Carrito</a>
                    <a class="nav-item nav-link" href="checkout.html">Checkout</a>
                    <a class="nav-item nav-link" href="logout.html">Cerrar sesión</a>
                    </div>
                </div>
            </nav>

            <!-- Finish Navbar -->

            <!-- Carousel -->
            <div class="carousel slide carousel-fade" id="myCarousel" data-ride="carousel">
                    <ol class="carousel-indicators">
                        <li data-target="#myCarousel" data-slide-to="0" class="active"></li>
                        <li data-target="#myCarousel" data-slide-to="1"></li>
                        <li data-target="#myCarousel" data-slide-to="2"></li>
                    </ol>
                    <div class="carousel-inner">
                        <div class="carousel-item active" data-interval="5000">
                            <div class="overlay-image" style="background-image:url(../assets/img/page/slide-1.jpg);"></div>
                            <div class="containerDif container">
                                <h1>Bienvenido</h1>
                                <p>Podras comprar dentro de nuestra tienda online, con gran variedad en productos.
                                </p>
                                <a href="../product.html" class="btn btn-lg btn-warning">Comprar productos</a>
                            </div>
                        </div>

                        <div class="carousel-item" data-interval="5000">
                            <div class="overlay-image" style="background-image:url(../assets/img/page/slide-2.jpg);"></div>
                            <div class="containerDif container">
                                <h1>Métodos de pago</h1>
                                <p>Contamos con gran variedad de métodos de pago, entre ellos Yappy, efectivo o transferencia bancaria.</p>
                                </p>
                                <a href="#" class="btn btn-lg btn-warning">Más información</a>
                            </div>
                        </div>

                        <div class="carousel-item" data-interval="5000">
                            <div class="overlay-image" style="background-image:url(../assets/img/page/slide-3.jpg);"></div>
                            <div class="containerDif container">
                                <h1>Métodos de pago</h1>
                                <p>Contamos con gran variedad de métodos de pago, entre ellos Yappy, efectivo o transferencia bancaria.</p>
                                </p>
                                <a href="#" class="btn btn-lg btn-warning">Más información</a>
                            </div>
                        </div>
                    </div>
            </div>

            <!-- Features section-->
                <section class="py-5 border-bottom" id="features">
                    <div class="container px-5 my-5">
                        <div class="row gx-5">
                            <div class="col-lg-4 mb-5 mb-lg-0">
                                <div class="feature bg-primary bg-gradient text-white rounded-3 mb-3 service-sierra"><i class="bi bi-box-seam"></i></div>
                                <h2 class="h4 fw-bolder">Pedidos asegurados</h2>
                                <p>Puede tener la garantía que sus productos irán en cajas sellados de la mejor manera, así evitando daños en los mismos.</p>
                                <a class="text-decoration-none link" href="#!">
                                    Más información
                                    <i class="bi bi-arrow-right"></i>
                                </a>
                            </div>
                            <div class="col-lg-4 mb-5 mb-lg-0">
                                <div class="feature bg-primary bg-gradient text-white rounded-3 mb-3 service-sierra"><i class="bi bi-chat-left-dots"></i></div>
                                <h2 class="h4 fw-bolder">Contacto</h2>
                                <p>Podrás contactarnos de distintas maneras, ya sea por medio de correo, teléfono, whatsapp o alguna de nuestras redes.</p>
                                <a class="text-decoration-none link" href="#!">
                                    Más información
                                    <i class="bi bi-arrow-right"></i>
                                </a>
                            </div>
                            <div class="col-lg-4">
                                <div class="feature bg-primary bg-gradient text-white rounded-3 mb-3 service-sierra"><i class="bi bi-person-check"></i></div>
                                <h2 class="h4 fw-bolder">Facilidad para ser cliente</h2>
                                <p>Te brindamos la facilidad de que seas cliente de una manera sencilla, solo tendrás que registrarte y ya podrás comprar.</p>
                                <a class="text-decoration-none link" href="#!">
                                    Más información
                                    <i class="bi bi-arrow-right"></i>
                                </a>
                            </div>
                        </div>
                    </div>
                </section>

                <!-- Testimonials section-->
                <section class="py-5 border-bottom bg-light">
                    <div class="container px-5 my-5 px-5">
                        <div class="text-center mb-5">
                            <h2 class="fw-bolder">Testimonios</h2>
                            <p class="lead mb-0">A nuestros clientes les gusta trabajar con nosotros.</p>
                        </div>
                        <div class="row gx-5 justify-content-center">
                            <div class="col-lg-6">
                                <!-- Testimonial 1-->
                                <div class="card mb-4">
                                    <div class="card-body p-4">
                                        <div class="d-flex">
                                            <div class="flex-shrink-0"><i class="bi bi-chat-right-quote-fill text-primary fs-1 icon-testimonial"></i></div>
                                            <div class="ms-4">
                                                <p class="mb-1">Gracias por brindarnos una atención de primera clase, una vez se hace el 
                                                pedido, no demoran ni un día en traernos la mercancía, lo cual es eficiente para nuestro día 
                                                a día.</p>
                                                <div class="small text-muted">- Juan Pérez, Cochez y Cia</div>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                                <!-- Testimonial 2-->
                                <div class="card">
                                    <div class="card-body p-4">
                                        <div class="d-flex">
                                            <div class="flex-shrink-0"><i class="bi bi-chat-right-quote-fill text-primary fs-1 icon-testimonial"></i></div>
                                            <div class="ms-4">
                                                <p class="mb-1">Una de las cosas que más me llama la atención es que ellos se adaptan a 
                                                nuestras necesidades, y usan herramientas tecnológicas, con lo cual podemos hacer cosas
                                                en conjunto.</p>
                                                <div class="small text-muted">- Andrés Fonseca, Ferretería y Asociados, S.A.</div>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </section>
            `,
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