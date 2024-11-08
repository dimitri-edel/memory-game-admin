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
    const row = document.getElementById("add_item_row");
    row.remove();
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

function renderCategoryOptions() {
    let options = "";
    apiController.categories.forEach((category) => {
        options += `<option value="${category.id}">${category.name}</option>`;
    });
    return options;
}
