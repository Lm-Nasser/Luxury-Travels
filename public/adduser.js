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
    getAllUsers();
    createUser();
});


function getAllUsers() {
    const url = "http://localhost:3000/fetch-all-users";
    const table = document.getElementById('users');

    fetch(url).then((response) => {
        return response.json();
    })
    .then((users) => {
        //console.log(users);
        users.map((user) => {
            let newRow = table.insertRow();
            let cell1 = newRow.insertCell(0);
            let cell2 = newRow.insertCell(1);
            let cell3 = newRow.insertCell(2);
            let cell4 = newRow.insertCell(3);
            let cell5 = newRow.insertCell(4);

            cell1.innerHTML = user.id
            cell2.innerHTML = user.username
            cell3.innerHTML = user.email
            cell4.innerHTML = user.creation_date
            cell5.innerHTML = "<span class='bg-blue-500 px-2 py-1 rounded text-white cursor-pointer' onclick='fetchUser("+ user.id +")'>EDIT</span> <span class='bg-pink-500 px-2 py-1 rounded text-white cursor-pointer' onclick='deleteUser("+ user.id +")'>DELETE</span>"
            cell5.dataset.userid = user.id
        })
    }).catch((error) => {
        console.log(error);
    });
};
//getAllUsers();
function createUser() {
    let userForm = document.getElementById('user_form');

    userForm.onsubmit = (event) => {
        event.preventDefault();
        let formData = new FormData(userForm);
        let data ={};
        formData.forEach((value, key)=>{
            data[key] = value;
        })
        const url = "http://localhost:3000/create";
        fetch(url, {
            method: "POST",
            headers: {
                "Accept": "application/json",
                "Content-Type": "application/json"
            },
            body: JSON.stringify(data)
        })
        .then(response => response.json().then(json => ({ status: response.status, json })))
        .then(({ status, json }) => {
            if (status === 201) {
                //alert("DONE!");

                document.getElementById("message").innerHTML = `
                <div class="bg-green-100 border border-green-400 text-green-700 px-4 py-3 rounded relative" role="alert">
                    <strong class="font-bold">Success!</strong>
                    <span class="block sm:inline">${json.message}</span>
                </div>`;

                setTimeout(() => {
                    location.reload();
                }, 2000);
            } else {
                document.getElementById("message").innerHTML = `
                <div class="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative" role="alert">
                        <strong class="font-bold">Error!</strong>
                        <span class="block sm:inline">${json.message}</span>
                </div>`
            }
        })
        .catch(error => {
            alert("ERROR: " + error.message);
        });
    }
}

function deleteUser(userId) {
    const url = "http://localhost:3000/delete";
    fetch(url, {
        method: "DELETE",
        headers: {
            "Accept": "application/json",
            "Content-Type": "application/json"
        },
        body: JSON.stringify({id: userId})
    }).then((response) => {
        if (response.status ===200) {
            alert("DONE!");
            location.reload();
        } else {
            alert("ERROR");
        }
    })
}

function fetchUser(userId) {
    const url = "http://localhost:3000/users/" + userId;
    fetch(url).then((response) => {
        return response.json();
    }).then((user)=>{
        console.log(user);
        let usernameInput = document.getElementById("username");
        let emailInput = document.getElementById("email");
        let passwordInput = document.getElementById("password");
        let buttonInput = document.getElementById("submit");

        usernameInput.value = user[0].username;
        emailInput.value = user[0].email;
        passwordInput.value = user[0].password_hash;
        buttonInput.textContent = "Update";
        updateUser(userId);
    }) 
}

function updateUser(userId) {
    let userForm = document.getElementById('user_form');

    userForm.onsubmit = (event) => {
        event.preventDefault();
        let formData = new FormData(userForm);
        let data ={};
        data.id =userId
        formData.forEach((value, key)=>{
            data[key] = value;
        })
        const url = "http://localhost:3000/update";
        fetch(url, {
            method: "POST",
            headers: {
                "Accept": "application/json",
                "Content-Type": "application/json"
            },
            body: JSON.stringify(data)
        }).then((response) => {
            if (response.status === 200) {
                alert("DONE!");
                location.reload();
            } else {
                alert("ERROR");
            }
        })
    }
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