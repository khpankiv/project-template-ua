// ===========================================================
// ================== Main Page ============================
// ============================================================
import { fetchProducts } from './utils.js';
import { initHeader } from './header.js';
import { initAddToCartButtons, initClickCard } from './interractions.js';
import { loadComponent, loadProductsMain, createSlides } from './ui.js';
import { dataFile,  headerPath, footerPath} from './file_links.js';

/*******************************************************************************
 * @name initHomepage - Initializes the homepage by loading and displaying products.
 * @returns {Promise<void>}
 ******************************************************************************/
async function initHomepage() {
    const allProducts = await fetchProducts(dataFile) || [];
		await loadProductsMain(allProducts, 'blocks', 'Selected Products', '#selected-products');
    await loadProductsMain(allProducts, 'blocks', 'New Products Arrival', '#new-products');
		initClickCard();
		initAddToCartButtons();
		// === Init Slider ===
		createSlides(8, 4, 'assets/images/slider-img/');

	}



//==========Initialize homepage when DOM is loaded=========================
document.addEventListener('DOMContentLoaded', async () => {
	await loadComponent('header', headerPath);
  await loadComponent('footer', footerPath);
  initHeader();
  await initHomepage();
});
