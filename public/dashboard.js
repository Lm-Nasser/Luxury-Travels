document.addEventListener("DOMContentLoaded", () => {
    fetch("http://localhost:3000/check-session")
        .then(response => response.json())
        .then(data => {
            if (!data.loggedIn) {
                window.location.href = "login.html";
            } else {
                document.getElementById("welcomeMessage").innerText = `${data.user.username}`;
            }
        })
        .catch(error => {
            console.error("Error checking session:", error);
        });
});

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