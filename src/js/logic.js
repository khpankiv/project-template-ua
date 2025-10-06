// =====================================================================================
// Different Cart functions
// =====================================================================================
import { updateCartCounter } from './header.js';
import { dataFile } from './file_links.js';
import { fetchProducts } from './utils.js';
import { getProductsByField } from './utils.js';
import notificationManager from './notifications.js';
// import { renderProductsForPage } from './ui.js';

/*************************************************************************************************
 * @name addToCart - Adds a specified quantity of a product to the cart.
 * @param {string} id - The ID of the product to add.
 * @param {number} quantity - The quantity to add (default is 1).
 ****************************************************************************************************/
export async function addToCart(id, quantity = 1) {
    // Get product details to create smart cart key
    const allProducts = await fetchProducts(dataFile);
    const product = allProducts.find(p => p.id === id);
    
    if (!product) return;
    
    let cart = JSON.parse(localStorage.getItem('shoppingCart')) || {};
    
    // Create unique key based on name, size, and color
    const cartKey = `${product.name}|${product.size}|${product.color}`;
    
    // If entry exists, add to quantity, otherwise create new entry
    if (cart[cartKey]) {
        cart[cartKey].quantity += quantity;
    } else {
        cart[cartKey] = {
            id: product.id,
            name: product.name,
            size: product.size,
            color: product.color,
            price: product.price,
            quantity: quantity,
            imageUrl: product.imageUrl
        };
    }
    
    localStorage.setItem('shoppingCart', JSON.stringify(cart));
    updateCartCounter();
}

/*************************************************************************************************
 * @name removeFromCart - Removes a specified quantity of a product from the cart.
 * @param {string} id - The ID of the product to remove.
 * @param {number} quantity - The quantity to remove (default is 1).
 ****************************************************************************************************/
export function removeFromCart(cartKey, quantity = 1) {
    let cart = JSON.parse(localStorage.getItem('shoppingCart')) || {};
    
    if (cart[cartKey]) {
        if (quantity === Infinity) {
            // Remove entire entry
            delete cart[cartKey];
        } else {
            cart[cartKey].quantity -= quantity;
            if (cart[cartKey].quantity <= 0) {
                delete cart[cartKey];
            }
        }
    }
    
    localStorage.setItem('shoppingCart', JSON.stringify(cart));
    updateCartCounter();
}

/*************************************************************************************************
 * @name clearCart - Clears all items from the cart.
 ****************************************************************************************************/
export function clearCart() {
    localStorage.removeItem('shoppingCart');
    updateCartCounter();
		document.querySelector('#cart-empty-message').style.display = 'block';
		document.querySelector('.cart-table').style.display = 'none';
		document.querySelector('.cart-summary').style.display = 'none';
		document.querySelector('#clear-shopping-cart').style.display = 'none';
}

/*************************************************************************************************
 * @name getCartTotal - Calculates the total price, discount, and subtotal for the cart.
 * @param {Array} cartItems - Array of cart items with price and quantity.
 * @returns {Object} - An object containing subtotal, discount, and total.
 ****************************************************************************************************/
export function getCartTotal(cartItems) {
  const subtotal = cartItems.reduce((sum, item) => sum + item.price * item.quantity, 0);
  let discount = 0;
  if (subtotal > 3000) {
    discount = Math.round(subtotal * 0.1);
  }
  const shipping = 30;
  const total = subtotal - discount + shipping;
  return {
    subtotal: subtotal,
    discount: discount,
    total: total
  };
}

// ===========================================================
// =================== Filters and Sorting =======================
// ===========================================================

/********************************************************************************************
 * @name readActualFilters - Reads the actual selected filters from the DOM.
 * @returns {Object} The current filter state object.
 ********************************************************************************************/
export function readActualFilters() {
	let filters = {category: undefined, color: undefined, size: undefined, salesStatus: undefined, sort: undefined};
  filters = {
	category: document.querySelector('#filter-category span') ? document.querySelector('#filter-category span').textContent : undefined,
		color: document.querySelector('#filter-color span') ? document.querySelector('#filter-color span').textContent : undefined,
		size: document.querySelector('#filter-size span') ? document.querySelector('#filter-size span').textContent : undefined,
		salesStatus: document.querySelector('#filter-sales-status input') ? document.querySelector('#filter-sales-status input').checked : undefined,
	};
	return filters;
}

/*********************************************************************
//  * @name applyFilters - Applies a single filter to the product list.
//  * @returns {Array} The filtered products array.
//  *******************************************************************/
export async function applyFilters() {
		const allProducts = await fetchProducts(dataFile);
		const filters = readActualFilters();
		let products = allProducts;
		for (let category in filters) {
			if (filters[category] && filters[category] !== 'Choose option' && filters[category] !== 'All' && category !== 'salesStatus') {
				products = getProductsByField(products, category, filters[category]);
			}
		}
		if (filters['salesStatus']) {
			products = products.filter(product => product.salesStatus === true);
		}
		const sort = document.querySelector('#sort-dropdown .selected') ? document.querySelector('#sort-dropdown .selected').dataset.value : undefined;
		if (sort) {
			products = handleSort(products, sort);
		}
		return products;
}

/*****************************************************************************
 * @name handleSort - Handles sorting of the filtered products.
 * @param {Array} products - The array of filtered products to sort.
 * @param {string} sortValue - The sort option value (e.g., 'price-asc', 'default').
 * @returns {Array} The sorted products array.
 *********************************************************************************/
export function handleSort(products, sortValue) {
		switch (sortValue) {
			case 'price-asc':
				products.sort((a, b) => a.price - b.price);
				break;
			case 'price-desc':
				products.sort((a, b) => b.price - a.price);
				break;
			case 'name-asc':
				products.sort((a, b) => a.name.localeCompare(b.name));
				break;
			case 'name-desc':
				products.sort((a, b) => b.name.localeCompare(a.name));
				break;
			case 'popularity':
				products.sort((a, b) => b.popularity - a.popularity);
				break;
			case 'rating':
				products.sort((a, b) => b.rating - a.rating);
				break;
			case 'default':
				products.sort((a, b) => a.id - b.id); // Assuming original order is by ID
				break;
		}
		return products;
}

/************************************************************************************************
 * @name doSearch - Handles the search functionality.
 * @param {Array} allProducts - The array of all products.
 * @param {string} query - The search query string.
 *****************************************************************************************************/
export function doSearch (products, searchInput) {
		const query = searchInput.trim().toLowerCase();
		
		// Check if search query is entered
		if (!query) {
			notificationManager.showToast('warning', 'Enter product name to search');
			return;
		}
		
		// Search product by name
		const exactMatch = products.find(product => 
			product.name.toLowerCase().includes(query)
		);
		
		if (!exactMatch) {
			notificationManager.showCartNotification('product-not-found');
			return;
		} else {		
			// Show quick notification about found product
			notificationManager.showToast('success', `Found: ${exactMatch.name}`);
			setTimeout(() => {
				window.location.href = `pages/product-details-template.html?id=${exactMatch.id}`;
			}, 500);
		}
}
