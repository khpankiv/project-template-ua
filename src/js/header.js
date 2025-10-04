// =======================================================================
// Header Functionality: Login Modal, Cart Counter, Active Link Highlighting, Mobile Menu
// =======================================================================
import { initForm } from './forms.js';

/*******************************************************************************************************
 * @name initHeader - Initializes header functionalities: login modal, cart counter, mobile menu.
 *******************************************************************************************************/
export function initHeader() {
    initLoginModal();
    updateCartCounter();
    initMobileMenu();
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

		initForm('#login-form', null);

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
    const cartItems = JSON.parse(localStorage.getItem('cart')) || [];
    const cartCounter = document.querySelector('#cart-counter');
		let totalItems = 0;
		for (const qty of Object.values(cartItems)) {
			totalItems += qty;
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

