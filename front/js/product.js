// Variables
const productIdByUrl = new URL(window.location.href).searchParams.get("id");
const itemImg = document.querySelector('.item__img');
const itemTitle = document.querySelector('#title');
const itemPrice = document.querySelector('#price');
const itemDescription = document.querySelector('#description');
const colorsOption = document.querySelector('#colors');


let productData;


// fonctions

const setProductFromApi = async () => {
  await fetch(`http://127.0.0.1:3000/api/products/${productIdByUrl}`)
  .then(res => res.json())
  .then(product => {
    productData = product;
    console.log("produit : ", productData);
  })
}

const productDisplay = async () => {
  await setProductFromApi();

  itemImg.innerHTML = `
    <img src="${productData.imageUrl}" alt="${productData.altTxt}">
  `;
  itemTitle.textContent = productData.name;
  itemPrice.textContent = productData.price;
  itemDescription.textContent = productData.description;

  productData.colors.map(color => {
    const option = document.createElement('option')
    option.value = color;
    option.textContent = color;
    colorsOption.appendChild(option);
  })

}

productDisplay();