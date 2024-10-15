/*  The code was posted on stackoverflow.com @https://stackoverflow.com/questions/25434813/simple-pagination-in-javascript */
var current_page = 1;
var records_per_page = 2;

function prevPage() {
    // Unselect item for playlists.js
    // Even if there is no item selected, the variable needs to be set to null
    selected_item = null;

    if (current_page > 1) {
        current_page--;
        changePage(current_page);
    }
}

function nextPage() {
    // Unselect item for playlists.js
    // Even if there is no item selected, the variable needs to be set to null
    selected_item = null;

    if (current_page < numPages()) {
        current_page++;
        changePage(current_page);
    }
}

// Function for going to the first page
function firstPage() {
    // Unselect item for playlists.js
    // Even if there is no item selected, the variable needs to be set to null
    selected_item = null;

    current_page = 1;
    changePage(current_page);
}

// Function for going to the last page
function lastPage() {
    // Unselect item for playlists.js
    // Even if there is no item selected, the variable needs to be set to null
    selected_item = null;

    current_page = numPages();
    changePage(current_page);
}
/* Function for changing the page in the painated table.
    It calls a different function depending on the page in which the script is being run */
function changePage(page) {
    // Call getPageName() from loadNavBar.js
    let pagename = getPageName();
    // The function hideAddItemTable() is defined in categories.js and playlists.js
    hideAddItemTable();
    if (pagename == "playlists.html") {
        loadPlalists(page);
    } else if (pagename == "categories.html") {
        loadCategories(page);
    }
}


function numPages() {
    // If the current page is the playlists page, return the number of pages for the playlists
    if (getPageName() == "playlists.html") {
        let num = Math.ceil(apiController.playlists.length / records_per_page);
        if (num <= 0) {
            return 1;
        }
        return num;
    } else if (getPageName() == "categories.html") {
        let num = Math.ceil(apiController.categories.length / records_per_page);
        if (num <= 0) {
            return 1;
        }
        return num;
    }
}

window.onload = function () {
    // If the current page is the playlists page, call getItems() from playlists.js
    if (getPageName() == "playlists.html") {
        // Call getCategories() and getPlaylists() from api-controller.js
        let promise = apiController.getCategories();
        let promise2 = apiController.getPlaylists();
        Promise.all([promise, promise2]).then((values) => {
            console.log("Categories and playlists loaded.");
            loadPlalists(1);
        }).catch((error) => {
            console.log("Error loading playlists: ");
            console.log(error);
        });
    } else if (getPageName() == "categories.html") {
        let promise = apiController.getCategories();
        promise.then((data) => {
            loadCategories(1);
        }).catch((error) => {
            console.log("Error loading categories: ");
            console.log(error);
        });
        // Call getCategories() from categories.js
        // getCategoriesResults();
        // Wait for the categories to be loaded for a second
        // setTimeout(() => {
        //     loadCategories(1);
        // }, 1000);
    }
};
// Load the paginated table in the playlists page
function loadPlalists(page) {
    console.log("loadPlalists() called");
    // If there are no items, return
    if (apiController.playlists.length == 0) {
        console.log("No playlists to load. playlists_results is empty.");
        return;
    }
    var btn_next = document.getElementById("btn_next");
    var btn_prev = document.getElementById("btn_prev");
    var btn_first = document.getElementById("btn_first");
    var btn_last = document.getElementById("btn_last");
    var page_span = document.getElementById("page");
    var total_pages_span = document.getElementById("total_pages");

    // Validate page
    if (page < 1) page = 1;
    if (page > numPages()) page = numPages();

    // Append the items to the table
    const items = document.getElementById("listing-items");
    items.innerHTML = "";

    for (var i = (page - 1) * records_per_page; i < (page * records_per_page) && i < apiController.playlists.length; i++) {
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
    // Append the row with the add button to the table
    items.appendChild(row_with_add_button);

    page_span.innerHTML = page;
    total_pages_span.innerHTML = numPages();

    if (page == 1) {
        btn_prev.style.visibility = "hidden";
        btn_first.style.visibility = "hidden";
    } else {
        btn_prev.style.visibility = "visible";
        btn_first.style.visibility = "visible";
    }

    if (page == numPages()) {
        btn_next.style.visibility = "hidden";
        btn_last.style.visibility = "hidden";
    } else {
        btn_next.style.visibility = "visible";
        btn_last.style.visibility = "visible";
    }
}

// Load the paginated table in the categories page
function loadCategories(page) {
    // If there are no items, return
    if (apiController.categories.length == 0) {
        console.log("No categories to load. categories_results is empty.");
        return;
    }
    var btn_next = document.getElementById("btn_next");
    var btn_prev = document.getElementById("btn_prev");
    var btn_first = document.getElementById("btn_first");
    var btn_last = document.getElementById("btn_last");
    var page_span = document.getElementById("page");
    var total_pages_span = document.getElementById("total_pages");

    // Validate page
    if (page < 1) page = 1;
    if (page > numPages()) page = numPages();

    // Append the items to the table
    const items = document.getElementById("listing-items");
    items.innerHTML = "";

    for (var i = (page - 1) * records_per_page; i < (page * records_per_page) && i < apiController.categories.length; i++) {
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

    page_span.innerHTML = page;
    total_pages_span.innerHTML = numPages();

    if (page == 1) {
        btn_prev.style.visibility = "hidden";
        btn_first.style.visibility = "hidden";
    } else {
        btn_prev.style.visibility = "visible";
        btn_first.style.visibility = "visible";
    }

    if (page == numPages()) {
        btn_next.style.visibility = "hidden";
        btn_last.style.visibility = "hidden";
    } else {
        btn_next.style.visibility = "visible";
        btn_last.style.visibility = "visible";
    }
}
