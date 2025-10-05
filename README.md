# Travel Suitcase E-Shop

A fully responsive, multi-page e-commerce website for travel luggage and suitcases. Built with vanilla HTML5, CSS3/SCSS, and JavaScript without any frameworks, this project demonstrates modern web development practices and responsive design principles.

## 🚀 Project Overview

This e-commerce platform offers a complete shopping experience for travel luggage, featuring product catalogs, detailed product pages, shopping cart functionality, and user account management.

### Key Features

- **Responsive Design**: Optimized for mobile, tablet, and desktop devices
- **Interactive Product Catalog**: Filtering, sorting, search, and pagination
- **Shopping Cart**: Add/remove items, quantity management, localStorage persistence
- **Product Details**: Dynamic product pages with reviews and recommendations
- **User Authentication**: Login modal with form validation
- **Modern UI**: Hover effects, animations, and intuitive navigation

## 🛠 Technologies Used

- **HTML5**: Semantic markup with modern web standards
- **CSS3/SCSS**: Advanced styling with Sass preprocessing
- **JavaScript ES6+**: Modular JavaScript with async/await
- **Local Storage**: Client-side data persistence
- **Responsive Design**: Mobile-first approach with flexible layouts

## 📱 Pages & Functionality

### Homepage (`/src/index.html`)
- Hero section with featured products
- Travel suitcase carousel with hover effects
- Selected and new product sections
- Customer testimonials

### Catalog (`/src/pages/catalog.html`)
- Product grid with 12 items per page
- Advanced filtering by category, color, size, and sales status
- Sorting by price, popularity, and rating
- Real-time search functionality
- Pagination with async loading

### Product Details (`/src/pages/product-details-template.html`)
- Dynamic product information loading
- Quantity selector and add-to-cart functionality
- Product reviews with form submission
- "You may also like" recommendations

### Shopping Cart (`/src/pages/cart.html`)
- Complete cart management
- Quantity updates and item removal
- Price calculations with discount rules
- Checkout process with order confirmation

### Additional Pages
- **About Us** (`/src/pages/about.html`): Company information and team
- **Contact** (`/src/pages/contact.html`): Contact form with validation

## 🚀 Setup Instructions

### Prerequisites
- Node.js (v14 or higher)
- npm (Node Package Manager)

### Installation

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd project-template-ua
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Compile SCSS to CSS**
   ```bash
   npm run compile
   ```
   
   For development with auto-compilation:
   ```bash
   npm run compile:watch
   ```

4. **Start local development server**
   ```bash
   npx live-server src
   ```
   
   The site will be available at `http://localhost:8080`

### Available Scripts

- `npm run compile` - Compile SCSS to CSS (production)
- `npm run compile:watch` - Watch and compile SCSS changes
- `npm run compile:once` - Single compilation run
- `npm run lint` - Run ESLint and Stylelint
- `npm run lint:js` - Lint JavaScript files only
- `npm run lint:css` - Lint SCSS files only
- `npm run lint:fix` - Auto-fix linting issues

## 📁 Project Structure

```
src/
├── index.html                 # Homepage
├── pages/                     # All application pages
│   ├── about.html
│   ├── cart.html
│   ├── catalog.html
│   ├── contact.html
│   └── product-details-template.html
├── js/                        # JavaScript modules
│   ├── main.js               # Main entry point
│   ├── header.js             # Header and navigation
│   ├── cart.js               # Shopping cart logic
│   ├── catalog.js            # Product catalog
│   ├── forms.js              # Form handling and validation
│   ├── logic.js              # Core business logic
│   └── ui.js                 # UI rendering functions
├── scss/                      # SCSS source files
│   ├── main.scss             # Main SCSS entry point
│   ├── abstracts/            # Variables, mixins, functions
│   ├── base/                 # Reset, typography, base styles
│   ├── components/           # Reusable components
│   ├── layouts/              # Layout-specific styles
│   └── pages/                # Page-specific styles
├── assets/                    # Static assets
│   ├── data.json             # Product data
│   ├── images/               # Image assets
│   └── fonts/                # Custom fonts
└── components/                # HTML components
    ├── header.html
    ├── footer.html
    └── product-card.html
```

## 🎯 Features Implementation

### Responsive Design
- **Breakpoints**: 768px (tablet), 1024px (desktop), 1440px (large desktop)
- **Mobile Navigation**: Hamburger menu for mobile devices
- **Flexible Layouts**: CSS Grid and Flexbox for adaptive layouts
- **Image Optimization**: Responsive images with proper aspect ratios

### Interactive Functionality
- **Product Filtering**: Multi-select filters with real-time updates
- **Search**: Live product search with "not found" handling
- **Shopping Cart**: Persistent cart with localStorage
- **Form Validation**: Real-time email validation and required field checks
- **Modal Windows**: Login modal with password visibility toggle

### Performance & Accessibility
- **Semantic HTML**: Proper use of HTML5 semantic elements
- **Modern CSS**: CSS custom properties and advanced selectors
- **ES6+ JavaScript**: Modular architecture with async operations
- **Cross-browser**: Tested in Chrome and Firefox

## 🔧 Development Guidelines

### CSS/SCSS Organization
- **BEM Methodology**: Block-Element-Modifier naming convention
- **SCSS Features**: Variables, mixins, nesting, and partials
- **Component-based**: Reusable component styles
- **Responsive Mixins**: Centralized breakpoint management

### JavaScript Architecture
- **ES6 Modules**: Import/export module system
- **Async/Await**: Modern asynchronous programming
- **LocalStorage**: Client-side data persistence
- **Event Delegation**: Efficient event handling

### Code Quality
- **ESLint**: JavaScript code linting
- **Stylelint**: SCSS code linting
- **Documentation**: Comprehensive JSDoc comments
- **Error Handling**: Proper try-catch blocks and user feedback

## 🌐 Browser Support

- Chrome 70+
- Firefox 65+
- Safari 12+
- Edge 79+

## 📋 TODO / Future Enhancements

- [ ] Add unit tests for JavaScript modules
- [ ] Implement service worker for offline functionality
- [ ] Add image lazy loading
- [ ] Integrate with payment gateway
- [ ] Add multi-language support

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/new-feature`)
3. Commit your changes (`git commit -am 'Add new feature'`)
4. Push to the branch (`git push origin feature/new-feature`)
5. Create a Pull Request

## 📄 License

This project is licensed under the ISC License - see the package.json for details.

## 🎨 Design Credits

Design based on Figma template specifications with custom implementations for enhanced user experience and modern web standards.

---

Built with ❤️ using vanilla web technologies