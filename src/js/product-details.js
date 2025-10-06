// ===================================================================
// ===============Product Details Page functionality======================
// ====================================================================
import { fetchProducts, getRandomItems, getProductIdFromURL, getInfoById } from './utils.js';
import { renderProductDetailsPage, populateProducts, loadComponent} from './ui.js';
import { initHeader } from './header.js';
import { dataFile, headerPath, footerPath } from './file_links.js';
import { initAddQuantity, initQuantityControls, initTabs, initClickCard, initAddToCartButtons } from './interractions.js';
import { initFilterDropdown, initReviewForm } from './forms.js';

/***********************************************************************
 * @name initProductDetails - Initializes the product details page.
 * @returns {Promise<void>}
 **********************************************************************/
async function initProductDetails() {
	try {
		const allProducts = await fetchProducts(dataFile);
		if (!allProducts || allProducts.length === 0) {
			console.warn('No products data available');
			return;
		}
		
		const productId = getProductIdFromURL();
		if (!productId) {
			console.error('No product ID found in URL');
			return;
		}
		
		const product = await getInfoById(productId);
		if (!product) {
			console.error(`Product with ID ${productId} not found`);
			return;
		}
		
		renderProductDetailsPage(product);
		const randomProducts = getRandomItems(allProducts, 4);
		if (randomProducts && randomProducts.length > 0) {
			await populateProducts(randomProducts, ".recommended-products", '#product-card-template');
		}
		
		initProductDetailsEventListeners();
	} catch (error) {
		console.error('Error initializing product details:', error);
		// Показуємо повідомлення про помилку користувачеві
		const container = document.querySelector('.main');
		if (container) {
			container.innerHTML = '<div class="error-message">Sorry, there was an error loading the product details. Please try again later.</div>';
		}
	}
}

/***********************************************************************
 * @name initProductDetailsEventListeners - Initializes event listeners for product details page.
 **********************************************************************/
function initProductDetailsEventListeners() {
	initQuantityControls();
	initFilterDropdown();
	initAddQuantity();
	initTabs();
	initReviewForm();
	initClickCard();
	initAddToCartButtons();
}

// =====================================================================
// Initialize page when DOM is loaded
// =====================================================================
document.addEventListener('DOMContentLoaded', async () => {
    try {
        await loadComponent('header', headerPath);
        await loadComponent('footer', footerPath);
        initHeader();
        await initProductDetails();
    } catch (error) {
        console.error('Error initializing product details page:', error);
        // Базова обробка критичних помилок
        document.body.innerHTML = '<div style="text-align: center; padding: 50px; color: #666;">Sorry, there was an error loading the page. Please refresh and try again.</div>';
    }
})
