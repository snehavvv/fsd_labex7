# REST API Project - Product Catalog

A complete REST API project built with Node.js backend (using only built-in `http` module) and HTML + Vanilla JavaScript + Tailwind CSS frontend.

## Project Structure

```
labex7_fsd/
├── package.json          # Project configuration
├── server.js            # Node.js REST API server
├── public/              # Frontend files
│   ├── index.html       # Main HTML page
│   └── app.js          # Vanilla JavaScript functionality
└── README.md           # This file
```

## Features

### Server Side (Node.js)
- **Pure Node.js**: Uses only built-in `http` module (no Express)
- **REST API Endpoints**:
  - `GET /api` - Get all products with query parameter support
  - `GET /api/products` - Get all products
  - `GET /api/items` - Alias for products endpoint
  - `GET /api/products/:id` - Get single product by ID
  - `GET /api/categories` - Get all unique categories
  - `GET /api/brands` - Get all unique brands
- **CORS Support**: Proper CORS headers for cross-origin requests
- **Query Parameters**: Support for filtering by name, category, brand, price range, and stock status

### Client Side (HTML + Vanilla JS + Tailwind CSS)
- **Responsive Design**: Works on desktop, tablet, and mobile
- **Interactive Filters**: Dropdowns and input fields for filtering
- **Real-time Search**: Search as you type functionality
- **Modern UI**: Clean, professional design with Tailwind CSS
- **API Integration**: Fetches data from REST API using vanilla JavaScript

## API Endpoints

### Base URL: `http://localhost:3000`

1. **Get All Products**
   ```
   GET /api
   GET /api/products
   GET /api/items
   ```

2. **Get Single Product**
   ```
   GET /api/products/:id
   ```

3. **Get Categories**
   ```
   GET /api/categories
   ```

4. **Get Brands**
   ```
   GET /api/brands
   ```

## Query Parameters

All product endpoints support the following query parameters:

- `name` - Filter by product name (partial match, case-insensitive)
- `category` - Filter by exact category match
- `brand` - Filter by exact brand match
- `minPrice` - Minimum price filter (inclusive)
- `maxPrice` - Maximum price filter (inclusive)
- `inStock` - Filter by stock status (`true` or `false`)

### Example Requests

```bash
# Get all products
GET /api

# Get electronics under $500
GET /api?category=Electronics&maxPrice=500

# Get products with "phone" in the name
GET /api?name=phone

# Get in-stock products from TechCorp
GET /api?brand=TechCorp&inStock=true

# Get products in price range $100-$300
GET /api?minPrice=100&maxPrice=300
```

## Sample Data

The API includes sample product data with the following structure:

```json
{
  "id": 1,
  "name": "Laptop",
  "category": "Electronics",
  "price": 999,
  "brand": "TechCorp",
  "inStock": true
}
```

Categories include:
- Electronics
- Education
- Furniture
- Kitchen

## How to Run

1. **Start the Server**:
   ```bash
   node server.js
   ```
   The server will start on `http://localhost:3000`

2. **Open the Frontend**:
   - Open your browser and go to `http://localhost:3000`
   - The HTML page will be served automatically

3. **Test the API**:
   - Use the web interface to test different filters
   - Or test API endpoints directly using curl, Postman, or browser

## Project Requirements Fulfilled

✅ **Server Side Requirements**:
- ✅ Pure Node.js with built-in `http` module only
- ✅ REST API serving data from chosen domain (Product Catalog)
- ✅ Query parameter support
- ✅ Multiple endpoints: `/api`, `/api/items`, `/api/products/:id`
- ✅ Proper CORS headers for cross-origin support

✅ **Client Side Requirements**:
- ✅ HTML + Vanilla JavaScript + Tailwind CSS
- ✅ UI to fetch and display data from REST API
- ✅ Dropdowns and input fields for filtering
- ✅ Query parameter filtering functionality

## API Response Format

All API responses follow this format:

```json
{
  "success": true,
  "count": 10,
  "data": [...]
}
```

Error responses:
```json
{
  "success": false,
  "message": "Error description"
}
```

## Technologies Used

- **Backend**: Node.js (built-in `http`, `url`, `path`, `fs` modules)
- **Frontend**: HTML5, Vanilla JavaScript (ES6+), Tailwind CSS
- **Development**: No build tools required - runs directly

## Learning Outcomes

This project demonstrates:
1. Building REST APIs with pure Node.js
2. Implementing CORS for cross-origin requests
3. URL parsing and query parameter handling
4. Frontend-backend communication with fetch API
5. Responsive web design with Tailwind CSS
6. Vanilla JavaScript DOM manipulation
7. RESTful API design principles
