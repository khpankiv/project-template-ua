// ===========================================================
// ================== Buttons Handlers =========================
// ============================================================
import { displayCartItems, renderProductsForPage } from './ui.js';
import { productsPerPage} from "./file_links.js";
import { addToCart, removeFromCart, clearCart } from './logic.js';
import notificationManager from './notifications.js';
import { initReviewForm, initStarRating } from './forms.js';
import { updateCartCounter } from './header.js';

// =================================================================
// ===================Product Card Interactions=====================
// =============================================================

/**********************************************************************
 * @name initAddToCartButtons	- Initialize Add to Cart Buttons Click.
 **************************************************************************/
export function initAddToCartButtons() {
  document.addEventListener('click', (e) => {
    if (e.target.classList.contains('button-add')) {
      const card = e.target.closest('.product-card');
      const id = card ? card.getAttribute('data-product-id') : null;
      
      if (id) {
        const productName = card.querySelector('h3')?.textContent || 'Product';
        addToCart(id);
        
        // Show product added notification
        notificationManager.showCartNotification(
          'product-added', 
          `${productName} added to cart`
        );
      } else {
        // Show error if product not found
        notificationManager.showCartNotification('product-not-found');
      }
      
      e.stopPropagation();
    }
  });
}

/*****************************************************************************
 * @name initClickCard - Initialize Click on Product Card to go to details page.
 * @param {string} productId - The ID of the product to view details.
 *****************************************************************************/
export function initClickCard() {
  document.addEventListener('click', (e) => {
    const card = e.target.closest('.product-card');
    if (card && !e.target.classList.contains('button-add')) {
      const product = card.getAttribute('data-product-id');
      if (product) {
        window.location.href = `pages/product-details-template.html?id=${product}`;
        e.stopPropagation();
      }
    }
  });
}

// =================================================================
// ===================Catalog Page Interactions=====================
// =============================================================

/*******************************************************************************
 * @name initPaginationButtons - Initialize Pagination Buttons Click.
 * @param {Array} products - The array of filtered products.
 * @param {number} currentPage - The current page number.
 *******************************************************************************/
export async function initPaginationButtons(products, currentPage) {
		const nextPageBtn = document.querySelector('#button-next-page');
		const prevPageBtn = document.querySelector('#button-previous-page');

		if (nextPageBtn) {
			nextPageBtn.addEventListener('click', async () => {
				currentPage = currentPage + 1;
				await renderProductsForPage(products, currentPage);
			});
		}
		if (prevPageBtn) {
			prevPageBtn.addEventListener('click', async () => {
				currentPage = currentPage - 1;
				await renderProductsForPage(products, currentPage);
			});
		}
	}

  /****************************************************************************
 * @name updatePagination - Updates pagination buttons dynamically.
 * @param {Array} products - The array of filtered products.
 * @param {number} currentPage - The current page number.
 *********************************************************************************/
export async function updatePagination(products, currentPage) {
  const totalPages = Math.ceil(products.length / productsPerPage);
  const pageNumberContainer = document.querySelector('#page-number');
  if (!pageNumberContainer) return;
  // Clear pagination container safely
  while (pageNumberContainer.firstChild) {
    pageNumberContainer.removeChild(pageNumberContainer.firstChild);
  }
  // Create page number buttons
  for (let i = 1; i <= totalPages; i++) {
    const btn = document.createElement('button');
    btn.className = `button-page-number${i === currentPage ? ' selected' : ''}`;
    btn.textContent = i;
    btn.addEventListener('click', async () => {
      const newPage = i;
      await renderProductsForPage(products, newPage);
    });
    pageNumberContainer.appendChild(btn);
  }
  // Update prev/next button state
  const prevBtn = document.querySelector('#button-previous-page');
  const nextBtn = document.querySelector('#button-next-page');
  if (prevBtn) {
    if (currentPage === 1) {
      prevBtn.style.opacity = '0';
      prevBtn.style.pointerEvents = 'none';
      prevBtn.classList.add('disabled');
    } else {
      prevBtn.style.opacity = '1';
      prevBtn.style.pointerEvents = '';
      prevBtn.classList.remove('disabled');
			prevBtn.addEventListener('click', async () => {
			currentPage = currentPage - 1;
			await renderProductsForPage(products, currentPage);
			});
    }
  }
  if (nextBtn) {
    if (currentPage === totalPages || totalPages === 0) {
      nextBtn.style.opacity = '0';
      nextBtn.style.pointerEvents = 'none';
    } else {
      nextBtn.style.opacity = '1';
      nextBtn.style.pointerEvents = '';
			nextBtn.addEventListener('click', async () => {
			currentPage = currentPage + 1;
			await renderProductsForPage(products, currentPage);
      });
    }
  }
}

// =================================================================
// ===================Product Details Page Interactions=====================
// =============================================================

/******************************************************************************************
 * @name initQuantityControls - Initialize quantity selection controls on product details page.
 *****************************************************************************************/
export function initQuantityControls() {
		const minusBtn = document.querySelector('.minus');
		const plusBtn = document.querySelector('.plus');
		const quantityInput = document.querySelector('.quantity');
		let currentQuantity = quantityInput ? quantityInput.value : 1;
		minusBtn.addEventListener('click', () => {
				if (currentQuantity > 1) {
						currentQuantity--;
						quantityInput.value = currentQuantity;
				}
		});
		
		plusBtn.addEventListener('click', () => {
				currentQuantity++;
				quantityInput.value = currentQuantity;
		});
		
		quantityInput.addEventListener('change', (e) => {
				const value = parseInt(e.target.value);
				if (value >= 1) {
						currentQuantity = value;
				} else {
						currentQuantity = 1;
						e.target.value = 1;
				}
		});
}

/****************************************************************************
 * @name initAddQuantity - Add product to cart from product details page
 *********************************************************************************/
export function initAddQuantity() {
  const addToCartButton = document.querySelector('#add-multiple-products');
  if (addToCartButton) {
    addToCartButton.addEventListener('click', () => {
      const productId = new URLSearchParams(window.location.search).get('id');
      const quantity = parseInt(document.querySelector('.quantity').value) || 1;
      
      // Get product name for notification
      const productName = document.querySelector('#product-name')?.textContent || 'Product';
      
      // Add to cart
      addToCart(productId, quantity);
      
      // Show success notification
      notificationManager.showCartNotification(
        'product-added', 
        `${quantity} × ${productName} added to cart`
      );
    });
  }
}

/*************************************************************************************
 * @name initTabs - Initialize tabs functionality
 *************************************************************************************/
export function initTabs() {
		initReviewForm();
		initStarRating();
		const tabButtons = document.querySelectorAll('.button-tab');
		const tabContents = document.querySelectorAll('.tab-pane');
		tabButtons.forEach((button, index) => {
				button.addEventListener('click', () => {
						// Remove active class from all tabs and contents
						tabButtons.forEach(btn => btn.classList.remove('active'));
						tabContents.forEach(content => content.classList.remove('active'));
						// Add active class to clicked tab and corresponding content
						button.classList.add('active');
						if (tabContents[index]) {
								tabContents[index].classList.add('active');
						}
				});
		});
		
		if (tabButtons[1].classList.contains('active')) {initReviewForm();}

		// Set first tab as active by default
		if (tabButtons.length > 0) {
				tabButtons[1].classList.add('active');
				if (tabContents[1]) {
						tabContents[1].classList.add('active');
				}
		}
}

// =================================================================
// ===================Cart Page Interactions=====================
// =============================================================

/*************************************************************************************
 * @name initClearCartButton - Initialize Clear Cart button functionality
 *************************************************************************************/
	export function initClearCartButton() {
const clearCartButton = document.querySelector('#clear-shopping-cart');
	if (clearCartButton) {
		clearCartButton.addEventListener('click', () => {
			clearCart();
			
			// Show cart cleared notification
			notificationManager.showCartNotification('cart-cleared');
			
			// Update header cart counter
			updateCartCounter();
			// Update display to show empty cart message
			displayCartItems();
		});
	}
}/*************************************************************************************
 * @name initCheckoutButton - Initialize Checkout button functionality
 *************************************************************************************/
export function initCheckoutButton() {
	const checkoutButton = document.querySelector('#checkout-button');
	if (checkoutButton) {
		checkoutButton.addEventListener('click', () => {
			// Check if cart has items
			const cart = JSON.parse(localStorage.getItem('shoppingCart')) || [];
			
			if (cart.length === 0) {
				notificationManager.showCartNotification('cart-empty');
				return;
			}
			
			// Clear cart after successful checkout
			clearCart();
			
			// Show checkout success notification
			notificationManager.showCartNotification('checkout-success');
			
			// Update page display
			setTimeout(() => {
				displayCartItems();
			}, 1000);
		});
	}		
}

/*************************************************************************************
 * @name handleMinusClick - Handle minus button click in cart
 *************************************************************************************/
function handleMinusClick(cartKey, productId) {
	if (cartKey) {
		removeFromCart(cartKey, 1);
	} else if (productId) {
		addToCart(productId, -1);
	}
	updateCartCounter();
	displayCartItems();
}

/*************************************************************************************
 * @name handlePlusClick - Handle plus button click in cart
 *************************************************************************************/
function handlePlusClick(cartKey, productId) {
	if (cartKey) {
		const cart = JSON.parse(localStorage.getItem('shoppingCart')) || {};
		if (cart[cartKey]) {
			cart[cartKey].quantity += 1;
			localStorage.setItem('shoppingCart', JSON.stringify(cart));
			updateCartCounter();
		}
	} else if (productId) {
		addToCart(productId, 1);
	}
	displayCartItems();
}

/*************************************************************************************
 * @name handleDeleteClick - Handle delete button click in cart
 *************************************************************************************/
function handleDeleteClick(cartKey, productId) {
	if (cartKey) {
		removeFromCart(cartKey, Infinity);
	} else if (productId) {
		removeFromCart(productId, Infinity);
	}
	updateCartCounter();
	displayCartItems();
}

/*************************************************************************************
 * @name initCartRowsControls - Initialize cart row controls (plus, minus, delete)
 *************************************************************************************/
export function initCartRowsControls() {
	const cartTableBody = document.querySelector('#cart-tbody');
	if (!cartTableBody) return;
	
	cartTableBody.addEventListener('click', (e) => {
		const cartKey = e.target.getAttribute('data-cart-key');
		const productId = e.target.getAttribute('data-id');
		
		const isMinus = e.target.classList.contains('minus') || 
			(e.target.classList.contains('button-quantity') && e.target.textContent === '-');
		const isPlus = e.target.classList.contains('plus') || 
			(e.target.classList.contains('button-quantity') && e.target.textContent === '+');
		const isDelete = e.target.classList.contains('delete-icon');
		
		if (isMinus) {
			handleMinusClick(cartKey, productId);
		} else if (isPlus) {
			handlePlusClick(cartKey, productId);
		} else if (isDelete) {
			handleDeleteClick(cartKey, productId);
		}
	});
}
