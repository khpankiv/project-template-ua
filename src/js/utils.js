// ==========================================================
// ================= Utility Functions =======================
// ==========================================================
import { dataFile } from "./file_links.js"; 

/*********************************************************
 * @name getRandomItems - Fetches N random unique items from an array.
 * Uses Fisher-Yates shuffle algorithm for better performance and true randomness.
 * @param {Array} array - The input array to pick random items from.
 * @param {number} count - The number of random items to return.
 * @returns {Array} A new array with random unique items.
 ***********************************************************/
export function getRandomItems(array, count) {
  if (!Array.isArray(array) || array.length === 0) return [];
  if (count <= 0) return [];
  
  const actualCount = Math.min(count, array.length);
  const result = [];
  const copy = [...array]; // Create a shallow copy
  
  // Fisher-Yates shuffle - only shuffle the first 'count' elements
  for (let i = 0; i < actualCount; i++) {
    const randomIndex = i + Math.floor(Math.random() * (copy.length - i));
    [copy[i], copy[randomIndex]] = [copy[randomIndex], copy[i]];
    result.push(copy[i]);
  }
  
  return result;
}

/***************************************************************************
 * @name getProductsByField - Filters products by a specific field and value.
 * @param {Array} products - The array of products to filter.
 * @param {string} field - The field name to check.
 * @param {*} value - The value to match.
 * @returns {Array} The filtered array of products.
 ****************************************************************************/
export function getProductsByField(products, field, value) {
	if (!Array.isArray(products)) {
		console.warn('getProductsByField: products is not an array');
		return [];
	}
	
	if (!field || value === undefined || value === null) {
		console.warn('getProductsByField: field or value is missing');
		return products;
	}
	
	const normalizedValue = String(value).toLowerCase();
	
	return products.filter(product => {
		if (!product || !product[field]) return false;
		
		const fieldValue = product[field];
		
		if (Array.isArray(fieldValue)) {
			return fieldValue.some(v => 
				String(v).toLowerCase() === normalizedValue
			);
		}
		
		return String(fieldValue).toLowerCase() === normalizedValue;
	});
}

/****************************************************************************
 * @name fetchProducts - Fetches data from a JSON file.
 * @param {string} dataFile - The path to the data file.
 * @returns {Promise<Array>} The fetched products array or empty array on error.
 ****************************************************************************/
export async function fetchProducts(dataFile) {
  if (!dataFile) {
    console.error('fetchProducts: dataFile path is required');
    return [];
  }
  
  try {
    const response = await fetch(dataFile);
    
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    
    const allProducts = await response.json();
    
    if (allProducts && Array.isArray(allProducts.data)) {
      console.log(`Data fetched successfully: ${allProducts.data.length} products`);
      return allProducts.data;
    }
    
    console.warn('fetchProducts: data format is invalid');
    return [];
  } catch (error) {
    console.error('Failed to fetch data:', error.message);
    return [];
  }
}

/****************************************************************************
 * @name capitalize - Capitalizes the first letter of a string.
 * @param {string} str - The string to capitalize.
 * @returns {string} The capitalized string.
 ****************************************************************************/
export function capitalize(str) {
  if (typeof str !== 'string' || str.length === 0) return '';
  return str.charAt(0).toUpperCase() + str.slice(1);
}

/*****************************************************************************
 * @name generateLoremIpsum - Generates placeholder Lorem Ipsum text.
 * @param {number} paragraphsCount - The number of paragraphs to generate.
 * @param {number} sentencesPerParagraph - The number of sentences per paragraph.
 * @returns {string} The generated Lorem Ipsum text.
 *********************************************************************************/
export function generateLoremIpsumParagraphs(paragraphsCount = 2, sentencesPerParagraph = 5) {
  const lorem = [
    "Lorem ipsum dolor sit amet, consectetur adipiscing elit.",
    "Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.",
    "Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat.",
    "Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur.",
    "Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.",
    "Curabitur pretium tincidunt lacus. Nulla gravida orci a odio.",
    "Nullam varius, turpis et commodo pharetra, est eros bibendum elit, nec luctus magna felis sollicitudin mauris.",
    "Integer in mauris eu nibh euismod gravida.",
    "Phasellus fermentum in, dolor. Pellentesque facilisis.",
    "Nulla imperdiet sit amet magna. Vestibulum dapibus, mauris nec malesuada fames ac turpis velit."
  ];
  let result = [];
  for (let p = 0; p < paragraphsCount; p++) {
    let paragraph = [];
    for (let s = 0; s < sentencesPerParagraph; s++) {
      paragraph.push(lorem[Math.floor(Math.random() * lorem.length)]);
    }
    result.push(`<p>${paragraph.join(' ')}</p>`);
  }
  return result.join('');
}

/**************************************************************************************************
 * @name getInfoById - Retrieves all product information by id.
 * @param {string|Array} id - Single ID or array of cart items with {id, name, size, color, quantity}
 * @returns {Promise<Object|Array|null>} Product(s) information or null if not found
 **************************************************************************************************/
export async function getInfoById(id) {
	const allProducts = await fetchProducts(dataFile);
	
	if (!allProducts || allProducts.length === 0) {
		console.error('getInfoById: No products available');
		return null;
	}
	
	// If id is an array of cart items: [{id, name, size, color, quantity}, ...]
	if (Array.isArray(id)) {
		return id.map(cartItem => {
			const product = allProducts.find(p => String(p.id) === String(cartItem.id));
			if (product) {
				return {
					...product,
					quantity: cartItem.quantity,
					// Use cart item's size and color if available, otherwise use product defaults
					size: cartItem.size || product.size,
					color: cartItem.color || product.color
				};
			}
			return null;
		}).filter(Boolean);
	}
	
	// If id is a single value (just id, no quantity)
	return allProducts.find(p => String(p.id) === String(id)) || null;
}

/************************************************************************
 * @name getProductIdFromURL - Get product ID from URL parameters
 * @returns {string|null} - The product ID or null if not found
 ************************************************************************/
export function getProductIdFromURL() {
	const urlParams = new URLSearchParams(window.location.search);
	const id = urlParams.get('id');
	
	if (!id) {
		console.error('Product ID not found in URL');
		return null;
	}
	
	return id;
}


