// =======================================================================
// Header Functionality: Login Modal, Cart Counter, Active Link Highlighting, Mobile Menu
// =======================================================================
import { FormValidator } from './forms.js';

/*******************************************************************************************************
 * @name initHeader - Initializes header functionalities: login modal, cart counter, mobile menu.
 *******************************************************************************************************/
export function initHeader() {
    initLoginModal();
    updateCartCounter();
    initMobileMenu();
    setActiveNavLink();
}
// =============================================================
// Login Modal functionality
// ============================================================

/*********************************************************************************
 * @name initLoginModal - Initializes the login modal functionality.
 ************************************************************************************/
function initLoginModal() {
    const loginIcon = document.querySelector('#login-icon');
    const loginModal = document.querySelector('#login-modal');
    const closeModal = document.querySelector('#close-modal');
    const loginForm = document.querySelector('#login-form');
    const passwordToggle = document.querySelector('#password-toggle');
    const passwordInput = document.querySelector('#password');

    // Open modal
    loginIcon?.addEventListener('click', (e) => {
        e.preventDefault();
        loginModal.style.display = 'block';
    });

    // // Close modal
    // closeModal?.addEventListener('click', () => {
    //     loginModal.style.display = 'none';
    //     clearFormErrors();
    // });

    // Close modal on outside click
    window.addEventListener('click', (e) => {
			if (e.target === loginModal) {
				loginModal.style.display = 'none';
				// clearFormErrors();
			}
    });

    // Password toggle
    passwordToggle?.addEventListener('click', () => {
			const type = passwordInput.getAttribute('type') === 'password' ? 'text' : 'password';
			passwordInput.setAttribute('type', type);
			passwordToggle.querySelector('.eye-icon').textContent = type === 'password' ? '👁️' : '🙈';
    });

		new FormValidator('#login-form');

    // // Form validation and submission
    // loginForm?.addEventListener('submit', (e) => {
		// 	e.preventDefault();
		// 	validateAndSubmitLogin();
    // });

    // // Real-time email validation
    // document.querySelector('#email')?.addEventListener('input', validateEmail);
		// const emailInput = document.querySelector('#email');
		// validateEmail(emailInput);
}


// // Login form validation and submission
// function validateAndSubmitLogin() {
//     const email = document.querySelector('#email').value;
//     const password = document.querySelector('#password').value;
//     const emailError = document.querySelector('#email-error');
//     const passwordError = document.querySelector('#password-error');
    
//     let isValid = true;

//     // Email validation
//     if (!validateEmail()) {
//         isValid = false;
//     }

//     // Password validation
//     if (password.length < 1) {
//         passwordError.textContent = 'Password is required';
//         passwordError.style.display = 'block';
//         isValid = false;
//     } else {
//         passwordError.style.display = 'none';
//     }

//     if (isValid) {
//         // Simulate successful login
//         alert('Login successful!');
//         document.querySelector('#login-modal').style.display = 'none';
//         clearFormErrors();
//         document.querySelector('#login-form').reset();
//     }
// }

// // Clear form errors
// function clearFormErrors() {
//     const errors = document.querySelectorAll('.error-message');
//     errors.forEach(error => error.style.display = 'none');
// }
// ==========================================================================================
// Cart counter functionality
// =========================================================================================

/*******************************************************************************************************
 * @name updateCartCounter - Updates the cart item counter in the header based on localStorage data.
 *******************************************************************************************************/
export function updateCartCounter() {
    const cartItems = JSON.parse(localStorage.getItem('shoppingCart')) || {};
    const cartCounter = document.querySelector('#cart-counter');
		let totalItems = 0;
		
		// Sum quantities from all cart entries
		for (const item of Object.values(cartItems)) {
			totalItems += item.quantity || 0;
		} 
    
    if (totalItems > 0) {
			  cartCounter.style.display = 'flex';
        cartCounter.textContent = totalItems;
    } else {
        cartCounter.style.display = 'none';
    }
}

// Mobile Menu functionality
function initMobileMenu() {
    const mobileMenuToggle = document.querySelector('#mobile-menu-toggle');
    const nav = document.querySelector('.nav');
    const body = document.body;

    if (!mobileMenuToggle || !nav) return;

    mobileMenuToggle.addEventListener('click', () => {
        const isOpen = nav.classList.contains('mobile-menu-open');
        
        if (isOpen) {
            nav.classList.remove('mobile-menu-open');
            mobileMenuToggle.classList.remove('active');
            body.style.overflow = '';
        } else {
            nav.classList.add('mobile-menu-open');
            mobileMenuToggle.classList.add('active');
            body.style.overflow = 'hidden';
        }
    });

    // Close menu when clicking nav links
    const navLinks = nav.querySelectorAll('.nav-link');
    navLinks.forEach(link => {
        link.addEventListener('click', () => {
            nav.classList.remove('mobile-menu-open');
            mobileMenuToggle.classList.remove('active');
            body.style.overflow = '';
        });
    });

    // Close menu when clicking outside
    document.addEventListener('click', (e) => {
        if (!nav.contains(e.target) && !mobileMenuToggle.contains(e.target)) {
            nav.classList.remove('mobile-menu-open');
            mobileMenuToggle.classList.remove('active');
            body.style.overflow = '';
        }
    });
}

// =============================================================
// Active Navigation Link Highlighting
// ============================================================

/*********************************************************************************
 * @name setActiveNavLink - Sets the active navigation link based on current page.
 ************************************************************************************/
function setActiveNavLink() {
    const navLinks = document.querySelectorAll('.nav-link');
    const currentPath = window.location.pathname;
    
    // Remove active class from all links
    navLinks.forEach(link => link.classList.remove('active', 'selected'));
    
    // Set active class based on current page
    navLinks.forEach(link => {
        const href = link.getAttribute('href');
        
        if (href) {
            // Handle root/index page
            if ((currentPath === '/' || currentPath.includes('index.html')) && href.includes('index.html')) {
                link.classList.add('active', 'selected');
            }
            // Handle other pages
            else if (currentPath.includes(href.replace('pages/', '')) && !href.includes('index.html')) {
                link.classList.add('active', 'selected');
            }
        }
    });
}

