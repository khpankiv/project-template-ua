// =====================================================================================
// Different Cart functions
// =====================================================================================
import { updateCartCounter } from './header.js';
import { dataFile } from './file_links.js';
import { fetchProducts, getInfoById } from './utils.js';
import { getProductsByField } from './utils.js';
import { showMessage } from './forms.js';
// import { renderProductsForPage } from './ui.js';

/*************************************************************************************************
 * @name addToCart - Adds a specified quantity of a product to the cart.
 * @param {string} id - The ID of the product to add.
 * @param {number} quantity - The quantity to add (default is 1).
 * @param {string} size - The size of the product (optional).
 * @param {string} color - The color of the product (optional).
 ****************************************************************************************************/
export async function addToCart(id, quantity = 1, size = null, color = null) {
    let cart = JSON.parse(localStorage.getItem('cart')) || [];
    
    // Get product info to retrieve name, size, and color
    const productInfo = await getInfoById(id);
    if (!productInfo) {
        console.error('Product not found:', id);
        return;
    }
    
    const productName = productInfo.name;
    const productSize = size || productInfo.size;
    const productColor = color || productInfo.color;
    
    // Find existing cart item with matching name, size, and color
    const existingItem = cart.find(item => 
        item.name === productName && 
        item.size === productSize && 
        item.color === productColor
    );
    
    if (existingItem) {
        // Merge: update quantity of existing item
        existingItem.quantity += quantity;
    } else {
        // Create new cart entry
        cart.push({
            id: id,
            name: productName,
            size: productSize,
            color: productColor,
            quantity: quantity
        });
    }
    
    localStorage.setItem('cart', JSON.stringify(cart));
    updateCartCounter();
    showMessage('Product added to cart!', 'success', '#cart-counter');
}

/*************************************************************************************************
 * @name removeFromCart - Removes a specified quantity of a product from the cart.
 * @param {string} id - The ID of the product to remove.
 * @param {number} quantity - The quantity to remove (default is 1).
 * @param {string} size - The size of the product (optional).
 * @param {string} color - The color of the product (optional).
 ****************************************************************************************************/
export async function removeFromCart(id, quantity = 1, size = null, color = null) {
    let cart = JSON.parse(localStorage.getItem('cart')) || [];
    
    // Get product info to retrieve name, size, and color
    const productInfo = await getInfoById(id);
    if (!productInfo) {
        console.error('Product not found:', id);
        return;
    }
    
    const productName = productInfo.name;
    const productSize = size || productInfo.size;
    const productColor = color || productInfo.color;
    
    // Find the cart item with matching name, size, and color
    const itemIndex = cart.findIndex(item => 
        item.name === productName && 
        item.size === productSize && 
        item.color === productColor
    );
    
    if (itemIndex !== -1) {
        cart[itemIndex].quantity -= quantity;
        
        // Remove item if quantity is 0 or less
        if (cart[itemIndex].quantity <= 0) {
            cart.splice(itemIndex, 1);
        }
    }
    
    localStorage.setItem('cart', JSON.stringify(cart));
    updateCartCounter();
    showMessage('Product removed from cart!', 'info', '#cart-counter');
}

/*************************************************************************************************
 * @name clearCart - Clears all items from the cart.
 ****************************************************************************************************/
export function clearCart() {
    localStorage.removeItem('cart');
    updateCartCounter();
		document.querySelector('#cart-empty-message').style.display = 'block'; // #cart-empty-message
		document.querySelector('.cart-table').style.display = 'none';
		document.querySelector('.cart-summary').style.display = 'none';
		document.querySelector('#clear-shopping-cart').style.display = 'none';
		// document.querySelector('#checkout-button').style.display = 'none';
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
		salesStatus: document.querySelector('#filter-salesStatus input') ? document.querySelector('#filter-salesStatus input').checked : undefined,
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
		// First matched product by name
		const exactMatch = products.find(product => product.name.toLowerCase().includes(query));
		if (!exactMatch) {
			showNotFoundPopup( 'Product not found', 'error', '#search-input');
			return;
		} else {		
			window.location.href = `src/pages/product-details-template.html?id=${exactMatch.id}`;
		}
}
