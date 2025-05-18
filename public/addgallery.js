


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
    const tripID = urlParams.get("id");

    getAllGallery(tripID);
    addGallery(tripID);
});


function getAllGallery(tripID) {
    const url = `http://localhost:3000/fetch-all-images/${tripID}`;
    const table = document.getElementById('gallery');

    if (!table) {
        console.error("Table element not found.");
        return;
    }

    fetch(url)
    .then((response) => {
        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }
        return response.json();
    })
    .then((gallery) => {
        if (!Array.isArray(gallery)) {
            console.error("Expected an array of images.");
            return;
        }

        gallery.forEach((image) => {
            let newRow = table.insertRow();
            let cell1 = newRow.insertCell(0);
            let cell2 = newRow.insertCell(1);
            let cell3 = newRow.insertCell(2);
            let cell4 = newRow.insertCell(3);
            let cell5 = newRow.insertCell(4);

            cell1.textContent = image.id;
            cell2.textContent = image.image_name;
            cell3.textContent = image.uploaded_at;

            cell4.innerHTML = `
                <span class='bg-pink-500 px-2 py-1 rounded text-white cursor-pointer' onclick='deleteImage(${image.id})'>DELETE</span>
            `;

            cell5.innerHTML = `
                <a href="http://localhost:3000/uploads/${image.image_name}" target="_blank" class='bg-green-500 px-2 py-1 rounded text-white cursor-pointer'>Preview</a>
            `;

            cell4.dataset.imageID = image.id;
            cell5.dataset.imageID = image.id;
        });
    })
    .catch((error) => {
        console.error("Error fetching gallery:", error);
        alert("Failed to load gallery. Please try again.");
    });
};


function addGallery(tripID) {
    let galleryForm = document.getElementById("gallery_form");

    galleryForm.onsubmit = (event) => {
        event.preventDefault();
        
        let formData = new FormData(galleryForm);
        
        // Correct endpoint URL with tripID
        const url = `http://localhost:3000/create-gallery/${tripID}`;
        
        fetch(url, {
            method: "POST",
            body: formData,
        })
        .then(response => response.json())
        .then(data => {
            if(data.success) {
                alert("Images Added Successfully!");
                location.reload();
            } else {
                alert("Error: " + data.message);
            }
        })
        .catch(error => console.error("Error:", error));
    };
}

function deleteImage(image_ID) {

    const url = `http://localhost:3000/delete-image/${image_ID}`;

    fetch(url, {
        method: "DELETE",
        headers: {
            "Accept": "application/json",
            "Content-Type": "application/json"
        },
        body: JSON.stringify({id: image_ID})
    }).then((response) => {
        if (response.status ===200) {
            alert("DONE!");
            location.reload();
        } else {
            alert("ERROR");
        }
    })
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