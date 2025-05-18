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
    getAllBookings();
});

function getAllBookings() {
    const url = "http://localhost:3000/fetch-all-bookings";
    const table = document.getElementById('bookings');

    fetch(url).then((response) => {
        return response.json();
    })
    .then((bookings) => {
        //console.log(bookings);
        bookings.map((booking) => {
            let newRow = table.insertRow();
            let cell1 = newRow.insertCell(0);
            let cell2 = newRow.insertCell(1);
            let cell3 = newRow.insertCell(2);
            let cell4 = newRow.insertCell(3);
            let cell5 = newRow.insertCell(4);
            let cell6 = newRow.insertCell(5);
            let cell7 = newRow.insertCell(6);
            let cell8 = newRow.insertCell(7);

            cell1.innerHTML = booking.BookingReference
            cell2.innerHTML = booking.FullName
            cell3.innerHTML = booking.location_from
            cell4.innerHTML = booking.location_to
            cell5.innerHTML = booking.Date
            cell6.innerHTML = "<span class='p-4 text-center text-yellow-700 font-medium'>"+ booking.Status +"</span>"
            cell8.innerHTML = `<a href='bookingPreview.html?id=${booking.BookingID}' class='bg-green-700 px-2 py-1 rounded text-white cursor-pointer'>PREVIEW</a>`
            cell7.innerHTML = `
                <span class='bg-blue-500 px-2 py-1 rounded text-white cursor-pointer' onclick='acceptBooking(${booking.BookingID})'>ACCEPT</span> 
                <span class='bg-pink-500 px-2 py-1 rounded text-white cursor-pointer' onclick='rejectBooking(${booking.BookingID})'>REJECT</span>
            `;
            cell7.dataset.bookingid = booking.BookingID
        })
    }).catch((error) => {
        console.log(error);
    });
};

function rejectBooking(bookingId) {
    const url = "http://localhost:3000/reject-booking";
    fetch(url, {
        method: "POST",
        headers: {
            "Accept": "application/json",
            "Content-Type": "application/json"
        },
        body: JSON.stringify({id: bookingId})
    }).then((response) => {
        if (response.status ===200) {
            alert("DONE!");
            location.reload();
        } else {
            alert("ERROR");
        }
    })
}

function acceptBooking(bookingId) {
    const url = "http://localhost:3000/accept-booking";
    fetch(url, {
        method: "POST",
        headers: {
            "Accept": "application/json",
            "Content-Type": "application/json"
        },
        body: JSON.stringify({id: bookingId})
    }).then((response) => {
        if (response.status ===200) {
            alert("DONE!");
            location.reload();
        } else {
            alert("ERROR");
        }
    })
}

function previewBooking(bookingId) {
    window.location.replace(`/bookingPreview.html?id=${bookingId}`);
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