// Variables
const items = document.querySelector('#items');
let productsData;

// fonctions

/**
 * Récupère les datas depuis l'api
 */
const setApi = async () => {
    await fetch("http://127.0.0.1:3000/api/products")
    .then((res) => res.json())
    .then((products) => {
        productsData = products;
    });
};

/**
 * Affiche les datas sur index.html
 */
const productsDisplay = async () => {
    await setApi();
    items.innerHTML = productsData.map(product => `
    <a href="./product.html?id=${product._id}">
        <article>
            <img src="${product.imageUrl}" alt="${product.altTxt}">
            <h3 class="productName">${product.name}</h3>
            <p class="productDescription">${product.description}</p>
        </article>
    </a>
    `).join("")
}

productsDisplay();