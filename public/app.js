const API_BASE_URL = 'http://localhost:3000';
const searchNameInput = document.getElementById('searchName');
const categoryFilter = document.getElementById('categoryFilter');
const cuisineFilter = document.getElementById('cuisineFilter');
const availabilityFilter = document.getElementById('availabilityFilter');
const minPriceInput = document.getElementById('minPrice');
const maxPriceInput = document.getElementById('maxPrice');
const minServingsInput = document.getElementById('minServings');
const maxServingsInput = document.getElementById('maxServings');
const searchBtn = document.getElementById('searchBtn');
const clearBtn = document.getElementById('clearBtn');
const loadAllBtn = document.getElementById('loadAllBtn');
const menuContainer = document.getElementById('menuContainer');
const resultCount = document.getElementById('resultCount');
const noResults = document.getElementById('noResults');
const loadingSpinner = document.getElementById('loadingSpinner');
const apiStatus = document.getElementById('apiStatus');
let allMenuItems = [];
let categories = [];
let cuisines = [];
document.addEventListener('DOMContentLoaded', async () => {
    await loadInitialData();
    setupEventListeners();
    await loadAllMenuItems();
});
function setupEventListeners() {
    searchBtn.addEventListener('click', handleSearch);
    clearBtn.addEventListener('click', clearFilters);
    loadAllBtn.addEventListener('click', loadAllMenuItems);
    searchNameInput.addEventListener('keypress', (e) => {
        if (e.key === 'Enter') {
            handleSearch();
        }
    });
    categoryFilter.addEventListener('change', handleSearch);
    cuisineFilter.addEventListener('change', handleSearch);
    availabilityFilter.addEventListener('change', handleSearch);
}
async function loadInitialData() {
    try {
        showLoading(true);
        const categoriesResponse = await fetch(`${API_BASE_URL}/api/categories`);
        if (categoriesResponse.ok) {
            const categoriesData = await categoriesResponse.json();
            categories = categoriesData.data;
            populateDropdown(categoryFilter, categories);
        }
        const cuisinesResponse = await fetch(`${API_BASE_URL}/api/cuisines`);
        if (cuisinesResponse.ok) {
            const cuisinesData = await cuisinesResponse.json();
            cuisines = cuisinesData.data;
            populateDropdown(cuisineFilter, cuisines);
        }
        
        showApiStatus('success', 'Successfully connected to Catering API');
    } catch (error) {
        console.error('Error loading initial data:', error);
        showApiStatus('error', 'Failed to connect to API. Please make sure the server is running.');
    } finally {
        showLoading(false);
    }
}
function populateDropdown(selectElement, options) {
    while (selectElement.children.length > 1) {
        selectElement.removeChild(selectElement.lastChild);
    }
    options.forEach(option => {
        const optionElement = document.createElement('option');
        optionElement.value = option;
        optionElement.textContent = option;
        selectElement.appendChild(optionElement);
    });
}
async function handleSearch() {
    try {
        showLoading(true);

        const queryParams = new URLSearchParams();
        
        if (searchNameInput.value.trim()) {
            queryParams.append('name', searchNameInput.value.trim());
        }
        
        if (categoryFilter.value) {
            queryParams.append('category', categoryFilter.value);
        }
        
        if (cuisineFilter.value) {
            queryParams.append('cuisine', cuisineFilter.value);
        }
        
        if (availabilityFilter.value) {
            queryParams.append('availability', availabilityFilter.value);
        }
        
        if (minPriceInput.value) {
            queryParams.append('minPrice', minPriceInput.value);
        }
        
        if (maxPriceInput.value) {
            queryParams.append('maxPrice', maxPriceInput.value);
        }
        
        if (minServingsInput.value) {
            queryParams.append('minServings', minServingsInput.value);
        }
        
        if (maxServingsInput.value) {
            queryParams.append('maxServings', maxServingsInput.value);
        }
        
        // Make API request
        const url = `${API_BASE_URL}/api?${queryParams.toString()}`;
        console.log('Fetching:', url);
        
        const response = await fetch(url);
        
        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }
        
        const data = await response.json();
        
        if (data.success) {
            displayMenuItems(data.data);
            updateResultCount(data.count);
            showApiStatus('success', `Found ${data.count} menu items`);
        } else {
            throw new Error(data.message || 'Failed to fetch menu items');
        }
        
    } catch (error) {
        console.error('Error searching menu items:', error);
        showApiStatus('error', `Error: ${error.message}`);
        displayMenuItems([]);
        updateResultCount(0);
    } finally {
        showLoading(false);
    }
}

// Load all menu items
async function loadAllMenuItems() {
    try {
        showLoading(true);
        
        const response = await fetch(`${API_BASE_URL}/api/menu`);
        
        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }
        
        const data = await response.json();
        
        if (data.success) {
            allMenuItems = data.data;
            displayMenuItems(allMenuItems);
            updateResultCount(data.count);
            showApiStatus('success', `Loaded ${data.count} menu items`);
        } else {
            throw new Error(data.message || 'Failed to fetch menu items');
        }
        
    } catch (error) {
        console.error('Error loading menu items:', error);
        showApiStatus('error', `Error: ${error.message}`);
        displayMenuItems([]);
        updateResultCount(0);
    } finally {
        showLoading(false);
    }
}

// Display menu items in the grid
function displayMenuItems(menuItems) {
    menuContainer.innerHTML = '';
    
    if (menuItems.length === 0) {
        noResults.classList.remove('hidden');
        return;
    }
    
    noResults.classList.add('hidden');
    
    menuItems.forEach(item => {
        const menuCard = createMenuCard(item);
        menuContainer.appendChild(menuCard);
    });
}

// Create a menu card element
function createMenuCard(item) {
    const card = document.createElement('div');
    card.className = 'bg-white/15 backdrop-blur-md border border-white/25 rounded-xl p-5 card-hover transition-all duration-200 animate-fade-in';
    
    const availabilityBadgeClass = item.availability 
        ? 'bg-gradient-to-r from-green-400 to-green-500 text-white' 
        : 'bg-gradient-to-r from-red-400 to-red-500 text-white';
    const availabilityText = item.availability ? 'Available' : 'Unavailable';
    const availabilityIcon = item.availability ? 'fas fa-check-circle' : 'fas fa-times-circle';
    
    // Category icon mapping
    const categoryIcons = {
        'Main Course': 'fas fa-drumstick-bite',
        'Appetizer': 'fas fa-leaf',
        'Dessert': 'fas fa-ice-cream'
    };
    
    const categoryIcon = categoryIcons[item.category] || 'fas fa-utensils';
    
    // Cuisine flag mapping
    const cuisineFlags = {
        'Indian': '🇮🇳',
        'Italian': '🇮🇹',
        'Chinese': '🇨🇳',
        'Continental': '🌍'
    };
    
    const cuisineFlag = cuisineFlags[item.cuisine] || '🍽️';
    
    card.innerHTML = `
        <div class="flex justify-between items-start mb-4">
            <div class="flex-1">
                <div class="flex items-center mb-2">
                    <div class="bg-gradient-to-r from-orange-500 to-orange-600 p-2 rounded-lg mr-3 shadow-sm">
                        <i class="${categoryIcon} text-white text-sm"></i>
                    </div>
                    <div>
                        <h3 class="text-lg font-semibold text-white mb-1">${escapeHtml(item.name)}</h3>
                        <p class="text-gray-300 text-sm flex items-center">
                            <span class="mr-2">${cuisineFlag}</span>${escapeHtml(item.cuisine)} Cuisine
                        </p>
                    </div>
                </div>
            </div>
            <span class="px-3 py-1 text-xs font-medium rounded-full ${availabilityBadgeClass} shadow-sm">
                <i class="${availabilityIcon} mr-1"></i>${availabilityText}
            </span>
        </div>
        
        <div class="flex justify-between items-center mb-4">
            <span class="inline-flex items-center bg-blue-500/25 text-blue-200 text-sm px-3 py-1 rounded-full border border-blue-500/40">
                <i class="fas fa-list mr-2"></i>${escapeHtml(item.category)}
            </span>
            <span class="inline-flex items-center bg-purple-500/25 text-purple-200 text-sm px-3 py-1 rounded-full border border-purple-500/40">
                <i class="fas fa-users mr-2"></i>${item.servings} serving${item.servings !== 1 ? 's' : ''}
            </span>
        </div>
        
        <div class="flex justify-between items-center">
            <div class="text-left">
                <span class="text-2xl font-bold bg-gradient-to-r from-green-400 to-emerald-400 bg-clip-text text-transparent">
                    $${item.price}
                </span>
                <p class="text-gray-400 text-xs">Item ID: ${item.id}</p>
            </div>
            <button 
                onclick="viewMenuItemDetails(${item.id})"
                class="bg-gradient-to-r from-orange-500 to-orange-600 text-white px-4 py-2 text-sm rounded-lg hover:from-orange-600 hover:to-orange-700 transition-all duration-200 transform hover:scale-102 shadow-md focus:outline-none focus:ring-2 focus:ring-orange-400"
            >
                <i class="fas fa-eye mr-2"></i>View Details
            </button>
        </div>
    `;
    
    // Add relative positioning for subtle hover effect
    card.style.position = 'relative';
    
    return card;
}

// View menu item details
async function viewMenuItemDetails(itemId) {
    try {
        const response = await fetch(`${API_BASE_URL}/api/menu/${itemId}`);
        
        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }
        
        const data = await response.json();
        
        if (data.success) {
            showMenuItemModal(data.data);
        } else {
            throw new Error(data.message || 'Failed to fetch menu item details');
        }
        
    } catch (error) {
        console.error('Error loading menu item details:', error);
        alert(`Error loading menu item details: ${error.message}`);
    }
}

// Show menu item details in a modal
function showMenuItemModal(item) {
    // Create modal backdrop
    const modalBackdrop = document.createElement('div');
    modalBackdrop.className = 'fixed inset-0 bg-black/40 backdrop-blur-sm z-50 flex items-center justify-center p-4';
    modalBackdrop.style.animation = 'fadeIn 0.2s ease-out';
    
    // Category icon mapping
    const categoryIcons = {
        'Main Course': 'fas fa-drumstick-bite',
        'Appetizer': 'fas fa-leaf',
        'Dessert': 'fas fa-ice-cream'
    };
    
    const categoryIcon = categoryIcons[item.category] || 'fas fa-utensils';
    const availabilityIcon = item.availability ? 'fas fa-check-circle' : 'fas fa-times-circle';
    const availabilityColor = item.availability ? 'text-green-300' : 'text-red-300';
    const availabilityBg = item.availability ? 'bg-green-500/15' : 'bg-red-500/15';
    
    // Cuisine flag mapping
    const cuisineFlags = {
        'Indian': '🇮🇳',
        'Italian': '🇮🇹',
        'Chinese': '🇨🇳',
        'Continental': '🌍'
    };
    
    const cuisineFlag = cuisineFlags[item.cuisine] || '🍽️';
    
    modalBackdrop.innerHTML = `
        <div class="glass-effect rounded-2xl p-6 max-w-md w-full mx-4 transform transition-all duration-200" style="animation: slideUp 0.3s ease-out;">
            <div class="text-center mb-5">
                <div class="bg-gradient-to-r from-orange-500 to-orange-600 p-3 rounded-full inline-block mb-3">
                    <i class="${categoryIcon} text-xl text-white"></i>
                </div>
                <h2 class="text-xl font-semibold text-white mb-2">${escapeHtml(item.name)}</h2>
                <p class="text-gray-300 flex items-center justify-center">
                    <span class="mr-2">${cuisineFlag}</span>${escapeHtml(item.cuisine)} Cuisine
                </p>
            </div>
            
            <div class="space-y-3 mb-5">
                <div class="flex justify-between items-center p-3 bg-white/8 rounded-lg">
                    <span class="text-gray-300"><i class="fas fa-list mr-2 text-blue-400"></i>Category</span>
                    <span class="text-white font-medium">${escapeHtml(item.category)}</span>
                </div>
                
                <div class="flex justify-between items-center p-3 bg-white/8 rounded-lg">
                    <span class="text-gray-300"><i class="fas fa-dollar-sign mr-2 text-green-400"></i>Price</span>
                    <span class="text-xl font-semibold bg-gradient-to-r from-green-400 to-emerald-400 bg-clip-text text-transparent">$${item.price}</span>
                </div>
                
                <div class="flex justify-between items-center p-3 bg-white/8 rounded-lg">
                    <span class="text-gray-300"><i class="fas fa-users mr-2 text-purple-400"></i>Servings</span>
                    <span class="text-white font-medium">${item.servings} serving${item.servings !== 1 ? 's' : ''}</span>
                </div>
                
                <div class="flex justify-between items-center p-3 bg-white/8 rounded-lg">
                    <span class="text-gray-300"><i class="fas fa-check-circle mr-2 text-yellow-400"></i>Availability</span>
                    <span class="inline-flex items-center px-2 py-1 rounded-full ${availabilityBg} ${availabilityColor} font-medium">
                        <i class="${availabilityIcon} mr-1"></i>${item.availability ? 'Available' : 'Unavailable'}
                    </span>
                </div>
                
                <div class="flex justify-between items-center p-3 bg-white/8 rounded-lg">
                    <span class="text-gray-300"><i class="fas fa-hashtag mr-2 text-pink-400"></i>Item ID</span>
                    <span class="text-white font-mono">${item.id}</span>
                </div>
            </div>
            
            <div class="flex gap-3">
                <button 
                    onclick="this.closest('.fixed').remove()"
                    class="flex-1 bg-gradient-to-r from-gray-500 to-gray-600 text-white px-4 py-2 rounded-lg hover:from-gray-600 hover:to-gray-700 transition-all duration-200 font-medium"
                >
                    <i class="fas fa-times mr-2"></i>Close
                </button>
                <button 
                    onclick="addToOrder(${item.id})"
                    class="flex-1 bg-gradient-to-r from-orange-500 to-orange-600 text-white px-4 py-2 rounded-lg hover:from-orange-600 hover:to-orange-700 transition-all duration-200 font-medium"
                >
                    <i class="fas fa-plus mr-2"></i>Add to Order
                </button>
            </div>
        </div>
    `;
    
    // Close modal when clicking backdrop
    modalBackdrop.addEventListener('click', (e) => {
        if (e.target === modalBackdrop) {
            modalBackdrop.remove();
        }
    });
    
    // Close modal with Escape key
    const handleEscape = (e) => {
        if (e.key === 'Escape') {
            modalBackdrop.remove();
            document.removeEventListener('keydown', handleEscape);
        }
    };
    document.addEventListener('keydown', handleEscape);
    
    document.body.appendChild(modalBackdrop);
}

// Add to order functionality
function addToOrder(itemId) {
    showApiStatus('success', `Menu item ${itemId} added to order! 🍽️`);
    // You can implement actual order management here
}

// Clear all filters
function clearFilters() {
    searchNameInput.value = '';
    categoryFilter.value = '';
    cuisineFilter.value = '';
    availabilityFilter.value = '';
    minPriceInput.value = '';
    maxPriceInput.value = '';
    minServingsInput.value = '';
    maxServingsInput.value = '';
    
    loadAllMenuItems();
}

// Update result count
function updateResultCount(count) {
    resultCount.textContent = `${count} menu item${count !== 1 ? 's' : ''} found`;
}

// Show/hide loading spinner
function showLoading(show) {
    if (show) {
        loadingSpinner.classList.remove('hidden');
    } else {
        loadingSpinner.classList.add('hidden');
    }
}

// Show API status messages
function showApiStatus(type, message) {
    const statusElement = apiStatus;
    const isSuccess = type === 'success';
    
    statusElement.className = `p-4 rounded-lg glass-effect border-l-3 ${
        isSuccess 
            ? 'border-green-400 bg-green-500/15 text-green-300' 
            : 'border-red-400 bg-red-500/15 text-red-300'
    }`;
    
    const icon = isSuccess ? 'fas fa-check-circle' : 'fas fa-exclamation-triangle';
    statusElement.innerHTML = `
        <div class="flex items-center">
            <i class="${icon} mr-3"></i>
            <span class="font-medium">${message}</span>
        </div>
    `;
    
    statusElement.classList.remove('hidden');
    statusElement.style.animation = 'slideUp 0.3s ease-out';
    
    // Auto-hide after 4 seconds
    setTimeout(() => {
        statusElement.style.animation = 'fadeIn 0.3s ease-out reverse';
        setTimeout(() => {
            statusElement.classList.add('hidden');
        }, 300);
    }, 4000);
}

// Utility function to escape HTML
function escapeHtml(text) {
    const div = document.createElement('div');
    div.textContent = text;
    return div.innerHTML;
}

// Export for global access
window.viewMenuItemDetails = viewMenuItemDetails;
window.addToOrder = addToOrder;

// Add some enhanced interactions
document.addEventListener('DOMContentLoaded', () => {
    // Add keyboard shortcuts
    document.addEventListener('keydown', (e) => {
        if (e.ctrlKey || e.metaKey) {
            switch(e.key) {
                case 'k':
                    e.preventDefault();
                    searchNameInput.focus();
                    break;
                case 'Enter':
                    e.preventDefault();
                    handleSearch();
                    break;
                case 'r':
                    e.preventDefault();
                    clearFilters();
                    break;
            }
        }
    });
    
    // Add search hints for catering
    const searchHints = [
        "Try 'biryani'...",
        "Search 'pasta'...",
        "Type 'cake'...",
        "Find 'chicken'...",
        "Look for 'pizza'..."
    ];
    
    let hintIndex = 0;
    setInterval(() => {
        if (!searchNameInput.value && document.activeElement !== searchNameInput) {
            searchNameInput.placeholder = searchHints[hintIndex];
            hintIndex = (hintIndex + 1) % searchHints.length;
        }
    }, 3000);
    
    // Add some subtle sparkle effects to buttons
    const buttons = document.querySelectorAll('button[class*="gradient"]');
    buttons.forEach(button => {
        button.addEventListener('mouseenter', (e) => {
            // Reduced sparkle frequency and made them smaller
            if (Math.random() > 0.7) { // Only 30% chance of sparkle
                const rect = e.target.getBoundingClientRect();
                const sparkle = document.createElement('div');
                sparkle.style.cssText = `
                    position: absolute;
                    top: ${rect.top + Math.random() * rect.height}px;
                    left: ${rect.left + Math.random() * rect.width}px;
                    width: 3px;
                    height: 3px;
                    background: white;
                    border-radius: 50%;
                    pointer-events: none;
                    z-index: 1000;
                    animation: sparkle 0.8s ease-out forwards;
                `;
                document.body.appendChild(sparkle);
                setTimeout(() => sparkle.remove(), 800);
            }
        });
    });
});
