document.addEventListener("DOMContentLoaded", () => {
    const urlParams = new URLSearchParams(window.location.search);
    const id = urlParams.get("id");

    fetchTripDetails();
    fetchAllGallery(id)
});

document.addEventListener("DOMContentLoaded", function () {

    // Adults Section
    const decreaseAdultsButton = document.getElementById("decreaseAdults");
    const increaseAdultsButton = document.getElementById("increaseAdults");
    const adultsInput = document.getElementById("adultsInput");

    decreaseAdultsButton.addEventListener("click", function () {
        let currentValue = parseInt(adultsInput.value);
        if (currentValue > 1) {
            adultsInput.value = currentValue - 1;
            document.getElementById("A_T_Number").textContent = adultsInput.value
        }
        updateTotalPrice();
    });

    increaseAdultsButton.addEventListener("click", function () {
        let currentValue = parseInt(adultsInput.value);
        adultsInput.value = currentValue + 1;
        document.getElementById("A_T_Number").textContent = adultsInput.value

        updateTotalPrice();
    });

    // Children Section
    const decreaseChildrenButton = document.getElementById("decreaseChildren");
    const increaseChildrenButton = document.getElementById("increaseChildren");
    const childrenInput = document.getElementById("childrenInput");

    decreaseChildrenButton.addEventListener("click", function () {
        let currentValue = parseInt(childrenInput.value);
        if (currentValue > 0) {
            childrenInput.value = currentValue - 1;
            document.getElementById("C_T_Number").textContent = childrenInput.value

        }
        updateTotalPrice();
    });

    increaseChildrenButton.addEventListener("click", function () {
        let currentValue = parseInt(childrenInput.value);
        childrenInput.value = currentValue + 1;
        document.getElementById("C_T_Number").textContent = childrenInput.value

        updateTotalPrice();
    });

    // Function to update the total price (You can modify this part to calculate the price dynamically)
    function updateTotalPrice() {
        let pricePerAdult = parseFloat(document.getElementById("tourG").textContent) ; // Example price per adult (Replace with actual price)
        let pricePerChild = parseFloat(document.getElementById("tourG_C").textContent); // Example price per child (Replace with actual price)

        let numberOfAdults = parseInt(document.getElementById("A_T_Number").textContent);
        let numberOfChildren = parseInt(document.getElementById("C_T_Number").textContent);

        let totalPricePerAdult = (numberOfAdults * pricePerAdult);
        let totalPricePerChild = (numberOfChildren * pricePerChild);
        document.getElementById("priceAdults").textContent = totalPricePerAdult;
        document.getElementById("priceChildren").textContent = totalPricePerChild;

        let totalPrice = totalPricePerAdult + totalPricePerChild;

        // Assuming you have an element with ID `totalPrice` to display the price
        document.getElementById("totalPrice").textContent = totalPrice;

        document.getElementById("priceAdultsInput").value = totalPricePerAdult;
        document.getElementById("priceChildrenInput").value = totalPricePerChild;
        document.getElementById("totalPriceInput").value = totalPrice;


    }
});



function fetchTripDetails() {
    const urlParams = new URLSearchParams(window.location.search);
    const tripId = urlParams.get("id");

    if (!tripId) {
        document.getElementById("tripInfo").innerHTML = "<p class='text-red-500 text-center'>Invalid Trip ID.</p>";
        return;
    }

    fetch(`http://localhost:3000/fetch-home-trips/${tripId}`)
        .then(response => response.json())
        .then(trip => {
            if (trip.error) {
                document.getElementById("tripTitle").innerHTML = "<p class='text-red-500 text-center'>Trip not found.</p>";
                return;
            }

            document.getElementById("tripTitle").innerHTML = trip.title;
            document.getElementById("tripTitle2").innerHTML = trip.title;
            document.getElementById("from").innerHTML = trip.location_from;
            document.getElementById("to").innerHTML = trip.location_to;

            let tourTypeDropdown = document.getElementById("tourType");
            
            function updatePrices() {
                let group_or_private = tourTypeDropdown.value;
                let discount = trip.discount / 100;
            
                if (group_or_private === "Group Tour") {
                    document.getElementById("tourType2").value = "Group Tour";
                    document.getElementById("tourType2").textContent = "Group Tour";
                    if (discount > 0) {
                        document.getElementById("discount1").textContent = trip.discount;
                        document.getElementById("original_Price_Adults").textContent = trip.price_group + " MAD";
                        document.getElementById("tourG").textContent = (trip.price_group - (trip.price_group * discount)).toFixed(2);
                        //document.getElementById("priceAdults").textContent = (trip.price_group - (trip.price_group * discount)).toFixed(2);
            
                        document.getElementById("original_Price_Children").textContent = trip.price_group_children + " MAD";
                        document.getElementById("tourG_C").textContent = (trip.price_group_children - (trip.price_group_children * discount)).toFixed(2);
                    } else {
                        document.getElementById("tourG").textContent = trip.price_group;
                        document.getElementById("tourG_C").textContent = trip.price_group_children;
                    }
                } else if (group_or_private === "Private Tour") {
                    document.getElementById("tourType2").value = "Private Tour";
                    document.getElementById("tourType2").textContent = "Private Tour";
                    if (discount > 0) {
                        document.getElementById("discount1").textContent = trip.discount;
                        document.getElementById("original_Price_Adults").textContent = trip.price_private + " MAD";
                        document.getElementById("tourG").textContent = (trip.price_private - (trip.price_private * discount)).toFixed(2);
                        //document.getElementById("priceAdults").textContent = (trip.price_private - (trip.price_private * discount)).toFixed(2);
            
                        document.getElementById("original_Price_Children").textContent = trip.price_private_children + " MAD";
                        document.getElementById("tourG_C").textContent = (trip.price_private_children - (trip.price_private_children * discount)).toFixed(2);
                    } else {
                        document.getElementById("tourG").textContent = trip.price_private;
                        document.getElementById("tourG_C").textContent = trip.price_private_children;
                    }
                }
            }
            
            tourTypeDropdown.addEventListener("change", updatePrices);
            
            updatePrices();

            document.getElementById("description").innerHTML = trip.description;
            document.getElementById("imageH").src  = `/uploads/${trip.trip_image}`;
            document.getElementById("imageH").alt = trip.title;
            document.getElementById("tripReview").href = `addReview.html?id=${trip.id}`;
            document.getElementById("tripDetails").innerHTML = trip.trip_details;
            document.getElementById("discountNumber").textContent = trip.discount;

            

            
        })
        .catch(error => {
            console.error("Error fetching trip details:", error);
            document.getElementById("tripTitle").innerHTML = "<p class='text-red-500 text-center'>Failed to load trip details.</p>";
        });
}

function fetchAllGallery(trip_ID) {
    const url = `http://localhost:3000/fetch-home-trips-gallery/${trip_ID}`; // Updated URL with the trip ID

    fetch(url)
        .then(response => response.json())
        .then(images => {
            const container = document.getElementById("imageContainer");
            container.innerHTML = ""; // Clear any previous images

            images.forEach(image => {
                const imageCard = `<img src="/uploads/${image.image_name}" alt="Gallery Image" class="rounded-lg shadow-md h-28 w-full object-cover cursor-pointer hover:opacity-80 transition duration-300">`;
                container.innerHTML += imageCard; // Add image to the container
            });
        })
        .catch(error => console.error("Error fetching images:", error));
}

createBooking();
function createBooking() {
    let bookingForm = document.getElementById('booking_form');
    const tripId = new URLSearchParams(window.location.search).get("id");

    bookingForm.onsubmit = (event) => {
        event.preventDefault();
        let formData = new FormData(bookingForm);
        let data = {};
        formData.forEach((value, key) => {
            data[key] = value;
        })
        const url = `http://localhost:3000/create-booking/${tripId}`;
        
        fetch(url, {
            method: "POST",
            headers: {
                "Accept": "application/json",
                "Content-Type": "application/json"
            },
            body: JSON.stringify(data)
        })
        .then(response => response.text())
        .then(responseText => {
            console.log("Response Text:", responseText);
            try {
                const result = JSON.parse(responseText);
                if (result.success) {
                    localStorage.setItem("bookingInfo", JSON.stringify(result.bookingData));
                    location.replace(`/public/thankyoupage.html`);
                } else {
                    alert("ERROR: " + JSON.stringify(result));
                }
            } catch (error) {
                console.error("Error parsing JSON:", error);
                alert("Failed to parse the response. It may not be in JSON format.");
            }
        })
        .catch(error => {
            console.error("Fetch Error:", error);
            alert("Network error: " + error.message);
        });
        
    }
}

