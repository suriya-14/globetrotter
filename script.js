// Mock Data
const mockUsers = [
    { id: 1, email: 'demo@globetrotter.com', password: 'demo123', name: 'Alex Traveler', photo: null }
];

const mockCities = [
    {
        id: 1,
        name: 'Tokyo',
        country: 'Japan',
        costIndex: 85,
        popularity: 95,
        description: 'Modern metropolis with ancient traditions',
        image: 'https://images.unsplash.com/photo-1549692520-acc6669e2f0c'
    },
    {
        id: 2,
        name: 'Paris',
        country: 'France',
        costIndex: 90,
        popularity: 98,
        description: 'The city of lights and love',
        image: 'https://images.unsplash.com/photo-1502602898657-3e91760cbb34'
    },
    {
        id: 3,
        name: 'New York',
        country: 'USA',
        costIndex: 95,
        popularity: 92,
        description: 'The city that never sleeps',
        image: 'https://images.unsplash.com/photo-1549924231-f129b911e442'
    },
    {
        id: 4,
        name: 'Barcelona',
        country: 'Spain',
        costIndex: 75,
        popularity: 88,
        description: 'Vibrant culture and stunning architecture',
        image: 'https://images.unsplash.com/photo-1505739778531-3cdd8e6a9a6f'
    },
    {
        id: 5,
        name: 'Bangkok',
        country: 'Thailand',
        costIndex: 50,
        popularity: 85,
        description: 'Exotic temples and street food paradise',
        image: 'https://images.unsplash.com/photo-1508009603885-50cf7c579365'
    },
    {
        id: 6,
        name: 'Dubai',
        country: 'UAE',
        costIndex: 88,
        popularity: 82,
        description: 'Luxury and innovation in the desert',
        image: 'https://images.unsplash.com/photo-1498496294664-d9372eb521f3'
    },
    {
        id: 7,
        name: 'Rome',
        country: 'Italy',
        costIndex: 80,
        popularity: 94,
        description: 'Ancient history meets modern charm',
        image: 'https://images.unsplash.com/photo-1526481280691-90652b9a0f3b'
    },
    {
        id: 8,
        name: 'London',
        country: 'UK',
        costIndex: 92,
        popularity: 90,
        description: 'Royal heritage and cosmopolitan culture',
        image: 'https://images.unsplash.com/photo-1469474968028-56623f02e42e'
    }
];


const mockActivities = [
    { id: 1, name: 'Eiffel Tower Visit', cityId: 2, type: 'Sightseeing', cost: 30, duration: 3, description: 'Iconic landmark with breathtaking views' },
    { id: 2, name: 'Sushi Making Class', cityId: 1, type: 'Food', cost: 75, duration: 2, description: 'Learn authentic sushi techniques' },
    { id: 3, name: 'Broadway Show', cityId: 3, type: 'Entertainment', cost: 120, duration: 3, description: 'World-class theatrical performance' },
    { id: 4, name: 'Sagrada Familia Tour', cityId: 4, type: 'Sightseeing', cost: 40, duration: 2, description: 'Gaudi\'s masterpiece basilica' },
    { id: 5, name: 'Floating Market Tour', cityId: 5, type: 'Culture', cost: 25, duration: 4, description: 'Traditional Thai market experience' },
    { id: 6, name: 'Desert Safari', cityId: 6, type: 'Adventure', cost: 85, duration: 5, description: 'Dune bashing and desert camp' },
    { id: 7, name: 'Colosseum Tour', cityId: 7, type: 'Sightseeing', cost: 35, duration: 2, description: 'Ancient Roman amphitheater' },
    { id: 8, name: 'Thames River Cruise', cityId: 8, type: 'Leisure', cost: 45, duration: 2, description: 'Scenic river tour with landmarks' },
    { id: 9, name: 'Louvre Museum', cityId: 2, type: 'Culture', cost: 20, duration: 4, description: 'World\'s largest art museum' },
    { id: 10, name: 'Tokyo Food Tour', cityId: 1, type: 'Food', cost: 90, duration: 4, description: 'Explore authentic Japanese cuisine' },
];

// State
let currentUser = null;
let trips = [];
let currentTrip = null;
let selectedStop = null;

// Utility Functions
function showScreen(screenId) {
    document.querySelectorAll('.screen').forEach(screen => {
        screen.classList.remove('active');
    });
    document.getElementById(`${screenId}-screen`).classList.add('active');
}

function openModal(modalId) {
    document.getElementById(modalId).classList.add('active');
}

function closeModal(modalId) {
    document.getElementById(modalId).classList.remove('active');
}

function getCityById(id) {
    return mockCities.find(c => c.id === id);
}

function calculateTripCost(trip) {
    let total = 0;
    if (!trip.stops) return 0;
    
    trip.stops.forEach(stop => {
        // Activities cost
        if (stop.activities) {
            stop.activities.forEach(activity => {
                total += activity.cost || 0;
            });
        }
        
        // Accommodation estimate
        const days = Math.ceil((new Date(stop.endDate) - new Date(stop.startDate)) / (1000 * 60 * 60 * 24));
        const city = getCityById(stop.cityId);
        total += days * (city?.costIndex || 50);
    });
    
    // Transport estimate
    total += (trip.stops.length || 0) * 150;
    
    return Math.round(total);
}

function updateDashboardStats() {
    document.getElementById('stat-trips').textContent = trips.length;
    
    const countries = new Set();
    trips.forEach(trip => {
        if (trip.stops) {
            trip.stops.forEach(stop => {
                const city = getCityById(stop.cityId);
                if (city) countries.add(city.country);
            });
        }
    });
    document.getElementById('stat-countries').textContent = countries.size;
    
    const totalBudget = trips.reduce((sum, trip) => sum + calculateTripCost(trip), 0);
    document.getElementById('stat-budget').textContent = `$${totalBudget}`;
}

function renderPopularCities() {
    const container = document.getElementById('popular-cities');
    container.innerHTML = mockCities.slice(0, 4).map(city => `
        <div class="city-card">
            <div class="city-image"></div>
            <h4>${city.name}</h4>
            <p>${city.country}</p>
        </div>
    `).join('');
}

function renderTrips() {
    if (trips.length === 0) {
        document.getElementById('trips-section').style.display = 'none';
        return;
    }
    
    document.getElementById('trips-section').style.display = 'block';
    const container = document.getElementById('trips-list');
    container.innerHTML = trips.map(trip => `
        <div class="trip-card">
            <div class="trip-image"></div>
            <div class="trip-content">
                <h4>${trip.name}</h4>
                <div class="trip-meta">
                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                        <rect x="3" y="4" width="18" height="18" rx="2" ry="2"></rect>
                        <line x1="16" y1="2" x2="16" y2="6"></line>
                        <line x1="8" y1="2" x2="8" y2="6"></line>
                        <line x1="3" y1="10" x2="21" y2="10"></line>
                    </svg>
                    <span>${trip.startDate} - ${trip.endDate}</span>
                </div>
                <div class="trip-meta">
                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                        <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"></path>
                        <circle cx="12" cy="10" r="3"></circle>
                    </svg>
                    <span>${trip.stops?.length || 0} stops</span>
                </div>
                <div class="trip-actions">
                    <button class="btn btn-primary" onclick="viewTripDetails(${trip.id})">View</button>
                    <button class="btn btn-secondary" onclick="editTrip(${trip.id})">Edit</button>
                </div>
            </div>
        </div>
    `).join('');
}

function renderMyTrips() {
    const container = document.getElementById('my-trips-list');
    
    if (trips.length === 0) {
        container.innerHTML = `
            <div style="text-align: center; padding: 5rem 1rem;">
                <div style="width: 96px; height: 96px; background: #fff7ed; border-radius: 50%; display: flex; align-items: center; justify-content: center; margin: 0 auto 1.5rem;">
                    <svg viewBox="0 0 24 24" fill="none" stroke="#f97316" stroke-width="2" style="width: 48px; height: 48px;">
                        <path d="M17.8 19.2L16 11l3.5-3.5C21 6 21.5 4 21 3c-1-.5-3 0-4.5 1.5L13 8 4.8 6.2c-.5-.1-.9.1-1.1.5l-.3.5c-.2.5-.1 1 .3 1.3L9 12l-2 3H4l-1 1 3 2 2 3 1-1v-3l3-2 3.5 5.3c.3.4.8.5 1.3.3l.5-.2c.4-.3.6-.7.5-1.2z"></path>
                    </svg>
                </div>
                <h3 style="font-size: 1.5rem; margin-bottom: 0.5rem; color: #1f2937;">No trips yet</h3>
                <p style="color: #6b7280; margin-bottom: 1.5rem;">Start planning your first adventure!</p>
                <button onclick="showScreen('create-trip')" class="btn btn-primary">Plan New Trip</button>
            </div>
        `;
        return;
    }
    
    container.innerHTML = trips.map(trip => `
        <div class="trip-list-item">
            <div class="trip-list-image"></div>
            <div class="trip-list-content">
                <div class="trip-list-header">
                    <div>
                        <h3>${trip.name}</h3>
                        <p>${trip.description || ''}</p>
                    </div>
                    <div class="trip-list-actions">
                        <button class="icon-button" onclick="deleteTrip(${trip.id})">
                            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                                <polyline points="3 6 5 6 21 6"></polyline>
                                <path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"></path>
                            </svg>
                        </button>
                    </div>
                </div>
                
                <div class="trip-list-meta">
                    <div class="meta-item">
                        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                            <rect x="3" y="4" width="18" height="18" rx="2" ry="2"></rect>
                            <line x1="16" y1="2" x2="16" y2="6"></line>
                            <line x1="8" y1="2" x2="8" y2="6"></line>
                            <line x1="3" y1="10" x2="21" y2="10"></line>
                        </svg>
                        <div>
                            <div>Duration</div>
                            <div>${trip.startDate} to ${trip.endDate}</div>
                        </div>
                    </div>
                    <div class="meta-item">
                        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                            <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"></path>
                            <circle cx="12" cy="10" r="3"></circle>
                        </svg>
                        <div>
                            <div>Stops</div>
                            <div>${trip.stops?.length || 0} cities</div>
                        </div>
                    </div>
                    <div class="meta-item">
                        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                            <line x1="12" y1="1" x2="12" y2="23"></line>
                            <path d="M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6"></path>
                        </svg>
                        <div>
                            <div>Estimated Cost</div>
                            <div class="text-primary">$${calculateTripCost(trip)}</div>
                        </div>
                    </div>
                </div>
                
                <div class="trip-actions">
                    <button class="btn btn-primary btn-flex" onclick="viewTripDetails(${trip.id})">View Itinerary</button>
                    <button class="btn btn-secondary btn-flex" onclick="editTrip(${trip.id})">Edit Trip</button>
                    <button class="btn btn-secondary" onclick="shareTrip(${trip.id})">
                        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                            <circle cx="18" cy="5" r="3"></circle>
                            <circle cx="6" cy="12" r="3"></circle>
                            <circle cx="18" cy="19" r="3"></circle>
                            <line x1="8.59" y1="13.51" x2="15.42" y2="17.49"></line>
                            <line x1="15.41" y1="6.51" x2="8.59" y2="10.49"></line>
                        </svg>
                    </button>
                </div>
            </div>
        </div>
    `).join('');
}

function renderItineraryBuilder() {
    if (!currentTrip) return;
    
    document.getElementById('builder-trip-name').textContent = currentTrip.name;
    document.getElementById('builder-trip-description').textContent = currentTrip.description || '';
    
    const stopsContainer = document.getElementById('stops-list');
    if (!currentTrip.stops || currentTrip.stops.length === 0) {
        stopsContainer.innerHTML = '';
    } else {
        stopsContainer.innerHTML = currentTrip.stops.map((stop, index) => {
            const city = getCityById(stop.cityId);
            return `
                <div class="stop-card">
                    <div class="stop-header">
                        <div class="stop-number">${index + 1}</div>
                        <div class="stop-info">
                            <h3>${city?.name || 'Unknown City'}</h3>
                            <p>${city?.country || ''}</p>
                        </div>
                        <div class="stop-date">${stop.startDate} - ${stop.endDate}</div>
                    </div>
                    
                    ${stop.activities && stop.activities.length > 0 ? `
                        <div class="activities-list">
                            ${stop.activities.map(activity => `
                                <div class="activity-item">
                                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                                        <circle cx="12" cy="12" r="10"></circle>
                                        <polyline points="12 6 12 12 16 14"></polyline>
                                    </svg>
                                    <div class="activity-info">
                                        <div class="activity-name">${activity.name}</div>
                                        <div class="activity-time">${activity.day} at ${activity.time}</div>
                                    </div>
                                    <div class="activity-cost">$${activity.cost}</div>
                                </div>
                            `).join('')}
                        </div>
                    ` : ''}
                    
                    <button class="add-activity-btn" onclick="openActivitySearch(${stop.id})">
                        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                            <line x1="12" y1="5" x2="12" y2="19"></line>
                            <line x1="5" y1="12" x2="19" y2="12"></line>
                        </svg>
                        <span>Add Activity</span>
                    </button>
                </div>
            `;
        }).join('');
    }
    
    updateBuilderSummary();
}

function updateBuilderSummary() {
    if (!currentTrip) return;
    
    const totalStops = currentTrip.stops?.length || 0;
    const totalActivities = currentTrip.stops?.reduce((sum, stop) => sum + (stop.activities?.length || 0), 0) || 0;
    const totalCost = calculateTripCost(currentTrip);
    
    document.getElementById('summary-stops').textContent = totalStops;
    document.getElementById('summary-activities').textContent = totalActivities;
    document.getElementById('summary-cost').textContent = `$${totalCost}`;
}

function renderItineraryView() {
    if (!currentTrip) return;
    
    document.getElementById('view-trip-name').textContent = currentTrip.name;
    document.getElementById('view-trip-description').textContent = currentTrip.description || '';
    document.getElementById('view-trip-dates').textContent = `${currentTrip.startDate} to ${currentTrip.endDate}`;
    document.getElementById('view-trip-stops').textContent = `${currentTrip.stops?.length || 0} stops`;
    document.getElementById('view-trip-cost').textContent = `$${calculateTripCost(currentTrip)}`;
    
    const stopsContainer = document.getElementById('itinerary-stops');
    if (!currentTrip.stops || currentTrip.stops.length === 0) {
        stopsContainer.innerHTML = '<p class="no-activities">No stops planned yet</p>';
    } else {
        stopsContainer.innerHTML = currentTrip.stops.map((stop, index) => {
            const city = getCityById(stop.cityId);
            return `
                <div class="itinerary-stop">
                    <div class="stop-banner">
                        <div class="stop-banner-number">${index + 1}</div>
                        <div class="stop-banner-info">
                            <h2>${city?.name || 'Unknown City'}</h2>
                            <p>${city?.country || ''}</p>
                            <p class="stop-dates">${stop.startDate} - ${stop.endDate}</p>
                        </div>
                    </div>
                    
                    <div class="stop-activities">
                        ${stop.activities && stop.activities.length > 0 ? `
                            ${stop.activities.map(activity => `
                                <div class="activity-detail">
                                    <div class="activity-icon">
                                        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                                            <circle cx="12" cy="12" r="10"></circle>
                                            <polyline points="12 6 12 12 16 14"></polyline>
                                        </svg>
                                    </div>
                                    <div class="activity-content">
                                        <h3>${activity.name}</h3>
                                        <p class="activity-description">${activity.description || ''}</p>
                                        <div class="activity-details">
                                            <span>${activity.day} at ${activity.time}</span>
                                            <span>${activity.duration}h</span>
                                            <span class="activity-cost">$${activity.cost}</span>
                                        </div>
                                    </div>
                                </div>
                            `).join('')}
                        ` : '<p class="no-activities">No activities planned yet</p>'}
                    </div>
                </div>
            `;
        }).join('');
    }
}

function renderBudget() {
    if (!currentTrip) return;
    
    const transportCost = (currentTrip.stops?.length || 0) * 150;
    const accommodationCost = currentTrip.stops?.reduce((sum, stop) => {
        const days = Math.ceil((new Date(stop.endDate) - new Date(stop.startDate)) / (1000 * 60 * 60 * 24));
        const city = getCityById(stop.cityId);
        return sum + (days * (city?.costIndex || 50));
    }, 0) || 0;
    const activitiesCost = currentTrip.stops?.reduce((sum, stop) => 
        sum + (stop.activities?.reduce((aSum, a) => aSum + (a.cost || 0), 0) || 0), 0) || 0;
    const totalCost = transportCost + accommodationCost + activitiesCost;
    
    document.getElementById('budget-total').textContent = `$${totalCost}`;
    document.getElementById('budget-destinations').textContent = `For ${currentTrip.stops?.length || 0} destinations`;
    
    document.getElementById('budget-breakdown').innerHTML = `
        <div class="breakdown-item">
            <div class="breakdown-label">
                <div class="breakdown-icon">
                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                        <path d="M17.8 19.2L16 11l3.5-3.5C21 6 21.5 4 21 3c-1-.5-3 0-4.5 1.5L13 8 4.8 6.2c-.5-.1-.9.1-1.1.5l-.3.5c-.2.5-.1 1 .3 1.3L9 12l-2 3H4l-1 1 3 2 2 3 1-1v-3l3-2 3.5 5.3c.3.4.8.5 1.3.3l.5-.2c.4-.3.6-.7.5-1.2z"></path>
                    </svg>
                </div>
                <span>Transport</span>
            </div>
            <span class="breakdown-amount">$${transportCost}</span>
        </div>
        <div class="breakdown-item">
            <div class="breakdown-label">
                <div class="breakdown-icon">
                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                        <path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"></path>
                        <polyline points="9 22 9 12 15 12 15 22"></polyline>
                    </svg>
                </div>
                <span>Accommodation</span>
            </div>
            <span class="breakdown-amount">$${accommodationCost}</span>
        </div>
        <div class="breakdown-item">
            <div class="breakdown-label">
                <div class="breakdown-icon">
                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                        <circle cx="12" cy="12" r="10"></circle>
                        <polygon points="16.24 7.76 14.12 14.12 7.76 16.24 9.88 9.88 16.24 7.76"></polygon>
                    </svg>
                </div>
                <span>Activities</span>
            </div>
            <span class="breakdown-amount">$${activitiesCost}</span>
        </div>
    `;
    
    document.getElementById('budget-by-destination').innerHTML = currentTrip.stops?.map(stop => {
        const city = getCityById(stop.cityId);
        const days = Math.ceil((new Date(stop.endDate) - new Date(stop.startDate)) / (1000 * 60 * 60 * 24));
        const stopAccommodation = days * (city?.costIndex || 50);
        const stopActivities = stop.activities?.reduce((sum, a) => sum + (a.cost || 0), 0) || 0;
        const stopTotal = stopAccommodation + stopActivities;
        
        return `
            <div class="destination-card">
                <div class="destination-header">
                    <div>
                        <h4>${city?.name || 'Unknown'}</h4>
                        <p>${stop.startDate} - ${stop.endDate} (${days} days)</p>
                    </div>
                    <span class="destination-cost">$${stopTotal}</span>
                </div>
                <div class="destination-breakdown">
                    <div>
                        <span>Accommodation: </span>
                        <strong>$${stopAccommodation}</strong>
                    </div>
                    <div>
                        <span>Activities: </span>
                        <strong>$${stopActivities}</strong>
                    </div>
                </div>
            </div>
        `;
    }).join('') || '<p>No destinations added yet</p>';
}

function renderCalendar() {
    if (!currentTrip) return;
    
    const startDate = new Date(currentTrip.startDate);
    const endDate = new Date(currentTrip.endDate);
    const days = [];
    
    for (let d = new Date(startDate); d <= endDate; d.setDate(d.getDate() + 1)) {
        days.push(new Date(d));
    }
    
    const calendarGrid = document.getElementById('calendar-grid');
    calendarGrid.innerHTML = days.map(day => {
        const dateStr = day.toISOString().split('T')[0];
        const dayActivities = currentTrip.stops?.flatMap(stop => 
            stop.activities?.filter(a => a.day === dateStr) || []
        ) || [];
        const currentStop = currentTrip.stops?.find(stop => 
            dateStr >= stop.startDate && dateStr <= stop.endDate
        );
        const city = getCityById(currentStop?.cityId);
        
        return `
            <div class="calendar-day">
                <div class="calendar-day-number">${day.getDate()}</div>
                ${city ? `<div class="calendar-city">${city.name}</div>` : ''}
                ${dayActivities.map(activity => `
                    <div class="calendar-activity">${activity.time} - ${activity.name}</div>
                `).join('')}
            </div>
        `;
    }).join('');
}

// Event Handlers
function handleLogin(e) {
    e.preventDefault();
    const email = document.getElementById('login-email').value;
    const password = document.getElementById('login-password').value;
    
    const user = mockUsers.find(u => u.email === email && u.password === password);
    if (user) {
        currentUser = user;
        document.getElementById('nav-username').textContent = user.name;
        document.getElementById('welcome-name').textContent = user.name.split(' ')[0];
        
        // Initialize with demo trip
        if (trips.length === 0) {
            trips = [{
                id: 1,
                name: 'European Adventure',
                startDate: '2024-06-15',
                endDate: '2024-06-25',
                description: 'Exploring the best of Europe',
                stops: [
                    {
                        id: 1,
                        cityId: 2,
                        startDate: '2024-06-15',
                        endDate: '2024-06-18',
                        activities: [
                            { ...mockActivities[0], day: '2024-06-15', time: '10:00' },
                            { ...mockActivities[8], day: '2024-06-16', time: '14:00' }
                        ]
                    },
                    {
                        id: 2,
                        cityId: 4,
                        startDate: '2024-06-19',
                        endDate: '2024-06-22',
                        activities: [
                            { ...mockActivities[3], day: '2024-06-19', time: '09:00' }
                        ]
                    }
                ]
            }];
        }
        
        updateDashboardStats();
        renderPopularCities();
        renderTrips();
        showScreen('dashboard');
    } else {
        alert('Invalid credentials. Try demo@globetrotter.com / demo123');
    }
}

function handleSignup(e) {
    e.preventDefault();
    const firstName = document.getElementById('signup-firstname').value;
    const lastName = document.getElementById('signup-lastname').value;
    const email = document.getElementById('signup-email').value;
    const password = document.getElementById('signup-password').value;
    
    const newUser = {
        id: mockUsers.length + 1,
        email,
        password,
        name: `${firstName} ${lastName}`,
        photo: null
    };
    
    mockUsers.push(newUser);
    currentUser = newUser;
    document.getElementById('nav-username').textContent = newUser.name;
    document.getElementById('welcome-name').textContent = firstName;
    
    updateDashboardStats();
    renderPopularCities();
    renderTrips();
    showScreen('dashboard');
}

function handleCreateTrip(e) {
    e.preventDefault();
    const name = document.getElementById('trip-name').value;
    const startDate = document.getElementById('trip-start-date').value;
    const endDate = document.getElementById('trip-end-date').value;
    const description = document.getElementById('trip-description').value;
    
    const newTrip = {
        id: trips.length + 1,
        name,
        startDate,
        endDate,
        description,
        stops: []
    };
    
    trips.push(newTrip);
    currentTrip = newTrip;
    
    document.getElementById('trip-name').value = '';
    document.getElementById('trip-start-date').value = '';
    document.getElementById('trip-end-date').value = '';
    document.getElementById('trip-description').value = '';
    
    renderItineraryBuilder();
    showScreen('itinerary-builder');
}

function viewTripDetails(tripId) {
    currentTrip = trips.find(t => t.id === tripId);
    if (currentTrip) {
        renderItineraryView();
        showScreen('itinerary-view');
    }
}

function editTrip(tripId) {
    currentTrip = trips.find(t => t.id === tripId);
    if (currentTrip) {
        renderItineraryBuilder();
        showScreen('itinerary-builder');
    }
}

function deleteTrip(tripId) {
    if (confirm('Are you sure you want to delete this trip?')) {
        trips = trips.filter(t => t.id !== tripId);
        updateDashboardStats();
        renderTrips();
        renderMyTrips();
    }
}

function shareTrip(tripId) {
    currentTrip = trips.find(t => t.id === tripId);
    if (currentTrip) {
        showScreen('share');
    }
}

function viewItinerary() {
    if (currentTrip) {
        renderItineraryView();
        showScreen('itinerary-view');
    }
}

function showBudget() {
    if (currentTrip) {
        renderBudget();
        showScreen('budget');
    }
}

function showCalendar() {
    if (currentTrip) {
        renderCalendar();
        showScreen('calendar');
    }
}

function showShare() {
    if (currentTrip) {
        document.getElementById('share-url').value = `https://globetrotter.com/trips/${currentTrip.id}`;
        showScreen('share');
    }
}

function copyShareLink() {
    const input = document.getElementById('share-url');
    input.select();
    document.execCommand('copy');
    alert('Link copied to clipboard!');
}

function logout() {
    currentUser = null;
    trips = [];
    currentTrip = null;
    showScreen('login');
}

// City Search
function openCitySearch() {
    renderCitySearch('');
    openModal('city-search-modal');
}

function renderCitySearch(query) {
    const results = document.getElementById('city-search-results');
    const filteredCities = mockCities.filter(city =>
        city.name.toLowerCase().includes(query.toLowerCase()) ||
        city.country.toLowerCase().includes(query.toLowerCase())
    );
    
    results.innerHTML = filteredCities.map(city => `
        <div class="search-result-item">
            <div class="search-result-info">
                <h4>${city.name}</h4>
                <p>${city.country}</p>
                <div class="search-result-meta">
                    <span>Cost Index: ${city.costIndex}</span>
                    <span>Popularity: ${city.popularity}%</span>
                </div>
            </div>
            <button class="btn btn-primary" onclick="addCityToTrip(${city.id})">Add</button>
        </div>
    `).join('');
}

function addCityToTrip(cityId) {
    const startDate = prompt('Enter start date (YYYY-MM-DD):');
    const endDate = prompt('Enter end date (YYYY-MM-DD):');
    
    if (startDate && endDate) {
        const newStop = {
            id: (currentTrip.stops?.length || 0) + 1,
            cityId,
            startDate,
            endDate,
            activities: []
        };
        
        if (!currentTrip.stops) {
            currentTrip.stops = [];
        }
        currentTrip.stops.push(newStop);
        
        // Update in trips array
        const tripIndex = trips.findIndex(t => t.id === currentTrip.id);
        if (tripIndex !== -1) {
            trips[tripIndex] = currentTrip;
        }
        
        renderItineraryBuilder();
        closeModal('city-search-modal');
        document.getElementById('city-search-input').value = '';
    }
}

// Activity Search
function openActivitySearch(stopId) {
    selectedStop = currentTrip.stops.find(s => s.id === stopId);
    if (selectedStop) {
        renderActivitySearch('');
        openModal('activity-search-modal');
    }
}

function renderActivitySearch(query) {
    if (!selectedStop) return;
    
    const results = document.getElementById('activity-search-results');
    const filteredActivities = mockActivities.filter(activity =>
        activity.cityId === selectedStop.cityId &&
        (activity.name.toLowerCase().includes(query.toLowerCase()) ||
         activity.type.toLowerCase().includes(query.toLowerCase()))
    );
    
    results.innerHTML = filteredActivities.map(activity => `
        <div class="search-result-item">
            <div class="search-result-info">
                <h4>${activity.name}</h4>
                <p>${activity.description}</p>
                <div class="search-result-meta">
                    <span class="text-primary">$${activity.cost}</span>
                    <span>${activity.duration}h</span>
                    <span>${activity.type}</span>
                </div>
            </div>
            <button class="btn btn-primary" onclick="addActivityToStop(${activity.id})">Add</button>
        </div>
    `).join('');
}

function addActivityToStop(activityId) {
    const activity = mockActivities.find(a => a.id === activityId);
    if (!activity) return;
    
    const day = prompt('Enter date (YYYY-MM-DD):');
    const time = prompt('Enter time (HH:MM):');
    
    if (day && time) {
        if (!selectedStop.activities) {
            selectedStop.activities = [];
        }
        selectedStop.activities.push({
            ...activity,
            day,
            time
        });
        
        // Update in trips array
        const tripIndex = trips.findIndex(t => t.id === currentTrip.id);
        if (tripIndex !== -1) {
            const stopIndex = trips[tripIndex].stops.findIndex(s => s.id === selectedStop.id);
            if (stopIndex !== -1) {
                trips[tripIndex].stops[stopIndex] = selectedStop;
                currentTrip = trips[tripIndex];
            }
        }
        
        renderItineraryBuilder();
        closeModal('activity-search-modal');
        document.getElementById('activity-search-input').value = '';
        selectedStop = null;
    }
}

// Profile
function updateProfile() {
    document.getElementById('profile-name').textContent = currentUser.name;
    document.getElementById('profile-email').textContent = currentUser.email;
    document.getElementById('profile-avatar').textContent = currentUser.name.charAt(0);
    document.getElementById('profile-name-input').value = currentUser.name;
    document.getElementById('profile-email-input').value = currentUser.email;
}

// Initialize
document.addEventListener('DOMContentLoaded', function() {
    // Login form
    document.getElementById('login-form').addEventListener('submit', handleLogin);
    
    // Signup form
    document.getElementById('signup-form').addEventListener('submit', handleSignup);
    
    // Create trip form
    document.getElementById('create-trip-form').addEventListener('submit', handleCreateTrip);
    
    // City search
    document.getElementById('city-search-input').addEventListener('input', (e) => {
        renderCitySearch(e.target.value);
    });
    
    // Activity search
    document.getElementById('activity-search-input').addEventListener('input', (e) => {
        renderActivitySearch(e.target.value);
    });
    
    // Profile form
    document.getElementById('profile-form').addEventListener('submit', (e) => {
        e.preventDefault();
        alert('Profile updated successfully!');
    });
    
    // Close modals on background click
    document.querySelectorAll('.modal').forEach(modal => {
        modal.addEventListener('click', (e) => {
            if (e.target === modal) {
                modal.classList.remove('active');
            }
        });
    });
    
    // Initialize popular cities
    renderPopularCities();
});
