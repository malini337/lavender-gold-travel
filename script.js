// Exchange Rate
const EXCHANGE_RATE = 0.012; // 1 INR ≈ 0.012 USD

function formatCurrency(rs) {
    const usd = (rs * EXCHANGE_RATE).toFixed(2);
    return `Rs${rs} (≈ $${usd})`;
}

// Cities & Attractions
const cities = {
    "Paris": [
        { name: "Eiffel Tower", cost: 1200 },
        { name: "Louvre Museum", cost: 900 },
        { name: "Seine River Cruise", cost: 600 }
    ],
    "London": [
        { name: "British Museum", cost: 600 },
        { name: "London Eye", cost: 700 }
    ],
    "Seoul": [
        { name: "Gyeongbokgung Palace", cost: 800 },
        { name: "N Seoul Tower", cost: 700 },
        { name: "Myeongdong Shopping Street", cost: 500 }
    ],
    "Tokyo": [
        { name: "Tokyo Disneyland", cost: 4000 },
        { name: "Shinjuku Gyoen Garden", cost: 600 },
        { name: "Tokyo Skytree", cost: 1200 }
    ],
    "Hong Kong": [
        { name: "Victoria Peak", cost: 700 },
        { name: "Disneyland Hong Kong", cost: 3800 },
        { name: "Star Ferry Ride", cost: 300 }
    ],
    "Kerala": [
        { name: "Alleppey Houseboat", cost: 2500 },
        { name: "Munnar Tea Gardens", cost: 600 },
        { name: "Athirappilly Waterfalls", cost: 400 }
    ],
    "Mexico": [
        { name: "Chichen Itza", cost: 1500 },
        { name: "Cancun Beaches", cost: 2000 },
        { name: "Mexico City Historic Center", cost: 800 }
    ]
};

// City Images
const cityImages = {
    "Paris": "images/paris.jpg",
    "London": "images/london.jpg",
    "Seoul": "images/seoul.jpg",
    "Tokyo": "images/tokyo.jpg",
    "Hong Kong": "images/hongkong.jpg",
    "Kerala": "images/kerala.jpg",
    "Mexico": "images/mexico.jpg"
};

// Cuisines
const cuisines = [
    { name: "Local Specialties", cost: 350 },
    { name: "Street Food", cost: 200 },
    { name: "Fine Dining", cost: 1200 }
];

// Hotels
const hotels = [
    { name: "City Budget Inn", cost: 3000 },
    { name: "Grand Royale", cost: 12000 }
];

// Travel Classes
const travelClasses = [
    { name: "Economy", cost: 25000 },
    { name: "Business", cost: 90000 }
];

// Populate dropdowns
window.onload = function () {
    populateDropdown("citySelect", Object.keys(cities));
    populateDropdown("cuisineSelect", cuisines.map(c => c.name));
    populateDropdown("hotelSelect", hotels.map(h => h.name));
    populateDropdown("travelSelect", travelClasses.map(t => t.name));
    updateDestinations();
};

function populateDropdown(id, items) {
    const select = document.getElementById(id);
    select.innerHTML = "";
    items.forEach((item, index) => {
        const option = document.createElement("option");
        option.value = index;
        option.textContent = item;
        select.appendChild(option);
    });
}

document.getElementById("citySelect").addEventListener("change", updateDestinations);

function updateDestinations() {
    const cityIndex = document.getElementById("citySelect").value;
    const city = Object.keys(cities)[cityIndex];

    const imgDiv = document.getElementById("cityImage");
    imgDiv.innerHTML = cityImages[city] ? `<img src="${cityImages[city]}" alt="${city}">` : "";

    const destDiv = document.getElementById("destinations");
    destDiv.innerHTML = "";
    if (cities[city]) {
        cities[city].forEach((dest, index) => {
            const label = document.createElement("label");
            const checkbox = document.createElement("input");
            checkbox.type = "checkbox";
            checkbox.value = index;
            label.appendChild(checkbox);
            label.appendChild(document.createTextNode(` ${dest.name}`));
            destDiv.appendChild(label);
        });
    }
}

function calculatePlan() {
    const cityIndex = document.getElementById("citySelect").value;
    const city = Object.keys(cities)[cityIndex];

    const chosenDest = Array.from(document.querySelectorAll("#destinations input:checked"))
        .map(cb => cities[city][cb.value]);

    const cuisine = cuisines[document.getElementById("cuisineSelect").value];
    const hotel = hotels[document.getElementById("hotelSelect").value];
    const rooms = parseInt(document.getElementById("rooms").value) || 1;
    const travelClass = travelClasses[document.getElementById("travelSelect").value];
    const travelers = parseInt(document.getElementById("travelers").value) || 1;
    const days = parseInt(document.getElementById("days").value) || 1;

    const destCost = chosenDest.reduce((sum, d) => sum + d.cost * days, 0);
    const foodCost = cuisine.cost * 3 * days * travelers;
    const hotelCost = hotel.cost * days * rooms;
    const travelCost = travelClass.cost * travelers;
    const total = destCost + foodCost + hotelCost + travelCost;
    const tax = total * 0.05;
    const grandTotal = total + tax;

    document.getElementById("planSummary").innerHTML = `
        <h3>Trip Summary</h3>
        <p><b>City:</b> ${city}</p>
        <p><b>Destinations:</b> ${chosenDest.map(d => d.name).join(", ") || "None"}</p>
        <p><b>Cuisine:</b> ${cuisine.name} (${formatCurrency(cuisine.cost)}/meal)</p>
        <p><b>Hotel:</b> ${hotel.name} (${formatCurrency(hotel.cost)}/night, Rooms: ${rooms})</p>
        <p><b>Travel Class:</b> ${travelClass.name} (${formatCurrency(travelClass.cost)}/ticket, Travelers: ${travelers})</p>
        <p><b>Days:</b> ${days}</p>
    `;

    document.getElementById("costBreakdown").innerHTML = `
        <h3>Cost Breakdown</h3>
        Destinations: ${formatCurrency(destCost)}<br>
        Food: ${formatCurrency(foodCost)}<br>
        Hotel: ${formatCurrency(hotelCost)}<br>
        Travel: ${formatCurrency(travelCost)}<br>
        Tax: ${formatCurrency(Math.round(tax))}<br>
        <b>Total: ${formatCurrency(Math.round(grandTotal))}</b>
    `;
}
