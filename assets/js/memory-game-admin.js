// The resultsJSON variable is used in pagination.js
var resultsJSON = [];
// The selected_itme variable signifies the item that is currently selected
var selected_item = null;
// The boolean variables is_image_selected and is_audio_selected are used to check if an image or audio file has been selected
var is_image_selected = false;
var is_audio_selected = false;

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
                        <button onclick="cancelSelection('audio-select', 'intial_audio_filename')"><i class="fa-regular fa-rectangle-xmark button-icon"></i></button>                        
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
                        <input type="file" id="update_image" accept="image/*" onchange="showSelectedImage(this, 'image-select')">
                        <button onclick="cancelSelection('image-select', 'intial_image_section')"><i class="fa-regular fa-rectangle-xmark button-icon"></i></button>
                    </span>
                    <!-- Element to display the initial file name -->
                    <span id="intial_image_section" class="image-update">                        
                        <img src="${base_url}${item.image}" alt="${item.title}" width="100">
                        <button value="Change" onclick="hideInitialFilename('intial_image_section', 'image-select')">Change</button>
                    </span>
                </td>                
                <td class="selected-row"><span class="update-button" onclick="updateItem(${item.id})"><i class="fa-solid fa-cloud-arrow-up button-icon"></i></span></td>
                <td class="selected-row"><span class="delete-button" onclick="deleteItem(${item.id})"><i class="fa-solid fa-trash-can button-icon"></i></span></td>
            `;
}

// Function to show the selected image
function showSelectedImage(input, select_section_id) {
    const file = input.files[0];
    const reader = new FileReader();
    reader.onload = function (e) {
        const image = document.createElement("img");
        image.src = e.target.result;
        image.width = 100;
        // If an image has been selected, remove the initial image from the select_section_id in the DOM
        if (is_image_selected) {
            document.getElementById(select_section_id).removeChild(document.getElementById(select_section_id).firstChild);
        }
        // Append the image as the first child of the select_section_id
        document.getElementById(select_section_id).insertBefore(image, document.getElementById(select_section_id).firstChild);
        is_image_selected = true;
    }
    reader.readAsDataURL(file);
}

function unselectItem(item) {
    let row = document.getElementById("row-" + item.id);
    // Unselect files regardless of whether they are selected
    is_image_selected = false;
    is_audio_selected = false;

    row.innerHTML = `
                <td>${item.id}</td>
                <td>${item.category}</td>
                <td><button onclick="play_audio('${base_url}${item.audio}')"> Play</button></td>
                <td>${item.title}</td>
                <td>${item.description}</td>
                <td><img src="${base_url}${item.image}" alt="${item.title}" width="100"></td>
                <td><span class="edit-button" onclick='editItem(${JSON.stringify(item)})'><i class="fa-solid fa-pen-to-square button-icon"></i></span></td>
                <td><span class="delete-button" onclick="deleteItem(${item.id})"><i class="fa-solid fa-trash-can button-icon"></i></span></td>
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
// function for appending the elements for adding an item to the table with id="add_item_table"
function showAddItemTable() {
    const add_item_table = document.getElementById("add_item_table");
    // Hide the container with the button for adding items
    document.getElementById("add-button-container").style.display = "none";

    add_item_table.innerHTML = `
        <th>category</th>
        <th>audio</th>
        <th>title</th>
        <th>description</th>
        <th>image</th>
        <th></th>
        <th></th>
        <tr>
            <td><input type="text" id="add_category" required></td>
            <td><input type="file" id="add_audio" accept="audio/*" required></td>
            <td><input type="text" id="add_title" required></td>
            <td><input type="text" id="add_description" required></td>
            <td><input type="file" id="add_image" accept="image/*" required></td>
            <td><span class="add-button" onclick="addItem()"><i class="fa-solid fa-cloud-arrow-down button-icon"></i></span></td>
            <td><span class="cancel-button" onclick="hideAddItemTable()"><i class="fa-solid fa-xmark button-icon"></i></span></td>
        </tr>
    `;
}
// function for hiding the table with id="add_item_table"
function hideAddItemTable() {
    const add_item_table = document.getElementById("add_item_table");
    add_item_table.innerHTML = "";
    // Show the container with the button for adding items
    document.getElementById("add-button-container").style.display = "flex";
}

async function addItem() {
    const category = document.getElementById("add_category").value;
    const audio = document.getElementById("add_audio").files[0];
    const title = document.getElementById("add_title").value;
    const description = document.getElementById("add_description").value;
    const image = document.getElementById("add_image").files[0];

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
            // Add the new item to the resultsJSON
            resultsJSON.push(data);
            // Add the new item to the table
            const items = document.getElementById("listing-items");
            const row = document.createElement("tr");
            row.setAttribute("id", "row-" + data.id);
            const audio_file = base_url + data.audio;
            row.innerHTML = `
                <td>${data.id}</td>
                <td>${data.category}</td>
                <td><button onclick="play_audio('${audio_file}')"> Play</button></td>
                <td>${data.title}</td>
                <td>${data.description}</td>
                <td><img src="${base_url}${data.image}" alt="${data.title}" width="100"></td>
                <td><span class="edit-button" onclick='editItem(${JSON.stringify(data)})'><i class="fa-solid fa-pen-to-square button-icon"></i></span></td>
                <td><span class="delete-button" onclick="deleteItem(${data.id})"><i class="fa-solid fa-trash-can button-icon"></i></span></td>
            `;
            items.appendChild(row);
            // Hide the add item table
            hideAddItemTable();
            // Go to the last page
            changePage(numPages());
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