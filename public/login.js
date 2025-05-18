document.addEventListener("DOMContentLoaded", () => {
});
checkUser();

function checkUser() {
    let loginForm = document.getElementById("login_form");

    loginForm.onsubmit = (event) => {
        event.preventDefault();
        let formData = new FormData(loginForm);
        let data = {};
        formData.forEach((value, key) => {
            data[key] = value;
        });

        const url = "http://localhost:3000/check-user";
        fetch(url, {
            method: "POST",
            headers: {
                "Accept": "application/json",
                "Content-Type": "application/json"
            },
            body: JSON.stringify(data)
        })
        .then(async response => {
            let data;
            try {
                data = await response.json();
            } catch {
                data = { message: "Unknown error occurred" };
            }
        
            if (response.ok) {
                document.getElementById("message").innerHTML = `
                <div class="bg-green-100 border border-green-400 text-green-700 px-4 py-3 my-10 rounded relative" role="alert">
                    <strong class="font-bold">Success!</strong>
                    <span class="block sm:inline">${data.message}</span>
                </div>`;
        
                setTimeout(() => {
                    location.href = "/public/dashboard.html"
                }, 500);
            } else {
                document.getElementById("message").innerHTML = `
                <div class="bg-red-100 border border-red-400 text-red-700 px-4 py-3 my-10 rounded relative" role="alert">
                    <strong class="font-bold">Error!</strong>
                    <span class="block sm:inline">${data.message || "An error occurred"}</span>
                </div>`;
            }
        })
        .catch(error => {
            document.getElementById("message").innerHTML = `
            <div class="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative" role="alert">
                <strong class="font-bold">Error!</strong>
                <span class="block sm:inline">Network error: ${error.message}</span>
            </div>`;
        });
        
}}
