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

function editItem(item) {
    // If there is a selected item, unselect it
    if (selected_item !== null) {
        unselectItem(selected_item);
    }
    selected_item = item;
    const row = document.getElementById("row-" + item.id);
    row.innerHTML = `
        <td>${apiController.getCategoryName(item.category)}</td>
        <td><input type="file" id="edit_json" accept="application/json" value="${item.json}"><span id="edit-json-validator" class="validator-message"></span></td>
        <td><span class="save-button" onclick="saveItem(${item.id})"><i class="fa-solid fa-check button-icon"></i></span></td>
        <td><span class="cancel-button" onclick="cancelEdit(${item.id})"><i class="fa-solid fa-xmark button-icon"></i></span></td>
    `;
    document.getElementById("edit_category").value = item.category;
}

function cancelEdit(id) {
    const item = apiController.quizes.find(item => item.id === id);
    const row = document.getElementById("row-" + id);
    // quiz_file_rendered is a promise that resolves to the HTML representation of the quiz
    let quiz_file_rendered = renderQuiz(item);
    quiz_file_rendered.then((html) => {
        row.innerHTML = `
            <td>${apiController.getCategoryName(item.category)}</td>
            <td>${html}</td>
            <td><span class="edit-button" onclick='editItem(${JSON.stringify(item)})'><i class="fa-solid fa-pen-to-square button-icon"></i></span></td>
            <td><span class="delete-button" onclick="deleteItem(${item.id})"><i class="fa-solid fa-trash-can button-icon"></i></span></td>
        `;
    }).catch((error) => {
        console.log(error);
    });    
    selected_item = null;
}

function saveItem(id) {
    const category = document.getElementById("edit_category").value;
    const json = document.getElementById("edit_json").files[0];
    // If the form is not valid, do nothing
    if (!validateForm()) {
        return;
    }
    let promise = apiController.updateQuiz({ id, category, json_file: json });
    promise.then((data) => {
        // Update the item in the table
        const row = document.getElementById("row-" + id);
        row.innerHTML = `
            <td>${apiController.getCategoryName(data.category)}</td>
            <td>${data.json}</td>
            <td><span class="edit-button" onclick='editItem(${JSON.stringify(data)})'><i class="fa-solid fa-pen-to-square button-icon"></i></span></td>
            <td><span class="delete-button" onclick="deleteItem(${data.id})"><i class="fa-solid fa-trash-can button-icon"></i></span></td>
        `;
        // Unselect the item
        unselectItem(data);
    }).catch((error) => {
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

function renderQuiz(item) {
    console.log(base_url + item.json);
    console.log(item.json);
    return new Promise((resolve, reject) => {
        fetch(`${base_url + item.json}`)
            .then(response => {
                if (!response.ok) {
                    throw new Error(`HTTP error! status: ${response.status}`);
                }
                console.log(response.json);
                return response.json();
            })
            .then(data => {
                resolve(`<h5>${data[0].question}</h5><p>${data[0].answer}</p>`);
            })
            .catch(error => {
                reject(`Error loading json-file for the quiz: ${item.json} : ${error}`);
            });
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

function renderQuizes({ first_index, last_index, ceiling }) {
    /* Load the representation of the quizes in the paginated table  */
    let list_for_paginator_rendered = new Promise((resolve, reject) => {
        // Append the items to the table
        const items = document.getElementById("paginator-table");
        items.innerHTML = "";

        let promises = [];

        for (var i = first_index; i < last_index && i < ceiling; i++) {
            const item = apiController.quizes[i];
            // quiz_file_rendered is a promise that resolves to the HTML representation of the quiz
            let quiz_file_rendered = renderQuiz(item);
            promises.push(quiz_file_rendered.then((html) => {
                const row = document.createElement("tr");
                row.setAttribute("id", "row-" + item.id);
                row.innerHTML = `            
                <td>${apiController.getCategoryName(item.category)}</td>
                <td>${html}</td>
                <td><span class="edit-button" onclick='editItem(${JSON.stringify(item)})'><i class="fa-solid fa-pen-to-square button-icon"></i></span></td>
                <td><span class="delete-button" onclick="deleteItem(${item.id})"><i class="fa-solid fa-trash-can button-icon"></i></span></td>
            `;
                items.appendChild(row);
            }).catch((error) => {
                reject(error);
            }));
        }

        Promise.all(promises).then(() => {
            resolve();
        }).catch((error) => {
            reject(error);
        });
    });

    list_for_paginator_rendered.then(() => {
        // Append the add item button to the table
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

paginator.addEventListener("on-change", renderQuizes);
paginator.addEventListener("on-change", hideAddItemTable);
paginator.addEventListener("on-change", (selected_item) => { selected_item = null; });

let categories_promise = apiController.getCategories();
let playlist_promise = apiController.getQuizes();

Promise.all([categories_promise, playlist_promise]).then((values) => {
    paginator.changePage(1);
}).catch((error) => {
    console.log("Error loading quizes: ");
    console.log(error);
});