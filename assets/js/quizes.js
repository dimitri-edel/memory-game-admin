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
            <select id="add_category">
                ${renderCategoryOptions()}
            </select>
            <span id="add-category-validator" class="validator-message"></span>
        </td>
        <td><input type="file" id="add_json" accept="application/json"><span id="add-json-validator" class="validator-message"></span></td>
        <td><span class="add-button
            " onclick="addItem()">
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

function addItem() {
    const category = document.getElementById("add_category").value;
    const json = document.getElementById("add_json").files[0];
    // If the form is not valid, do nothing
    if (!validateForm()) {
        return;
    }
    let quiz_saved_in_database = apiController.addQuiz({ category, json_file: json });
    let quizes_loaded = apiController.getQuizes();
    Promise.all([quiz_saved_in_database, quizes_loaded]).then((values) => {
        paginator.lastPage();
    }).catch((error) => {
        if (error === "HTTP error! status: 409") {
            document.getElementById("add-category-validator").innerHTML = "A Quiz for this Category alredy exists! Please choose another Category!";
        }
        console.log(error);
    });

    function validateForm() {
        clearValidators();
        if (json === undefined) {
            document.getElementById("add-json-validator").innerHTML = "JSON file is required";
            return false;
        }
        return true;
    }

    function clearValidators() {
        document.getElementById("add-json-validator").innerHTML = "";
    }
}

function editItem(quiz_id) {
    // Extract the quiz item from the quizes array
    const item = apiController.quizes.find(item => item.id === quiz_id);
    // If there is a selected item, unselect it
    if (selected_item !== null) {
        unselectItem(selected_item);
    }
    selected_item = item;
    const row = document.getElementById("row-" + item.id);
    row.innerHTML = `
        <td>${apiController.getCategoryName(item.category)}<span id="edit_category" hidden>${item.category}</span></td>
        <td><input type="file" id="edit_json" accept="application/json" value="${item.json}"><span id="edit-json-validator" class="validator-message"></span></td>
        <td><span class="save-button" onclick="updateItem(${item.id})"><i class="fa-solid fa-check button-icon"></i></span></td>
        <td><span class="cancel-button" onclick="cancelEdit(${item.id})"><i class="fa-solid fa-xmark button-icon"></i></span></td>
    `;
}

function cancelEdit(id) {
    selected_item = null;
    paginator.changePage(paginator.current_page);
}

function updateItem(quiz_id) {
    const category = document.querySelector("#edit_category").textContent;
    const json = document.getElementById("edit_json").files[0];

    // If the form is not valid, do nothing
    if (!validateForm()) {
        return;
    }
    let quiz_updated = apiController.updateQuiz({ id: quiz_id, category: category, json_file: json });
    quiz_updated.then((data) => {
        selected_item = null;
        paginator.changePage(paginator.current_page);
    }).catch((error) => {
        alert(error.message);
        console.log(error);
    });

    function validateForm() {
        clearValidators();
        if (json === undefined) {
            document.getElementById("edit-json-validator").innerHTML = "JSON file is required";
            return false;
        }
        return true;
    }

    function clearValidators() {
        document.getElementById("edit-json-validator").innerHTML = "";
    }
}


function renderCategoryOptions() {
    let options = "";
    apiController.categories.forEach((category) => {
        options += `<option value="${category.id}">${category.name}</option>`;
    });
    return options;
}

function deleteItem(id) {
    let promise = apiController.deleteQuiz(id);
    promise.then((data) => {
        // Remove the item from the table
        const row = document.getElementById("row-" + id);
        row.remove();
    }).catch((error) => {
        console.log(error);
    });
}

/* EVENT LISTENERS FOR PAGINATOR  */
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
    let items_loaded = apiController.getQuizes();
    items_loaded.then((data) => {

        const items = document.getElementById("paginator-table");
        items.innerHTML = "";

        for (var i = first_index; i < last_index && i < ceiling; i++) {
            const item = apiController.quizes[i];
            console.log(item);
            const row = document.createElement("tr");
            row.setAttribute("id", "row-" + item.id);
            row.innerHTML = `            
                <td>${apiController.getCategoryName(item.category)}</td>
                <td>${item.json[0].question}<br>${item.json[0].answer}</td>
                <td><span class="edit-button" onclick='editItem(${item.id})'><i class="fa-solid fa-pen-to-square button-icon"></i></span></td>
                <td><span class="delete-button" onclick="deleteItem(${item.id})"><i class="fa-solid fa-trash-can button-icon"></i></span></td>
            `;
            items.appendChild(row);
        }
        renderAddItemButton();
    }).catch((error) => {
        console.log(error);
    });
}


function renderAddItemButton() {
    // Append the items to the table
    const items = document.getElementById("paginator-table");

    const row_with_add_button = document.createElement("tr");
    row_with_add_button.innerHTML = ` 
            <td></td><td></td><td></td>
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

paginator.addEventListener("on-change", renderItems);
paginator.addEventListener("on-change", hideAddItemTable);
paginator.addEventListener("on-change", (selected_item) => { selected_item = null; });

let categories_loaded = apiController.getCategories();
let quizes_loaded = apiController.getQuizes();

Promise.all([categories_loaded, quizes_loaded]).then((values) => {
    paginator.changePage(1);
}).catch((error) => {
    console.log("Error loading quizes: ");
    console.log(error);
});