// ===========================================================
// ================== UI Functions ============================
// ============================================================

import { updatePagination } from "./interractions.js";
import { productCardTemplatePath, productsPerPage, numberOfRandomProducts, numberOfRandomSets, imageCount, imageFolder} from "./file_links.js";
import { getProductsByField, getInfoById, getRandomItems, generateLoremIpsumParagraphs } from "./utils.js";
import { getCartTotal, clearCart } from "./logic.js";

// ===========================================================
// ================= Load Header and Footer =========================
// ===========================================================
/***************************************************************************
 * @name loadComponent - Loads a component into the page.
 * @param {string} id - The ID of the element to load into.
 * @param {string} url - The URL of the component file.
 * @returns {Promise<void>}
 **************************************************************************/
export async function loadComponent(id, url) {
  const component = document.getElementById(id);
  if (component) {
    try {
      const res = await fetch(url);
      component.innerHTML = await res.text();
    } catch (error) {
      console.error(`Failed to load component from ${url}:`, error);
    }
  } else {
    console.error(`Element with ID '${id}' not found in the DOM.`);
  }
}

// ===========================================================
// ================== General Renders============================
// ===========================================================

/**********************************************************************
 * @name populateProducts - Function to populate a container with a list of product cards.
 * This function handles both the main grid and the random products sidebar.
 * Optimized to reduce DOM operations by using DocumentFragment.
 * @param {Array<Object>} products - The array of product objects.
 * @param {string} containerSelector - The CSS selector for the container.
 * @param {string} templateId - The template ID to use.
 * @param {boolean} isSidebar - Whether this is a sidebar render.
 * @returns {Promise<void>}
 ****************************************************************************/
export async function populateProducts(products, containerSelector, templateId, isSidebar = false) {
	if (!Array.isArray(products) || products.length === 0) {
		console.warn(`populateProducts: No products to display in ${containerSelector}`);
		return;
	}
	
	const template = await loadCardTemplate(templateId);
  const container = document.querySelector(containerSelector);
	
	if (!container) {
		console.error(`populateProducts: Container ${containerSelector} not found`);
		return;
	}
	
	if (!template) {
		console.error(`populateProducts: Template ${templateId} not found`);
		return;
	}
	
  // Clear the container before adding new products
  container.innerHTML = '';
	
	// Use DocumentFragment for better performance
	const fragment = document.createDocumentFragment();
	
	if (isSidebar) {
		products.forEach(product => {
			const card = createSidebarProductCard(product, template);
			fragment.appendChild(card);
		});
	} else {
		products.forEach(product => {
			const card = createProductCard(product, template);
			fragment.appendChild(card);
		});
	}
	
	// Append all cards at once for better performance
	container.appendChild(fragment);
}

/**************************************************************************
 * @name renderStars - Renders star ratings for a product (with partially filled stars).
 * @param {number} rating - The rating value (0-5).
 * @param {HTMLElement} container - The container element to render stars into.
 **************************************************************************/
export function renderStars(rating, container) {
  container.innerHTML = '';
  for (let i = 1; i <= 5; i++) {
    const star = document.createElement('span');
    star.className = 'star-bg';
    container.appendChild(star);
    if (rating >= i) {
      star.classList.add('star-full');
    } else if (rating > i - 1) {
      const percent = (rating - (i - 1)) * 100;
      const starFill = document.createElement('span');
      starFill.className = 'star-fill';
      starFill.style.width = percent + '%';
      star.appendChild(starFill);
    }
  }
}

/************************************************************************
 * @name loadCardTemplate - Loads the product card template.
 * @param {string} selector - The CSS selector for the template within the fetched HTML.
 * @returns {Promise<Element>} The template element.
 ************************************************************************/
async function loadCardTemplate(selector) {
  const templateRes = await fetch(productCardTemplatePath);
	if (!templateRes.ok) {
		console.error(`Failed to load template from ${productCardTemplatePath}: ${templateRes.statusText}`);
		return null;
	}
  const templateHtml = await templateRes.text();
  const tempDiv = document.createElement('div');
  tempDiv.innerHTML = templateHtml;
  const template = tempDiv.querySelector(selector);
  return template;
}

// ===========================================================
// ================ Render Product Cards =================================
// ===========================================================

/************************************************************************* 
 * @name createProductCard - Helper function to create a single product card element from a template.
 * @param {Object} product - The product object containing details.
 * @param {HTMLTemplateElement} template - The template element for a single product card.
 * @returns {HTMLElement} - The populated product card element.
 *******************************************************************************/
	function createProductCard(product, template) {
    const cardClone = template.content.cloneNode(true);
    cardClone.querySelector('.product-card').setAttribute('data-product-id', product.id);
    cardClone.querySelector('.product-card-name').textContent = product.name;
    cardClone.querySelector('.product-card-price').textContent = `€${product.price}`;
    cardClone.querySelector('.product-card-img').src = product.imageUrl.replace('path/to/', 'assets/images/items/').replace('.jpg', '.png');
    cardClone.querySelector('.product-card-img').alt = product.name;    
    cardClone.querySelector('.badge-sale').style.display = (product.salesStatus === true || product.salesStatus === 'true') ? '' : 'none';
    return cardClone;
}

// =================================================================
// ================ Render Sidebar Product Cards ================================
// =================================================================

/*********************************************************************
 * @name createSidebarProductCard - Creates a sidebar product card element from a template.
 * @param {Object} product - The product object containing details.
 * @param {HTMLTemplateElement} template - The template element for a single product card.
 * @returns {HTMLElement} - The populated sidebar product card element.
 **************************************************************************/
function createSidebarProductCard(product, template) {
    const cardClone = template.content.cloneNode(true);
    const rating = cardClone.querySelector('.sidebar-product-rating');
    cardClone.querySelector('.sidebar-product-name').textContent = product.name;
    cardClone.querySelector('.sidebar-product-price').textContent = `$${product.price}`;
    cardClone.querySelector('.sidebar-product-img').src = product.imageUrl.replace('path/to/', 'assets/images/items/').replace('.jpg', '.png');
		renderStars(product.rating, rating);
    return cardClone;
}

/***************************************************************************
*@name renderRandomSetsSidebar - Renders random sets in the sidebar.
*@param {Array} allProducts - The array of all products.
*******************************************************************************/
export async function renderRandomSetsSidebar(allProducts) {
	const setProducts = getProductsByField(allProducts, 'category', 'luggage sets');
	const randomProducts = getRandomItems(setProducts, numberOfRandomSets);
	await populateProducts(randomProducts, '.random-products-list', '#sidebar-product-card-template', true);
}

// ===========================================================
// ================ Render Products for Sections======================
// ============================================================
/****************************************************************************************************
 * @name loadProductsMain - Fetch and display products in the specified container - main page.
 * @param {Array} products - The array of products to choose from.
 * @param {string} field - The product field to filter by (e.g., 'blocks').
 * @param {string} fieldValue - The value of the field to match (e.g., 'Selected Products').
 * @param {string} id - The CSS selector of the container to populate.
 *******************************************************************************************************/
export async function loadProductsMain(products, field, fieldValue, id) {
	  const selectedProducts = getProductsByField(products, field, fieldValue, id);
		const randomProducts = getRandomItems(selectedProducts, numberOfRandomProducts);  
		await populateProducts(randomProducts, id, '#product-card-template');
}

// ===========================================================
// ================ Render Products for Catalog Page======================
// ============================================================
/******************************************************************************
 * @name renderProductsForPage - Renders products for the catalog current page
 * @param {Array} products - The array of products to render.
 * @param {number} currentPage - The current page number.
 **********************************************************************************/
export async function renderProductsForPage(products,  currentPage) {
	const startIndex = (currentPage - 1) * productsPerPage;
  const endIndex = startIndex + productsPerPage;
  const productsToDisplay = products.slice(startIndex, endIndex);
  const grid = document.querySelector('.product-grid');
  grid.innerHTML = '';
  await populateProducts(productsToDisplay, '.product-grid', '#product-card-template');
  // Update product count display
  const productCountElement = document.querySelector('#product-count');
  if (productCountElement) {
    productCountElement.textContent = `Showing ${productsToDisplay.length ? (startIndex + 1) : 0}-${Math.min(endIndex, products.length)} of ${products.length} products`;
  }
	 updatePagination(products, currentPage);
}

// ===========================================================
// ================ Render Product Details Page =======================
// ============================================================

/******************************************************************************
 * @name renderProductDetailsPage - Renders the product details page.
 * @param {Object} product - The product object containing details.
 ******************************************************************************/
export function renderProductDetailsPage(product) {
	if (!product) {
		showNotFoundPopup('error', 'Product not found');
		return;
	}
  document.title = `${product.name} - Product Details`;
	const ratingEl = document.querySelector('.product-rating');
	document.querySelector('#product-name').textContent = product.name;
	document.querySelector('#product-price').textContent = `$${product.price}`;
	document.querySelector('#product-main-image').src = product.imageUrl.replace('path/to/', 'assets/images/items/').replace('.jpg', '.png');
	const imageThumbnails = document.querySelector('.image-thumbnails');
	imageThumbnails.innerHTML = '';
	for (let i = 1; i <= 4; i++) {
		const thumb = document.createElement('img');
		thumb.src = product.imageUrl.replace('path/to/', 'assets/images/items/').replace('.jpg', '.png');
		imageThumbnails.appendChild(thumb);
	}
	document.querySelector('#product-rating-text').textContent = `${product.popularity} || 0} Clients Reviewed`;
	if (ratingEl) renderStars(product.rating, ratingEl);
	const descriptionEl = generateLoremIpsumParagraphs(2, 3); //2 paragraphs, 3 sentences each
	document.querySelector('.product-description').innerHTML = descriptionEl || 'No description available.';

	document.querySelector('#filter-size .filter-btn').textContent = product.size || 'Choose option ▾';
	document.querySelector('#filter-color .filter-btn').textContent = product.color || 'Choose option ▾';
	document.querySelector('#filter-category .filter-btn').textContent = product.category || 'Choose option ▾';
}

// ===========================================================
// ================= Slider =====================================
// ===========================================================

/********************************************************************************************************
 * @name createSlides - Creates slides for the travel suitcases slider.
 ********************************************************************************************************/
export function createSlides(imageCount, numSlides, imageFolder) {
		const sliderContainer = document.getElementById("travel-slider");
		if (!sliderContainer) return;
		// all travel suitcase images
		const images = Array.from({ length: imageCount }, (_, i) => `${imageFolder}travel-suitcase${i + 1}.png`);
		let start = 0;

		function renderSlides(startIdx) {
			sliderContainer.innerHTML = '';
			for (let i = 0; i < numSlides; i++) {
				const imgIdx = (startIdx + i) % images.length;
				const slide = document.createElement("div");
				slide.className = "travel-slide";
				slide.style.backgroundImage = `linear-gradient(rgba(0, 0, 0, 0.4), rgba(0, 0, 0, 0.4)), url(${images[imgIdx]})`;
				slide.innerHTML = generateLoremIpsumParagraphs(1, 1);
				sliderContainer.appendChild(slide);
			}
		}

		renderSlides(start);
		setInterval(() => {
			start = (start + 1) % images.length;
			renderSlides(start);
		}, 3000);
	}
 
// ===========================================================
// ================= Cart Page Tables =====================
// ===========================================================

/***************************************************************************************************
 * @name displayCartItems - Displays cart items on the cart page.
 ***************************************************************************************************/
export async function displayCartItems() {
  const allCart = JSON.parse(localStorage.getItem('cart')) || [];
		if (!allCart || Object.keys(allCart).length === 0) {
			// Show empty cart message
			clearCart();
		} else {
			let allCartProducts = JSON.parse(localStorage.getItem('cart')) || [];
			let items = await getInfoById(allCartProducts);
			const cartTableBody = document.querySelector('#cart-tbody');
			cartTableBody.innerHTML = '';
			items.forEach(item => {
				const row = document.createElement('tr');
				row.innerHTML = `
				<td><img class="cart-item-image" src="${item.imageUrl.replace('path/to/', 'assets/images/items/').replace('.jpg', '.png')}" alt="Product Image"></td>
				<td class="cart-item-name">${item.name}</td>
				<td class="cart-item-price">$${item.price}</td>
				<td class="cart-item-quantity">
					<div class="quantity-controls">
						<button type="button" class="button-quantity minus" data-id="${item.id}">-</button>
						<input class="quantity" value="${item.quantity}" min="1" readonly>
						<button type="button" class="button-quantity plus" data-id="${item.id}">+</button>
					</div>
				</td>
				<td class="cart-item-total">$${item.price * item.quantity}</td>
				<td>
					<button class="delete-item-button">
						<img class="delete-icon" src="assets/images/icons/trash.svg" alt="Delete"data-id="${item.id}">
					</button>
				</td>
			`;
				cartTableBody.appendChild(row);
			});
  	// Update cart summary after rendering items
  	// initCartRowsControls();
		updateCartSummary(items);
	}
}

/***************************************************************************************************
 * @name updateCartSummary - Updates the cart summary section with totals.
 * @param {Array} cartItems - The array of cart items with price and quantity.
 ***************************************************************************************************/
function updateCartSummary(cartItems) {
	const { subtotal, discount, total } = getCartTotal(cartItems);
  document.getElementById('cart-subtotal-amount').textContent = `$${subtotal}`;
  document.getElementById('cart-discount-amount').textContent = `$${discount}`;
  // document.getElementById('cart-shipping-amount').textContent = `$${shipping}`;
  document.getElementById('cart-total-amount').textContent = `$${total}`;
}

// //==================================================================
// // ================= Notifications =====================
// //==================================================================

// /****************************************************************************
//  * @name showNotFoundPopup - Shows a "Product not found" popup notification.
//  * @param {string} label - The label for the notification (e.g., 'error').
//  * @param {string} message - The message to display in the notification.
//  *****************************************************************************/
// export function showNotFoundPopup(label, message) {
//   // Create backdrop to make page inactive
//   const backdrop = document.createElement('div');
//   backdrop.className = 'notification-backdrop';
//   const popup = document.createElement('div');
//   popup.className = 'notification ' + (label || 'error');
//   popup.textContent = message || 'Product not found';
//   document.body.appendChild(backdrop);
//   document.body.appendChild(popup);
//   setTimeout(() => {
//     popup.remove();
//     backdrop.remove();
//   }, 3000);
// }
