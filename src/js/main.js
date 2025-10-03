// ===========================================================
// ================== Main Page ============================
// ============================================================
import { fetchProducts } from './utils.js';
import { initHeader } from './header.js';
import { initAddToCartButtons, initClickCard } from './interractions.js';
import { loadComponent, loadProductsMain, createSlides, createProductSlider } from './ui.js';
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
		
		// === Init Travel Suitcases Slider ===
		createSlides(8, 4, 'assets/images/slider-img/');
		
		// === Init Product Sliders ===
		// Show 3 items per view on desktop so slider is active even with 4 products
		createProductSlider('#selected-products', 3);
		createProductSlider('#new-products', 3);
	}

// Initialize Travel Suitcases slider
// function initImageSlider() {
//     const slides = document.querySelectorAll('.travel-slide');
//     const randomTexts = [
//         'Adventure Awaits with Premium Quality',
//         'Explore the World in Style',
//         'Journey Beyond Limits',
//         'Discover New Horizons',
//         'Travel with Confidence',
//         'Experience Ultimate Comfort'
//     ];
    
//     if (slides.length === 0) return;
    
//     let currentSlide = 0;
    
//     // Function to show next slide
//     function showNextSlide() {
//         slides[currentSlide].classList.remove('active');
//         currentSlide = (currentSlide + 1) % slides.length;
//         slides[currentSlide].classList.add('active');
        
//         // Update random text
//         const randomTextEl = slides[currentSlide].querySelector('.random-text');
//         if (randomTextEl) {
//             const randomIndex = Math.floor(Math.random() * randomTexts.length);
//             randomTextEl.textContent = randomTexts[randomIndex];
//         }
//     }
    
//     // Auto-play slider every 4 seconds
//     setInterval(showNextSlide, 3000);
    
//     // Add click event to manually change slides
//     slides.forEach((slide, index) => {
//         slide.addEventListener('click', () => {
//             slides[currentSlide].classList.remove('active');
//             currentSlide = index;
//             slides[currentSlide].classList.add('active');
//         });
//     });
// }

//==========Initialize homepage when DOM is loaded=========================
document.addEventListener('DOMContentLoaded', async () => {
	await loadComponent('header', headerPath);
  await loadComponent('footer', footerPath);
  initHeader();
  await initHomepage();
  
  // Initialize button navigation using data-href attribute
  document.querySelectorAll('[data-href]').forEach(button => {
    button.addEventListener('click', (e) => {
      const href = e.currentTarget.getAttribute('data-href');
      if (href) window.location.href = href;
    });
  });
});
