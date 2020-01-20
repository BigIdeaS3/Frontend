async function login() {
    var username = document.getElementById("usernameLogin").value;
    var password = document.getElementById("passwordLogin").value;
    var body = JSON.stringify({
        "username": username,
        "password": password
    })

    console.log(body)

    var call = await fetch('http://localhost:9000/players/login',{
        method: 'POST',
        body: body,
        headers: {
            'Content-Type': 'application/json'
          }
    })


    var result = await call.json();
    if (result.username !== null && result.email !== null && result.username !== undefined && result.email !== undefined){

        sessionStorage.setItem("user", JSON.stringify(result))

        name = result.username;        
        location.href = 'lobbyfinder.html'
    }
}

async function register() {
    var username = document.getElementById("usernameRegister").value;
    var email = document.getElementById("email").value;
    var password = document.getElementById("passwordRegister").value;

    var body = JSON.stringify({
        "username": username,
        "password": password,
        "email": email
    })

    var call = await fetch('http://localhost:9000/players/register',{
        method: 'POST',
        body: body,
        headers: {
            'Content-Type': 'application/json'
        }
    })

    console.log( await call.json())
    if (result.username !== null && result.email !== null && result.username !== undefined && result.email !== undefined){
        name = result.username;
        location.href = 'lobbyfinder.html'
    }
}

