document.querySelectorAll(".contact-form").forEach((form) => {
  form.addEventListener("submit", (event) => {
    event.preventDefault();

    if (!form.reportValidity()) return;

    const nome = new FormData(form).get("nome");
    const feedback = form.querySelector(".contact-feedback");
    feedback.textContent = `Obrigado, ${nome}! Esta demonstração não envia nem armazena sua mensagem.`;
    form.reset();
  });
});

const cartItems = document.querySelector("#cart-items");

if (cartItems) {
  const cart = new Map();
  const cartCount = document.querySelector("#cart-count");
  const cartEmpty = document.querySelector("#cart-empty");
  const cartTotal = document.querySelector("#cart-total");
  const currency = new Intl.NumberFormat("pt-BR", {
    style: "currency",
    currency: "BRL"
  });

  const renderCart = () => {
    cartItems.replaceChildren();
    let quantity = 0;
    let total = 0;

    cart.forEach((item, id) => {
      quantity += item.quantity;
      total += item.price * item.quantity;

      const listItem = document.createElement("li");
      listItem.className = "cart-item";

      const itemInfo = document.createElement("span");
      itemInfo.className = "cart-item-info";
      itemInfo.textContent = `${item.name} — ${item.quantity} x ${currency.format(item.price / 100)}`;

      const removeButton = document.createElement("button");
      removeButton.type = "button";
      removeButton.className = "cart-remove";
      removeButton.dataset.productId = id;
      removeButton.textContent = "Remover";
      removeButton.setAttribute("aria-label", `Remover ${item.name} do carrinho`);

      listItem.append(itemInfo, removeButton);
      cartItems.append(listItem);
    });

    cartCount.textContent = `(${quantity} ${quantity === 1 ? "item" : "itens"})`;
    cartEmpty.hidden = quantity > 0;
    cartTotal.textContent = currency.format(total / 100);
  };

  document.querySelectorAll(".buy-button").forEach((button) => {
    button.addEventListener("click", () => {
      const product = button.closest(".store-product");
      const id = product.dataset.productId;
      const existingItem = cart.get(id);

      if (existingItem) {
        existingItem.quantity += 1;
      } else {
        cart.set(id, {
          name: product.querySelector("h3").textContent,
          price: Number(product.dataset.price),
          quantity: 1
        });
      }

      renderCart();
      product.querySelector(".buy-feedback").textContent = "Adicionado ao carrinho.";
    });
  });

  cartItems.addEventListener("click", (event) => {
    const removeButton = event.target.closest(".cart-remove");
    if (!removeButton) return;

    cart.delete(removeButton.dataset.productId);
    renderCart();
  });
}
