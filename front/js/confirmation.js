//variable
const localOrderSent = "order";

// affiche le numero de commande et le supprime du local storage
orderId.textContent = JSON.parse(localStorage.getItem(localOrderSent));
localStorage.removeItem(localOrderSent);