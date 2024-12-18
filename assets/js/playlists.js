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
                <td class="selected-row"><select id="update_category">${renderCategoryOptions(item.category)}</select></td>
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
                <td class="selected-row"><input id="update_title" type="text" value="${item.title}"><br><span id="update-title-validator" class="validator-message"></span></td>
                <td class="selected-row"><input  id="update_description" type="text" value="${item.description}"><br><span id="update-description-validator" class="validator-message"></span></td>
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
                <td class="selected-row"><span class="update-button" onclick="updateItem(${item.id})"><i class="fa-solid fa-check button-icon"></i></span></td>
                <td class="selected-row"><span class="cancel-button" onclick="cancelEdit()"><i class="fa-solid fa-xmark button-icon"></i></span></td>
            `;
}

function cancelEdit() {
    // unselectItem(selected_item);
    selected_item = null;
    paginator.changePage(paginator.current_page);
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
                <td>${apiController.getCategoryName(item.category)}</td>
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
    const audio_select = row.querySelector("#update_audio");
    // If audio is not selected, the apiController will not update the audio file
    let audio = null;
    const title = row.querySelector("#update_title").value;
    const description = row.querySelector("#update_description").value;
    const image_select = row.querySelector("#update_image");
    // If image is not selected, the apiController will not update the image file
    let image = null;
    // If the form is not valid, do nothing
    if (!validateForm()) {
        return;
    }
    // Check if a new audio file has been selected
    if (audio_select.files.length > 0) {
        audio = audio_select.files[0];
    }

    // Check if a new image file has been selected
    if (image_select.files.length > 0) {
        image = image_select.files[0];
    }
    // Create a promise to update the playlist
    let promise = apiController.updatePlayist({ id, category, audio, title, description, image });
    promise.then((data) => {
        // Update secelted_item with the new values
        selected_item.category = data.category;
        selected_item.audio = data.audio;
        selected_item.title = data.title;
        selected_item.description = data.description;
        selected_item.image = data.image;
        // If the response is successful, unselect the item
        unselectItem(selected_item);
    }).catch((error) => {
        console.log(error);

    });

    function clearEditFormValidators() {
        document.getElementById("update-title-validator").innerHTML = "";
        document.getElementById("update-description-validator").innerHTML = "";
    }

    function validateForm() {
        // Clear the validators
        clearEditFormValidators();

        const title = document.getElementById("update_title").value;
        const description = document.getElementById("update_description").value;

        // Title may not exceed 30 characters and may not be empty
        if (title.length > 30 || title === "") {
            document.getElementById("update-title-validator").innerHTML = "Title may not exceed 30 characters and may not be empty";
            return false;
        }
        // Description may not exceed 50 characters and may not be empty
        if (description.length > 50 || description === "") {
            document.getElementById("update-description-validator").innerHTML = "Description may not exceed 50 characters and may not be empty";
            return false;
        }

        return true;
    }
}

async function deleteItem(id) {
    let promise = apiController.deletePlaylist(id);
    promise.then((data) => {
        // Remove the item from the table
        const row = document.getElementById("row-" + id);
        row.remove();
    }).catch((error) => {
        console.log(error);
    });
}

// function for rendering category options
function renderCategoryOptions(selectedCategoryId) {
    let options = "";
    apiController.categories.forEach((category) => {
        const selected = category.id === selectedCategoryId ? 'selected' : '';
        options += `<option value="${category.id}" ${selected}>${category.name}</option>`;
    });
    return options;
}

// function for appending the elements for adding an item to the table with id="add_item_table"
function showAddItemTable() {
    const listing_table = document.getElementById("paginator-table");
    // Create new tr element
    const row = document.createElement("tr");

    // Hide the container with the button for adding items
    document.getElementById("add-button-container").style.display = "none";
    let html_headers = `<th>category</th>
        <th>audio</th>
        <th>title</th>
        <th>description</th>
        <th>image</th>
        <th></th>
        <th></th>
        <th></th>       
        <tr>
         </tr>
        `;

    // Set the innerHTML of the row
    row.innerHTML = ` 
            <td><select id="add_category">${renderCategoryOptions()}</seclect></td>
            <td><input type="file" id="add_audio" accept="audio/*"><br><span id="add-audio-validator" class="validator-message"></span></td>
            <td><input type="text" id="add_title"><br><span id="add-title-validator" class="validator-message"></span></td>
            <td><input type="text" id="add_description"><br><span id="add-description-validator" class="validator-message"></span></td>
            <td><input type="file" id="add_image" accept="image/*"><br><span id="add-image-validator" class="validator-message"></span></td>            
            <td><span class="add-button" onclick="addItem()"><i class="fa-solid fa-cloud-arrow-down button-icon"></i></span></td>
            <td><span class="cancel-button" onclick="hideAddItemTable()"><i class="fa-solid fa-xmark button-icon"></i></span></td>       
    `;
    // Give the row the id "add_item_row"
    row.setAttribute("id", "add_item_row");
    // Append the row to the table as the last child
    listing_table.appendChild(row);

}

async function addItem() {
    const category = document.getElementById("add_category").value;
    const audio = document.getElementById("add_audio").files[0];
    const title = document.getElementById("add_title").value;
    const description = document.getElementById("add_description").value;
    const image = document.getElementById("add_image").files[0];

    // If the form is not valid, do nothing
    if (!validateForm()) {
        return;
    }

    let playlist_added = apiController.addPlaylist({ category, audio, title, description, image });
    let playlists_loaded = apiController.getPlaylists();
    Promise.all([playlist_added, playlists_loaded]).then((values) => {
        paginator.lastPage();
    }).catch((error) => {
        console.log(error);
    });
    
    // function for validating the form before adding an item
    function validateForm() {
        // Clear the validators
        clearValidators();
        // Get the values of the form elements that need to be validated
        const audio = document.getElementById("add_audio").files[0];
        const title = document.getElementById("add_title").value;
        const description = document.getElementById("add_description").value;
        const image = document.getElementById("add_image").files[0];

        // An audio file must be selected
        if (audio === null || audio === undefined) {
            document.getElementById("add-audio-validator").innerHTML = "An audio file must be selected";
            return false;
        }
        // Title may not exceed 30 characters and may not be empty
        if (title.length > 30 || title === "") {
            document.getElementById("add-title-validator").innerHTML = "Title may not exceed 30 characters and may not be empty";
            return false;
        }
        // Description may not exceed 50 characters and may not be empty
        if (description.length > 50 || description === "") {
            document.getElementById("add-description-validator").innerHTML = "Description may not exceed 50 characters and may not be empty";
            return false;
        }
        // An image file must be selected
        if (image === null || image === undefined) {
            document.getElementById("add-image-validator").innerHTML = "An image file must be selected";
            return false;
        }
        return true;
    }

    // Function for clearing the validator messages
    function clearValidators() {
        document.getElementById("add-audio-validator").innerHTML = "";
        document.getElementById("add-title-validator").innerHTML = "";
        document.getElementById("add-description-validator").innerHTML = "";
        document.getElementById("add-image-validator").innerHTML = "";
    }
}
play_audio = (audio) => {
    console.log(audio);
    const audioElement = new Audio(audio);
    audioElement.play();
}

async function getPlaylists() {
    let filter = encodeURIComponent(document.getElementById("filter-field").value);
    if (filter === "" || filter === null) {
        filter = "none";
    }
    let promise = apiController.getPlaylists(filter);
    promise.then((data) => {
        paginator.changePage(1);
    }).catch((error) => {
        console.log("Error loading playlists: ");
        console.log(error);
    });
}


/* EVENT LISTINERS FOR THE PAGINATOR */

function renderAddItemButton() {
    // Append the items to the table
    const items = document.getElementById("paginator-table");


    const row_with_add_button = document.createElement("tr");
    row_with_add_button.innerHTML = ` 
                <td></td><td></td><td></td><td></td><td></td><td></td>
                <td>
                    <!-- Button for adding items -->
                    <span id="add-button-container">        
                        <span id="add-item-button" onclick="showAddItemTable()">
                            <i class="fa-solid fa-square-plus add-button-icon"></i>
                        </span>
                    </span>
                </td>`;
    // Append the row with the add button to the table as its last child
    items.appendChild(row_with_add_button);
}

function renderItems({ first_index, last_index, ceiling }) {
    // Append the items to the table
    const items = document.getElementById("paginator-table");
    items.innerHTML = "";

    for (i = first_index; i < last_index && i < ceiling; i++) {
        const item = apiController.playlists[i];
        console.log(`item: ${item} index: ${i}`);
        const row = document.createElement("tr");
        row.setAttribute("id", "row-" + item.id);
        const audio_file = base_url + item.audio;
        row.innerHTML = `            
            <td>${apiController.getCategoryName(item.category)}</td>
            <td><button onclick="play_audio('${audio_file}')"> Play</button></td>
            <td>${item.title}</td>
            <td>${item.description}</td>
            <td><img src="${base_url}${item.image}" alt="${item.title}" width="100"></td>
            <td><span class="edit-button" onclick='editItem(${JSON.stringify(item)})'><i class="fa-solid fa-pen-to-square button-icon"></i></span></td>
            <td><span class="delete-button" onclick="deleteItem(${item.id})"><i class="fa-solid fa-trash-can button-icon"></i></span></td>
        `;
        items.appendChild(row);
    }
    // Append the add item button to the table
    renderAddItemButton();
}

// function for hiding the table with id="add_item_table"
function hideAddItemTable() {
    const listing_table = document.getElementById("paginator-table");
    // Remove the row with the id "add_item_row"
    try { listing_table.removeChild(document.getElementById("add_item_row")); }
    catch (e) {
        return;
    }

    // Show the container with the button for adding items
    document.getElementById("add-button-container").style.display = "inline";
}

paginator.addEventListener("on-change", hideAddItemTable);
paginator.addEventListener("on-change", renderItems);
paginator.addEventListener("on-change", (selected_item) => { selected_item = null; });

let categories_promise = apiController.getCategories();
let playlist_promise = apiController.getPlaylists();

Promise.all([categories_promise, playlist_promise]).then((values) => {
    paginator.firstPage();
}).catch((error) => {
    console.log("Error loading playlists: ");
    console.log(error);
});