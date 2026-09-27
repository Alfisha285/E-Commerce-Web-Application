/* =========================================================
   SHOPEASE
   MAIN FRONTEND APPLICATION
========================================================= */

const API_URL = "http://localhost:5000";

const productList = document.getElementById("product-list");
const cartCountElement = document.getElementById("cart-count");

const mobileMenuButton =
    document.getElementById("mobile-menu-button");

const mobileMenu =
    document.getElementById("mobile-menu");


/* =========================================================
   CART
========================================================= */

function getCart() {

    try {

        return JSON.parse(
            localStorage.getItem("cart")
        ) || [];

    } catch (error) {

        console.error(
            "Unable to read cart:",
            error
        );

        return [];

    }
}


function saveCart(cart) {

    localStorage.setItem(
        "cart",
        JSON.stringify(cart)
    );

    updateCartCount();

}


function updateCartCount() {

    const cart = getCart();

    const totalItems = cart.reduce(
        (total, item) =>
            total + Number(item.quantity || 1),
        0
    );

    if (cartCountElement) {

        cartCountElement.textContent =
            totalItems;

    }

}


/* =========================================================
   ADD TO CART
========================================================= */

function addToCart(product) {

    const cart = getCart();

    const existingProduct =
        cart.find(
            item => item._id === product._id
        );


    if (existingProduct) {

        existingProduct.quantity =
            Number(existingProduct.quantity || 1) + 1;

    } else {

        cart.push({

            _id: product._id,

            name: product.name,

            price: Number(product.price),

            image: product.image || "",

            category: product.category || "",

            quantity: 1

        });

    }


    saveCart(cart);


    showNotification(
        `${product.name} added to your bag.`
    );

}


/* =========================================================
   IMAGE SECURITY
========================================================= */

function getProductImage(image) {

    if (!image) {
        return "";
    }


    if (
        image.startsWith("https://") ||
        image.startsWith("http://")
    ) {

        return image;

    }


    return "";

}


/* =========================================================
   HTML SECURITY
========================================================= */

function escapeHTML(value) {

    if (
        value === null ||
        value === undefined
    ) {

        return "";

    }


    return String(value)

        .replace(/&/g, "&amp;")

        .replace(/</g, "&lt;")

        .replace(/>/g, "&gt;")

        .replace(/"/g, "&quot;")

        .replace(/'/g, "&#039;");

}


/* =========================================================
   PRICE FORMAT
========================================================= */

function formatPrice(price) {

    return new Intl.NumberFormat(
        "en-IN",
        {
            style: "currency",
            currency: "INR",
            maximumFractionDigits: 0
        }
    ).format(price);

}


/* =========================================================
   LOAD PRODUCTS
========================================================= */

async function loadProducts() {

    if (!productList) {
        return;
    }


    productList.innerHTML = `

        <div class="product-loading">

            <p>
                Loading collection...
            </p>

        </div>

    `;


    try {

        const response =
            await fetch(
                `${API_URL}/api/products`
            );


        if (!response.ok) {

            throw new Error(
                "Unable to load products."
            );

        }


        const products =
            await response.json();


        if (
            !Array.isArray(products) ||
            products.length === 0
        ) {

            productList.innerHTML = `

                <div class="product-loading">

                    <p>
                        No products available.
                    </p>

                    <span>
                        New pieces will appear here soon.
                    </span>

                </div>

            `;

            return;

        }


        const params =
            new URLSearchParams(
                window.location.search
            );


        const requestedCategory =
            params.get("category");


        let filteredProducts =
            products;


        if (
            requestedCategory &&
            requestedCategory !== "New In"
        ) {

            filteredProducts =
                products.filter(
                    product =>
                        String(product.category)
                            .toLowerCase() ===
                        requestedCategory.toLowerCase()
                );

        }


        if (
            filteredProducts.length === 0
        ) {

            productList.innerHTML = `

                <div class="product-loading">

                    <p>
                        No products found.
                    </p>

                    <span>
                        Check back soon for new arrivals.
                    </span>

                </div>

            `;

            return;

        }


        productList.innerHTML =
            filteredProducts
                .map(createProductCard)
                .join("");


        updateCollectionHeading(
            requestedCategory
        );


    } catch (error) {

        console.error(
            "Product loading error:",
            error
        );


        productList.innerHTML = `

            <div class="product-loading">

                <p>
                    Unable to load collection.
                </p>

                <span>
                    Please make sure the backend server is running.
                </span>

            </div>

        `;

    }

}


/* =========================================================
   COLLECTION HEADING
========================================================= */

function updateCollectionHeading(category) {

    const heading =
        document.querySelector(
            ".products-header h2"
        );


    if (!heading) {
        return;
    }


    if (!category || category === "New In") {

        heading.textContent =
            "New arrivals";

        return;

    }


    heading.textContent =
        category;

}


/* =========================================================
   PRODUCT CARD
========================================================= */

function createProductCard(product) {

    const image =
        getProductImage(
            product.image
        );


    const safeName =
        escapeHTML(
            product.name
        );


    const safeCategory =
        escapeHTML(
            product.category
        );


    const safeDescription =
        escapeHTML(
            product.description
        );


    const price =
        formatPrice(
            product.price
        );


    const productData =
        JSON.stringify({
            _id: product._id,
            name: product.name,
            price: product.price,
            image: product.image || "",
            category: product.category || ""
        })
        .replace(/"/g, "&quot;");


    return `

        <article
            class="product-card"
        >

            <a
                href="#"
                class="product-image-wrapper"
                onclick="return false;"
                title="${safeDescription}"
            >

                ${
                    image

                    ?

                    `
                    <img
                        src="${image}"
                        alt="${safeName}"
                        loading="lazy"
                    >
                    `

                    :

                    `
                    <div
                        class="product-image-fallback"
                    >

                        <span>
                            SHOPEASE
                        </span>

                    </div>
                    `
                }

            </a>


            <div class="product-info">

                <h3 class="product-name">
                    ${safeName}
                </h3>


                <p class="product-category">
                    ${safeCategory}
                </p>


                <p class="product-price">
                    ${price}
                </p>


                <button
                    type="button"
                    class="add-to-bag-button"
                    data-product="${productData}"
                >
                    ADD TO BAG
                </button>

            </div>

        </article>

    `;

}


/* =========================================================
   ADD TO BAG BUTTON EVENTS
========================================================= */

if (productList) {

    productList.addEventListener(
        "click",
        event => {

            const button =
                event.target.closest(
                    ".add-to-bag-button"
                );


            if (!button) {
                return;
            }


            try {

                const product =
                    JSON.parse(
                        button.dataset.product
                    );


                addToCart(product);


            } catch (error) {

                console.error(
                    "Unable to add product:",
                    error
                );

            }

        }
    );

}


/* =========================================================
   NOTIFICATION
========================================================= */

function showNotification(message) {

    const existing =
        document.querySelector(
            ".shop-notification"
        );


    if (existing) {
        existing.remove();
    }


    const notification =
        document.createElement("div");


    notification.className =
        "shop-notification";


    notification.textContent =
        message;


    document.body.appendChild(
        notification
    );


    requestAnimationFrame(() => {

        notification.classList.add(
            "show"
        );

    });


    setTimeout(() => {

        notification.classList.remove(
            "show"
        );


        setTimeout(() => {

            if (notification.parentNode) {

                notification.remove();

            }

        }, 300);

    }, 2200);

}


/* =========================================================
   MOBILE MENU
========================================================= */

if (
    mobileMenuButton &&
    mobileMenu
) {

    mobileMenuButton.addEventListener(
        "click",
        () => {

            mobileMenu.classList.toggle(
                "open"
            );

        }
    );


    const mobileLinks =
        mobileMenu.querySelectorAll(
            "a"
        );


    mobileLinks.forEach(link => {

        link.addEventListener(
            "click",
            () => {

                mobileMenu.classList.remove(
                    "open"
                );

            }
        );

    });

}


/* =========================================================
   NEWSLETTER
========================================================= */

const newsletterForm =
    document.querySelector(
        ".newsletter-form"
    );


if (newsletterForm) {

    newsletterForm.addEventListener(
        "submit",
        event => {

            event.preventDefault();


            const emailInput =
                document.getElementById(
                    "newsletter-email"
                );


            if (
                !emailInput ||
                !emailInput.value.trim()
            ) {

                return;

            }


            showNotification(
                "Thank you for joining the ShopEase edit."
            );


            emailInput.value = "";

        }
    );

}


/* =========================================================
   NAVIGATION
========================================================= */

function setupCategoryNavigation() {

    const navigationLinks =
        document.querySelectorAll(
            ".main-navigation a, .mobile-navigation a"
        );


    navigationLinks.forEach(link => {

        const text =
            link.textContent
                .trim()
                .toLowerCase();


        if (
            text === "new in" ||
            text === "clothing" ||
            text === "makeup" ||
            text === "shoes" ||
            text === "heels"
        ) {

            link.addEventListener(
                "click",
                event => {

                    event.preventDefault();


                    const category =
                        text === "new in"
                            ? "New In"
                            : text.charAt(0).toUpperCase()
                              + text.slice(1);


                    if (
                        category === "New In"
                    ) {

                        window.location.href =
                            "index.html#products";

                    } else {

                        window.location.href =
                            `index.html?category=${encodeURIComponent(category)}#products`;

                    }

                }
            );

        }

    });

}


/* =========================================================
   CATEGORY CARD NAVIGATION
========================================================= */

function setupCategoryCards() {

    const categoryCards =
        document.querySelectorAll(
            ".category-large, .category-small, .category-mini"
        );


    categoryCards.forEach(card => {

        const heading =
            card.querySelector("h3");


        if (!heading) {
            return;
        }


        const category =
            heading.textContent
                .trim();


        card.addEventListener(
            "click",
            event => {

                event.preventDefault();


                window.location.href =
                    `index.html?category=${encodeURIComponent(category.charAt(0).toUpperCase() + category.slice(1).toLowerCase())}#products`;

            }
        );

    });

}


/* =========================================================
   INITIALIZE
========================================================= */

document.addEventListener(
    "DOMContentLoaded",
    () => {

        updateCartCount();

        setupCategoryNavigation();

        setupCategoryCards();

        loadProducts();

    }
);