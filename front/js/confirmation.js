const localOrderSent = "order";


orderId.textContent = JSON.parse(localStorage.getItem(localOrderSent));
localStorage.removeItem(localOrderSent);