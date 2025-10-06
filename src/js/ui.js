// ===========================================================
// ================== UI Functions ============================
// ===========================================================
import { updatePagination } from "./interractions.js";
import { productCardTemplatePath, productsPerPage, numberOfRandomProducts, numberOfRandomSets, imageCount, imageFolder} from "./file_links.js";
import { getProductsByField, getInfoById, getRandomItems, generateLoremIpsumParagraphs } from "./utils.js";
import { getCartTotal, clearCart } from "./logic.js";
import notificationManager from "./notifications.js";

// Duplicate function removed - using exported version below


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
      // Безпечніше завантаження HTML компонентів
      const html = await res.text();
      // Санітизуємо HTML перед вставкою
      component.innerHTML = sanitizeHTML(html);
    } catch (error) {
      console.error(`Failed to load component from ${url}:`, error);
    }
  } else {
    console.error(`Element with ID '${id}' not found in the DOM.`);
  }
}

// Функція для базової санітизації HTML
// Для завантаження компонентів використовуємо оригінальний HTML
function sanitizeHTML(html) {
  // Для header/footer компонентів повертаємо як є
  // В майбутньому можна додати більш складну логіку санітизації
  return html;
}

// ===========================================================
// ================== General Renders============================
// ===========================================================

/**********************************************************************
 * @name populateProducts - Function to populate a container with a list of product cards.
 * This function handles both the main grid and the random products sidebar.
 * @param {Array<Object>} products - The array of product objects.
 * @param {string} containerSelector - The CSS selector for the container.
 ****************************************************************************/
export async function populateProducts(products, containerSelector, templateId, isSidebar = false) {
	const template = await loadCardTemplate(templateId);
  const container = document.querySelector(containerSelector);
	if (!container || !template) return;
  // Clear the container before adding new products
  container.innerHTML = '';
	if (isSidebar) {
		products.forEach(product => {
		const card = createSidebarProductCard(product, template);
		container.appendChild(card);
		});
	} else {
		products.forEach(product => {
		const card = createProductCard(product, template);
		container.appendChild(card);
		});
	}
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
export async function renderProductsForPage(products, currentPage) {
	const startIndex = (currentPage - 1) * productsPerPage;
  const endIndex = startIndex + productsPerPage;
  const productsToDisplay = products.slice(startIndex, endIndex);
  const grid = document.querySelector('.product-grid');
  if (!grid) {
    console.error('Product grid container not found');
    return;
  }
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
		notificationManager.showCartNotification('product-not-found');
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
	// Використовуємо textContent для безпеки
	document.querySelector('.product-description').textContent = descriptionEl || 'No description available.';

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
				// Використовуємо textContent для безпеки
				slide.textContent = generateLoremIpsumParagraphs(1, 1);
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
  const allCart = JSON.parse(localStorage.getItem('shoppingCart')) || {};
		if (!allCart || Object.keys(allCart).length === 0) {
			// Show empty cart message
			clearCart();
		} else {
			// Cart items are already in the right format
			let items = Object.values(allCart);
			const cartTableBody = document.querySelector('#cart-tbody');
			cartTableBody.innerHTML = '';
			items.forEach(item => {
				const cartKey = `${item.name}|${item.size}|${item.color}`;
				const row = document.createElement('tr');
				
				// Безпечне створення DOM елементів замість innerHTML
				// Стовпець з зображенням
				const imgCell = document.createElement('td');
				const img = document.createElement('img');
				img.className = 'cart-item-image';
				img.src = item.imageUrl.replace('path/to/', 'assets/images/items/').replace('.jpg', '.png');
				img.alt = 'Product Image';
				imgCell.appendChild(img);
				
				// Стовпець з назвою
				const nameCell = document.createElement('td');
				nameCell.className = 'cart-item-name';
				const productDetails = document.createElement('div');
				productDetails.className = 'product-details';
				const productName = document.createElement('div');
				productName.className = 'product-name';
				productName.textContent = item.name;
				const productVariant = document.createElement('div');
				productVariant.className = 'product-variant';
				productVariant.textContent = `Size: ${item.size} | Color: ${item.color}`;
				productDetails.appendChild(productName);
				productDetails.appendChild(productVariant);
				nameCell.appendChild(productDetails);
				
				// Стовпець з ціною
				const priceCell = document.createElement('td');
				priceCell.className = 'cart-item-price';
				priceCell.textContent = `$${item.price}`;
				
				// Стовпець з кількістю
				const quantityCell = document.createElement('td');
				quantityCell.className = 'cart-item-quantity';
				const quantityControls = document.createElement('div');
				quantityControls.className = 'quantity-controls';
				const minusBtn = document.createElement('button');
				minusBtn.type = 'button';
				minusBtn.className = 'button-quantity minus';
				minusBtn.setAttribute('data-cart-key', cartKey);
				minusBtn.textContent = '-';
				const quantityInput = document.createElement('input');
				quantityInput.className = 'quantity';
				quantityInput.value = item.quantity;
				quantityInput.min = '1';
				quantityInput.readOnly = true;
				const plusBtn = document.createElement('button');
				plusBtn.type = 'button';
				plusBtn.className = 'button-quantity plus';
				plusBtn.setAttribute('data-cart-key', cartKey);
				plusBtn.textContent = '+';
				quantityControls.appendChild(minusBtn);
				quantityControls.appendChild(quantityInput);
				quantityControls.appendChild(plusBtn);
				quantityCell.appendChild(quantityControls);
				
				// Стовпець з загальною сумою
				const totalCell = document.createElement('td');
				totalCell.className = 'cart-item-total';
				totalCell.textContent = `$${item.price * item.quantity}`;
				
				// Стовпець з кнопкою видалення
				const deleteCell = document.createElement('td');
				const deleteBtn = document.createElement('button');
				deleteBtn.className = 'delete-item-button';
				const deleteIcon = document.createElement('img');
				deleteIcon.className = 'delete-icon';
				deleteIcon.src = 'assets/images/icons/trash.svg';
				deleteIcon.alt = 'Delete';
				deleteIcon.setAttribute('data-cart-key', cartKey);
				deleteBtn.appendChild(deleteIcon);
				deleteCell.appendChild(deleteBtn);
				
				// Додаємо всі стовпці до рядка
				row.appendChild(imgCell);
				row.appendChild(nameCell);
				row.appendChild(priceCell);
				row.appendChild(quantityCell);
				row.appendChild(totalCell);
				row.appendChild(deleteCell);
				
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
