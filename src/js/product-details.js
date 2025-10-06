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
		// Show error message to user
		const container = document.querySelector('.main');
		if (container) {
			// Clear container safely
			while (container.firstChild) {
				container.removeChild(container.firstChild);
			}
			const errorDiv = document.createElement('div');
			errorDiv.className = 'error-message';
			errorDiv.textContent = 'Sorry, there was an error loading the product details. Please try again later.';
			container.appendChild(errorDiv);
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
        // Basic critical error handling - clear and show error
        while (document.body.firstChild) {
            document.body.removeChild(document.body.firstChild);
        }
        const errorDiv = document.createElement('div');
        errorDiv.style.cssText = 'text-align: center; padding: 50px; color: #666;';
        errorDiv.textContent = 'Sorry, there was an error loading the page. Please refresh and try again.';
        document.body.appendChild(errorDiv);
    }
})
