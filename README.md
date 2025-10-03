# Smart Luggage Project

A modern website for smart luggage sales with contemporary design.

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
src/
├── index.html          # Main page
├── pages/              # Other pages
├── css/                # Compiled CSS
├── scss/               # Source SCSS files
├── js/                 # JavaScript files
├── assets/             # Images and fonts
└── components/         # HTML components
```

## ⚠️ Important Notes
- Project uses `<base href="/src/">` for proper asset loading
- Live server can be started from project root (will open at `/src/` path)
- All source files are located in the `src/` directory
- Use `npm run compile` for automatic SCSS compilation with watch mode

## 🔧 Available Scripts
- `npm run compile` - compile SCSS with automatic file watching

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