// ========================================================================
// Contact Page functionality
// ========================================================================
import { loadComponent } from './ui.js';
import { initHeader } from './header.js';	
import { headerPath, footerPath } from './file_links.js';
import { FormValidator } from './forms.js';

function initContactForm() {
	const contactFormValidator = new FormValidator('#contact-form');
}

// =====================================================================
// Initialize page when DOM is loaded
// =====================================================================
document.addEventListener('DOMContentLoaded', async () => {
	await loadComponent('header', headerPath)
	await loadComponent('footer', footerPath);
	initHeader();
	initContactForm();
});
