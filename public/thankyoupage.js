document.addEventListener("DOMContentLoaded", function() {
    // Retrieve booking data from localStorage
    const bookingData = JSON.parse(localStorage.getItem("bookingInfo"));
    console.log(bookingData);

    if (!bookingData) {
        document.getElementById("bookingDetails").innerHTML = "No booking information found!";
        return;
    }

    // Display the booking data on the page
    document.getElementById("clientName").textContent = bookingData.FullName;
    document.getElementById("date").textContent = bookingData.date;
    document.getElementById("Adult").textContent = bookingData.adultTP;
    document.getElementById("Children").textContent = bookingData.childrenTP;
    document.getElementById("tourType").textContent = bookingData.tourType;
    document.getElementById("TTotalPrice").textContent = bookingData.totalPrice;
    document.getElementById("email").textContent = bookingData.Email;
    document.getElementById("phone").textContent = bookingData.phone;
});
