# Smart Luggage Project

A modern, fully responsive e-commerce website for smart luggage sales with contemporary design. Built with semantic HTML5, SCSS, and vanilla JavaScript following web accessibility standards (WCAG).

## 📐 Design Reference

This project is based on the Figma design templates located in the `Figma/` directory:
- Homepage.png - Main landing page design
- Catalog.png - Product catalog with filters
- Product Card.png - Product details page
- About Us.png - Company information page
- Contact Us.png - Contact form page
- My Cart.png - Shopping cart page
- Account Log In.png - Login modal design

## 🚀 How to Run the Project

### 1. Install Dependencies
```bash
npm install
```

### 2. Compile SCSS (if needed)
```bash
npm run compile
```

### 3. Start Live Server

**Option 1: Using VS Code Live Server Extension (Recommended)**
1. Install "Live Server" extension in VS Code
2. Open `src/index.html` file
3. Right-click on the file in Explorer panel → "Open with Live Server"
4. Website will open at `http://localhost:5500/src/`

**Option 2: Using npm live-server**
```bash
npx live-server --port=5500 --open=/src/
```

**Option 3: Using live-server from src folder**
```bash
cd src
npx live-server --port=5500
# Then change base href to "/" in index.html for this method
```

**Option 3: Simple file opening (Limited functionality)**
1. Navigate to `src/` folder
2. Double-click `index.html` 
3. ⚠️ **Note**: Some features may not work due to CORS restrictions

**Option 4: Using Python (if installed)**
```bash
cd src
python -m http.server 5500
```
Then open `http://localhost:5500`

**Option 5: Using Node.js simple server**
```bash
cd src
npx http-server -p 5500
```

### 4. Project Structure
```
project-template-ua/
├── Figma/                  # Design mockups and references
│   ├── Homepage.png
│   ├── Catalog.png
│   ├── Product Card.png
│   ├── About Us.png
│   ├── Contact Us.png
│   └── My Cart.png
├── src/
│   ├── index.html          # Homepage
│   ├── pages/              # Additional pages
│   │   ├── catalog.html
│   │   ├── product-details-template.html
│   │   ├── about.html
│   │   ├── contact.html
│   │   └── cart.html
│   ├── components/         # Reusable HTML components
│   │   ├── header.html     # Header with navigation and login modal
│   │   ├── footer.html     # Footer with benefits section
│   │   └── product-card.html
│   ├── css/                # Compiled CSS (generated)
│   │   └── main.css
│   ├── scss/               # Source SCSS files
│   │   ├── main.scss       # Main SCSS entry point
│   │   ├── abstracts/      # Variables, mixins, functions
│   │   ├── base/           # Reset, fonts, base styles
│   │   ├── components/     # Buttons, forms, product cards
│   │   ├── layouts/        # Header, footer, grid
│   │   └── pages/          # Page-specific styles
│   ├── js/                 # JavaScript modules
│   │   ├── main.js         # Homepage logic
│   │   ├── catalog.js      # Catalog page logic
│   │   ├── product-details.js
│   │   ├── cart.js
│   │   ├── contact.js
│   │   ├── about.js
│   │   ├── header.js       # Header functionality
│   │   ├── forms.js        # Form validation
│   │   ├── interractions.js # UI interactions
│   │   ├── logic.js        # Business logic
│   │   ├── ui.js           # UI rendering
│   │   ├── utils.js        # Utility functions
│   │   └── file_links.js   # Configuration
│   └── assets/             # Static assets
│       ├── images/         # Product images, icons
│       ├── fonts/          # Custom fonts
│       └── data.json       # Product data
├── package.json            # Dependencies and scripts
├── .eslintrc.json          # ESLint configuration
├── .stylelintrc.json       # Stylelint configuration
├── .gitignore              # Git ignore rules
├── README.md               # This file
└── REQUIREMENTS.md         # Project requirements
```

## 📄 Page Overview

### Homepage (`src/index.html`)
- Hero section with call-to-action
- **Travel suitcases carousel** - Smooth auto-sliding image carousel with navigation arrows, keyboard support, and touch/swipe gestures
- **Selected products showcase** - Interactive slider showing 3 products (desktop), 2 (tablet), 1 (mobile) with navigation
- Special offers (25% and 50% discounts)
- **New arrivals section** - Product slider with same responsive behavior as selected products
- Customer testimonials

### Catalog Page (`src/pages/catalog.html`)
- Product filtering (size, category, color, sale status)
- Sorting options (price, name, popularity, rating)
- Search functionality
- Pagination (12 products per page)
- Sidebar with top best sets

### Product Details Page (`src/pages/product-details-template.html`)
- Product image gallery with thumbnails
- Product information (name, price, rating, description)
- Size, color, and category selectors
- Quantity controls
- Add to cart functionality
- Reviews section with rating
- "You May Also Like" recommendations

### About Us Page (`src/pages/about.html`)
- Company features (accuracy, awards, ecological, shipping)
- New arrivals information
- Team members showcase
- Special monthly offer

### Contact Us Page (`src/pages/contact.html`)
- Contact information (location, hours, email, phone)
- Contact form with validation
- Real-time error messages

### Cart Page (`src/pages/cart.html`)
- Cart items table
- **Smart cart merging**: Products with the same name, size, and color are merged with updated quantity
- **Separate entries**: Products with the same name but different size or color remain as separate items
- Quantity update controls
- Remove item functionality
- Discount calculation (10% off over $3000)
- Shipping cost
- Total calculation
- Clear cart button
- Checkout functionality
- Cart data persisted in LocalStorage as array of items

### 4. Project Structure

## ⚠️ Important Notes
- Project uses `<base href="/src/">` for proper asset loading
- Live server can be started from project root (will open at `/src/` path)
- All source files are located in the `src/` directory
- Use `npm run compile` for automatic SCSS compilation with watch mode

## 🔧 Available Scripts
- `npm run compile` - compile SCSS with automatic file watching
- `npm run compile:once` - compile SCSS once without watching
- `npm run lint` - run both JavaScript and SCSS linters
- `npm run lint:js` - lint JavaScript files with ESLint
- `npm run lint:css` - lint SCSS files with Stylelint  
- `npm run lint:fix` - automatically fix linting issues where possible

## 🎯 Optimization Summary

This project has been optimized following modern web development best practices:

### SCSS/CSS Optimizations
- ✅ Added all missing SCSS mixins for consistency and reusability
  - `responsive-size` - responsive scaling for properties
  - `font-parameters` - typography management
  - `flex-responsive` and `grid-responsive` - responsive layouts
  - `shaded-background` - background images with overlays
  - Animation mixins (`fadeIn`, `slideDown`)
  - Form and modal mixins
- ✅ Consolidated all button styles in `$button-styles-map`
- ✅ Organized variables by category (colors, spacing, typography, layout)
- ✅ Removed commented-out code
- ✅ Added comprehensive hover effects map
- ✅ Implemented proper z-index management system

### JavaScript Optimizations
- ✅ **Fisher-Yates shuffle algorithm** - replaced inefficient `sort()` based shuffle with O(n) algorithm
- ✅ **Enhanced error handling** - added validation and defensive programming
- ✅ **DOM performance** - using DocumentFragment for batch DOM operations
- ✅ **Data normalization** - proper type conversion (String()) for comparisons
- ✅ **Improved JSDoc** - comprehensive documentation for all functions
- ✅ **Better async/await** - proper error handling with try/catch
- ✅ **Input validation** - checks for null/undefined/empty arrays
- ✅ **Smart cart merging** - products with matching name, size, and color are merged; different variants remain separate
- ✅ **Cart data structure** - migrated from object to array for better flexibility and merging logic

### HTML Optimizations
- ✅ Removed inline `onclick` handlers
- ✅ Added `data-href` attributes for navigation
- ✅ Event delegation via `DOMContentLoaded`
- ✅ Semantic HTML structure maintained
- ✅ ARIA attributes for accessibility
- ✅ Proper form attributes (type, autocomplete, required)

### Accessibility Enhancements
- ✅ Comprehensive aria-labels for all interactive elements
- ✅ Role attributes (menubar, listbox, alert, dialog)
- ✅ aria-live for dynamic content updates
- ✅ aria-expanded for expandable elements
- ✅ aria-required for required form fields
- ✅ Keyboard navigation support (tabindex)
- ✅ Descriptive alt text for images
- ✅ Focus management for modals

### Development Tools
- ✅ ESLint configuration for JavaScript linting
- ✅ Stylelint configuration for SCSS linting
- ✅ `.gitignore` configured to exclude generated files
- ✅ npm scripts for linting and compilation

### Performance Improvements
1. **Shuffle Algorithm**: O(n²) → O(n) complexity
2. **DOM Operations**: Batch updates using DocumentFragment
3. **Error Prevention**: Early return patterns and validation
4. **Code Maintainability**: Clear documentation and consistent patterns

## 🧪 Testing

### Manual Testing Checklist
- [ ] **Homepage**: Hero section, product sliders, testimonials
- [ ] **Catalog**: Filters work correctly, sorting functions, pagination
- [ ] **Product Details**: Image gallery, quantity controls, add to cart
- [ ] **Cart**: Add/update/remove items, discount calculation, checkout
- [ ] **Forms**: Validation messages, email format, required fields
- [ ] **Login Modal**: Opens/closes, password toggle, form submission
- [ ] **Mobile Menu**: Toggle works, navigation links
- [ ] **Responsive**: Test on mobile (320px-767px), tablet (768px-1023px), desktop (1024px+)

### Linting
```bash
# Run all linters
npm run lint

# Run JavaScript linting only
npm run lint:js

# Run SCSS linting only
npm run lint:css

# Auto-fix linting issues
npm run lint:fix
```

### SCSS Compilation
```bash
# Watch mode (auto-compile on file changes)
npm run compile

# Compile once
npm run compile:once
```

## 🐛 Troubleshooting

### SCSS not compiling
```bash
# Re-install dependencies
npm install

# Compile manually with npx
npx sass src/scss:src/css
```

### Page not loading correctly
- Ensure you're using a web server (not file:// protocol)
- Check browser console for errors
- Clear browser cache and localStorage
- Verify `<base href="/src/">` is correct for your setup

### LocalStorage issues
```javascript
// Clear all localStorage data
localStorage.clear();

// Or clear specific items
localStorage.removeItem('cart');
localStorage.removeItem('allProducts');
```

### Images not loading
- Check that paths are relative to the `src/` directory
- Verify images exist in `src/assets/images/`
- Check browser console for 404 errors

## 🌐 Browser Compatibility

Tested and working on:
- ✅ Chrome 90+
- ✅ Firefox 88+
- ✅ Safari 14+
- ✅ Edge 90+

## 📱 Responsive Breakpoints

```scss
$breakpoints: (
  sm: 480px,   // Mobile
  md: 768px,   // Tablet
  lg: 1024px,  // Desktop
  xl: 1440px   // Large Desktop
);
```

## Performance Improvements

## 📋 Requirements
- Node.js (v14 or higher for npm packages)
- Modern web browser (Chrome, Firefox, Safari, Edge)
- **Recommended**: VS Code with Live Server extension
- **Alternative**: Python 3.x (for simple HTTP server)

## ✨ Key Features

### Sliders Implementation
The homepage features three types of sliders, all built with vanilla JavaScript (no external libraries):

**1. Travel Suitcases Slider**
- **Smooth Transitions**: Uses CSS transitions instead of DOM recreation to prevent "jumping" effects
- **Auto-play**: Automatically advances every 4 seconds
- **Pause on Hover**: Stops auto-play when user hovers over the slider
- **Navigation**: Left/right arrow buttons for manual control
- **Keyboard Support**: Arrow keys (←/→) for navigation
- **Touch/Swipe**: Full touch gesture support for mobile devices
- **Accessibility**: ARIA labels, roles, and keyboard navigation
- **Fixed Height**: Prevents layout shifts during transitions

**2. Product Sliders** (Selected Products & New Products Arrival)
- **Reusable Component**: Single `createProductSlider()` function for both sections
- **Responsive Display**: 
  - Desktop (1024px+): 3 products per view
  - Tablet (768px-1023px): 2 products per view  
  - Mobile (<768px): 1 product per view
- **Smart Detection**: Automatically determines if slider is needed based on item count
- **Smooth Animations**: CSS transform transitions (0.4s ease)
- **Navigation Buttons**: Prev/Next arrows with disabled states at boundaries
- **Touch/Swipe**: Mobile-friendly swipe gestures
- **Keyboard Navigation**: Full keyboard support (Tab, Enter, Space)
- **Accessibility**: ARIA labels for all interactive elements

**Technical Implementation:**
- Location: `src/js/ui.js` - `createSlides()` and `createProductSlider()`
- Styles: `src/scss/components/_sliders.scss`
- No external dependencies - pure vanilla JavaScript
- Optimized DOM manipulation (updates background images instead of recreating elements)
- Event delegation for better performance
- Responsive design with CSS media queries

### Accessibility (WCAG Compliant)
- ✅ Semantic HTML5 structure (nav, section, article, main, aside)
- ✅ ARIA labels and roles for screen readers
- ✅ Keyboard navigation support (Tab, Enter, Escape)
- ✅ Alt text for all images
- ✅ Live regions for dynamic content updates
- ✅ Focus management for modals and interactive elements
- ✅ Proper heading hierarchy (h1-h6)

### Interactive Features
- ✅ **Product Catalog** - Filter by category, color, size, sale status
- ✅ **Sorting** - By price, name, popularity, rating
- ✅ **Search** - Real-time product search
- ✅ **Pagination** - 12 products per page with async loading
- ✅ **Shopping Cart** - Add/update/remove items with LocalStorage
- ✅ **Discounts** - Automatic 10% off for orders over $3000
- ✅ **Login Modal** - Email validation and password toggle
- ✅ **Form Validation** - Real-time validation with RegEx
- ✅ **Reviews** - Customer testimonials and product reviews
- ✅ **Responsive Design** - Mobile, tablet, desktop breakpoints

### JavaScript Functionality
- ✅ ES6+ modern syntax
- ✅ Modular architecture
- ✅ Event delegation
- ✅ LocalStorage for cart persistence
- ✅ Async/await for data loading
- ✅ Form validation without page reload
- ✅ Dynamic content rendering

## 📋 Requirements
- Node.js (for npm packages)
- Modern web browser
- **Optional**: VS Code with Live Server extension
- **Alternative**: Python (for simple HTTP server)

## Data Loading Strategy

This project uses a hybrid data loading and caching strategy for product data:

- On the first page load, product data is fetched from `assets/data.json` using an asynchronous request.
- The fetched data is then cached in the browser's `localStorage` under the key `allProducts`.
- On subsequent page loads (or when navigating between pages), the application first checks `localStorage` for cached product data. If present, it uses the cached data, avoiding unnecessary network requests. If not present or if the cache is corrupted, it fetches the data again and updates the cache.

### Why this approach?
- **Performance:** Reduces the number of network requests, making navigation between pages much faster for the user.
- **Cross-tab support:** Cached data in `localStorage` is available across all browser tabs and windows for the same site.
- **Simplicity:** No need for a complex state management solution for a small/medium project.
- **Fallback:** If the data is missing or corrupted in the cache, the app automatically fetches fresh data.

> Note: If the product data changes frequently on the server, consider adding a cache invalidation mechanism (e.g., by timestamp or version).