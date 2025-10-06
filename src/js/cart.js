// ============================================================
// Cart initialization module
// ============================================================
import { initHeader } from './header.js';
import { loadComponent, displayCartItems } from './ui.js';
import { footerPath, headerPath } from './file_links.js';
import { initCartRowsControls, initCheckoutButton, initClearCartButton } from './interractions.js';

/*****************************************************************************************************
 * @name initCartPage - Initializes the cart page.
 * @returns {Promise<void>}
 ***************************************************************************************************/
async function initCartPage() {
		displayCartItems();
		initCartEventListeners();
}

/***************************************************************************************************
 * @name initCartEventListeners - Initializes event listeners for cart actions.
 * @param {Object} allCart - The current cart object from localStorage.
 ***************************************************************************************************/
function initCartEventListeners() {
		initCartRowsControls();	
		initClearCartButton();
		initCheckoutButton();
}


// =======Initialization on DOMContentLoaded =======
document.addEventListener('DOMContentLoaded', async () => {
		await loadComponent('header', headerPath);
    await loadComponent('footer', footerPath);
    initHeader();
    initCartPage();
});

