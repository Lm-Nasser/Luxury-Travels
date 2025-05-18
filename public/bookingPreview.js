document.addEventListener("DOMContentLoaded", () => {
    fetch("http://localhost:3000/check-session")
        .then(response => response.json())
        .then(data => {
            if (!data.loggedIn) {
                window.location.href = "/public/login.html";
            }
        })
        .catch(error => console.error("Error checking session:", error));
});

document.addEventListener("DOMContentLoaded", () => {
    const urlParams = new URLSearchParams(window.location.search);
    const id = urlParams.get("id"); 

    if (id) {
        fetchBookingDetails(id);
    } else {
        console.error("Booking ID is missing in the URL");
    }
});

function fetchBookingDetails(bookingID) {
    const url = `http://localhost:3000/booking-details/${bookingID}`;

    fetch(url)
        .then((response) => {
            if (!response.ok) {
                throw new Error(`HTTP error! Status: ${response.status}`);
            }
            return response.json();
        })
        .then((booking) => {
            console.log(booking);

            if (!booking) {
                console.error("No booking data found");
                return;
            }

            document.getElementById("BookingReference").textContent = booking.BookingReference;
            document.getElementById("Status").textContent = booking.Status;
            document.getElementById("FullName").textContent = booking.FullName;
            document.getElementById("Email").textContent = booking.Email;
            document.getElementById("Nationality").textContent = booking.Nationality;
            document.getElementById("Date").textContent = new Date(booking.Date).toISOString().split('T')[0];;
            document.getElementById("Phone").textContent = booking.Phone;
            document.getElementById("Pickup_Location").textContent = booking.PickupLocation;
            document.getElementById("Tour_Type").textContent = booking.TourType;
            document.getElementById("AdultTravelers").textContent = booking.AdultTravelers;
            document.getElementById("ChildrenTravelers").textContent = booking.ChildrenTravelers;
            document.getElementById("SpecialRequest").textContent = booking.SpecialRequest;
        })
        .catch((error) => {
            console.error("Error fetching booking:", error);
        });
}

document.getElementById("logoutLink").addEventListener("click", (event) => {
    event.preventDefault();

    fetch("http://localhost:3000/logout", {
        method: "POST",
        credentials: "include"
    })
    .then(response => response.json())
    .then(data => {
        
        document.getElementById("message").innerHTML = `
                <div class="bg-green-100 border border-green-400 text-green-700 px-4 py-3 my-10 rounded relative" role="alert">
                    <strong class="font-bold">Success!</strong>
                    <span class="block sm:inline">${data.message}</span>
                </div>`;
        setTimeout(() => {
            window.location.href = "login.html"
                }, 500);
        
    })
    .catch(error => {
        console.error("Logout failed:", error);
    });
});