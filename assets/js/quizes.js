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
    let promise = apiController.addQuiz({ category, json_file: json });
    promise.then((data) => {
        // Add the new item to the table
        const items = document.getElementById("paginator-table");
        const row = document.createElement("tr");
        row.setAttribute("id", "row-" + data.id);
        row.innerHTML = `
            <td>${apiController.getCategoryName(data.category)}</td>
            <td>${data.json}</td>
            <td><span class="edit-button" onclick='editItem(${JSON.stringify(data)})'><i class="fa-solid fa-pen-to-square button-icon"></i></span></td>
            <td><span class="delete-button" onclick="deleteItem(${data.id})"><i class="fa-solid fa-trash-can button-icon"></i></span></td>
        `;
        items.appendChild(row);
        // Go to the last page
        paginator.changePage(paginator.numPages());
    }).catch((error) => {
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

function renderCategoryOptions() {
    let options = "";
    apiController.categories.forEach((category) => {
        options += `<option value="${category.id}">${category.name}</option>`;
    });
    return options;
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

function renderQuizes({ first_index, last_index, ceiling }) {
    // Append the items to the table
    const items = document.getElementById("paginator-table");
    items.innerHTML = "";
    
    for (var i = first_index; i < last_index && i < ceiling; i++) {
        const item = apiController.quizes[i];
        console.log(`item: ${item} index: ${i}`);
        const row = document.createElement("tr");
        row.setAttribute("id", "row-" + item.id);
        row.innerHTML = `            
            <td>${apiController.getCategoryName(item.category)}</td>
            <td>${item.json}</td>
            <td><span class="edit-button" onclick='editItem(${JSON.stringify(item)})'><i class="fa-solid fa-pen-to-square button-icon"></i></span></td>
            <td><span class="delete-button" onclick="deleteItem(${item.id})"><i class="fa-solid fa-trash-can button-icon"></i></span></td>
        `;
        items.appendChild(row);
    }
    // Append the add item button to the table
    renderAddItemButton();
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

paginator.addEventListener("on-change", hideAddItemTable);
paginator.addEventListener("on-change", renderQuizes);
paginator.addEventListener("on-change", (selected_item) => { selected_item = null; });

let categories_promise = apiController.getCategories();
let playlist_promise = apiController.getQuizes();

Promise.all([categories_promise, playlist_promise]).then((values) => {
    paginator.changePage(1);
}).catch((error) => {
    console.log("Error loading quizes: ");
    console.log(error);
});