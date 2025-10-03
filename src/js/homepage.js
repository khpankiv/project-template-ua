// // Number of products to show in the Selected Products section
// // const SELECTED_PRODUCTS_COUNT = 4;

// // Homepage dynamic product loading
// import { getProductsByField, getRandomItems } from './utils.js';
// import { populateProducts } from './ui.js';
// import { updateCartCounter } from './header.js';
// import { addToCart } from './cart.js';

// // let allProducts = [];

// export async function initHomepage() {
//     await getCachedProducts() ;
    
//     loadSelectedProducts();
//     loadNewProducts();
//     initAddToCartButtons();
//     initImageSlider();
//     }



// // Load Selected Products
// function loadProducts() {
//     const allProducts = JSON.parse(localStorage.getItem('allProducts')) || [];
//     const selected = getProductsByField(allProducts, 'blocks', 'Selected Products');
//     const selectedProducts = getRandomItems(selected, SELECTED_PRODUCTS_COUNT);

//     const productCards = document.querySelectorAll('.selected-products .product-card');

//     populateProducts(selectedProducts, template, productCards);
// }

// // Load New Products Arrival section
// function loadNewProducts() {
//     const newProducts = allProducts.filter(product => 
//         product.blocks && product.blocks.includes('New Products Arrival')
//     ).slice(0, 4);

//     const productCards = document.querySelectorAll('.product-grid-section:nth-of-type(4) .product-card');
    
//     productCards.forEach((card, index) => {
//         if (newProducts[index]) {
//             const product = newProducts[index];
            
//             // Оновити зображення
//             const img = card.querySelector('.product-image');
//             if (img) {
//                 img.src = `assets/images/items/image${(index % 100) + 1}.png`;
//                 img.alt = product.name;
//             }
            
//             // Оновити назву
//             const nameEl = card.querySelector('.product-name');
//             if (nameEl) {
//                 nameEl.textContent = product.name;
//             }
            
//             // Оновити ціну
//             const priceEl = card.querySelector('.product-price');
//             if (priceEl) {
//                 priceEl.textContent = `€${product.price}`;
//             }
            
//             // Додати ID до кнопки
//             const button = card.querySelector('.button');
//             if (button) {
//                 button.setAttribute('data-product-id', product.id);
//                 button.classList.add('add-to-cart-btn');
//             }
            
//             // Додати клік на картку для переходу до деталей
//             card.style.cursor = 'pointer';
//             card.addEventListener('click', (e) => {
//                 if (!e.target.classList.contains('add-to-cart-btn')) {
//                     window.location.href = `pages/product-details-template.html?id=${product.id}`;
//                 }
//             });
//         }
//     });
// }

// // Initialize Add to Cart buttons
// function initAddToCartButtons() {
//     document.addEventListener('click', (e) => {
//         if (e.target.classList.contains('add-to-cart-btn')) {
//             e.preventDefault();
//             e.stopPropagation();
            
//             const productId = e.target.getAttribute('data-product-id');
//             const product = allProducts.find(p => p.id === productId);
            
//             if (product) {
//                 addToCartHomepage(product);
//             }
//         }
//     });
// }

// // Add product to cart
// function addToCartHomepage(product) {
//     addToCart(product);
// }

// // Initialize View All Items button
// export function initViewAllItemsButton() {
//     const viewAllButton = document.querySelector('.hero-content .button');
//     if (viewAllButton) {
//         viewAllButton.addEventListener('click', () => {
//             window.location.href = 'pages/catalog.html';
//         });
//     }
// }

// // Initialize Travel Suitcases slider
// function initImageSlider() {
//     const slides = document.querySelectorAll('.travel-slide');
//     const randomTexts = [
//         'Adventure Awaits with Premium Quality',
//         'Explore the World in Style',
//         'Journey Beyond Limits',
//         'Discover New Horizons',
//         'Travel with Confidence',
//         'Experience Ultimate Comfort'
//     ];
    
//     if (slides.length === 0) return;
    
//     let currentSlide = 0;
    
//     // Function to show next slide
//     function showNextSlide() {
//         slides[currentSlide].classList.remove('active');
//         currentSlide = (currentSlide + 1) % slides.length;
//         slides[currentSlide].classList.add('active');
        
//         // Update random text
//         const randomTextEl = slides[currentSlide].querySelector('.random-text');
//         if (randomTextEl) {
//             const randomIndex = Math.floor(Math.random() * randomTexts.length);
//             randomTextEl.textContent = randomTexts[randomIndex];
//         }
//     }
    
//     // Auto-play slider every 4 seconds
//     setInterval(showNextSlide, 4000);
    
//     // Add click event to manually change slides
//     slides.forEach((slide, index) => {
//         slide.addEventListener('click', () => {
//             slides[currentSlide].classList.remove('active');
//             currentSlide = index;
//             slides[currentSlide].classList.add('active');
//         });
//     });
// }

// // Ensure all page components are loaded before initializing the catalog
// document.addEventListener('DOMContentLoaded', async () => {
//     productCardTemplate = await pageLoader();
//     await initHomepage();
// });
