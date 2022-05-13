// Variables
const productIdByUrl = new URL(window.location.href).searchParams.get("id");
const itemImg = document.querySelector(".item__img");
const itemTitle = document.querySelector("#title");
const itemPrice = document.querySelector("#price");
const itemDescription = document.querySelector("#description");
const colorsOption = document.querySelector("#colors");

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

const addToCart = (productData) => {
  const button = document.getElementById("addToCart");
  const localDataName = "productsInCart";

  button.addEventListener("click", () => {
    const productQuantity = document.getElementById("quantity");
    const color = colorsOption.value;
    let storageLocal = JSON.parse(localStorage.getItem(localDataName));
    const productToLocalStorage = {
      id: productData._id,
      quantity: parseInt(productQuantity.value, 10),
      color: color,
    };

    if (storageLocal === null){
      storageLocal = [];
      storageLocal.push(productToLocalStorage);
      localStorage.setItem(localDataName, JSON.stringify(storageLocal));
    } else if(storageLocal !== null){
      for(i = 0; i < storageLocal.length; i++){
        
      if(
        storageLocal[i].id === productData._id &&
        storageLocal[i].color === productToLocalStorage.color
        
      ){
       return (
        storageLocal[i].quantity++ ,
        localStorage.setItem(localDataName, JSON.stringify(storageLocal)),
        storageLocal = JSON.parse(localStorage.getItem(localDataName)),
        console.log('qt', storageLocal[i].quantity));
      }
    }
  
    for(i = 0; i < storageLocal.length; i++){
      if((storageLocal[i].id === productData._id && storageLocal[i].teinte !== productToLocalStorage.color) || storageLocal[i].id != productData._id){
        return (
          console.log('nouveau'),
          storageLocal.push(productToLocalStorage),
          localStorage.setItem(localDataName,JSON.stringify(localStorage)),
          storageLocal = JSON.parse(localStorage.getItem(localDataName)),
          console.log('new :', i)
        );
      }
    }
  
    }

    // console.log("productToLocalStorage", productToLocalStorage);
    // console.log("storageLocal",typeof storageLocal);
    // console.log("quantity", typeof productToLocalStorage.quantity);

    // TEST si color select
    //productToLocalStorage.color
    //   ? setProductToLocalStorage(
    //       storageLocal,
    //       productToLocalStorage,
    //       localDataName
    //     )
    //   : errorInfo("Choissez une couleur!", "colors", "span");
  });
};

// envoie les info produit dans le localStorage
 
 const setProductToLocalStorage = (
  storageLocal,
  productToLocalStorage,
  localDataName
) =>{
  if (storageLocal === null){
    storageLocal = [];
    storageLocal.push(productToLocalStorage);
    localStorage.setItem(localDataName, JSON.stringify(storageLocal));
  } else if(storageLocal !== null){
    for(i = 0; i < storageLocal.length; i++){
      
    if(
      storageLocal[i].id === productData._id &&
      storageLocal[i].color === productToLocalStorage.color
      
    ){
     return (
      storageLocal[i].quantity++ ,
      localStorage.setItem(localDataName, JSON.stringify(storageLocal)),
      storageLocal = JSON.parse(localStorage.getItem(localDataName)),
      console.log('qt', storageLocal[i].quantity));
    }
  }

  for(i = 0; i < storageLocal.length; i++){
    if((storageLocal[i].id === productData._id && storageLocal[i].teinte !== productToLocalStorage.color) || storageLocal[i].id != productData._id){
      return (
        console.log('nouveau'),
        storageLocal.push(productToLocalStorage),
        localStorage.setItem(localDataName,JSON.stringify(localStorage)),
        storageLocal = JSON.parse(localStorage.getItem(localDataName)),
        console.log('new :', i)
      );
    }
  }

  }
  


  
}

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
