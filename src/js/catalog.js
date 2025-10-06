// =========================================================================
// Catalog Page 
// =========================================================================

import { dataFile, headerPath, footerPath} from './file_links.js';
import { loadComponent, renderProductsForPage, renderRandomSetsSidebar } from './ui.js';
import { fetchProducts} from './utils.js';
import { initHeader } from './header.js';//to check
import { initAddToCartButtons, initClickCard} from './interractions.js';
import { initFilterDropdown, initSortDropdown, initSearch, initResetFilters, initSalesFilter, initFilterToggle  } from './forms.js';

/******************************************************************************
 * @name initCatalog - Initializes the product catalog.
 * @param {string} productCardTemplatePath - The path to the product card template.
 * @param {string} dataFile - The path to the data file.
 ******************************************************************************/
async function initCatalog() {
  try {
    // Fetch all products
    const allProducts = await fetchProducts(dataFile);
    if (allProducts) {
			await renderRandomSetsSidebar(allProducts);
      await renderProductsForPage(allProducts, 1);
      initAllCatalogInteractions(allProducts);
    }
  } catch (error) {
    console.error('An error occurred during catalog initialization:', error);
  }
}

/******************************************************************************
 * Initialize all interactions for the catalog page.
 * @param {Array} products - The array of filtered products.
 * @param {number} currentPage - The current page number.
 ******************************************************************************/
function initAllCatalogInteractions(products) {
  // updatePagination(products, currentPage);
  initFilterDropdown();
	initSalesFilter();
  initSortDropdown(products);
  initAddToCartButtons();
  initClickCard();
  initSearch(products);
  initResetFilters();
	initFilterToggle();
  }

// ==========================================================================
// Initialize page when DOM is loaded
// ==========================================================================
document.addEventListener('DOMContentLoaded', async () => {
  await loadComponent('header', headerPath)
  await loadComponent('footer', footerPath);
  initHeader();
  await initCatalog();
});
