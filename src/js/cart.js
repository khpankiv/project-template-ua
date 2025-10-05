// ============================================================
// Cart initialization module
// ============================================================
import { initHeader } from './header.js';
import { loadComponent, displayCartItems } from './ui.js';
import { footerPath, headerPath } from './file_links.js';
import { initCartRowsControls, initCheckoutButton, initClearCartButton } from './interractions.js';
import notificationManager from './notifications.js';

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



// function showCartNotification(message, type = 'success') {
//     const notification = document.createElement('div');
//     notification.className = `notification-card ${type}`;
//     notification.textContent = message;  
//     document.body.appendChild(notification);
    
//     setTimeout(() => {
//         notification.style.animation = 'fadeOut 0.3s ease-out';
//         setTimeout(() => notification.remove(), 300);
//     }, 2500);
// }

// =======Initialization on DOMContentLoaded =======
document.addEventListener('DOMContentLoaded', async () => {
		await loadComponent('header', headerPath);
    await loadComponent('footer', footerPath);
    initHeader();
    initCartPage();
});

