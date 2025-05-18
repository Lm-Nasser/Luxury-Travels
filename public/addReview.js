const urlParams = new URLSearchParams(window.location.search);
const id = urlParams.get("id");

createReview(id);

function createReview(id) {
    let reviewForm = document.getElementById('review_form');

    reviewForm.onsubmit = (event) => {
        event.preventDefault();
        let formData = new FormData(reviewForm);
        let data = {};
        formData.forEach((value, key) => {
            data[key] = value;
        });

        const url = `http://localhost:3000/create-review/${id}`;

        fetch(url, {
            method: "POST",
            headers: {
                "Accept": "application/json",
                "Content-Type": "application/json"
            },
            body: JSON.stringify(data)
        })
        .then(response => response.json())
        .then(data => {
            if (data.message) {
                alert("Review submitted successfully!");
                location.reload();
            } else {
                alert(data.error || "ERROR");
            }
        })
        .catch(error => {
            console.error("Fetch error:", error);
            alert("An error occurred while submitting the review.");
        });
    }
}
