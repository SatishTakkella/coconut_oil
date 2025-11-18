// Cart Data Structure
const cartData = {
    1: { name: 'Virgin Coconut Oil - 500ml', price: 480, quantity: 2 },
    2: { name: 'Virgin Coconut Oil - 1 Liter', price: 920, quantity: 1 },
    3: { name: 'Virgin Coconut Oil - 250ml', price: 250, quantity: 1 }
};

// Promo codes
const promoCodes = {
    'HERITAGE10': { discount: 10, type: 'percentage' },
    'KONASEEMA50': { discount: 50, type: 'fixed' },
    'FIRST100': { discount: 100, type: 'fixed' }
};

let appliedPromo = null;
const FREE_SHIPPING_THRESHOLD = 3000;
const SHIPPING_COST = 100;

// Initialize cart on page load
document.addEventListener('DOMContentLoaded', function () {
    updateCart();
});

// Calculate totals
function calculateTotals() {
    let subtotal = 0;
    let totalItems = 0;

    Object.keys(cartData).forEach(id => {
        const item = cartData[id];
        subtotal += item.price * item.quantity;
        totalItems += item.quantity;
    });

    let discount = 0;
    if (appliedPromo) {
        if (appliedPromo.type === 'percentage') {
            discount = (subtotal * appliedPromo.discount) / 100;
        } else {
            discount = appliedPromo.discount;
        }
    }

    const shipping = subtotal >= FREE_SHIPPING_THRESHOLD ? 0 : SHIPPING_COST;
    const total = subtotal + shipping - discount;

    return {
        subtotal,
        discount,
        shipping,
        total,
        totalItems
    };
}

// Update cart display
function updateCart() {
    const totals = calculateTotals();

    // Update item prices
    Object.keys(cartData).forEach(id => {
        const item = cartData[id];
        const qtyInput = document.getElementById(`qty-${id}`);
        const priceElement = document.getElementById(`price-${id}`);

        if (qtyInput) qtyInput.value = item.quantity;
        if (priceElement) priceElement.textContent = `₹${(item.price * item.quantity).toLocaleString()}`;
    });

    // Update summary
    document.getElementById('total-items').textContent = totals.totalItems;
    document.getElementById('summary-items').textContent = totals.totalItems;
    document.getElementById('subtotal').textContent = `₹${totals.subtotal.toLocaleString()}`;
    document.getElementById('shipping-cost').textContent = totals.shipping === 0 ? 'FREE' : `₹${totals.shipping}`;
    document.getElementById('discount').textContent = `-₹${totals.discount.toLocaleString()}`;
    document.getElementById('total-amount').textContent = `₹${totals.total.toLocaleString()}`;

    // Update cart count in header
    const cartCount = document.querySelector('.cart-count');
    if (cartCount) cartCount.textContent = totals.totalItems;

    // Update free shipping progress
    updateFreeShippingProgress(totals.subtotal);

    // Check if cart is empty
    checkEmptyCart();
}

// Update free shipping progress
function updateFreeShippingProgress(subtotal) {
    const remaining = FREE_SHIPPING_THRESHOLD - subtotal;
    const progress = (subtotal / FREE_SHIPPING_THRESHOLD) * 100;

    const progressBar = document.getElementById('shipping-progress');
    const remainingElement = document.getElementById('free-shipping-remaining');
    const banner = document.querySelector('.free-shipping-banner');

    if (progressBar) {
        progressBar.style.width = Math.min(progress, 100) + '%';
    }

    if (remaining > 0) {
        if (remainingElement) remainingElement.textContent = `₹${remaining.toLocaleString()}`;
        if (banner) {
            banner.querySelector('p').innerHTML = `Add <strong>₹${remaining.toLocaleString()}</strong> more for FREE shipping!`;
        }
    } else {
        if (banner) {
            banner.querySelector('p').innerHTML = `<strong>🎉 Congratulations! You've earned FREE shipping!</strong>`;
            banner.style.background = 'linear-gradient(135deg, #d4edda, #c3e6cb)';
        }
    }
}

// Increase quantity
function increaseQuantity(productId) {
    if (cartData[productId] && cartData[productId].quantity < 10) {
        cartData[productId].quantity++;
        updateCart();
        showNotification('Quantity updated', 'success');
    }
}

// Decrease quantity
function decreaseQuantity(productId) {
    if (cartData[productId] && cartData[productId].quantity > 1) {
        cartData[productId].quantity--;
        updateCart();
        showNotification('Quantity updated', 'success');
    }
}

// Update quantity from input
function updateQuantity(productId) {
    const qtyInput = document.getElementById(`qty-${productId}`);
    let newQty = parseInt(qtyInput.value);

    if (isNaN(newQty) || newQty < 1) {
        newQty = 1;
    } else if (newQty > 10) {
        newQty = 10;
    }

    if (cartData[productId]) {
        cartData[productId].quantity = newQty;
        updateCart();
    }
}

// Remove item from cart
function removeItem(productId) {
    if (confirm('Are you sure you want to remove this item from your cart?')) {
        delete cartData[productId];

        // Remove the item element from DOM
        const itemElement = document.querySelector(`[data-product-id="${productId}"]`);
        if (itemElement) {
            itemElement.style.animation = 'slideOut 0.3s ease';
            setTimeout(() => {
                itemElement.remove();
                updateCart();
                showNotification('Item removed from cart', 'success');
            }, 300);
        }
    }
}

// Clear entire cart
function clearCart() {
    if (confirm('Are you sure you want to clear your entire cart?')) {
        Object.keys(cartData).forEach(id => delete cartData[id]);

        document.querySelectorAll('.cart-item').forEach(item => {
            item.style.animation = 'slideOut 0.3s ease';
        });

        setTimeout(() => {
            updateCart();
            showNotification('Cart cleared', 'success');
        }, 300);
    }
}

// Check if cart is empty
function checkEmptyCart() {
    const isEmpty = Object.keys(cartData).length === 0;
    const emptyCart = document.querySelector('.empty-cart');
    const cartItemsList = document.querySelector('.cart-items-list');
    const continueShoppingBtn = document.querySelector('.continue-shopping');

    if (isEmpty) {
        if (emptyCart) emptyCart.style.display = 'block';
        if (cartItemsList) cartItemsList.style.display = 'none';
        if (continueShoppingBtn) continueShoppingBtn.style.display = 'none';
    } else {
        if (emptyCart) emptyCart.style.display = 'none';
        if (cartItemsList) cartItemsList.style.display = 'block';
        if (continueShoppingBtn) continueShoppingBtn.style.display = 'block';
    }
}

// Apply promo code
function applyPromoCode() {
    const promoInput = document.getElementById('promo-code');
    const promoMessage = document.getElementById('promo-message');
    const code = promoInput.value.trim().toUpperCase();

    if (!code) {
        showPromoMessage('Please enter a promo code', 'error');
        return;
    }

    if (promoCodes[code]) {
        appliedPromo = promoCodes[code];
        updateCart();
        showPromoMessage(`Promo code applied! You saved ${appliedPromo.type === 'percentage' ? appliedPromo.discount + '%' : '₹' + appliedPromo.discount}`, 'success');
        promoInput.value = '';
        promoInput.disabled = true;
    } else {
        showPromoMessage('Invalid promo code', 'error');
    }
}

// Show promo message
function showPromoMessage(message, type) {
    const promoMessage = document.getElementById('promo-message');
    if (promoMessage) {
        promoMessage.textContent = message;
        promoMessage.className = `promo-message ${type}`;
        promoMessage.style.display = 'block';

        setTimeout(() => {
            if (type === 'error') {
                promoMessage.style.display = 'none';
            }
        }, 3000);
    }
}

// Show notification
function showNotification(message, type) {
    // Create notification element
    const notification = document.createElement('div');
    notification.className = `notification ${type}`;
    notification.innerHTML = `
        <i class="fas fa-${type === 'success' ? 'check-circle' : 'exclamation-circle'}"></i>
        <span>${message}</span>
    `;
    notification.style.cssText = `
        position: fixed;
        top: 100px;
        right: 20px;
        background: ${type === 'success' ? '#28a745' : '#dc3545'};
        color: white;
        padding: 1rem 1.5rem;
        border-radius: 5px;
        box-shadow: 0 5px 15px rgba(0,0,0,0.3);
        z-index: 10000;
        display: flex;
        align-items: center;
        gap: 0.5rem;
        animation: slideInRight 0.3s ease;
    `;

    document.body.appendChild(notification);

    setTimeout(() => {
        notification.style.animation = 'slideOutRight 0.3s ease';
        setTimeout(() => notification.remove(), 300);
    }, 3000);
}

// Add to cart from recommendations
function addToCartQuick(productId, productName, price) {
    if (!cartData[productId]) {
        cartData[productId] = {
            name: productName,
            price: price,
            quantity: 1
        };

        // Create and add new cart item to DOM
        const cartItemsList = document.querySelector('.cart-items-list');
        if (cartItemsList) {
            const newItem = createCartItemElement(productId, productName, price);
            cartItemsList.appendChild(newItem);
        }

        updateCart();
        showNotification(`${productName} added to cart!`, 'success');
    } else {
        cartData[productId].quantity++;
        updateCart();
        showNotification(`${productName} quantity increased!`, 'success');
    }
}

// Create cart item element
function createCartItemElement(productId, productName, price) {
    const div = document.createElement('div');
    div.className = 'cart-item';
    div.setAttribute('data-product-id', productId);
    div.innerHTML = `
        <div class="item-image">
            <img src="https://images.unsplash.com/photo-1474979266404-7eaacbcd87c5?w=150" alt="${productName}">
        </div>
        <div class="item-details">
            <h3>${productName}</h3>
            <p class="item-origin"><i class="fas fa-map-marker-alt"></i> Konaseema, East Godavari</p>
            <div class="item-badges">
                <span class="badge">100% Natural</span>
                <span class="badge">Cold-Pressed</span>
            </div>
            <button class="remove-item" onclick="removeItem(${productId})">
                <i class="fas fa-trash"></i> Remove
            </button>
        </div>
        <div class="item-quantity">
            <label>Quantity:</label>
            <div class="quantity-controls">
                <button onclick="decreaseQuantity(${productId})"><i class="fas fa-minus"></i></button>
                <input type="number" value="1" min="1" max="10" id="qty-${productId}" onchange="updateQuantity(${productId})">
                <button onclick="increaseQuantity(${productId})"><i class="fas fa-plus"></i></button>
            </div>
        </div>
        <div class="item-price">
            <div class="unit-price">₹${price} each</div>
            <div class="total-price" id="price-${productId}">₹${price}</div>
        </div>
    `;
    return div;
}

// Proceed to checkout
function proceedToCheckout() {
    if (Object.keys(cartData).length === 0) {
        showNotification('Your cart is empty', 'error');
        return;
    }

    showNotification('Proceeding to checkout...', 'success');

    // Simulate checkout process
    setTimeout(() => {
        alert('Checkout functionality will be implemented here.\n\nYour order summary:\n' +
            `Items: ${calculateTotals().totalItems}\n` +
            `Total: ₹${calculateTotals().total.toLocaleString()}\n\n` +
            'Thank you for choosing Pure Heritage!');
    }, 500);
}

// Add CSS animations
const style = document.createElement('style');
style.textContent = `
    @keyframes slideOut {
        from {
            opacity: 1;
            transform: translateX(0);
        }
        to {
            opacity: 0;
            transform: translateX(100%);
        }
    }

    @keyframes slideInRight {
        from {
            opacity: 0;
            transform: translateX(100%);
        }
        to {
            opacity: 1;
            transform: translateX(0);
        }
    }

    @keyframes slideOutRight {
        from {
            opacity: 1;
            transform: translateX(0);
        }
        to {
            opacity: 0;
            transform: translateX(100%);
        }
    }
`;
document.head.appendChild(style);
