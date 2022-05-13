// Variables
const localDataName = "productsInCart";
const cartItems = document.getElementById("cart__items");

let addProduct = JSON.parse(localStorage.getItem(localDataName));

// functions

// const setProductFromApi = async () => {
//   await fetch(`http://127.0.0.1:3000/api/products/${addProduct.id}`)
//     .then((res) => res.json())
//     .then((product) => {
//       productData = product;
//       // console.log("produit : ", productData);
//     });
// };

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
  
  return;
};

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
            (totalPriceUpdate.textContent = `${
              parseInt(i.quantity) * i.price
            } €`),
            totalArticles()
          );
        }
      }
    });
  });
};

const totalArticles = async (displayCart) => {
  await displayCart;
  const total = [];
  const nbArticles = [];
  addProduct.forEach((el) => {
    total.push(el.price * parseInt(el.quantity));
    nbArticles.push(parseInt(el.quantity));
  });
  console.log(nbArticles);
  return (
    totalPrice.textContent = total.reduce((acc, el) => acc + el),
    totalQuantity.textContent = nbArticles.reduce((acc, el) => acc + el)
    );
   
};
