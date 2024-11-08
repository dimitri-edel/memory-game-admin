selected_item = null;

function showAddItemTable() {
    // If there is a selected item, unselect it
    if (selected_item !== null) {
        unselectItem(selected_item);
    }
    // Create a new row
    const items = document.getElementById("paginator-table");
    const row = document.createElement("tr");
    row.setAttribute("id", "add_item_row");
    row.innerHTML = `
        <td>
            <select id="category" name="category">
                ${renderCategoryOptions()}
            </select>
            <span id="category-validator" class="validator-message"></span>
        </td>
        <td>
            <input id="image" type="file" name="image" accept="image/*">
            <span id="image-validator" class="validator-message"></span>
        </td>
        <td>
            <span class="add-button" onclick="addItem()">
                <i class="fa-solid fa-check button-icon"></i>
            </span>
        </td>
        <td>
            <span class="cancel-button" onclick="hideAddItemTable()">
                <i class="fa-solid fa-xmark button-icon"></i>
            </span>
        </td>`;
    // Append the row to the table
    items.appendChild(row);
    // Hide the add button
    document.getElementById("add-button-container").style.display = "none";
}

function hideAddItemTable() {
    // Remove the row
    const row = document.getElementById("add_item_row");
    row.remove();
    // Show the add button
    document.getElementById("add-button-container").style.display = "block";
}

function renderCategoryOptions() {
    let options = "";
    for (const category of categories) {
        options += `<option value="${category.id}">${category.name}</option>`;
    }
    return options;
}

function addItem() {
    // Validate the category
    const category = document.getElementById("category");
    const image = document.getElementById("image").files[0];

     // If the form is not valid, do nothing
     if (!validateForm()) {
        return;
    }

    let faces_saved_in_the_database = apiController.addFace({category, image});
    let faces_loaded = apiController.getFaces();

    Promise.all([faces_saved_in_the_database, faces_loaded]).then(function(values) {
        paginator.lastPage();
    }).catch(function(error) {       
        console.log(error);
    });
   
    function validateForm() {
        clearValidators();
        if (image === undefined) {
            document.getElementById("image-validator").textContent = "Please select an image";
            return false;
        }
        return true;
    }

    function clearValidators() {
        document.getElementById("category-validator").textContent = "";
        document.getElementById("image-validator").textContent = "";
    }
}

function editItem(face_id){
    const item = apiController.faces.find(face => face.id == face_id);
    // If there is a selected item, unselect it
    if (selected_item !== null) {
        unselectItem(selected_item);
    }
     selected_item = item;
     selectItem(selected_item);
}

function selectItem(item) {
    const row = document.getElementById("row-" + item.id);
    row.innerHTML = `
        <td>
            <select id="category" name="category">
                ${renderCategoryOptions()}
            </select>
            <span id="category-validator" class="validator-message"></span>
        </td>
        <td>
            <input id="image" type="file" name="image" accept="image/*">
            <span id="image-validator" class="validator-message"></span>
        </td>
        <td>
            <span class="save-button" onclick="saveItem(${item.id})">
                <i class="fa-solid fa-check button-icon"></i>
            </span>
        </td>
        <td>
            <span class="cancel-button" onclick="cancelEdit(${item.id})">
                <i class="fa-solid fa-xmark button-icon"></i>
            </span>
        </td>`;
}

function unselectItem(item) {
    const row = document.getElementById("row-" + item.id);
    row.innerHTML = `
        <td>${item.category.name}</td>
        <td><img src="${item.image}" alt="${item.category.name}" class="face-image"></td>
        <td>
            <span class="edit-button" onclick="editItem(${item.id})">
                <i class="fa-solid fa-pencil button-icon"></i>
            </span>
        </td>
        <td>
            <span class="delete-button" onclick="deleteItem(${item.id})">
                <i class="fa-solid fa-trash button-icon"></i>
            </span>
        </td>`;
}