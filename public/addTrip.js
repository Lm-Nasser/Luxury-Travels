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
    getAllTrips();
    createTrip();
});


function getAllTrips() {
    const url = "http://localhost:3000/fetch-all-trips";
    const table = document.getElementById('trips');

    fetch(url).then((response) => {
        return response.json();
    })
    .then((trips) => {
        console.log(trips);
        trips.map((trip) => {
            let newRow = table.insertRow();
            let cell1 = newRow.insertCell(0);
            let cell2 = newRow.insertCell(1);
            let cell3 = newRow.insertCell(2);
            let cell4 = newRow.insertCell(3);
            let cell5 = newRow.insertCell(4);

            cell1.innerHTML = trip.id
            cell2.innerHTML = trip.title
            cell3.innerHTML = trip.created_at
            cell4.innerHTML = "<span class='bg-blue-500 px-2 py-1 rounded text-white cursor-pointer' onclick='fetchTrip("+ trip.id +")'>EDIT</span> <span class='bg-pink-500 px-2 py-1 rounded text-white cursor-pointer' onclick='deleteTrip("+ trip.id +")'>DELETE</span> <span class='bg-pink-500 px-2 py-1 rounded text-white cursor-pointer' onclick='deleteGallery("+ trip.id +")'>DELETE GALLERY</span> <span class='bg-green-500 px-2 py-1 rounded text-white cursor-pointer' onclick='addGallery("+ trip.id +")'>Add Gallery</span>"

            cell5.innerHTML = "<span class='bg-green-500 px-2 py-1 rounded text-white cursor-pointer' onclick='previewTrip("+ trip.id +")'>Preview</span>"

            cell4.dataset.tripid = trip.id
            cell5.dataset.tripid = trip.id
        })
    }).catch((error) => {
        console.log(error);
    });
};

function createTrip() {
    let tripForm = document.getElementById("trip_form");

    tripForm.onsubmit = (event) => {
        event.preventDefault();
        
        let formData = new FormData(tripForm); // FormData to handle file uploads

        const url = "http://localhost:3000/create-trip";
        fetch(url, {
            method: "POST",
            body: formData, // No need to manually set Content-Type, FormData handles it
        })
        .then((response) => {
            if (response.ok) {
                alert("Trip Added Successfully!");
                location.reload();
            } else {
                alert("Error Adding Trip!");
            }
        })
        .catch((error) => console.error("Error:", error));
    };
}


function deleteTrip(tripId) {
    const url = "http://localhost:3000/delete-trip";
    fetch(url, {
        method: "DELETE",
        headers: {
            "Accept": "application/json",
            "Content-Type": "application/json"
        },
        body: JSON.stringify({id: tripId})
    }).then((response) => {
        if (response.status ===200) {
            alert("DONE!");
            location.reload();
        } else {
            alert("ERROR");
        }
    })
}

function fetchTrip(tripId) {
    const url = `http://localhost:3000/trips/${tripId}`;
    fetch(url)
        .then((response) => response.json())
        .then((trip) => {
            console.log(trip);

            document.getElementById("Title").value = trip[0].title;
            document.getElementById("from").value = trip[0].location_from;
            document.getElementById("to").value = trip[0].location_to;
            document.getElementById("priceG").value = trip[0].price_group;
            document.getElementById("priceP").value = trip[0].price_private;
            document.getElementById("priceP_children").value = trip[0].price_private_children;
            document.getElementById("priceG_children").value = trip[0].price_group_children;
            document.getElementById("discount").value = trip[0].discount;
            document.getElementById("description").value = trip[0].description;
            document.getElementById("tipDetails").value = trip[0].trip_details;
            document.getElementById("submit").textContent = "Update";

            updateTrip(tripId, trip[0].trip_image);
        });
}

function updateTrip(tripId, existingImage) {
    let tripForm = document.getElementById("trip_form");

    tripForm.onsubmit = (event) => {
        event.preventDefault();
        let formData = new FormData(tripForm);
        formData.append("id", tripId);

        // If no new image is selected, use the existing image
        let imageInput = document.getElementById("image");
        if (imageInput.files.length === 0) {
            formData.append("existingImage", existingImage);
        }

        fetch("http://localhost:3000/update-trip", {
            method: "POST",
            body: formData, // `Content-Type` is automatically set to `multipart/form-data`
        })
            .then((response) => {
                if (response.status === 200) {
                    alert("Trip updated successfully!");
                    location.reload();
                } else {
                    alert("Error updating trip");
                }
            })
            .catch((error) => console.error("Error:", error));
    };
}


function deleteGallery(trip_id) {
    const url = `http://localhost:3000/delete-trip-gallery/${trip_id}`;

    fetch(url, {
        method: "DELETE",
        headers: {
            "Accept": "application/json",
            "Content-Type": "application/json"
        }
    })
    .then(response => response.json()) // Parse JSON response
    .then(data => {
        if (data.error) {
            document.getElementById("message2").innerHTML = `
                <div class="bg-red-100 border border-red-400 text-red-700 px-4 py-3 my-10 rounded relative" role="alert">
                    <strong class="font-bold">Error!</strong>
                    <span class="block sm:inline">${data.error}</span>
                </div>`;
                setTimeout(() => location.reload(), 1000);
        } else {
            document.getElementById("message2").innerHTML = `
                <div class="bg-green-100 border border-green-400 text-green-700 px-4 py-3 my-10 rounded relative" role="alert">
                    <strong class="font-bold">Success!</strong>
                    <span class="block sm:inline">${data.message}</span>
                </div>`;
            setTimeout(() => location.reload(), 1000); // Reload after 1 sec
        }
    })
    .catch(error => {
        console.error("Fetch error:", error);
        document.getElementById("message2").innerHTML = `
            <div class="bg-red-100 border border-red-400 text-red-700 px-4 py-3 my-10 rounded relative" role="alert">
                <strong class="font-bold">Error!</strong>
                <span class="block sm:inline">Failed to delete gallery. Please try again.</span>
            </div>`;
            setTimeout(() => location.reload(), 1000);
    });
}



function previewTrip(tripID) {
    window.open(`trippage.html?id=${tripID}`);
}

function addGallery(tripID) {
    window.open(`addgallery.html?id=${tripID}`);
}


document.getElementById("logoutLink").addEventListener("click", (event) => {
    event.preventDefault();

    fetch("http://localhost:3000/logout", {
        method: "POST",
        credentials: "include"
    })
    .then(response => response.json())
    .then(data => {
        //alert(data.message);
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
