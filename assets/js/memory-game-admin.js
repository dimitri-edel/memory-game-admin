// The resultsJSON variable is used in pagination.js
var resultsJSON = [];
var selected_item = null;

function editItem(item) {
    let row = document.getElementById("row-" + item.id);
    // Parse the item if it is a JSON string
    if (typeof item === 'string') {
        item = JSON.parse(item);    
    }
    // If there is a selected item, unselect it
    if (selected_item !== null) {
        unselectItem(selected_item);
    }
    // Select the current item
    selected_item = item;


    row.innerHTML = `
                <td id="update_id" class="selected-row">${item.id}</td>
                <td class="selected-row"><input  id="update_category" type="text" value="${item.category}" required></td>
                <td class="selected-row">
                    <span id="audio-select" style="display:none" class="audio-update">
                        <label for="audio">Audio:</label>
                        <input type="file" id="update_audio" accept="audio/*" onchange="hideInitialFilename('initial_audio_filename')">
                        <button onclick="cancelSelection('audio-select', 'intial_audio_filename')"><i class="fa-regular fa-rectangle-xmark"></i></button>                        
                    </span>
                    <!-- Element to display the initial file name -->
                    <span id="intial_audio_filename">                        
                        <button value="Play" onclick="play_audio('${base_url}${item.audio}')">Play</button>
                        <button value="Change" onclick="hideInitialFilename('intial_audio_filename', 'audio-select')">Change</button>
                    </span>
                </td>                
                <td class="selected-row"><input id="update_title" type="text" value="${item.title}" required></td>
                <td class="selected-row"><input  id="update_description" type="text" value="${item.description}" required></td>
                <td class="selected-row">
                    <span id="image-select"  style="display:none" class="image-update">
                        <label for="image">Image:</label>
                        <input type="file" id="update_image" accept="image/*">
                        <button onclick="cancelSelection('image-select', 'intial_image_section')"><i class="fa-regular fa-rectangle-xmark"></i></button>
                    </span>
                    <!-- Element to display the initial file name -->
                    <span id="intial_image_section" class="image-update">                        
                        <img src="${base_url}${item.image}" alt="${item.title}" width="100">
                        <button value="Change" onclick="hideInitialFilename('intial_image_section', 'image-select')">Change</button>
                    </span>
                </td>                
                <td class="selected-row"><span class="update-button" onclick="updateItem(${item.id})"><i class="fa-solid fa-cloud-arrow-up"></i></span></td>
                <td class="selected-row"><span class="delete-button" onclick="deleteItem(${item.id})"><i class="fa-solid fa-trash-can"></i></span></td>
            `;
}

function unselectItem(item) {
    let row = document.getElementById("row-" + item.id);
    row.innerHTML = `
                <td>${item.id}</td>
                <td>${item.category}</td>
                <td><button onclick="play_audio('${base_url}${item.audio}')"> Play</button></td>
                <td>${item.title}</td>
                <td>${item.description}</td>
                <td><img src="${base_url}${item.image}" alt="${item.title}" width="100"></td>
                <td><span class="edit-button" onclick='editItem(${JSON.stringify(item)})'><i class="fa-solid fa-pen-to-square"></i></span></td>
                <td><span class="delete-button" onclick="deleteItem(${item.id})"><i class="fa-solid fa-trash-can"></i></span></td>
            `;
}

function cancelSelection(select_section_id, intial_section_id) {
    document.getElementById(select_section_id).style.display = "none";
    document.getElementById(intial_section_id).style.display = "flex";
}

function hideInitialFilename(intial_section_id, select_section_id) {
    document.getElementById(intial_section_id).style.display = "none";
    document.getElementById(select_section_id).style.display = "flex";
}

async function updateItem(id) {  
    // Get the row of the selected item  
    const row = document.getElementById("row-" + id);
    // Get the values of the selected item
    const category = row.querySelector("#update_category").value;
    const audio = row.querySelector("#update_audio");
    const title = row.querySelector("#update_title").value;
    const description = row.querySelector("#update_description").value;
    const image = row.querySelector("#update_image");
    console.log(`updating category: ${category}`);
    // Create a FormData object
    const formData = new FormData();
    // Add the values to the FormData object
    formData.append("category", category);
    // Check if a new audio file has been selected
    if (audio.files.length > 0) {
        formData.append("audio", audio.files[0]);
    }
    formData.append("title", title);
    formData.append("description", description);
    // Check if a new image file has been selected
    if (image.files.length > 0) {
        formData.append("image", image.files[0]);
    }
    // Get the tokens from the cookies
    const token1 = getCookie("token1");
    const token2 = getCookie("token2");
    // Create a request object
    const request = new Request(`${base_url}/playlist/update-item/${id}/`, {
        method: "PUT",
        body: formData,
        headers: new Headers({
            "token1": token1,
            "token2": token2
        })
    });
    // Fetch the request
    fetch(request)
        .then((response) => {
            console.log(response);
            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }
            return response.json();
        })
        .then((data) => {
            // Update secelted_item with the new values
            selected_item.category = data.category;
            selected_item.audio = data.audio;
            selected_item.title = data.title;
            selected_item.description = data.description;
            selected_item.image = data.image;            
            // If the response is successful, unselect the item
            unselectItem(selected_item);
            // Update the resultsJSON
            resultsJSON = resultsJSON.map(item => {
                if (item.id === id) {
                    item.category = data.category;
                    item.audio = data.audio;
                    item.title = data.title;
                    item.description = data.description;
                    item.image = data.image;                    
                }
                return item;
            });
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

async function deleteItem(id) {    
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
            return;
        })
        .then(() => {            
            // Remove the item from the resultsJSON
            resultsJSON = resultsJSON.filter(item => item.id !== id);
            // Remove the item from the table
            const row = document.getElementById("row-" + id);
            row.remove();
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
            // if resultsJSON is not empty, clear it
            if (resultsJSON.length > 0) {
                resultsJSON = [];
            }
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
function input_file_click(id) {
    document.getElementById(id).click();
    document.getElementById(id).style = "display: relative";
}