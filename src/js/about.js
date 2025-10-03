// About page functionality
import { loadComponent } from './ui.js';
import { initHeader } from './header.js';
import { headerPath, footerPath } from './file_links.js';

document.addEventListener('DOMContentLoaded', async () => {
	await loadComponent('header', headerPath)
	await loadComponent('footer', footerPath);
	initHeader();
});
