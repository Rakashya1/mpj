// Cart functionality
class ShoppingCart {
  constructor() {
    this.items = JSON.parse(localStorage.getItem("cart")) || [];
    this.init();
  }

  init() {
    // Initialize cart UI
    this.updateCartUI();

    // Add event listeners
    document.addEventListener("DOMContentLoaded", () => {
      // Add to cart buttons
      document.querySelectorAll(".add-to-cart").forEach((button) => {
        button.addEventListener("click", (e) => {
          const productId = e.target.getAttribute("data-id");
          this.addToCart(productId);
        });
      });

      // Sort select
      const sortSelect = document.getElementById("sortSelect");
      if (sortSelect) {
        sortSelect.addEventListener("change", (e) => {
          const [field, direction] = e.target.value.split(",");
          window.location.href = `/products?sort=${field}&direction=${direction}`;
        });
      }

      // Initialize cart offcanvas
      const cartOffcanvas = document.getElementById("cartOffcanvas");
      if (cartOffcanvas) {
        cartOffcanvas.addEventListener("show.bs.offcanvas", () => {
          this.updateCartUI();
        });
      }
    });
  }

  addToCart(productId) {
    // Fetch product details from API
    fetch(`/api/products/${productId}`)
      .then((response) => response.json())
      .then((product) => {
        const existingItem = this.items.find((item) => item.id === product.id);

        if (existingItem) {
          existingItem.quantity += 1;
        } else {
          this.items.push({
            id: product.id,
            name: product.name,
            price: product.price,
            image: product.image,
            quantity: 1,
          });
        }

        this.saveCart();
        this.updateCartUI();

        // Show cart offcanvas
        const cartOffcanvas = new bootstrap.Offcanvas(
          document.getElementById("cartOffcanvas"),
        );
        cartOffcanvas.show();
      })
      .catch((error) => {
        console.error("Error adding product to cart:", error);
      });
  }

  removeFromCart(productId) {
    this.items = this.items.filter((item) => item.id !== productId);
    this.saveCart();
    this.updateCartUI();
  }

  updateQuantity(productId, quantity) {
    const item = this.items.find((item) => item.id === productId);
    if (item) {
      item.quantity = Math.max(1, quantity);
      this.saveCart();
      this.updateCartUI();
    }
  }

  saveCart() {
    localStorage.setItem("cart", JSON.stringify(this.items));
  }

  calculateSubtotal() {
    return this.items.reduce(
      (total, item) => total + item.price * item.quantity,
      0,
    );
  }

  updateCartUI() {
    // Update cart count
    const cartCount = document.getElementById("cart-count");
    const headerCartCount = document.getElementById("header-cart-count");
    const totalItems = this.items.reduce(
      (total, item) => total + item.quantity,
      0,
    );

    if (cartCount) cartCount.textContent = totalItems;
    if (headerCartCount) headerCartCount.textContent = totalItems;

    // Update empty cart / cart items visibility
    const emptyCart = document.getElementById("empty-cart");
    const cartItemsContainer = document.getElementById("cart-items");

    if (emptyCart && cartItemsContainer) {
      if (this.items.length === 0) {
        emptyCart.classList.remove("d-none");
        cartItemsContainer.classList.add("d-none");
      } else {
        emptyCart.classList.add("d-none");
        cartItemsContainer.classList.remove("d-none");
      }
    }

    // Update cart items list
    const cartItemsList = document.getElementById("cart-items-list");
    if (cartItemsList) {
      cartItemsList.innerHTML = "";

      this.items.forEach((item) => {
        const li = document.createElement("li");
        li.className = "list-group-item py-3";
        li.innerHTML = `
                    <div class="d-flex gap-3">
                        <img src="${item.image}" alt="${item.name}" class="cart-item-image rounded">
                        <div class="flex-grow-1">
                            <h6 class="mb-0">${item.name}</h6>
                            <p class="text-muted small mb-2">$${item.price.toFixed(2)}</p>
                            <div class="d-flex align-items-center">
                                <div class="quantity-control">
                                    <button class="btn btn-sm btn-outline-secondary decrease-quantity" data-id="${item.id}">
                                        <i class="bi bi-dash"></i>
                                    </button>
                                    <span>${item.quantity}</span>
                                    <button class="btn btn-sm btn-outline-secondary increase-quantity" data-id="${item.id}">
                                        <i class="bi bi-plus"></i>
                                    </button>
                                </div>
                                <button class="btn btn-sm btn-link text-danger ms-auto remove-item" data-id="${item.id}">
                                    <i class="bi bi-trash"></i>
                                </button>
                            </div>
                        </div>
                    </div>
                `;
        cartItemsList.appendChild(li);
      });

      // Add event listeners to cart item buttons
      cartItemsList.querySelectorAll(".decrease-quantity").forEach((button) => {
        button.addEventListener("click", (e) => {
          const productId = e.currentTarget.getAttribute("data-id");
          const item = this.items.find((item) => item.id === productId);
          if (item) this.updateQuantity(productId, item.quantity - 1);
        });
      });

      cartItemsList.querySelectorAll(".increase-quantity").forEach((button) => {
        button.addEventListener("click", (e) => {
          const productId = e.currentTarget.getAttribute("data-id");
          const item = this.items.find((item) => item.id === productId);
          if (item) this.updateQuantity(productId, item.quantity + 1);
        });
      });

      cartItemsList.querySelectorAll(".remove-item").forEach((button) => {
        button.addEventListener("click", (e) => {
          const productId = e.currentTarget.getAttribute("data-id");
          this.removeFromCart(productId);
        });
      });
    }

    // Update cart summary
    const subtotal = this.calculateSubtotal();
    const shipping = subtotal > 0 ? 9.99 : 0;
    const tax = subtotal * 0.08;
    const total = subtotal + shipping + tax;

    const cartSubtotal = document.getElementById("cart-subtotal");
    const cartShipping = document.getElementById("cart-shipping");
    const cartTax = document.getElementById("cart-tax");
    const cartTotal = document.getElementById("cart-total");

    if (cartSubtotal) cartSubtotal.textContent = `$${subtotal.toFixed(2)}`;
    if (cartShipping) cartShipping.textContent = `$${shipping.toFixed(2)}`;
    if (cartTax) cartTax.textContent = `$${tax.toFixed(2)}`;
    if (cartTotal) cartTotal.textContent = `$${total.toFixed(2)}`;
  }
}

// Initialize shopping cart
const cart = new ShoppingCart();

// Filter form functionality
document.addEventListener("DOMContentLoaded", () => {
  const filterForm = document.getElementById("filterForm");
  if (filterForm) {
    // Pre-select filters based on URL parameters
    const urlParams = new URLSearchParams(window.location.search);

    // Categories
    const categories = urlParams.getAll("categories");
    categories.forEach((category) => {
      const checkbox = document.querySelector(
        `input[name="categories"][value="${category}"]`,
      );
      if (checkbox) checkbox.checked = true;
    });

    // Price range
    const minPrice = urlParams.get("minPrice");
    const maxPrice = urlParams.get("maxPrice");
    if (minPrice) document.getElementById("minPrice").value = minPrice;
    if (maxPrice) document.getElementById("maxPrice").value = maxPrice;

    // Rating
    const rating = urlParams.get("rating");
    if (rating) {
      const ratingRadio = document.querySelector(
        `input[name="rating"][value="${rating}"]`,
      );
      if (ratingRadio) ratingRadio.checked = true;
    }
  }
});
