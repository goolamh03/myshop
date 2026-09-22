"use strict";

        /* =========================================================
           SHOPPING CART
           ========================================================= */

        const cart = {};

        const cartItemsContainer =
            document.getElementById("cart-items");

        const cartCountElement =
            document.getElementById("cart-count");

        const cartTotalElement =
            document.getElementById("cart-total");

        const cartMessageElement =
            document.getElementById("cart-message");

        const emptyCartMessage =
            document.getElementById("empty-cart-message");

        const clearCartButton =
            document.getElementById("clear-cart-button");

        let cartMessageTimer;

        /*
         * Display a temporary Bootstrap notification.
         */
        function showCartMessage(message, messageType) {
            window.clearTimeout(cartMessageTimer);

            cartMessageElement.textContent = message;

            cartMessageElement.className =
                `alert alert-R{messageType}`;

            cartMessageTimer = window.setTimeout(
                function () {
                    cartMessageElement.classList.add("d-none");
                },
                2500
            );
        }

        /*
         * Add a product and its selected quantity to the cart.
         */
        function addToCart(
            productName,
            productPrice,
            quantityInputId
        ) {
            const quantityInput =
                document.getElementById(quantityInputId);

            const quantity = Number.parseInt(
                quantityInput.value,
                10
            );

            if (
                !Number.isInteger(quantity) ||
                quantity < 1 ||
                quantity > 99
            ) {
                showCartMessage(
                    "Please select a quantity between 1 and 99.",
                    "warning"
                );

                quantityInput.focus();
                return;
            }

            if (cart[productName]) {
                cart[productName].quantity += quantity;
            } else {
                cart[productName] = {
                    name: productName,
                    price: productPrice,
                    quantity: quantity
                };
            }

            renderCart();

            showCartMessage(
                `R{quantity} × R{productName} added to the cart.`,
                "success"
            );

            quantityInput.value = "1";
        }

        /*
         * Remove a selected product from the cart.
         */
        function removeFromCart(productName) {
            if (!cart[productName]) {
                return;
            }

            delete cart[productName];

            renderCart();

            showCartMessage(
                `R{productName} removed from the cart.`,
                "info"
            );
        }

        /*
         * Clear all products from the shopping cart.
         */
        function clearCart() {
            const productNames = Object.keys(cart);

            if (productNames.length === 0) {
                showCartMessage(
                    "Your shopping cart is already empty.",
                    "secondary"
                );

                return;
            }

            const shouldClearCart = window.confirm(
                "Are you sure you want to clear the shopping cart?"
            );

            if (!shouldClearCart) {
                return;
            }

            productNames.forEach(function (productName) {
                delete cart[productName];
            });

            renderCart();

            showCartMessage(
                "The shopping cart has been cleared.",
                "success"
            );
        }

        /*
         * Create and display all shopping cart entries.
         */
        function renderCart() {
            const products = Object.values(cart);

            let totalQuantity = 0;
            let grandTotal = 0;

            cartItemsContainer.innerHTML = "";

            products.forEach(function (product) {
                const productSubtotal =
                    product.price * product.quantity;

                totalQuantity += product.quantity;
                grandTotal += productSubtotal;

                const cartItem =
                    document.createElement("div");

                cartItem.className =
                    "cart-item row align-items-center " +
                    "g-2 border-bottom py-3";

                const productDetails =
                    document.createElement("div");

                productDetails.className = "col-md-6";

                const productHeading =
                    document.createElement("h3");

                productHeading.className = "h6 mb-1";
                productHeading.textContent = product.name;

                const productInformation =
                    document.createElement("p");

                productInformation.className =
                    "text-muted mb-0";

                productInformation.textContent =
                    `${product.quantity} × ` +
                    `R${product.price.toFixed(2)}`;

                productDetails.appendChild(productHeading);
                productDetails.appendChild(productInformation);

                const subtotalContainer =
                    document.createElement("div");

                subtotalContainer.className =
                    "col-6 col-md-3";

                const subtotal =
                    document.createElement("strong");

                subtotal.textContent =
                    `R${productSubtotal.toFixed(2)}`;

                subtotalContainer.appendChild(subtotal);

                const buttonContainer =
                    document.createElement("div");

                buttonContainer.className =
                    "col-6 col-md-3 text-end";

                const removeButton =
                    document.createElement("button");

                removeButton.type = "button";

                removeButton.className =
                    "btn btn-outline-danger btn-sm";

                removeButton.textContent = "Remove";

                removeButton.setAttribute(
                    "aria-label",
                    `Remove ${product.name} from cart`
                );

                removeButton.addEventListener(
                    "click",
                    function () {
                        removeFromCart(product.name);
                    }
                );

                buttonContainer.appendChild(removeButton);

                cartItem.appendChild(productDetails);
                cartItem.appendChild(subtotalContainer);
                cartItem.appendChild(buttonContainer);

                cartItemsContainer.appendChild(cartItem);
            });

            cartCountElement.textContent =
                totalQuantity.toString();

            cartTotalElement.textContent =
                grandTotal.toFixed(2);

            const cartIsEmpty = products.length === 0;

            emptyCartMessage.classList.toggle(
                "d-none",
                !cartIsEmpty
            );

            clearCartButton.disabled = cartIsEmpty;
        }

        /*
         * Add a click event to every Buy button.
         */
        document.querySelectorAll(".buy-button")
            .forEach(function (button) {
                button.addEventListener(
                    "click",
                    function () {
                        const productName =
                            button.dataset.name;

                        const productPrice =
                            Number.parseFloat(
                                button.dataset.price
                            );

                        const quantityInputId =
                            button.dataset.quantityId;

                        addToCart(
                            productName,
                            productPrice,
                            quantityInputId
                        );
                    }
                );
            });

        clearCartButton.addEventListener(
            "click",
            clearCart
        );

        /* =========================================================
           CONTACT FORM
           ========================================================= */

        const contactForm =
            document.getElementById("contact-form");

        const formMessage =
            document.getElementById("form-message");

        let formMessageTimer;

        contactForm.addEventListener(
            "submit",
            function (event) {
                event.preventDefault();
                event.stopPropagation();

                if (!contactForm.checkValidity()) {
                    contactForm.classList.add(
                        "was-validated"
                    );

                    return;
                }

                formMessage.classList.remove("d-none");

                contactForm.reset();

                contactForm.classList.remove(
                    "was-validated"
                );

                window.clearTimeout(formMessageTimer);

                formMessageTimer = window.setTimeout(
                    function () {
                        formMessage.classList.add("d-none");
                    },
                    3500
                );
            }
        );

        contactForm.addEventListener(
            "reset",
            function () {
                contactForm.classList.remove(
                    "was-validated"
                );

                formMessage.classList.add("d-none");
            }
        );

        /* =========================================================
           PAGE INITIALISATION
           ========================================================= */

        document.getElementById("current-year")
            .textContent = new Date().getFullYear();

        renderCart();
