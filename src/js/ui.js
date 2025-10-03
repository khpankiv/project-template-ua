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
 * Improved version with smooth transitions and accessibility.
 ********************************************************************************************************/
export function createSlides(imageCount, numSlides, imageFolder) {
		const sliderContainer = document.getElementById("travel-slider");
		if (!sliderContainer) return;
		
		// all travel suitcase images
		const images = Array.from({ length: imageCount }, (_, i) => `${imageFolder}travel-suitcase${i + 1}.png`);
		const phrases = [
			'Adventure Awaits with Premium Quality',
			'Explore the World in Style',
			'Journey Beyond Limits',
			'Discover New Horizons',
			'Travel with Confidence',
			'Experience Ultimate Comfort',
			'Your Perfect Travel Companion',
			'Quality That Goes the Distance'
		];
		
		let currentIndex = 0;
		let isTransitioning = false;

		// Create navigation buttons
		const prevBtn = document.createElement('button');
		prevBtn.className = 'travel-slider-arrow travel-slider-arrow-left';
		prevBtn.innerHTML = '&#8592;';
		prevBtn.setAttribute('aria-label', 'Previous slide');
		prevBtn.setAttribute('tabindex', '0');
		
		const nextBtn = document.createElement('button');
		nextBtn.className = 'travel-slider-arrow travel-slider-arrow-right';
		nextBtn.innerHTML = '&#8594;';
		nextBtn.setAttribute('aria-label', 'Next slide');
		nextBtn.setAttribute('tabindex', '0');

		// Initial render - create all slides at once
		function initSlides() {
			sliderContainer.innerHTML = '';
			for (let i = 0; i < numSlides; i++) {
				const imgIdx = i % images.length;
				const slide = document.createElement("div");
				slide.className = "travel-slide";
				slide.style.backgroundImage = `linear-gradient(rgba(0, 0, 0, 0.4), rgba(0, 0, 0, 0.4)), url(${images[imgIdx]})`;
				slide.setAttribute('role', 'group');
				slide.setAttribute('aria-label', `Slide ${i + 1} of ${numSlides}`);
				
				const textContent = document.createElement('p');
				textContent.className = 'travel-slide-text';
				textContent.textContent = phrases[imgIdx % phrases.length];
				slide.appendChild(textContent);
				
				sliderContainer.appendChild(slide);
			}
			
			// Add navigation buttons after slides
			sliderContainer.parentElement.appendChild(prevBtn);
			sliderContainer.parentElement.appendChild(nextBtn);
		}

		// Update slides smoothly - only change background images
		function updateSlides(direction = 1) {
			if (isTransitioning) return;
			isTransitioning = true;
			
			currentIndex = (currentIndex + direction + images.length) % images.length;
			
			const slides = sliderContainer.querySelectorAll('.travel-slide');
			slides.forEach((slide, i) => {
				const imgIdx = (currentIndex + i) % images.length;
				
				// Add fade-out class
				slide.classList.add('travel-slide-transition');
				
				// Update background and text after a short delay
				setTimeout(() => {
					slide.style.backgroundImage = `linear-gradient(rgba(0, 0, 0, 0.4), rgba(0, 0, 0, 0.4)), url(${images[imgIdx]})`;
					const textEl = slide.querySelector('.travel-slide-text');
					if (textEl) {
						textEl.textContent = phrases[imgIdx % phrases.length];
					}
					
					// Remove transition class
					setTimeout(() => {
						slide.classList.remove('travel-slide-transition');
						isTransitioning = false;
					}, 300);
				}, 150);
			});
		}

		// Event listeners
		prevBtn.addEventListener('click', () => updateSlides(-1));
		nextBtn.addEventListener('click', () => updateSlides(1));
		
		// Keyboard navigation
		document.addEventListener('keydown', (e) => {
			if (e.key === 'ArrowLeft') {
				updateSlides(-1);
			} else if (e.key === 'ArrowRight') {
				updateSlides(1);
			}
		});

		// Auto-play
		let autoPlayInterval = setInterval(() => updateSlides(1), 4000);
		
		// Pause on hover
		sliderContainer.addEventListener('mouseenter', () => {
			clearInterval(autoPlayInterval);
		});
		
		sliderContainer.addEventListener('mouseleave', () => {
			autoPlayInterval = setInterval(() => updateSlides(1), 4000);
		});

		// Touch/swipe support
		let touchStartX = 0;
		let touchEndX = 0;
		
		sliderContainer.addEventListener('touchstart', (e) => {
			touchStartX = e.changedTouches[0].screenX;
		}, { passive: true });
		
		sliderContainer.addEventListener('touchend', (e) => {
			touchEndX = e.changedTouches[0].screenX;
			handleSwipe();
		}, { passive: true });
		
		function handleSwipe() {
			const swipeThreshold = 50;
			const diff = touchStartX - touchEndX;
			
			if (Math.abs(diff) > swipeThreshold) {
				if (diff > 0) {
					updateSlides(1); // Swipe left
				} else {
					updateSlides(-1); // Swipe right
				}
			}
		}

		initSlides();
	}

// ===========================================================
// ================= Product Slider ===========================
// ===========================================================

/********************************************************************************************************
 * @name createProductSlider - Creates a reusable product slider with navigation.
 * @param {string} containerId - The ID of the container element.
 * @param {number} itemsPerView - Number of items to show at once on desktop (default: 4).
 ********************************************************************************************************/
export function createProductSlider(containerId, itemsPerView = 4) {
	const container = document.querySelector(containerId);
	if (!container) return;
	
	// Get current items
	const items = Array.from(container.children);
	if (items.length === 0) return;
	
	// Check if we need a slider (only if more items than can be shown)
	const needsSlider = items.length > itemsPerView;
	if (!needsSlider) {
		// Just add grid layout without slider
		container.classList.add('product-slider-no-scroll');
		return;
	}
	
	let currentIndex = 0;
	let isTransitioning = false;
	
	// Wrap container in slider wrapper
	const wrapper = document.createElement('div');
	wrapper.className = 'product-slider-wrapper';
	container.parentNode.insertBefore(wrapper, container);
	wrapper.appendChild(container);
	
	// Add slider class to container
	container.classList.add('product-slider-track');
	
	// Create navigation buttons
	const prevBtn = document.createElement('button');
	prevBtn.className = 'product-slider-arrow product-slider-arrow-left';
	prevBtn.innerHTML = '&#8592;';
	prevBtn.setAttribute('aria-label', 'Previous products');
	prevBtn.setAttribute('tabindex', '0');
	
	const nextBtn = document.createElement('button');
	nextBtn.className = 'product-slider-arrow product-slider-arrow-right';
	nextBtn.innerHTML = '&#8594;';
	nextBtn.setAttribute('aria-label', 'Next products');
	nextBtn.setAttribute('tabindex', '0');
	
	wrapper.appendChild(prevBtn);
	wrapper.appendChild(nextBtn);
	
	// Calculate responsive items per view
	function getItemsPerView() {
		const width = window.innerWidth;
		if (width < 768) return 1; // Mobile: 1 item
		if (width < 1024) return 2; // Tablet: 2 items
		return itemsPerView; // Desktop: default (4 items)
	}
	
	// Update slider position
	function updateSlider() {
		const currentItemsPerView = getItemsPerView();
		const maxIndex = Math.max(0, items.length - currentItemsPerView);
		
		// Ensure index is within bounds
		currentIndex = Math.max(0, Math.min(currentIndex, maxIndex));
		
		// Calculate offset (percentage based)
		const itemWidth = 100 / currentItemsPerView;
		const offset = -(currentIndex * itemWidth);
		
		container.style.transform = `translateX(${offset}%)`;
		
		// Update button states
		prevBtn.disabled = currentIndex === 0;
		nextBtn.disabled = currentIndex >= maxIndex;
		
		prevBtn.classList.toggle('disabled', currentIndex === 0);
		nextBtn.classList.toggle('disabled', currentIndex >= maxIndex);
	}
	
	// Navigation functions
	function goToNext() {
		if (isTransitioning) return;
		const currentItemsPerView = getItemsPerView();
		const maxIndex = Math.max(0, items.length - currentItemsPerView);
		
		if (currentIndex < maxIndex) {
			isTransitioning = true;
			currentIndex++;
			updateSlider();
			setTimeout(() => { isTransitioning = false; }, 400);
		}
	}
	
	function goToPrev() {
		if (isTransitioning) return;
		
		if (currentIndex > 0) {
			isTransitioning = true;
			currentIndex--;
			updateSlider();
			setTimeout(() => { isTransitioning = false; }, 400);
		}
	}
	
	// Event listeners
	prevBtn.addEventListener('click', goToPrev);
	nextBtn.addEventListener('click', goToNext);
	
	// Touch/swipe support
	let touchStartX = 0;
	let touchEndX = 0;
	
	container.addEventListener('touchstart', (e) => {
		touchStartX = e.changedTouches[0].screenX;
	}, { passive: true });
	
	container.addEventListener('touchend', (e) => {
		touchEndX = e.changedTouches[0].screenX;
		handleSwipe();
	}, { passive: true });
	
	function handleSwipe() {
		const swipeThreshold = 50;
		const diff = touchStartX - touchEndX;
		
		if (Math.abs(diff) > swipeThreshold) {
			if (diff > 0) {
				goToNext(); // Swipe left
			} else {
				goToPrev(); // Swipe right
			}
		}
	}
	
	// Keyboard navigation
	prevBtn.addEventListener('keydown', (e) => {
		if (e.key === 'Enter' || e.key === ' ') {
			e.preventDefault();
			goToPrev();
		}
	});
	
	nextBtn.addEventListener('keydown', (e) => {
		if (e.key === 'Enter' || e.key === ' ') {
			e.preventDefault();
			goToNext();
		}
	});
	
	// Update on window resize
	let resizeTimeout;
	window.addEventListener('resize', () => {
		clearTimeout(resizeTimeout);
		resizeTimeout = setTimeout(() => {
			updateSlider();
		}, 150);
	});
	
	// Initial update
	updateSlider();
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
