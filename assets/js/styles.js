let selected_item = null;

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
        <td><input type="color" id="primary-color" name="primary-color"><span id="primary-color-validator" class="validator-message"></span></td>
        <td><input type="color" id="secondary-color" name="secondary-color"><span id="secondary-color-validator" class="validator-message"></span></td>
        <td><input type="color" id="complementary-color" name="complementary-color"><span id="complementary-color-validator" class="validator-message"></span></td>
        <td><input type="file" id="background-image" name="background-image" accept="image/*"><span id="background-image-validator" class="validator-message"></span></td>
        <td><span class="add-button" onclick="addItem()">
            <i class="fa-solid fa-check button-icon"></i>
        </span></td>
        <td><span class="cancel-button" onclick="hideAddItemTable()">
            <i class="fa-solid fa-xmark button-icon"></i>
        </span></td>        
    `;
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
    document.getElementById("add-button-container").style.display = "block";
}

function addItem() {
    const category = document.getElementById("category").value;
    const primary_color = document.getElementById("primary-color").value;
    const secondary_color = document.getElementById("secondary-color").value;
    const complementary_color = document.getElementById("complementary-color").value;
    const background_image = document.getElementById("background-image").files[0];
    // If the form is not valid, do nothing
    if (!validateForm()) {
        return;
    }
    let style_saved_in_database = apiController.addStyle({ category, primary_color, secondary_color, complementary_color, background_image });
    let styles_loaded = apiController.getStyles();
    Promise.all([style_saved_in_database, styles_loaded]).then((values) => {
        paginator.lastPage();
    }).catch((error) => {
        if (error === "HTTP error! status: 409") {
            document.getElementById("category-validator").innerHTML = "A Style for this Category alredy exists! Please choose another Category!";
        }
        console.log(error);
    });

    function validateForm() {
        clearValidators();
        if (background_image === undefined) {
            document.getElementById("background-image-validator").innerHTML = "Background Image is required";
            return false;
        }
        return true;
    }

    function clearValidators() {
        document.getElementById("background-image-validator").innerHTML = "";
    }
}

function editItem(style_id) {
   const item = apiController.styles.find((style) => style.id === style_id);
    // If there is a selected item, unselect it
    if (selected_item !== null) {
        unselectItem(selected_item);
    }
    // Select the item
    selected_item = item;
    selectItem(item);
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
        <td><input type="color" id="primary-color" name="primary-color" value="${item.primary_color}"><span id="primary-color-validator" class="validator-message"></span></td>
        <td><input type="color" id="secondary-color" name="secondary-color" value="${item.secondary_color}"><span id="secondary-color-validator" class="validator-message"></span></td>
        <td><input type="color" id="complementary-color" name="complementary-color" value="${item.complementary_color}"><span id="complementary-color-validator" class="validator-message"></span></td>
        <td><input type="file" id="background-image" name="background-image" accept="image/*"><span id="background-image-validator" class="validator-message"></span></td>
        <td><span class="update-button" onclick="updateItem(${item.id})">
            <i class="fa-solid fa-check button-icon"></i>
        </span></td>
        <td><span class="cancel-button" onclick="cancelEditItem(${item.id})">
            <i class="fa-solid fa-xmark button-icon"></i>
        </span></td>
    `;
}

function unselectItem(item) {
    const row = document.getElementById("row-" + item.id);
    row.innerHTML = `
        <td>${item.category}</td>
        <td>${item.primary_color}</td>
        <td>${item.secondary_color}</td>
        <td>${item.complementary_color}</td>
        <td><img src="${item.background_image}" width="50px" height="50px"></td>
        <td><span class="edit-button" onclick="editItem(${item.id})">
            <i class="fa-solid fa-pen button-icon"></i>
        </span></td>
        <td><span class="delete-button" onclick="deleteItem(${item.id})">
            <i class="fa-solid fa-trash button-icon"></i>
        </span></td>
    `;
}

function cancelEditItem(id) {
    selected_item = null;
    paginator.changePage(paginator.current_page);
}

function renderCategoryOptions() {
    let options = "";
    apiController.categories.forEach((category) => {
        options += `<option value="${category.id}">${category.name}</option>`;
    });
    return options;
}

function updateItem(style_id) {
    const category = document.getElementById("category").value;
    const primary_color = document.getElementById("primary-color").value;
    const secondary_color = document.getElementById("secondary-color").value;
    const complementary_color = document.getElementById("complementary-color").value;
    const background_image = document.getElementById("background-image").files[0];
    // If the form is not valid, do nothing
    if (!validateForm()) {
        return;
    }
    let style_updated = apiController.updateStyle({ id: style_id, category, primary_color, secondary_color, complementary_color, background_image });
    style_updated.then((data) => {
        selected_item = null;
        paginator.changePage(paginator.current_page);
    }).catch((error) => {
        alert(error.message);
        console.log(error);
    });

    function validateForm() {
        clearValidators();
        if (background_image === undefined) {
            document.getElementById("background-image-validator").innerHTML = "Background Image is required";
            return false;
        }
        return true;
    }

    function clearValidators() {
        document.getElementById("background-image-validator").innerHTML = "";
    }
}

function deleteItem(id) {
    let promise = apiController.deleteStyle(id);
    promise.then((data) => {
        // Remove the item from the table
        const row = document.getElementById("row-" + id);
        row.remove();
    }).catch((error) => {
        console.log(error);
        // If errror message contains 401, then the user is not authenticated and should be redirected to the login page
        if (error.message.includes("401")) {
            window.location.href = "login.html";
        }
    });
}

function renderItems({ first_index, last_index, ceiling }){
    const items_loaded = apiController.getStyles();
    items_loaded.then((data) => {        
        const itmes = document.getElementById("paginator-table");
        itmes.innerHTML = "";
        for (var i = first_index; i < last_index && i < ceiling; i++) {
            const item = data[i];
            console.log("the item is: ", item);
            const row = document.createElement("tr");
            row.setAttribute("id", "row-" + item.id);
            row.innerHTML = `
                <td>${item.category}</td>
                <td>${item.primary_color}</td>
                <td>${item.secondary_color}</td>
                <td>${item.complementary_color}</td>
                <td><img src="${base_url}${item.background_image}" width="50px" height="50px"></td>
                <td><span class="edit-button" onclick="editItem(${item.id})">
                    <i class="fa-solid fa-pen button-icon"></i>
                </span></td>
                <td><span class="delete-button" onclick="deleteItem(${item.id})">
                    <i class="fa-solid fa-trash button-icon"></i>
                </span></td>
            `;
            itmes.appendChild(row);
        }
        renderAddItemButton();
    }).catch((error) => {
        console.log(error);
    });
}

function renderAddItemButton() {
    const table = document.getElementById("paginator-table");
    const row = document.createElement("tr");
    
    row.innerHTML = `
        <td></td><td></td><td></td><td></td><td></td><td></td>
        <td>
            <span class="add-button" onclick="showAddItemTable()">
                <i class="fa-solid fa-plus button-icon"></i>
            </span>
        </td>
    `;
    table.appendChild(row);
}

paginator.addEventListener("on-change", renderItems);
paginator.addEventListener("on-change", hideAddItemTable);
paginator.addEventListener("on-change", (selected_item) => { selected_item = null; });

let categories_loaded = apiController.getCategories();
let styles_loaded = apiController.getStyles();

Promise.all([categories_loaded, styles_loaded]).then((values) => {
    paginator.changePage(1);
}).catch((error) => {
    console.log(error);
});