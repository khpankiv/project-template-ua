// ========================================================================
// Contact Page functionality
// ========================================================================
import { loadComponent } from './ui.js';
import { initHeader } from './header.js';	
import { headerPath, footerPath } from './file_links.js';
import { initForm } from './forms.js';

function initContactForm() {
	initForm('#contact-form', null);
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
