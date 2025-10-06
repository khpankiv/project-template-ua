// ==========================================================
// ================= Utility Functions =======================
// ==========================================================
import { dataFile } from "./file_links.js"; 

/*********************************************************
 * @name getRandomItems - Fetches N random unique items from an array.
 * @param {Array} array - The input array to pick random items from.
 * @param {number} count - The number of random items to return.
 * @returns {Array} A new array with random unique items.
 ***********************************************************/
export function getRandomItems(array, count) {
  try {
    // Валідація параметрів
    if (!Array.isArray(array)) {
      console.warn('getRandomItems: array parameter is not an array');
      return [];
    }
    if (typeof count !== 'number' || count < 0) {
      console.warn('getRandomItems: count parameter must be a non-negative number');
      return [];
    }
    if (array.length === 0) {
      console.warn('getRandomItems: empty array provided');
      return [];
    }
    
    const shuffled = array.slice().sort(() => 0.5 - Math.random());
    return shuffled.slice(0, Math.min(count, array.length));
  } catch (error) {
    console.error('Error in getRandomItems:', error);
    return [];
  }
}

/***************************************************************************
 * @name getProductsByField - Filters products by a specific field and value.
 * @param {Array} products - The array of products to filter.
 * @param {string} field - The field name to check.
 * @param { value } - The value to match.
 * @returns {Array} The filtered array of products.
 ****************************************************************************/
export function getProductsByField(products, field, value) {
	try {
		// Parameters validation
		if (!Array.isArray(products)) {
			console.warn('getProductsByField: products parameter is not an array');
			return [];
		}
		if (typeof field !== 'string' || !field.trim()) {
			console.warn('getProductsByField: field parameter must be a non-empty string');
			return [];
		}
		if (value === null || value === undefined) {
			console.warn('getProductsByField: value parameter cannot be null or undefined');
			return [];
		}
		
		return products.filter(function(product) {
			try {
				if (!product || typeof product !== 'object') {
					return false;
				}
				
				let fieldValue = product[field];
				if (fieldValue === null || fieldValue === undefined) {
					return false;
				}
				
				let match = false;
				if (Array.isArray(fieldValue)) {
					match = fieldValue.some(v => {
						return v && typeof v.toLowerCase === 'function' && 
							   v.toLowerCase() === String(value).toLowerCase();
					});
				} else if (typeof fieldValue.toLowerCase === 'function') {
					match = fieldValue.toLowerCase() === String(value).toLowerCase();
				} else {
					match = String(fieldValue) === String(value);
				}
				return match;
			} catch (itemError) {
				console.warn('Error filtering product item:', itemError);
				return false;
			}
		});
	} catch (error) {
		console.error('Error in getProductsByField:', error);
		return [];
	}
}

/****************************************************************************
 * @name fetchProducts - Fetches data from a JSON file.
 * @param {string} dataFile - The path to the data file.
 * @returns {Promise<Array>} The fetched products array.
 ****************************************************************************/
export async function fetchProducts(dataFile) {
  try {
    // Валідація параметрів
    if (!dataFile || typeof dataFile !== 'string') {
      throw new Error('Invalid dataFile parameter: must be a non-empty string');
    }
    
    const data = await fetch(dataFile);
    
    // Check response status
    if (!data.ok) {
      throw new Error(`HTTP error! status: ${data.status} - ${data.statusText}`);
    }
    
    const contentType = data.headers.get('content-type');
    if (!contentType?.includes('application/json')) {
      console.warn('Response is not JSON format');
    }
    
    const allProducts = await data.json();
    
    // Data structure validation
    if (!allProducts) {
      throw new Error('No data received from server');
    }
    
    if (allProducts?.data && Array.isArray(allProducts.data)) {
      return allProducts.data;
    } else if (Array.isArray(allProducts)) {
      return allProducts;
    } else {
      console.warn('Unexpected data structure received:', allProducts);
      return [];
    }
  } catch (error) {
    console.error('Failed to fetch data from', dataFile, ':', error.message);
    // Return empty array instead of throwing error
    return [];
  }
}

/****************************************************************************
 * @name capitalize - Capitalizes the first letter of a string.
 * @param {string} str - The string to capitalize.
 * @returns {string} The capitalized string.
 ****************************************************************************/
export function capitalize(str) {
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
 **************************************************************************************************/
export async function getInfoById(id) {
	const allProducts = await fetchProducts(dataFile);
	// If id is an object: {id: quantity, ...}
	if (id && typeof id === 'object' && !Array.isArray(id)) {
		return Object.keys(id).map(key => {
			const product = allProducts.find(p => p.id == key);
			return product ? { ...product, quantity: id[key] } : null;
		}).filter(Boolean);
	}
	// If id is an array: [id1, id2, ...]
	if (Array.isArray(id)) {
		return id.map(singleId => allProducts.find(p => p.id == singleId)).filter(Boolean);
	}
	// If id is a single value (just id, no quantity)
	return allProducts.find(p => p.id == id);
}

/************************************************************************
 * @name getProductIdFromURL - Get product ID from URL parameters
 * @return {string|null} - The product ID or null if not found
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


