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
    const listing_table = document.getElementById("paginator-table");
    // Remove the row with the id "add_item_row"
    try { listing_table.removeChild(document.getElementById("add_item_row")); }
    catch (e) {
        return;
    }
    // Show the add button
    document.getElementById("add-button-container").style.display = "block";
}

// function renderCategoryOptions() {
//     let options = "";
//     apiController.categories.forEach(category => {
//         options += `<option value="${category.id}">${category.name}</option>`;
//     });

//     return options;
// }


// function for rendering category options
function renderCategoryOptions(selectedCategoryId) {
    let options = "";
    apiController.categories.forEach((category) => {
        const selected = category.id === selectedCategoryId ? 'selected' : '';
        options += `<option value="${category.id}" ${selected}>${category.name}</option>`;
    });
    return options;
}

function addItem() {
    // Validate the category
    const category = document.getElementById("category").value;
    const image = document.getElementById("image").files[0];

    // If the form is not valid, do nothing
    if (!validateForm()) {
        return;
    }

    let faces_saved_in_the_database = apiController.addFace({ category, image });
    let faces_loaded = apiController.getFaces();

    Promise.all([faces_saved_in_the_database, faces_loaded]).then(function (values) {
        paginator.lastPage();
    }).catch(function (error) {
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

function editItem(face_id) {
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
                ${renderCategoryOptions(item.category)}
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
        <td>${apiController.getCategoryName(item.category)}</td>
        <td><img src="${base_url+item.image}" alt="${apiController.getCategoryName(item.category)}" class="face-image"></td>
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

function cancelEdit(face_id) {
    const item = apiController.faces.find(face => face.id == face_id);
    unselectItem(item);
}

function updateItem(face_id) {
    // Validate the category
    const category = document.getElementById("category");
    const image = document.getElementById("image").files[0];

    // If the form is not valid, do nothing
    if (!validateForm()) {
        return;
    }

    let faces_saved_in_the_database = apiController.updateFace({ category, image });
    let faces_loaded = apiController.getFaces();

    Promise.all([faces_saved_in_the_database, faces_loaded]).then(function (values) {
        paginator.lastPage();
    }).catch(function (error) {
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

function deleteItem(face_id) {
    let faces_deleted = apiController.deleteFace(face_id);
    let faces_loaded = apiController.getFaces();

    Promise.all([faces_deleted, faces_loaded]).then(function (values) {
        paginator.lastPage();
    }).catch(function (error) {
        console.log(error);
    });
}

function renderItems({ first_index, last_index, ceiling }) {
    let items_loaded = apiController.getFaces();
    items_loaded.then((data) => {
        const itmes = document.getElementById("paginator-table");
        itmes.innerHTML = "";
        for (var i = first_index; i < last_index && i < ceiling; i++) {
            const item = data[i];
            console.log("the item is: ", item);
            const row = document.createElement("tr");
            row.setAttribute("id", "row-" + item.id);
            row.innerHTML = `
                <td>${apiController.getCategoryName(item.category)}</td>
                <td><img src="${base_url}${item.image}" alt="${item.category}" class="face-image"></td>
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
            itmes.appendChild(row);
        }
        renderAddItemButton();
    }).catch(function (error) {
        console.log(error);
    });
}

function renderAddItemButton() {
    const items = document.getElementById("paginator-table");
    const row = document.createElement("tr");
    row.setAttribute("id", "add-button-container");

    row.innerHTML = `
        <td></td><td></td><td></td>
        <td>
            <span class="add-button" onclick="showAddItemTable()">
                <i class="fa-solid fa-plus button-icon"></i>
            </span>
        </td>`;
    items.appendChild(row);
}


paginator.addEventListener("on-change", renderItems);
paginator.addEventListener("on-change", hideAddItemTable);
paginator.addEventListener("on-change", (selected_item) => { selected_item = null; });

let categories_loaded = apiController.getCategories();
let faces_loaded = apiController.getFaces();

Promise.all([categories_loaded, faces_loaded]).then(function (values) {
    console.log("faces loaded: ", apiController.faces);
    paginator.firstPage();
}).catch(function (error) {
    console.log(error);
});