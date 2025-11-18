// Product Filtering and Sorting
const sizeFilter = document.getElementById('size-filter');
const sortFilter = document.getElementById('sort-filter');
const productCards = document.querySelectorAll('.product-card');
const productCount = document.getElementById('product-count');
const noProductsMessage = document.querySelector('.no-products');
const productsGrid = document.querySelector('.products-grid');

// Update product count
function updateProductCount() {
    const visibleProducts = Array.from(productCards).filter(card => card.style.display !== 'none');
    if (productCount) {
        productCount.textContent = visibleProducts.length;
    }

    // Show/hide no products message
    if (noProductsMessage) {
        if (visibleProducts.length === 0) {
            noProductsMessage.style.display = 'block';
            if (productsGrid) productsGrid.style.display = 'none';
        } else {
            noProductsMessage.style.display = 'none';
            if (productsGrid) productsGrid.style.display = 'grid';
        }
    }
}

// Filter products by size
function filterProducts() {
    const selectedSize = sizeFilter.value;

    productCards.forEach(card => {
        const category = card.dataset.category;

        if (selectedSize === 'all' || selectedSize === category) {
            card.style.display = 'block';
        } else {
            card.style.display = 'none';
        }
    });

    updateProductCount();
}

// Sort products
function sortProducts() {
    const selectedSort = sortFilter.value;
    const cardsArray = Array.from(productCards);

    if (selectedSort === 'price-low') {
        cardsArray.sort((a, b) => {
            return parseFloat(a.dataset.price) - parseFloat(b.dataset.price);
        });
    } else if (selectedSort === 'price-high') {
        cardsArray.sort((a, b) => {
            return parseFloat(b.dataset.price) - parseFloat(a.dataset.price);
        });
    }

    cardsArray.forEach(card => {
        if (productsGrid) {
            productsGrid.appendChild(card);
        }
    });
}

// Add to cart functionality
function addToCart(productName, price) {
    // Get current cart count
    const cartCountElement = document.querySelector('.cart-count');
    if (cartCountElement) {
        let currentCount = parseInt(cartCountElement.textContent) || 0;
        currentCount++;
        cartCountElement.textContent = currentCount;

        // Add animation
        cartCountElement.style.transform = 'scale(1.3)';
        setTimeout(() => {
            cartCountElement.style.transform = 'scale(1)';
        }, 300);
    }

    // Show success message
    alert(`Added ${productName} to cart! Price: ₹${price}`);
}

// Event listeners
if (sizeFilter) {
    sizeFilter.addEventListener('change', filterProducts);
}

if (sortFilter) {
    sortFilter.addEventListener('change', sortProducts);
}

// Add to cart button listeners
document.querySelectorAll('.add-to-cart').forEach((button, index) => {
    button.addEventListener('click', function () {
        const card = this.closest('.product-card');
        const productName = card.querySelector('.product-title').textContent;
        const price = card.dataset.price;
        addToCart(productName, price);
    });
});

// Initialize product count
updateProductCount();
