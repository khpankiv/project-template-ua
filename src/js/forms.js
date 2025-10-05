// =======================================================================
// Filters and Sorting Functionality
// =======================================================================

/*******************************************************************************
 * @name initFilterToggle - Initialize Hide/Show Filters functionality
 *********************************************************************************/
export function initFilterToggle() {
	const filterSection = document.querySelector('.filter-section');
	const hideFiltersBtn = document.querySelector('#hide-filters-btn');
	const showFiltersBtn = document.querySelector('#show-filters-btn');
	
	if (hideFiltersBtn && showFiltersBtn && filterSection) {
		// Hide filters functionality
		hideFiltersBtn.addEventListener('click', () => {
			filterSection.style.display = 'none';
			showFiltersBtn.style.display = 'inline-block';
		});
		
		// Show filters functionality  
		showFiltersBtn.addEventListener('click', () => {
			filterSection.style.display = 'block';
			showFiltersBtn.style.display = 'none';
		});
	}
}

/****************************************************************************
 * @name initResetFilters - Initialize Reset Filters button
 ***************************************************************************/

// =======================================================================
import { dataFile } from './file_links.js';
import { fetchProducts } from './utils.js';
import { renderStars } from './ui.js';
import { renderProductsForPage } from './ui.js';
import { handleSort, doSearch, applyFilters } from './logic.js';
import notificationManager from './notifications.js';

// ===========================================================================
// ========Dropdowns, Search, Filters=================================
// ==========================================================================
/*****************************************************************************
 * @name initSortDropdown - Initialize Sort Dropdown functionality.
 *  @param {Array} products - The array of all products for sorting.  
 *****************************************************************************/
export async function initSortDropdown(products) {
		const dropdown = document.querySelector('#sort-dropdown');
		const sortButton = dropdown?.querySelector('.sort-btn') || document.querySelector('#sort-selected');
		const sortOptions = dropdown?.querySelector('.sort-options') || document.querySelector('#sort-options');
		const sortOptionItems = sortOptions?.querySelectorAll('li');
		
		if (!dropdown || !sortButton || !sortOptions || !sortOptionItems) return;
		
		let antiHover = false;
		
		// Toggle dropdown on button click
		sortButton.addEventListener('click', (e) => {
			e.stopPropagation();
			sortOptions.classList.toggle('show');
			sortButton.classList.toggle('active');
		});
		
		sortOptionItems.forEach(option => {
				option.addEventListener('click',async (e) => {
					e.stopPropagation();
					antiHover = true;
					
					// Close dropdown
					sortOptions.classList.remove('show');
					sortButton.classList.remove('active');
					
					dropdown.classList.add('closed');
					document.body.classList.add('anti-hover');
					setTimeout(() => {
						dropdown.classList.remove('closed');
						document.body.classList.remove('anti-hover');
						antiHover = false;
					}, 300);
					
					// Update selected option
					sortOptionItems.forEach(opt => opt.classList.remove('selected'));
					option.classList.add('selected');
					
					// Update button text
					if (sortButton.querySelector('span')) {
						sortButton.querySelector('span').textContent = option.textContent;
					} else {
						sortButton.childNodes[0].textContent = option.textContent + ' ';
					}
					
					const currentSort = option.dataset.value;
					products = handleSort(products, currentSort);
					await renderProductsForPage(products, 1);
				});
		});
		
		// Close dropdown when clicking outside
		document.addEventListener('click', () => {
			sortOptions.classList.remove('show');
			sortButton.classList.remove('active');
		});
};

/*******************************************************************************
 * @name initFilterDropdown - Initialize Filter Dropdown functionality with auto-apply.
 *********************************************************************************/
export function initFilterDropdown() {

		const dropdowns = document.querySelectorAll('.filter-dropdown');
		dropdowns.forEach(dropdown => {
			const filterButton = dropdown.querySelector('.filter-btn');
			const filterOptions = dropdown.querySelector('.filter-options');
			const filterOptionItems = filterOptions.querySelectorAll('li');
			let antiHover = false;
			
			// Toggle dropdown on button click
			filterButton.addEventListener('click', (e) => {
				e.stopPropagation();
				
				// Close all other dropdowns first
				document.querySelectorAll('.filter-dropdown .filter-options.show').forEach(otherOptions => {
					if (otherOptions !== filterOptions) {
						otherOptions.classList.remove('show');
						const otherBtn = otherOptions.closest('.filter-dropdown').querySelector('.filter-btn');
						otherBtn.classList.remove('active');
					}
				});
				
				// Toggle current dropdown
				filterOptions.classList.toggle('show');
				filterButton.classList.toggle('active');
			});
			
			filterOptionItems.forEach(option => {
				option.addEventListener('click', async (e) => {
					e.stopPropagation();
					antiHover = true;
					
					// Close dropdown
					filterOptions.classList.remove('show');
					filterButton.classList.remove('active');
					
        	dropdown.classList.add('closed');
					document.body.classList.remove('anti-hover');
					setTimeout(() => {
						dropdown.classList.remove('closed');
						document.body.classList.remove('anti-hover');
						antiHover = false;
					}, 300);
					
					// Update selected option
					filterOptionItems.forEach(opt => opt.classList.remove('selected'));
					option.classList.add('selected');
					
					if (filterButton.querySelector('span')) {
						filterButton.querySelector('span').textContent = option.textContent;
					}
					
					// Auto-apply filters after selection (only on catalog page)
					if (document.querySelector('.product-grid')) {
						const products = await applyFilters();
						await renderProductsForPage(products, 1);
					}
				});
		});
		
		// Close dropdown when clicking outside
		document.addEventListener('click', () => {
			filterOptions.classList.remove('show');
			filterButton.classList.remove('active');
		});
})
};

/*******************************************************************************
 * @name initSalesFilter - Initialize Sales checkbox auto-apply functionality.
 *********************************************************************************/
export function initSalesFilter() {
	const salesCheckbox = document.querySelector('#filter-salesStatus input');
	if (salesCheckbox) {
		salesCheckbox.addEventListener('change', async () => {
			// Auto-apply filters when checkbox is toggled
			const products = await applyFilters();
			await renderProductsForPage(products, 1);
		});
	}
}

 /********************************************************************************************
 * @name initSearch	- Initialize Search functionality (on press Enter or click search icon).
 *  @param {Array} Products - The array of all products for searching.  
 ***************************************************************************************/
export function initSearch(products) {
	const searchInput = document.querySelector('#catalog-search');
	if (searchInput) {
		searchInput.addEventListener('keydown', (e) => {
			if (e.key === 'Enter') {doSearch(products, searchInput.value);}
		});
		const searchIcon = document.querySelector('.search-icon');
		if (searchIcon) {
			searchIcon.addEventListener('click', () => doSearch(products, searchInput.value));
		}
	}
}

/****************************************************************************
 * @name initResetFilters - Initialize Reset Filters button
 ****************************************************************************/
export async function initResetFilters() {
			const resetBtn = document.querySelector('#filter-reset');
			if (resetBtn) {
				resetBtn.addEventListener('click', async () => {
					const products = await fetchProducts(dataFile);
					document.querySelectorAll('.filter-dropdown span').forEach(btn => {
						btn.textContent = 'Choose option';
					});
					const salesCheckbox = document.querySelector('#filter-salesStatus input');
					if (salesCheckbox) salesCheckbox.checked = false;
					await renderProductsForPage(products, 1);
				});
			}
}

/*******************************************************************************
 * @name initApplyFilters - Initialize Apply Filters button
 ********************************************************************************/
export async function initApplyFilters() {
		const applyBtn = document.querySelector('#filter-apply');
		if (applyBtn) {
			applyBtn.addEventListener('click', async () => {
				const products = await applyFilters();
				await renderProductsForPage(products, 1);
			});
		}
}

// ==========================================================================
// ==========Forms=========================================================
// =======================================================================
/**************************************************************************
 * @name initStarRating - Initialize star rating functionality in review form
 *****************************************************************************/
export function initStarRating() {
		const stars = document.querySelectorAll('.star-rating .star');
		let selectedRating = 0;
		stars.forEach((star, index) => {
				star.addEventListener('click', () => {
						selectedRating = index + 1;
						updateStarDisplay(selectedRating);
				});
				
				star.addEventListener('mouseover', () => {
						updateStarDisplay(index + 1);
				});
		});
		
		// Reset on mouse leave
		document.querySelector('.star-rating').addEventListener('mouseleave', () => {
				updateStarDisplay(selectedRating);
		});
}

/****************************************************************************
 * @name updateStarDisplay - Update star display based on rating
 * @param {number} rating - The rating value (1-5)
 **************************************************************************/
export function updateStarDisplay(rating) {
		const stars = document.querySelectorAll('.star-rating .star');
		
		stars.forEach((star, index) => {
			if (index < rating) {
				star.classList.add('active');
			} else {
				star.classList.remove('active');
			}
		});
}

/****************************************************************************
 * @name initFloatingLabels - Initialize floating label functionality
 *****************************************************************************/
export function initFloatingLabels() {
	const floatingInputs = document.querySelectorAll('.floating-input');
	
	floatingInputs.forEach(input => {
		// Function to check if input has value
		const checkValue = () => {
			if (input.value.trim() !== '') {
				input.classList.add('has-value');
			} else {
				input.classList.remove('has-value');
			}
		};
		
		// Check initial value
		checkValue();
		
		// Listen for input changes
		input.addEventListener('input', checkValue);
		input.addEventListener('blur', checkValue);
		
		// Handle focus states
		input.addEventListener('focus', () => {
			input.parentElement.querySelector('.floating-label').classList.add('active');
		});
		
		input.addEventListener('blur', () => {
			if (input.value.trim() === '') {
				input.parentElement.querySelector('.floating-label').classList.remove('active');
			}
		});
	});
}

/****************************************************************************
 * @name initReviewForm - Initialize review form functionality
 *****************************************************************************/
export function initReviewForm() {
	initForm('#review-form');
	initFloatingLabels();
	renderStars(3, document.querySelector('.review-rating'));
	let productName = document.querySelector('#product-name').textContent;
	document.querySelector('#number-of-reviews').textContent = '1 review for ' + productName;
	// initStarRating();
}

// /****************************************************************************
//  * @name initContactForm - Initialize contact form functionality
//  ****************************************************************************/
// export function initContactForm() {
// 	initForm('#contact-form', null);
// }

/****************************************************************************
 * @name initForm - Initialize form validation and submission handling
 * @param {string} formId - The ID of the form to initialize
 * @param {object} star - The star rating element
 ***************************************************************************/
export function initForm(formId) {
		const form = document.querySelector(formId);
    if (!form) return;

		const nameInput = document.querySelector('#name');
		const emailInput = document.querySelector('#email');
		const mailInput = document.querySelector('#mail');
		const topicInput = document.querySelector('#topic');
		const messageInput = document.querySelector('#message');
		const checkedInput = document.querySelector('#agree-checkbox');
		const passwordInput = document.querySelector('#password');
		let nameValid = true;
		let emailValid = true;
		let mailValid = true;
		let topicValid = true;
		let messageValid = true;
		let checkedValid = true;
		let passwordValid = true;
    // Real-time validation
    nameInput?.addEventListener('blur', (event) => {
				event.preventDefault();
        nameValid = validateName(nameInput);
    });
    nameInput?.addEventListener('input', (event) => {
			event.preventDefault();
        if (nameInput.value.length > 0) nameValid = validateName(nameInput);
    });

    emailInput?.addEventListener('blur', (event)	 => {
        event.preventDefault();
        emailValid = validateEmail(emailInput);
    });
    emailInput?.addEventListener('input', (event) => {
        event.preventDefault();
        if (emailInput.value.length > 0) emailValid = validateEmail(emailInput);
    });

		mailInput?.addEventListener('blur', (event) => {
			event.preventDefault();
			mailValid = validateEmail(mailInput);
		});
		mailInput?.addEventListener('input', (event) => {
			event.preventDefault();
			if (mailInput.value.length > 0) mailValid = validateEmail(mailInput);
		});

		topicInput?.addEventListener('blur', (event) => {
			event.preventDefault();
			topicValid = validateTopic(topicInput);
		});
		topicInput?.addEventListener('input', (event) => {
			event.preventDefault();
			if (topicInput.value.length > 0) topicValid = validateTopic(topicInput);
		});

    messageInput?.addEventListener('blur', (event) => {
        event.preventDefault();
        messageValid = validateMessage(messageInput);
    });
    messageInput?.addEventListener('input', (event) => {
        event.preventDefault();
        if (messageInput.value.length > 0) messageValid = validateMessage(messageInput);
    });

		passwordInput?.addEventListener('blur', (event) => {
			event.preventDefault();
			passwordValid = validatePassword(passwordInput);
		});
		passwordInput?.addEventListener('input', (event) => {
			event.preventDefault();
			if (passwordInput.value.length > 0) passwordValid = validatePassword(passwordInput);
		});

		if (checkedInput) {
			const checkedValid = checkedInput.checked;
			if (!checkedValid) {
				showError('review-checkbox', 'You must agree before submitting.');
			}
		}

		const isValid = nameValid && emailValid && topicValid && messageValid && checkedValid;
		if (isValid) {
			let button = form.querySelector('button');
			button.disabled = false;
			button.classList.remove('disabled');
			form.reset();
			form.addEventListener('submit', handleFormSubmit);

		}
}

/****************************************************************************
 * @name handleFormSubmit - Handle form submission
 * @param {Event} e - The form submit event
 ***************************************************************************/
function handleFormSubmit(e) {
		e.preventDefault();
		
		// Show success submission notification
		notificationManager.showPopup(
				'success',
				'Thank you for your feedback!',
				'Your message has been successfully sent. We will contact you shortly.',
				5000
		);
		
		// Clear form
		e.target.reset();
		updateStarDisplay(0);
		
		// Clear all validation notifications
		const inputs = e.target.querySelectorAll('input, textarea, select');
		inputs.forEach(input => {
				notificationManager.hideInlineNotification(input);
				input.classList.remove('error', 'valid');
		});
}

/****************************************************************************
 * @name validateName - Validate name input
 * @param {HTMLElement} nameInput - The name input element
 * @returns {boolean} True if valid, false otherwise
 ***************************************************************************/
function validateName(nameInput) {
		const value = nameInput.value.trim();
		
		if (!value) {
				notificationManager.showFormValidation(nameInput, false, 'Name is required');
				return false;
		}
		if (value.length < 2) {
				notificationManager.showFormValidation(nameInput, false, 'Name must contain at least 2 characters');
				return false;
		}
		if (!/^[a-zA-ZА-Яа-я\s''`-]+$/u.test(value)) {
				notificationManager.showFormValidation(nameInput, false, 'Name can contain only letters and spaces');
				return false;
		}
		
		notificationManager.showFormValidation(nameInput, true);
		return true;
}

/****************************************************************************
 * @name validateEmail - Validate email input
 * @param {HTMLElement} emailInput - The email input element
 * @returns {boolean} True if valid, false otherwise
 ***************************************************************************/
export function validateEmail(emailInput) {
		const value = emailInput.value.trim();
		
		if (!value) {
				notificationManager.showFormValidation(emailInput, false, 'Email is required');
				return false;
		}
		
		const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
		if (!emailRegex.test(value)) {
				notificationManager.showFormValidation(emailInput, false, 'Enter a valid email address');
				return false;
		}
		
		notificationManager.showFormValidation(emailInput, true);
		return true;
}

/****************************************************************************
 * @name validateTopic - Validate topic selection
 * @param {HTMLElement} topicInput - The topic select element
 * @returns {boolean} True if valid, false otherwise
 ***************************************************************************/
function validateTopic(topicInput) {
		const value = topicInput.value;
		
		if (!value || value === '') {
				notificationManager.showFormValidation(topicInput, false, 'Please select a topic');
				return false;
		}
		
		notificationManager.showFormValidation(topicInput, true);
		return true;
}

/****************************************************************************
 * @name validatePassword - Validate password input
 * @param {HTMLElement} passwordInput - The password input element
 * @returns {boolean} True if valid, false otherwise
 ***************************************************************************/
function validatePassword(passwordInput) {
		const value = passwordInput.value.trim();
		
		if (!value) {
				notificationManager.showFormValidation(passwordInput, false, 'Password is required');
				return false;
		}
		if (value.length < 6) {
				notificationManager.showFormValidation(passwordInput, false, 'Password must contain at least 6 characters');
				return false;
		}
		if (!/(?=.*[a-zA-Z])(?=.*\d)/.test(value)) {
				notificationManager.showFormValidation(passwordInput, false, 'Password must contain letters and numbers');
				return false;
		}
		
		notificationManager.showFormValidation(passwordInput, true);
		return true;
}

/****************************************************************************
 * @name validateMessage - Validate message input
 * @param {HTMLElement} messageInput - The message textarea element
 * @returns {boolean} True if valid, false otherwise
 ***************************************************************************/
function validateMessage(messageInput) {
		const value = messageInput.value.trim();
		
		if (!value) {
				notificationManager.showFormValidation(messageInput, false, 'Message is required');
				return false;
		}
		if (value.length < 10) {
				notificationManager.showFormValidation(messageInput, false, 'Message must contain at least 10 characters');
				return false;
		}
		if (value.length > 1000) {
				notificationManager.showFormValidation(messageInput, false, 'Message must be shorter than 1000 characters');
				return false;
		}
		
		notificationManager.showFormValidation(messageInput, true);
		return true;
}

// ==========================================================================================
// Messages
// ==========================================================================================

/****************************************************************************
 * @name showError - Show error message for a specific field
 * @param {string} fieldName - The name of the field (e.g., 'name', 'email')
 * @param {string} message - The error message to display
 ***************************************************************************/
function showError(fieldName, message) {
		const errorElement = document.getElementById(`${fieldName}-error`);
		const inputElement = document.getElementById(fieldName);
		
		if (errorElement) {
			errorElement.textContent = message;
			errorElement.style.display = 'block';
		}
		
		if (inputElement) {
			inputElement.classList.add('error');
		}
}

/****************************************************************************
 * @name clearError - Clear error message for a specific field
 * @param {string} fieldName - The name of the field (e.g., 'name', 'email')
 ***************************************************************************/
function clearError(fieldName) {
		const errorElement = document.getElementById(`${fieldName}-error`);
		const inputElement = document.getElementById(fieldName);
		
		if (errorElement) {
			errorElement.textContent = '';
			errorElement.style.display = 'none';
		}
		
		if (inputElement) {
			inputElement.classList.remove('error');
		}
}

/****************************************************************************
 * @name showMessage - Show notification message
 * @param {string} type - The type of message (e.g., success, error)
 * @param {string} message - The message content
 * @param {string} id - The ID of the element to attach the message to
 ***************************************************************************/
export function showMessage(type, message, targetEl) {
  const notification = document.createElement('div');
  notification.className = `notification ${type}`;
  notification.textContent = message;

  if (targetEl) {
    // контейнер для popup
    const wrapper = targetEl.parentElement;
    wrapper.style.position = "relative"; 
    wrapper.appendChild(notification);
  } else {
    document.body.appendChild(notification);
  }

  setTimeout(() => {
    notification.remove();
  }, 4000);
}




