const http = require('http');
const url = require('url');
const path = require('path');
const fs = require('fs');

// Sample data for our domain (Catering Management System)
const cateringItems = [
  { id: 1, name: "Chicken Biryani", category: "Main Course", price: 25, cuisine: "Indian", availability: true, servings: 4 },
  { id: 2, name: "Pasta Alfredo", category: "Main Course", price: 18, cuisine: "Italian", availability: true, servings: 2 },
  { id: 3, name: "Caesar Salad", category: "Appetizer", price: 12, cuisine: "Continental", availability: false, servings: 2 },
  { id: 4, name: "Chocolate Cake", category: "Dessert", price: 15, cuisine: "Continental", availability: true, servings: 6 },
  { id: 5, name: "Samosa Platter", category: "Appetizer", price: 8, cuisine: "Indian", availability: true, servings: 4 },
  { id: 6, name: "Grilled Salmon", category: "Main Course", price: 32, cuisine: "Continental", availability: true, servings: 1 },
  { id: 7, name: "Mango Kulfi", category: "Dessert", price: 6, cuisine: "Indian", availability: true, servings: 2 },
  { id: 8, name: "Pizza Margherita", category: "Main Course", price: 22, cuisine: "Italian", availability: true, servings: 3 },
  { id: 9, name: "Tiramisu", category: "Dessert", price: 10, cuisine: "Italian", availability: false, servings: 4 },
  { id: 10, name: "Garlic Bread", category: "Appetizer", price: 5, cuisine: "Italian", availability: true, servings: 4 },
  { id: 11, name: "Butter Chicken", category: "Main Course", price: 28, cuisine: "Indian", availability: true, servings: 3 },
  { id: 12, name: "Spring Rolls", category: "Appetizer", price: 9, cuisine: "Chinese", availability: true, servings: 6 },
  { id: 13, name: "Fried Rice", category: "Main Course", price: 16, cuisine: "Chinese", availability: true, servings: 2 },
  { id: 14, name: "Ice Cream Sundae", category: "Dessert", price: 8, cuisine: "Continental", availability: true, servings: 1 },
  { id: 15, name: "Tandoori Chicken", category: "Main Course", price: 30, cuisine: "Indian", availability: false, servings: 2 }
];

const PORT = 3000;

// Helper function to set CORS headers
function setCORSHeaders(res) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');
}

// Helper function to send JSON response
function sendJSONResponse(res, statusCode, data) {
  setCORSHeaders(res);
  res.writeHead(statusCode, { 'Content-Type': 'application/json' });
  res.end(JSON.stringify(data));
}

// Helper function to serve static files
function serveStaticFile(res, filePath) {
  const extname = path.extname(filePath);
  let contentType = 'text/html';
  
  switch (extname) {
    case '.js':
      contentType = 'text/javascript';
      break;
    case '.css':
      contentType = 'text/css';
      break;
    case '.json':
      contentType = 'application/json';
      break;
    case '.png':
      contentType = 'image/png';
      break;
    case '.jpg':
      contentType = 'image/jpg';
      break;
  }

  fs.readFile(filePath, (err, content) => {
    if (err) {
      if (err.code === 'ENOENT') {
        res.writeHead(404, { 'Content-Type': 'text/html' });
        res.end('<h1>404 - File Not Found</h1>');
      } else {
        res.writeHead(500);
        res.end(`Server Error: ${err.code}`);
      }
    } else {
      setCORSHeaders(res);
      res.writeHead(200, { 'Content-Type': contentType });
      res.end(content);
    }
  });
}

// Helper function to filter catering items based on query parameters
function filterCateringItems(query) {
  let filteredItems = [...cateringItems];

  // Filter by name
  if (query.name) {
    filteredItems = filteredItems.filter(item => 
      item.name.toLowerCase().includes(query.name.toLowerCase())
    );
  }

  // Filter by category
  if (query.category) {
    filteredItems = filteredItems.filter(item => 
      item.category.toLowerCase() === query.category.toLowerCase()
    );
  }

  // Filter by cuisine
  if (query.cuisine) {
    filteredItems = filteredItems.filter(item => 
      item.cuisine.toLowerCase() === query.cuisine.toLowerCase()
    );
  }

  // Filter by price range
  if (query.minPrice) {
    filteredItems = filteredItems.filter(item => 
      item.price >= parseInt(query.minPrice)
    );
  }

  if (query.maxPrice) {
    filteredItems = filteredItems.filter(item => 
      item.price <= parseInt(query.maxPrice)
    );
  }

  // Filter by availability
  if (query.availability !== undefined) {
    const available = query.availability === 'true';
    filteredItems = filteredItems.filter(item => 
      item.availability === available
    );
  }

  // Filter by servings
  if (query.minServings) {
    filteredItems = filteredItems.filter(item => 
      item.servings >= parseInt(query.minServings)
    );
  }

  if (query.maxServings) {
    filteredItems = filteredItems.filter(item => 
      item.servings <= parseInt(query.maxServings)
    );
  }

  return filteredItems;
}

// Create HTTP server
const server = http.createServer((req, res) => {
  const parsedUrl = url.parse(req.url, true);
  const pathname = parsedUrl.pathname;
  const query = parsedUrl.query;

  // Handle preflight OPTIONS requests for CORS
  if (req.method === 'OPTIONS') {
    setCORSHeaders(res);
    res.writeHead(200);
    res.end();
    return;
  }

  // API Routes
  if (pathname === '/api' || pathname === '/api/') {
    // Get all catering items or filtered items
    if (req.method === 'GET') {
      const filteredItems = filterCateringItems(query);
      sendJSONResponse(res, 200, {
        success: true,
        count: filteredItems.length,
        data: filteredItems
      });
    } else {
      sendJSONResponse(res, 405, { success: false, message: 'Method not allowed' });
    }
  }
  else if (pathname === '/api/menu' || pathname === '/api/items') {
    // Get all catering items or filtered items
    if (req.method === 'GET') {
      const filteredItems = filterCateringItems(query);
      sendJSONResponse(res, 200, {
        success: true,
        count: filteredItems.length,
        data: filteredItems
      });
    } else {
      sendJSONResponse(res, 405, { success: false, message: 'Method not allowed' });
    }
  }
  else if (pathname.startsWith('/api/menu/') || pathname.startsWith('/api/items/')) {
    // Get single catering item by ID
    if (req.method === 'GET') {
      const id = parseInt(pathname.split('/').pop());
      const item = cateringItems.find(p => p.id === id);
      
      if (item) {
        sendJSONResponse(res, 200, {
          success: true,
          data: item
        });
      } else {
        sendJSONResponse(res, 404, {
          success: false,
          message: 'Menu item not found'
        });
      }
    } else {
      sendJSONResponse(res, 405, { success: false, message: 'Method not allowed' });
    }
  }
  else if (pathname === '/api/categories') {
    // Get all unique categories
    if (req.method === 'GET') {
      const categories = [...new Set(cateringItems.map(p => p.category))];
      sendJSONResponse(res, 200, {
        success: true,
        data: categories
      });
    } else {
      sendJSONResponse(res, 405, { success: false, message: 'Method not allowed' });
    }
  }
  else if (pathname === '/api/cuisines') {
    // Get all unique cuisines
    if (req.method === 'GET') {
      const cuisines = [...new Set(cateringItems.map(p => p.cuisine))];
      sendJSONResponse(res, 200, {
        success: true,
        data: cuisines
      });
    } else {
      sendJSONResponse(res, 405, { success: false, message: 'Method not allowed' });
    }
  }
  // Serve static files
  else if (pathname === '/' || pathname === '/index.html') {
    serveStaticFile(res, path.join(__dirname, 'public', 'index.html'));
  }
  else if (pathname.startsWith('/public/')) {
    const filePath = path.join(__dirname, pathname);
    serveStaticFile(res, filePath);
  }
  else {
    // Try to serve from public directory
    const filePath = path.join(__dirname, 'public', pathname);
    serveStaticFile(res, filePath);
  }
});

server.listen(PORT, () => {
  console.log(`🍽️  Catering Management System API running at http://localhost:${PORT}`);
  console.log('\n📋 Available API endpoints:');
  console.log('GET /api - Get all menu items (supports query parameters)');
  console.log('GET /api/menu - Get all menu items');
  console.log('GET /api/items - Get all items (alias for menu)');
  console.log('GET /api/menu/:id - Get menu item by ID');
  console.log('GET /api/categories - Get all food categories');
  console.log('GET /api/cuisines - Get all available cuisines');
  console.log('\n🔍 Query parameters supported:');
  console.log('- name: filter by dish name');
  console.log('- category: filter by food category (Main Course, Appetizer, Dessert)');
  console.log('- cuisine: filter by cuisine type (Indian, Italian, Chinese, Continental)');
  console.log('- minPrice: minimum price filter');
  console.log('- maxPrice: maximum price filter');
  console.log('- availability: filter by availability status (true/false)');
  console.log('- minServings: minimum servings filter');
  console.log('- maxServings: maximum servings filter');
  console.log('\n💡 Example: /api?category=Main Course&cuisine=Indian&minPrice=20&availability=true');
});
