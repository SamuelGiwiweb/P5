// Variables
const localDataName = "productsInCart";
const localOrderSent = "order";
const cartItems = document.getElementById("cart__items");

let addProduct = JSON.parse(localStorage.getItem(localDataName));
let orderSent =  JSON.parse(localStorage.getItem(localOrderSent));

// functions


/**
 * Affiche le panier
 */
const displayCart = async () => {
  if (addProduct) {
    await addProduct;
    modifyQuantity();
    removeProduct();
    totalArticles();
    cartItems.innerHTML = addProduct
      .map(
        (productItem) => `
    <article class="cart__item" data-id="${productItem._id}" data-color="${
          productItem.color
        }">
                 <div class="cart__item__img">
                   <img src="${
                     productItem.imageUrl
                   }" alt="Photographie d'un canapé">
                 </div>
                 <div class="cart__item__content">
                   <div class="cart__item__content__description">
                     <h2>${productItem.name}</h2>
                     <p>${productItem.color}</p>
                     <p>${productItem.price * productItem.quantity} €</p>
                   </div>
                   <div class="cart__item__content__settings">
                     <div class="cart__item__content__settings__quantity">
                       <p>Qté : </p>
                       <input type="number" class="itemQuantity" name="itemQuantity" min="1" max="100" value="${
                         productItem.quantity
                       }">
                     </div>
                     <div class="cart__item__content__settings__delete">
                       <p class="deleteItem">Supprimer</p>
                     </div>
                   </div>
                 </div>
               </article> 
    `
      )
      .join("");
  }
};

displayCart();


/**
 * Supprimer un produit du panier
 * @param {*} displayCart promise
 */
const removeProduct = async (displayCart) => {
  
  await displayCart;
  const deleteItem = document.querySelectorAll(".deleteItem");
  deleteItem.forEach((trash) => {
    trash.addEventListener("click", () => {
      const article = trash.closest(".cart__item");
      const [id, color] = [article.dataset.id, article.dataset.color];
      if (addProduct.length === 1) {
        localStorage.removeItem(localDataName);
        cartItems.removeChild(article);
        totalPrice.textContent = "";
        totalQuantity.textContent = "";
      } else {
        const index = addProduct.findIndex(
          (el) => el._id === id && el.color === color
        );
        addProduct.splice(index, 1);
        localStorage.setItem(localDataName, JSON.stringify(addProduct));
        addProduct = JSON.parse(localStorage.getItem(localDataName));
        cartItems.removeChild(article);
        totalArticles();
      }
    });
  });

};

/**
 * modifie les quantités de produit
 * @param {*} displayCart promise
 */
const modifyQuantity = async (displayCart) => {
  await displayCart;
  let modify = document.querySelectorAll(".itemQuantity");
  modify.forEach((item) => {
    item.addEventListener("click", () => {
      const article = item.closest(".cart__item");
      const [id, color] = [article.dataset.id, article.dataset.color];
      const totalPriceUpdate =
        article.childNodes[3].childNodes[1].lastElementChild;

      for (let i of addProduct) {
        if (i._id === id && i.color === color) {
          return (
            (i.quantity = item.value),
            localStorage.setItem(localDataName, JSON.stringify(addProduct)),
            totalPriceUpdate.textContent = `${
              parseInt(i.quantity) * i.price
            } €`,
            totalArticles()
          );
        }
      }
    });
  });
};

/**
 * gère le prix et le nombre total de produit du panier
 * @param {*} displayCart promise
 * @returns {Int, Int} prix total et nombre total d'article dans le panier
 */
const totalArticles = async (displayCart) => {
  await displayCart;
  const total = [];
  const nbArticles = [];
  addProduct.forEach((el) => {
    total.push(el.price * parseInt(el.quantity));
    nbArticles.push(parseInt(el.quantity));
  });
  return (
    totalPrice.textContent = total.reduce((acc, el) => acc + el),
    totalQuantity.textContent = nbArticles.reduce((acc, el) => acc + el)
  );
};

// form

const form = document.querySelector(".cart__order__form");

/**
 * verifie et recupère les datas du formulaire
 * @param {*} e event
 */
const getInfos = (e) => {
  e.preventDefault();
  const nameRegex = /^[a-z A-Z \s -]{3,20}$/;
  if (
    !(
      formError(
        nameRegex,
        `${form.firstName.name} n'est pas valide`,
        form.firstName,
        firstNameErrorMsg
      ) ||
      formError(
        nameRegex,
        `${form.lastName.name} n'est pas valide`,
        form.lastName,
        lastNameErrorMsg
      ) ||
      formError(
        /^[0-9]{1,4} [a-z A-Z 0-9 \,]{10,50}$/,
        `${form.address.name} n'est pas valide`,
        form.address,
        addressErrorMsg
      ) ||
      formError(
        /^[a-z A-Z 0-9 \-]{3,30}$/,
        `${form.city.name} n'est pas valide`,
        form.city,
        cityErrorMsg
      ) ||
      formError(
        /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,4})+$/,
        `${form.email.name} n'est pas valide`,
        form.email,
        emailErrorMsg
      )
    )
  ) {
    const prouductsArray = [];
     addProduct.forEach((id) => {
      prouductsArray.push(id._id)
    })
    const data = {
      contact: {
        firstName: form.firstName.value,
        lastName: form.lastName.value,
        address: form.address.value,
        city: form.city.value,
        email: form.email.value,  
      },

      products: prouductsArray
    }
   
    // fetch post
    fetch("http://127.0.0.1:3000/api/products/order", {
      method: 'POST',
      headers: {'Accept': 'application/json', 
      'Content-Type': 'application/json'  },
      body: JSON.stringify(data)
    }).then(res => res.json()).then(promise => {
      const serverResponse = promise;
      if(orderSent === null){
        orderSent = [serverResponse.orderId];
        localStorage.setItem(localOrderSent, JSON.stringify(orderSent));
         localStorage.removeItem(localDataName);
        window.location.href = "confirmation.html";

      }
    })
  } 
};

form.addEventListener("submit", getInfos);

const formError = (regex, msg, input, output) => {
  output.textContent = "";
  return (output.textContent = input.value.match(regex) ? "" : msg);
};

