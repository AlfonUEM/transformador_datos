
const serverAddress= "194.164.162.70:4567"
export async function authenticatedPostRequest(path, post_json){
    const url = "http://" + serverAddress + path;
    let response = await fetch(url, {
        method: "POST",
        body: JSON.stringify(post_json),
        headers: {
            "Authorization": "TODO",
            "Content-Type": "application/json"
        }
    });

    if(response.status === 200 || response.status === 400){
        return {"status": response.status, "body": response.json()};
    }else{
        return {"status": response.status};
    }
}


export async function unauthenticatedPostRequest(path, post_json){
    const url = "http://" + serverAddress + path;
    let response = await fetch(url, {
        method: "POST",
        body:  JSON.stringify(post_json),
        headers: {
            "Content-Type": "application/json"
        }
    });
    if(response.status === 200 || response.status === 400){
        return {"status": response.status, "body": response.json()};
    }else{
        return {"status": response.status};
    }
}

export async function authenticatedGetRequest(path){
    const url = serverAddress + path;
    let response = await fetch(url, {
        method: "GET",
        headers: {
            "Authorization": "TODO",
        }
    });

    if(response.status === 200 || response.status === 400){
        return {"status": response.status, "body": response.json()};
    }else{
        return {"status": response.status};
    }
}

export async function apiLogin(user, password){
    let res = await unauthenticatedPostRequest("/login", {"user":user, "password":password});
    return res;
}

export async function apiRegisterUser(user, password, name, surname, email, birthdate, phone, country, province){
    let res = await unauthenticatedPostRequest("/register", {
        "user":user,
        "password":password,
        "name": name,
        "surname": surname,
        "email": email,
        "birthdate": birthdate,
        "phone": phone,
        "country": country,
        "province": province })
    return res;
}

export async function apiCreateFunction(name, description, jsonEncodedFunction){
    let res = await authenticatedPostRequest("/function", {
        "name":name,
        "description": description,
        "jsonEncodedFunction": jsonEncodedFunction})
    return res;
}

export async function apiCreateCombination(name, jsonEncodedCombination){
    let res = await authenticatedPostRequest("/combination", {
        "name":name,
        "jsonEncodedCombination": jsonEncodedCombination})
    return res;
}

export async function apiGetCombinations(name, jsonEncodedCombination){
    let res = await authenticatedGetRequest("/combinations")
    return res;
}

export async function apiGetFunctions(name, jsonEncodedCombination){
    let res = await authenticatedGetRequest("/functions")
    return res;
}

export function saveJWTinLocalStorage(token){
    window.sessionStorage.setItem("jwt_token", token);
}

export function getJWTfromLocalStorage(){
    return window.sessionStorage.getItem("jwt_token");
}

export function removeJWTfromLocalStorage(){
    return window.sessionStorage.removeItem("jwt_token");
}

export function isJWTstored(){
    if(window.sessionStorage.getItem("jwt_token")){
        return true;
    }else{
        return false;
    }
}