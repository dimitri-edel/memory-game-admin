let selected_item = null;

function showAddItemTable() {
    const listing_table = document.getElementById("paginator-table");
    // Create new tr element
    const row = document.createElement("tr");

    // Hide the container with the button for adding items
    document.getElementById("add-button-container").style.display = "none";
    row.innerHTML = `            
                <td><input type="text" id="add_name"><br><span id="add-name-validator"></span></td>
                <td><input type="text" id="add_description"><br><span id="add-description-validator"></span></td>
                <td><input type="file" id="add_image" accept="image/*"><br><span id="add-image-validator"></span></td> 
                <td><span class="add-button" onclick="addItem()"><i class="fa-solid fa-cloud-arrow-down button-icon"></i></span></td>
                <td><span class="cancel-button" onclick="hideAddItemTable()"><i class="fa-solid fa-xmark button-icon"></i></span></td>
            `;
    // Give the row the id "add_item_row"
    row.setAttribute("id", "add_item_row");
    // Append the row to the table as the last child
    listing_table.appendChild(row);

}

function addItem() {
    const name = document.getElementById("add_name").value;
    const description = document.getElementById("add_description").value;
    const image = document.getElementById("add_image").files[0];
    validateForm();

    let category_added = apiController.addCategory({ name, description, image });
    let categories_loaded = apiController.getCategories();
    Promise.all([category_added, categories_loaded]).then((data) => {
        paginator.lastPage();
    }).catch((error) => {
        console.log(error);
    });

    function validateForm() {
        clearValidators();
        if (name == "") {
            document.getElementById("add-name-validator").innerHTML = "Name is required";
            return false;
        }
        if (description == "") {
            document.getElementById("add-description-validator").innerHTML = "Description is required";
            return false;
        }
        if (image == null) {
            document.getElementById("add-image-validator").innerHTML = "Image is required";
            return false;
        }
        return true;
    }

    function clearValidators() {
        document.getElementById("add-name-validator").innerHTML = "";
        document.getElementById("add-description-validator").innerHTML = "";
        document.getElementById("add-image-validator").innerHTML = "";
    }
}

function deleteItem(id) {
    let page_number = paginator.current_page;
    let category_deleted = apiController.deleteCategory(id);
    category_deleted.then((data) => {        
        paginator.changePage(page_number);  
    }).catch((error) => {
        if(error.message.includes("401")) {
            alert("You are not authorized to delete this item!");
        }    
        console.log(error);
    });
}

function editItem(item) {
    let row = document.getElementById("row-" + item.id);
    // Parse the item if it is a JSON string
    if (typeof item === 'string') {
        item = JSON.parse(item);
    }    
    // Select the current item
    selected_item = item;

    row.innerHTML = `
    <td class="selected-row"><input type="text" id="edit_name" value="${item.name}"><br><span id="edit-name-validator"></span></td>
    <td class="selected-row"><input type="text" id="edit_description" value="${item.description}"><br><span id="edit-description-validator"></span></td>
    <td class="selected-row"><input type="file" id="edit_image" accept="image/*"><br><span id="edit-image-validator"></span></td>
    <td class="selected-row"><span class="update-button" onclick="updateItem(${item.id})"> <i class="fa-solid fa-check button-icon"></i></span></td>
    <td class="selected-row"><span class="cancel-button" onclick="cancelEdit()"><i class="fa-solid fa-xmark button-icon"></i></span></td>
    `;
}

function cancelEdit() {
    selected_item = null;
    paginator.changePage(paginator.current_page);
}

function updateItem(id) {
    const name = document.getElementById("edit_name").value;
    const description = document.getElementById("edit_description").value;
    const image = document.getElementById("edit_image").files[0];
    validateForm();

    let category_updated = apiController.updateCategory({ id, name, description, image });
    category_updated.then((data) => {
        selected_item = null;
        paginator.changePage(paginator.current_page);
    }).catch((error) => {
        alert(error.message);
        console.log(error);
    });
    
    function validateForm() {
        clearValidators();
        if (name == "") {
            document.getElementById("edit-name-validator").innerHTML = "Name is required";
            return false;
        }
        if (description == "") {
            document.getElementById("edit-description-validator").innerHTML = "Description is required";
            return false;
        }
        return true;
    }

    function clearValidators() {
        document.getElementById("edit-name-validator").innerHTML = "";
        document.getElementById("edit-description-validator").innerHTML = "";
    }
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

// function for rendering categorie options
function renderCategoryOptions() {
    let options = "";
    apiController.categories.forEach((category) => {
        options += `<option value="${category.id}">${category.name}</option>`;
    });
    return options;
}

/* EVENT LISTNERS FOR THE PAGINATOR */


function renderAddItemButton() {
    // Append the items to the table
    const items = document.getElementById("paginator-table");    

    const row_with_add_button = document.createElement("tr");
    row_with_add_button.innerHTML = ` 
            <td></td><td></td><td></td><td></td>
            <td>
                <!-- Button for adding items -->
                <span id="add-button-container">        
                    <span id="add-item-button" onclick="showAddItemTable()">
                        <i class="fa-solid fa-square-plus add-button-icon"></i>
                    </span>
                </span>
            </td>`;
    // Append the row with the add button to the table
    items.appendChild(row_with_add_button);
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

function renderItems({ first_index, last_index, ceiling }) {
    // Append the items to the table
    const items = document.getElementById("paginator-table");
    items.innerHTML = "";

    for (var i = first_index; i < last_index && i < ceiling; i++) {
        const item = apiController.categories[i];
        console.log(`item: ${item} index: ${i}`);
        const row = document.createElement("tr");
        row.setAttribute("id", "row-" + item.id);
        row.innerHTML = `            
            <td>${item.name}</td>
            <td>${item.description}</td>
            <td><img src="${base_url}${item.image}" alt="${item.name}" width="100"></td> 
            <td><span class="edit-button" onclick='editItem(${JSON.stringify(item)})'><i class="fa-solid fa-pen-to-square button-icon"></i></span></td>
            <td><span class="delete-button" onclick="deleteItem(${item.id})"><i class="fa-solid fa-trash-can button-icon"></i></span></td>               
        `;
        items.appendChild(row);
    }
    // Append the add item button to the table
    renderAddItemButton();
}

// Add event listeners for the paginator
paginator.addEventListener("on-change", renderItems);
paginator.addEventListener("on-change", hideAddItemTable);
paginator.addEventListener("on-change", (selected_item) => { selected_item = null; });

let categories_loaded = apiController.getCategories();
categories_loaded.then((data) => {
    paginator.changePage(1);
}).catch((error) => {
    console.log(error);
});