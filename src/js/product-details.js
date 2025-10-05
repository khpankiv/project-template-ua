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
	const allProducts = await fetchProducts(dataFile);
	const productId = getProductIdFromURL();
	const product = await getInfoById(productId);
	renderProductDetailsPage(product);
	const randomProducts = getRandomItems(allProducts, 4);
	await populateProducts(randomProducts, ".recommended-products", '#product-card-template');
	initProductDetailsEventListeners();
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
    await loadComponent('header', headerPath);
    await loadComponent('footer', footerPath);
    initHeader();
    await initProductDetails();    
})
