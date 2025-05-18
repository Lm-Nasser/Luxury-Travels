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
    getAllCustomers();
});

function getAllCustomers() {
    const url = "http://localhost:3000/fetch-all-customers";
    const table = document.getElementById('customers');

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

            cell1.innerHTML = booking.FullName
            cell2.innerHTML = booking.Nationality
            cell3.innerHTML = booking.Phone
            cell4.innerHTML = booking.Email
            cell5.innerHTML = `<span class='bg-red-500 px-2 py-1 rounded text-white cursor-pointer' onclick='deleteCustomers(${booking.BookingID})'>DELETE</span>`

            cell5.dataset.bookingid = booking.BookingID
        })
    }).catch((error) => {
        console.log(error);
    });
};

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