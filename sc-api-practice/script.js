
const usernameInput = document.getElementById('username');
const passwordInput = document.getElementById('password');
const btn = document.getElementById('submit');
const BASE_URL = "https://sandpit-api.safetyculture.io"


function clearInput() {
    usernameInput.value = '';
    passwordInput.value = '';
}

let apiToken;
function getAccessToken(username, password, apiUrl=BASE_URL) {
    let url = apiUrl + "/auth";
    fetch(url, {
        body: `grant_type=password&username=${username.value}&password=${password.value}`,
        headers: {
            "Content-Type": "application/x-www-form-urlencoded"
        },
        method: "POST"
    }).then(response => {
        return response.json()
    }).then(data => {
        apiToken = data.access_token;
        clearInput();
        alert('Token Acquired.')
    }).catch(error => console.log(error))
}

btn.addEventListener('click', function() {
    getAccessToken(usernameInput, passwordInput);
})


// GET GROUPS: if 'Get Users' is clicked -> show users in group
const groupsList = document.getElementById('groups');

// API call to get groups
function getMyGroups(apiToken, apiUrl=BASE_URL) {
    let url = apiUrl + '/share/connections'
    fetch(url, {
        headers: {
            "Content-Type": "application/json",
            "Authorization": "Bearer " + apiToken
        }
    }).then(response => {
        return response.json()
    }).then(data => {
        listMyGroups(data, groupsTable)
    }).catch(error => console.log(error))
}

const groupsBtn = document.getElementById('getGroups')
groupsBtn.addEventListener('click', function() {
    getMyGroups(apiToken)
})
const groupsTable = document.getElementById('groups');
function listMyGroups(groupsObj, table) {
    for (i = 0; i < groupsObj.groups.length; i++) {
        let groupName = groupsObj.groups[i].name;
        let groupType = groupsObj.groups[i].type;
        let groupId = groupsObj.groups[i].id;

        let template = `
            <tr>
                <td>${groupName}</td>
                <td>${groupType}</td>
                <td class="getUsers" id=${groupId}>Get Users</td>
            </tr>`

        table.innerHTML += template;
    }
    let userBtns = document.getElementsByClassName("getUsers");
    for (i = 0; i < userBtns.length; i++) {
        userBtns[i].addEventListener('click', function() {
            let btnId = this.id;
            // call getUsersInGroup()
            getUsersInGroup(btnId, apiToken)
        })
    }

}


// GET USERS IN GROUP
function getUsersInGroup(groupId, apiToken, apiUrl=BASE_URL) {
    let url = apiUrl + `/groups/${groupId}/users`;
    fetch(url, {
        headers: {
            "Content-Type": "application/json",
            "Authorization": "Bearer " + apiToken
        }
    }).then(response => {
        return response.json()
    }).then(data => {
        listUsersInGroup(data, usersTable)
    })
}

// LIST USERS IN TABLE
const usersTable = document.getElementById('users');
function listUsersInGroup(userObj, table) {
    resetUsersTable(usersTable)
    for (i = 0; i < userObj.users.length; i++) {
        let email = userObj.users[i].email;
        let firstname = userObj.users[i].firstname;
        let lastname = userObj.users[i].lastname; 
        let status = userObj.users[i].status;
        let id = userObj.users[i].id

        let template = `
            <tr id=${id}>
                <td>${email}</td>
                <td>${firstname}</td>
                <td>${lastname}</td>
                <td>${status}</td>
            </tr>`

        table.innerHTML += template;
    }

}

// resetTable function
function resetUsersTable(usersTable){
    let template = `
        <tr>
            <th>Email</th>
            <th>First Name</th>
            <th>Last Name</th>
            <th>Status</th>
        </tr>`
    usersTable.innerHTML = template;
}