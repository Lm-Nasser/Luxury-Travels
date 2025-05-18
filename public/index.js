document.addEventListener("DOMContentLoaded", () => {
    fetchTrips();
});

function fetchTrips() {
    const url = "http://localhost:3000/fetch-home-trips";
    fetch(url)
        .then(response => response.json())
        .then(trips => {
            const container = document.getElementById("tripsContainer");
            container.innerHTML = "";

            trips.forEach(trip => {
                const tripCard = `
                <div class="rounded-lg overflow-hidden shadow-lg group relative">
                    <div class="relative h-64">
                        <img src="/uploads/${trip.trip_image}" alt="${trip.title}" class="object-cover bg-top">
                        <div class="absolute inset-0 bg-gradient-to-t from-black to-transparent"></div>
                            ${trip.discount > 0 ? `
                        <div class="absolute top-4 left-4 bg-yellow-700 text-white px-4 py-2 
                            rounded-full text-sm font-medium">
                            ${trip.discount} % OFF
                    </div>
                ` : ''}
                <div class="absolute bottom-0 left-0 p-6 text-white">
                    <h3 class="text-2xl font-bold mb-2">${trip.title}</h3>
                    <p class="mb-4 opacity-90">${(trip.description).slice(0, 40)}...</p>
                    <a href="trippage.html?id=${trip.id}" class="inline-block bg-yellow-700 px-4 py-2 
                    rounded-full text-sm font-medium hover:bg-yellow-800 transition duration-300">Explore More</a>
                </div>
            </div>
        </div>
    `;
                container.innerHTML += tripCard;
            });
        })
        .catch(error => console.error("Error fetching trips:", error));
}
