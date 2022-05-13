// Variables
const productIdByUrl = new URL(window.location.href).searchParams.get("id");
const itemImg = document.querySelector(".item__img");
const itemTitle = document.querySelector("#title");
const itemPrice = document.querySelector("#price");
const itemDescription = document.querySelector("#description");
const colorsOption = document.querySelector("#colors");
const localDataName = "productsInCart";

let productData;

// fonctions

/**
 * Récupère les datas depuis l'api
 */
const setProductFromApi = async () => {
  await fetch(`http://127.0.0.1:3000/api/products/${productIdByUrl}`)
    .then((res) => res.json())
    .then((product) => {
      productData = product;
      // console.log("produit : ", productData);
    });
};

/**
 * Affiche les datas sur product.html
 */
const productDisplay = async () => {
  await setProductFromApi();

  itemImg.innerHTML = `
    <img src="${productData.imageUrl}" alt="${productData.altTxt}">
  `;
  itemTitle.textContent = productData.name;
  itemPrice.textContent = productData.price;
  itemDescription.textContent = productData.description;

  productData.colors.map((color) => {
    const option = document.createElement("option");
    option.value = color;
    option.textContent = color;
    colorsOption.appendChild(option);
  });
  addToCart(productData);
};

productDisplay();

/**
 * Ajout de produits au panier
 */
const addToCart = () => {
  let addToCartBtn = document.getElementById("addToCart");

  addToCartBtn.addEventListener("click", () => {
    const color = document.getElementById("colors");
    const quantity = document.getElementById("quantity");
    let productsList = JSON.parse(localStorage.getItem(localDataName));

    const productToLocalStorage = Object.assign({}, productData, {
      _id: productData._id,
      quantity: parseInt(quantity.value, 10),
      color: color.value,
    });
    // console.log("prodlist",productToLocalStorage);
    if (productToLocalStorage.color) {
      if (productsList == null) {
        productsList = [];
        productsList.push(productToLocalStorage);

        localStorage.setItem(localDataName, JSON.stringify(productsList));
      } else if (productsList != null) {
        for (i = 0; i < productsList.length; i++) {
          if (
            productsList[i]._id === productData._id &&
            productsList[i].color === productToLocalStorage.color
          ) {
            return (
              productsList[i].quantity++,
              localStorage.setItem(localDataName, JSON.stringify(productsList)),
              productsList = JSON.parse(localStorage.getItem(localDataName)),
              console.log("qt++")
            );
          } 
        }

        for (i = 0; i < productsList.length; i++){
          if(productsList[i]._id === productData._id &&
            productsList[i].color !== productToLocalStorage.color ||
            productsList[i]._id !== productData._id ){
              
              return (console.log("newby"),
                productsList.push(productToLocalStorage),
                localStorage.setItem(localDataName, JSON.stringify(productsList)),
              productsList = JSON.parse(localStorage.getItem(localDataName))
              );
            }
        }
      }
    }else{
      errorInfo("Choissez une couleur!", "colors", "span");
    }
  });
  return (productList = JSON.parse(localStorage.getItem(localDataName)));
};

/**
 * Renvoie une erreur dans une balise html
 * @param {string} msg
 * @param {string} parent
 * @param {string} el
 */
const errorInfo = (msg, parent, el) => {
  const info = document.createElement(el);
  info.textContent = msg;
  info.style.color = "red";
  const id = document.getElementById(parent).getAttribute("id");
  document.getElementById(id).insertAdjacentElement("afterend", info);
};
