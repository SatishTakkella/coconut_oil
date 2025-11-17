// Product Filtering and Sorting
const sizeFilter = document.getElementById('size-filter');
const sortFilter = document.getElementById('sort-filter');
const productCards = document.querySelectorAll('.product-card');

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
}

function sortProducts() {
    const selectedSort = sortFilter.value;
    const productsGrid = document.querySelector('.products-grid');
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

    cardsArray.forEach(card => productsGrid.appendChild(card));
}

if (sizeFilter) {
    sizeFilter.addEventListener('change', filterProducts);
}

if (sortFilter) {
    sortFilter.addEventListener('change', sortProducts);
}
