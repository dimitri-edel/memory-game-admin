// The resultsJSON variable is used in pagination.js
var resultsJSON = [];


async function updateItem() {
    const id = document.getElementById("update_id").value;
    const category = document.getElementById("update_category").value;
    const audio = document.getElementById("update_audio").files[0];
    const title = document.getElementById("update_title").value;
    const description = document.getElementById("update_description").value;
    const image = document.getElementById("update_image").files[0];

    const formData = new FormData();
    formData.append("category", category);
    formData.append("audio", audio);
    formData.append("title", title);
    formData.append("description", description);
    formData.append("image", image);

    const token1 = getCookie("token1");
    const token2 = getCookie("token2");

    const request = new Request(`${base_url}/playlist/update-item/${id}/`, {
        method: "PUT",
        body: formData,
        headers: new Headers({
            "token1": token1,
            "token2": token2
        })
    });

    fetch(request)
        .then((response) => {
            console.log(response);
            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }
            return response.json();
        })
        .then((data) => {
            console.log(data);
        })
        .catch((error) => {
            console.log(error);
        });

    function getCookie(name) {
        const value = `; ${document.cookie}`;
        const parts = value.split(`; ${name}=`);
        if (parts.length === 2) return parts.pop().split(";").shift();
    }
}

async function deleteCategory() {
    const category = document.getElementById("delete_category").value;
    const token1 = getCookie("token1");
    const token2 = getCookie("token2");

    const request = new Request(`${base_url}/playlist/delete-category/${category}/`, {
        method: "DELETE",
        headers: new Headers({
            "Content-Type": "application/json",
            "token1": token1,
            "token2": token2
        })
    });

    fetch(request)
        .then((response) => {
            console.log(response);
            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }
            return response.json();
        })
        .then((data) => {
            console.log(data);
        })
        .catch((error) => {
            console.log(error);
        });

    function getCookie(name) {
        const value = `; ${document.cookie}`;
        const parts = value.split(`; ${name}=`);
        if (parts.length === 2) return parts.pop().split(";").shift();
    }
}

async function deleteItem() {
    const id = document.getElementById("delete_id").value;
    const token1 = getCookie("token1");
    const token2 = getCookie("token2");
    
    const request = new Request(`${base_url}/playlist/delete-item/${id}/`, {
        method: "DELETE",
        headers: new Headers({
            "Content-Type": "application/json",
            "token1": token1,
            "token2": token2
        })
    });

    fetch(request)
        .then((response) => {
            console.log(response);
            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }
            return response.json();
        })
        .then((data) => {
            console.log(data);
        })
        .catch((error) => {
            console.log(error);
        });

    function getCookie(name) {
        const value = `; ${document.cookie}`;
        const parts = value.split(`; ${name}=`);
        if (parts.length === 2) return parts.pop().split(";").shift();
    }
}

async function addItem() {
    const category = document.getElementById("add_category").value;
    const audio = document.getElementById("audio").files[0];
    const title = document.getElementById("title").value;
    const description = document.getElementById("description").value;
    const image = document.getElementById("image").files[0];

    const formData = new FormData();
    console.log("category", category);
    formData.append("category", category);
    formData.append("audio", audio);
    formData.append("title", title);
    formData.append("description", description);
    formData.append("image", image);

    const token1 = getCookie("token1");
    const token2 = getCookie("token2");

    const request = new Request(`${base_url}/playlist/post/`, {
        method: "POST",
        body: formData,
        headers: new Headers({
            "token1": token1,
            "token2": token2
        })
    });

    fetch(request)
        .then((response) => {
            console.log(response);
            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }
            return response.json();
        })
        .then((data) => {
            console.log(data);
        })
        .catch((error) => {
            console.log(error);
        });

    function getCookie(name) {
        const value = `; ${document.cookie}`;
        const parts = value.split(`; ${name}=`);
        if (parts.length === 2) return parts.pop().split(";").shift();
    }
}
play_audio = (audio) => {
    console.log(audio);
    const audioElement = new Audio(audio);
    audioElement.play();
}

async function showItems() {
    const category = encodeURIComponent(document.getElementById("category").value);
    const request = new Request(`${base_url}/playlist/get/${category}/${api_key}`, {
        method: "GET",
        headers: {
            "Content-Type": "application/json",
        }
    });

    fetch(request)
        .then((response) => {
            console.log(response);
            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }
            return response.json();
        })
        .then((data) => {            
            data.forEach((item) => {
                // add every item to reulstsJSON
                resultsJSON.push(item);                
            });
            // If the resultsJSON is not empty, show the first page
            if (resultsJSON.length > 0) {
                // This function is in pagination.js
                changePage(1);
            }
        })
        .catch((error) => {
            console.log(error);
        });       
}

 // Function that clicks on a hidden input file element and sets its visibility back to relative
 function input_file_click(id){
    document.getElementById(id).click();
    document.getElementById(id).style = "display: relative";
}