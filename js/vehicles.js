/**
 * Vehicle Display Functions
 * Handles loading and displaying vehicles from API
 */

/**
 * Format price with currency
 */
function formatPrice(price) {
    return new Intl.NumberFormat('en-LK', {
        style: 'currency',
        currency: 'LKR',
        minimumFractionDigits: 0,
        maximumFractionDigits: 0
    }).format(price);
}

/**
 * Get vehicle image - returns first image or placeholder
 */
function getVehicleImage(vehicle) {
    if (vehicle.images && vehicle.images.length > 0) {
        return vehicle.images[0];
    }
    return 'img/service-1.jpg'; // Fallback to existing service image
}

/**
 * Format vehicle category name
 */
function formatCategory(category) {
    const categories = {
        'preOrder': 'Pre-Order',
        'preOwn': 'Pre-Owned',
        'unregistered': 'Unregistered'
    };
    return categories[category] || category;
}

/**
 * Format fuel type
 */
function formatFuelType(fuelType) {
    const types = {
        'petrol': 'Petrol',
        'diesel': 'Diesel',
        'hybrid': 'Hybrid',
        'ev': 'Electric',
        'plugInHybrid': 'Plug-in Hybrid'
    };
    return types[fuelType] || fuelType;
}

// Store vehicles globally for modal access
window.vehicleDataStore = window.vehicleDataStore || {};

/**
 * Create vehicle card HTML
 */
function createVehicleCard(vehicle) {
    const image = getVehicleImage(vehicle);
    const price = formatPrice(vehicle.currentPrice);
    const category = formatCategory(vehicle.category);
    const fuelType = formatFuelType(vehicle.fuel_type);
    
    // Store vehicle data globally using ID or generate unique ID
    const vehicleId = vehicle.id || vehicle._id || `vehicle_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
    window.vehicleDataStore[vehicleId] = vehicle;
    
    return `
        <div class="col-lg-3 col-md-6 wow fadeInUp" data-wow-delay="0.1s">
            <div class="team-item vehicle-card" style="cursor: pointer;" data-vehicle-id="${vehicleId}">
                <div class="team-body">
                    <div class="team-before">
                        <span>Brand</span>
                        <span>Model</span>
                        <span>Year</span>
                        <span>Price</span>
                    </div>
                    <img class="img-fluid" src="${image}" alt="${vehicle.brand} ${vehicle.model}" onerror="this.src='img/service-1.jpg'">
                    <div class="team-after">
                        <span>${vehicle.brand}</span>
                        <span>${vehicle.model}</span>
                        <span>${vehicle.year}</span>
                        <span>${price}</span>
                    </div>
                </div>
                <div class="team-name">
                    <h5 class="text-uppercase mb-2">${vehicle.brand} ${vehicle.model}</h5>
                    <button class="btn btn-primary btn-sm w-100 vehicle-details-btn" data-vehicle-id="${vehicleId}">View Details</button>
                </div>
            </div>
        </div>
    `;
}

/**
 * Show vehicle details in modal popup
 */
function showVehicleDetails(vehicleId) {
    // Get vehicle from store
    const vehicle = window.vehicleDataStore[vehicleId];
    if (!vehicle) {
        console.error('Vehicle not found:', vehicleId);
        return;
    }
    
    const modal = document.getElementById('vehicleDetailsModal');
    if (!modal) {
        console.error('Vehicle details modal not found');
        return;
    }
    
    // Get modal elements
    const modalTitle = document.getElementById('vehicleModalTitle');
    const modalCarousel = document.getElementById('vehicleModalCarousel');
    const modalCarouselIndicators = document.getElementById('vehicleModalCarouselIndicators');
    const modalCarouselInner = modalCarousel ? modalCarousel.querySelector('.carousel-inner') : null;
    const modalDetails = document.getElementById('vehicleModalDetails');
    const modalActionButton = document.getElementById('vehicleModalActionButton');
    
    // Set title
    if (modalTitle) {
        modalTitle.textContent = `${vehicle.brand} ${vehicle.model} ${vehicle.year}`;
    }
    
    // Set up image carousel
    const images = vehicle.images && vehicle.images.length > 0 ? vehicle.images : ['img/service-1.jpg'];
    let carouselIndicatorsHtml = '';
    let carouselItemsHtml = '';
    
    images.forEach((img, index) => {
        const isActive = index === 0 ? 'active' : '';
        carouselIndicatorsHtml += `<button type="button" data-bs-target="#vehicleModalCarousel" data-bs-slide-to="${index}" class="${isActive}" aria-label="Slide ${index + 1}"></button>`;
        carouselItemsHtml += `
            <div class="carousel-item ${isActive}">
                <img src="${img}" class="d-block w-100" alt="${vehicle.brand} ${vehicle.model}" onerror="this.src='img/service-1.jpg'" style="max-height: 300px; object-fit: contain; background: #f8f9fa; border-radius: 8px;">
            </div>
        `;
    });
    
    if (modalCarouselIndicators) {
        modalCarouselIndicators.innerHTML = carouselIndicatorsHtml;
    }
    
    if (modalCarouselInner) {
        modalCarouselInner.innerHTML = carouselItemsHtml;
    }
    
    // Set vehicle details
    const price = formatPrice(vehicle.currentPrice);
    const category = formatCategory(vehicle.category);
    const fuelType = formatFuelType(vehicle.fuel_type);
    
    // Build details HTML
    let detailsHtml = `
        <div class="row g-3">
            <div class="col-md-6">
                <h6 class="text-primary mb-2"><i class="fa fa-tag me-2"></i>Category</h6>
                <p class="mb-3">${category}</p>
            </div>
            <div class="col-md-6">
                <h6 class="text-primary mb-2"><i class="fa fa-dollar-sign me-2"></i>Price</h6>
                <p class="mb-3 fs-5 fw-bold">${price}</p>
            </div>
            <div class="col-md-6">
                <h6 class="text-primary mb-2"><i class="fa fa-car me-2"></i>Brand</h6>
                <p class="mb-3">${vehicle.brand || 'N/A'}</p>
            </div>
            <div class="col-md-6">
                <h6 class="text-primary mb-2"><i class="fa fa-cog me-2"></i>Model</h6>
                <p class="mb-3">${vehicle.model || 'N/A'}</p>
            </div>
            <div class="col-md-6">
                <h6 class="text-primary mb-2"><i class="fa fa-calendar me-2"></i>Year</h6>
                <p class="mb-3">${vehicle.year || 'N/A'}</p>
            </div>
            <div class="col-md-6">
                <h6 class="text-primary mb-2"><i class="fa fa-gas-pump me-2"></i>Fuel Type</h6>
                <p class="mb-3">${fuelType}</p>
            </div>
    `;
    
    // Add additional details if available
    if (vehicle.mileage) {
        detailsHtml += `
            <div class="col-md-6">
                <h6 class="text-primary mb-2"><i class="fa fa-tachometer-alt me-2"></i>Mileage</h6>
                <p class="mb-3">${vehicle.mileage.toLocaleString()} km</p>
            </div>
        `;
    }
    
    if (vehicle.transmission) {
        detailsHtml += `
            <div class="col-md-6">
                <h6 class="text-primary mb-2"><i class="fa fa-cogs me-2"></i>Transmission</h6>
                <p class="mb-3">${vehicle.transmission}</p>
            </div>
        `;
    }
    
    if (vehicle.color) {
        detailsHtml += `
            <div class="col-md-6">
                <h6 class="text-primary mb-2"><i class="fa fa-palette me-2"></i>Color</h6>
                <p class="mb-3">${vehicle.color}</p>
            </div>
        `;
    }
    
    if (vehicle.engine_capacity) {
        detailsHtml += `
            <div class="col-md-6">
                <h6 class="text-primary mb-2"><i class="fa fa-tools me-2"></i>Engine Capacity</h6>
                <p class="mb-3">${vehicle.engine_capacity}</p>
            </div>
        `;
    }
    
    if (vehicle.description) {
        detailsHtml += `
            <div class="col-12">
                <h6 class="text-primary mb-2"><i class="fa fa-info-circle me-2"></i>Description</h6>
                <p class="mb-3">${vehicle.description}</p>
            </div>
        `;
    }
    
    detailsHtml += `</div>`;
    
    if (modalDetails) {
        modalDetails.innerHTML = detailsHtml;
        // Make sure details are visible
        modalDetails.style.display = 'block';
    } else {
        console.error('Modal details container not found');
    }
    
    // Set up action button
    const isPreOrder = vehicle.category === 'preOrder';
    const buttonText = isPreOrder ? 'Order' : 'Contact';
    
    const subject = isPreOrder 
        ? `Pre-Order Request for ${vehicle.brand} ${vehicle.model} ${vehicle.year}`
        : `Inquiry about ${vehicle.brand} ${vehicle.model} ${vehicle.year}`;
    
    const message = isPreOrder
        ? `I would like to place a pre-order for the ${vehicle.brand} ${vehicle.model} ${vehicle.year}.\nPlease share the availability, expected delivery timeline, and next steps.`
        : `I would like to get more details about the ${vehicle.brand} ${vehicle.model} ${vehicle.year}.\nPlease contact me with additional information, pricing, and availability.`;
    
    const contactUrl = `contact.html?subject=${encodeURIComponent(subject)}&message=${encodeURIComponent(message)}#contact-section`;
    
    if (modalActionButton) {
        modalActionButton.textContent = buttonText;
        modalActionButton.href = contactUrl;
        modalActionButton.className = `btn btn-primary btn-lg w-100 ${isPreOrder ? '' : ''}`;
    }
    
    // Show modal using Bootstrap
    const bsModal = new bootstrap.Modal(modal);
    
    // Initialize carousel after modal is shown
    modal.addEventListener('shown.bs.modal', function() {
        if (modalCarousel) {
            // Dispose existing carousel instance if any
            const existingCarousel = bootstrap.Carousel.getInstance(modalCarousel);
            if (existingCarousel) {
                existingCarousel.dispose();
            }
            // Initialize new carousel
            const carouselInstance = new bootstrap.Carousel(modalCarousel, {
                interval: false, // Disable auto-slide
                wrap: true
            });
            
            // Reset to first slide
            carouselInstance.to(0);
        }
    }, { once: true });
    
    bsModal.show();
}

/**
 * Attach click handlers to vehicle cards
 */
function attachVehicleCardHandlers(container) {
    // Handle card click
    container.querySelectorAll('.vehicle-card').forEach(card => {
        card.addEventListener('click', function(e) {
            // Don't trigger if clicking on the button
            if (e.target.closest('.vehicle-details-btn')) {
                return;
            }
            const vehicleId = this.getAttribute('data-vehicle-id');
            if (vehicleId) {
                showVehicleDetails(vehicleId);
            }
        });
    });
    
    // Handle button click
    container.querySelectorAll('.vehicle-details-btn').forEach(btn => {
        btn.addEventListener('click', function(e) {
            e.stopPropagation();
            const vehicleId = this.getAttribute('data-vehicle-id');
            if (vehicleId) {
                showVehicleDetails(vehicleId);
            }
        });
    });
}

/**
 * Load and display vehicles in a container
 */
async function loadVehicles(containerId, category = null) {
    const container = document.getElementById(containerId);
    if (!container) {
        console.error(`Container ${containerId} not found`);
        return;
    }

    try {
        let vehicles = [];
        if (category) {
            // Map category names to API format
            const categoryMap = {
                'preOrder': 'preOrder',
                'preOwn': 'preOwn',
                'pre-owned': 'preOwn',
                'unregistered': 'unregistered'
            };
            const apiCategory = categoryMap[category] || category;
            vehicles = await apiService.getVehiclesByCategory(apiCategory);
        } else {
            vehicles = await apiService.getAllVehicles();
        }

        if (vehicles.length === 0) {
            container.innerHTML = '<div class="col-12 text-center"><p>No vehicles available at the moment.</p></div>';
            return;
        }

        // Limit to 8 vehicles for display
        const displayVehicles = vehicles.slice(0, 8);
        container.innerHTML = displayVehicles.map(createVehicleCard).join('');
        
        // Attach click handlers to vehicle cards
        attachVehicleCardHandlers(container);
        
        // Reinitialize WOW.js for new elements
        if (typeof WOW !== 'undefined') {
            new WOW().init();
        }
    } catch (error) {
        console.error('Error loading vehicles:', error);
        container.innerHTML = '<div class="col-12 text-center"><p>Error loading vehicles. Please try again later.</p></div>';
    }
}

