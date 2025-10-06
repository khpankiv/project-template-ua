// =======================================================================
// Forms and Interactions
// =======================================================================
import { renderProductsForPage, renderStars } from './ui.js';
import { fetchProducts } from './utils.js';
import { dataFile } from './file_links.js';
import notificationManager from './notifications.js';
import { doSearch, applyFilters } from './logic.js';

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
			showFiltersBtn.classList.remove('disabled');
		});
		
		// Show filters functionality  
		showFiltersBtn.addEventListener('click', () => {
			filterSection.style.display = 'block';
			showFiltersBtn.classList.add('disabled');
		});
	}
}

/****************************************************************************
 * @name initResetFilters - Initialize Reset Filters button
 ***************************************************************************/

// ===========================================================================
// ========Dropdowns, Search, Filters=================================
// ==========================================================================
/*****************************************************************************
 * @name initSortDropdown - Initialize Sort Dropdown functionality.
 *****************************************************************************/
export function initSortDropdown() {
	const dropdown = document.querySelector('#sort-dropdown');
	const sortButton = dropdown?.querySelector('.sort-btn');
	const sortOptions = dropdown?.querySelector('.sort-options');
	const sortOptionItems = sortOptions?.querySelectorAll('li');
	
	if (!dropdown || !sortButton || !sortOptions || !sortOptionItems) return;
	
	// Toggle dropdown on button click
	sortButton.addEventListener('click', (e) => {
		e.stopPropagation();
		sortOptions.classList.toggle('show');
		sortButton.classList.toggle('active');
	});
	
	sortOptionItems.forEach(option => {
		option.addEventListener('click', async (e) => {
			e.stopPropagation();
			
			// Close dropdown
			sortOptions.classList.remove('show');
			sortButton.classList.remove('active');
			
			dropdown.classList.add('closed');
			document.body.classList.add('anti-hover');
			setTimeout(() => {
				dropdown.classList.remove('closed');
				document.body.classList.remove('anti-hover');
			}, 300);
			
			// Update selected option
			sortOptionItems.forEach(opt => opt.classList.remove('selected'));
			option.classList.add('selected');
			
			// Update button text
			const buttonSpan = sortButton.querySelector('span');
			if (buttonSpan) {
				buttonSpan.textContent = option.textContent;
			}
			
			// Apply filters with sorting
			const products = await applyFilters();
			await renderProductsForPage(products, 1);
		});
	});
	
	// Close dropdown when clicking outside
	document.addEventListener('click', () => {
		sortOptions.classList.remove('show');
		sortButton.classList.remove('active');
	});
}

/*******************************************************************************
 * @name initFilterDropdown - Initialize Filter Dropdown functionality with auto-apply.
 *********************************************************************************/
export function initFilterDropdown() {
	const dropdowns = document.querySelectorAll('.filter-dropdown');
	
	dropdowns.forEach(dropdown => {
		const filterButton = dropdown.querySelector('.filter-btn');
		const filterOptions = dropdown.querySelector('.filter-options');
		const filterOptionItems = filterOptions.querySelectorAll('li');
		
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
				
				// Close dropdown
				filterOptions.classList.remove('show');
				filterButton.classList.remove('active');
				
				dropdown.classList.add('closed');
				document.body.classList.add('anti-hover');
				setTimeout(() => {
					dropdown.classList.remove('closed');
					document.body.classList.remove('anti-hover');
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
	});
}

/*******************************************************************************
 * @name initSalesFilter - Initialize Sales checkbox auto-apply functionality.
 *********************************************************************************/
export function initSalesFilter() {
	const salesCheckbox = document.querySelector('#filter-sales-status input');
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
			const salesCheckbox = document.querySelector('#filter-sales-status input');
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
	const reviewFormValidator = new FormValidator('#review-form');
	initFloatingLabels();
	renderStars(3, document.querySelector('.review-rating'));
	let productName = document.querySelector('#product-name')?.textContent || 'Product';
	const reviewsElement = document.querySelector('#number-of-reviews');
	if (reviewsElement) {
		reviewsElement.textContent = '1 review for ' + productName;
	}
}

/****************************************************************************
 * @class FormValidator - Universal form validation class with real-time validation
 ***************************************************************************/
export class FormValidator {
	constructor(formSelector) {
		this.form = document.querySelector(formSelector);
		this.fields = new Map(); // Store field validation states
		this.validationRules = new Map(); // Store validation rules for each field
		
		if (!this.form) {
			console.warn(`Form not found: ${formSelector}`);
			return;
		}
		
		this.init();
	}
	
	/**
	 * Initialize the form validator
	 */
	init() {
		// Discover all form inputs
		this.discoverFields();
		
		// Set up validation rules
		this.setupValidationRules();
		
		// Add event listeners
		this.attachEventListeners();
		
		// Initial validation state
		this.updateSubmitButton();
	}
	
	/**
	 * Discover all form fields and their types
	 */
	discoverFields() {
		const inputs = this.form.querySelectorAll('input, textarea, select');
		
		inputs.forEach(input => {
			const fieldType = this.getFieldType(input);
			this.fields.set(input.id || input.name, {
				element: input,
				type: fieldType,
				isValid: false,
				isRequired: input.hasAttribute('required')
			});
		});
	}
	
	/**
	 * Determine field type for validation
	 */
	getFieldType(input) {
		if (input.type === 'email' || input.id === 'email' || input.id === 'mail') return 'email';
		if (input.type === 'password' || input.id === 'password') return 'password';
		if (input.type === 'checkbox') return 'checkbox';
		if (input.tagName === 'TEXTAREA' || input.id === 'message') return 'message';
		if (input.id === 'topic') return 'topic';
		if (input.id === 'name' || input.name === 'name') return 'name';
		return 'text';
	}
	
	/**
	 * Setup validation rules for different field types
	 */
	setupValidationRules() {
		this.validationRules.set('name', (value) => {
			if (!value) return { isValid: false, message: 'Name is required' };
			if (value.length < 2) return { isValid: false, message: 'Name must contain at least 2 characters' };
			if (!/^[a-zA-ZА-Яа-я\s'`-]+$/u.test(value)) return { isValid: false, message: 'Name can contain only letters and spaces' };
			return { isValid: true };
		});
		
		this.validationRules.set('email', (value) => {
			if (!value) return { isValid: false, message: 'Email is required' };
			const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
			if (!emailRegex.test(value)) return { isValid: false, message: 'Enter a valid email address' };
			return { isValid: true };
		});
		
		this.validationRules.set('password', (value) => {
			if (!value) return { isValid: false, message: 'Password is required' };
			if (value.length < 6) return { isValid: false, message: 'Password must contain at least 6 characters' };
			if (!/(?=.*[a-zA-Z])(?=.*\d)/.test(value)) return { isValid: false, message: 'Password must contain letters and numbers' };
			return { isValid: true };
		});
		
		this.validationRules.set('message', (value) => {
			if (!value) return { isValid: false, message: 'Message is required' };
			if (value.length < 10) return { isValid: false, message: 'Message must contain at least 10 characters' };
			if (value.length > 1000) return { isValid: false, message: 'Message must be shorter than 1000 characters' };
			return { isValid: true };
		});
		
		this.validationRules.set('topic', (value) => {
			if (!value || value === '') return { isValid: false, message: 'Please select a topic' };
			return { isValid: true };
		});
		
		this.validationRules.set('checkbox', (checked, element) => {
			if (element.hasAttribute('required') && !checked) return { isValid: false, message: 'You must agree before submitting' };
			return { isValid: true };
		});
		
		this.validationRules.set('text', (value) => {
			if (!value) return { isValid: false, message: 'This field is required' };
			return { isValid: true };
		});
	}
	
	/**
	 * Attach event listeners to form fields
	 */
	attachEventListeners() {
		this.fields.forEach((field, fieldKey) => {
			const element = field.element;
			
			// Real-time validation on input (but only after first interaction)
			element.addEventListener('input', (e) => {
				e.preventDefault();
				if (element.value.length > 0 || field.hasInteracted) {
					this.validateField(fieldKey);
				}
			});
			
			// Validation on blur (always)
			element.addEventListener('blur', (e) => {
				e.preventDefault();
				field.hasInteracted = true;
				this.validateField(fieldKey);
			});
		});
		
		// Form submission
		this.form.addEventListener('submit', (e) => this.handleSubmit(e));
	}
	
	/**
	 * Validate a specific field
	 */
	validateField(fieldKey) {
		const field = this.fields.get(fieldKey);
		if (!field) return;
		
		const element = field.element;
		const value = element.type === 'checkbox' ? element.checked : element.value.trim();
		
		// Skip validation for non-required empty fields
		if (!field.isRequired && !value && element.type !== 'checkbox') {
			field.isValid = true;
			notificationManager.hideInlineNotification(element);
			element.classList.remove('error', 'valid');
			this.updateSubmitButton();
			return;
		}
		
		const rule = this.validationRules.get(field.type);
		if (!rule) {
			field.isValid = true;
			this.updateSubmitButton();
			return;
		}
		
		const result = rule(value, element);
		field.isValid = result.isValid;
		
		// Show/hide notification
		if (result.isValid) {
			notificationManager.showFormValidation(element, true);
		} else {
			notificationManager.showFormValidation(element, false, result.message);
		}
		
		this.updateSubmitButton();
	}
	
	/**
	 * Validate all fields in the form
	 */
	validateAllFields() {
		let isFormValid = true;
		
		this.fields.forEach((field, fieldKey) => {
			this.validateField(fieldKey);
			if (!field.isValid) {
				isFormValid = false;
			}
		});
		
		return isFormValid;
	}
	
	/**
	 * Update submit button state based on form validity
	 */
	updateSubmitButton() {
		const submitButton = this.form.querySelector('button[type="submit"], button:not([type])');
		if (!submitButton) return;
		
		const isFormValid = Array.from(this.fields.values()).every(field => field.isValid);
		
		if (isFormValid) {
			submitButton.disabled = false;
			submitButton.classList.remove('disabled');
		} else {
			submitButton.disabled = true;
			submitButton.classList.add('disabled');
		}
	}
	
	/**
	 * Handle form submission
	 */
	handleSubmit(e) {
		e.preventDefault();
		
		// Validate all fields before submission
		const isValid = this.validateAllFields();
		
		if (isValid) {
			this.onFormSubmit(e);
		}
	}
	
	/**
	 * Form submission handler (can be overridden)
	 */
	onFormSubmit() {
		// Show success notification
		notificationManager.showPopup(
			'Thank you for your feedback!',
			'Your message has been successfully sent. We will contact you shortly.',
			'success',
			5000
		);
		
		// Reset form
		this.resetForm();
	}
	
	/**
	 * Reset form and clear all validation states
	 */
	resetForm() {
		this.form.reset();
		
		// Clear validation states
		this.fields.forEach(field => {
			field.isValid = false;
			field.hasInteracted = false;
			notificationManager.hideInlineNotification(field.element);
			field.element.classList.remove('error', 'valid');
		});
		
		// Reset star rating if exists
		updateStarDisplay(0);
		
		this.updateSubmitButton();
	}
}

/****************************************************************************
 * @name initForm - Initialize form validation and submission handling (legacy)
 * @param {string} formId - The ID of the form to initialize
 ***************************************************************************/
export function initForm(formId) {
	// Use new FormValidator class instead
	return new FormValidator(formId);
}

// Removed unused functions: handleFormSubmit and validateName

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

// ========================================================================
// UNUSED VALIDATION FUNCTIONS - Removed to fix lint warnings
// 
// The following functions were removed because they are not used anywhere:
// - validateTopic, validatePassword, validateMessage, showError, clearError, handleFormSubmit
// These functions can be re-added if needed in the future.
// ========================================================================

