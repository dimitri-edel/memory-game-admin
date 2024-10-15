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
    if (pagename == "playlists.html") {
        loadPlalists(page);
    } else if (pagename == "categories.html") {
        loadCategories(page);
    }
}


function numPages() {
    // If the current page is the playlists page, return the number of pages for the playlists
    if (getPageName() == "playlists.html") {
        return Math.ceil(playlists.length / records_per_page);
    } else if (getPageName() == "categories.html") {
        return Math.ceil(categories_results.length / records_per_page);
    }
}

window.onload = function () {
    // If the current page is the playlists page, call getItems() from playlists.js
    if (getPageName() == "playlists.html") {
        getCategories();            
        getPlaylists();
        // Wait for the categories and playlists to be loaded for a second
        setTimeout(() => {
            loadPlalists(1);
        }, 1000);
    }else if (getPageName() == "categories.html") {
        // Call getCategories() from categories.js
        getCategoriesResults();
        // Wait for the categories to be loaded for a second
        setTimeout(() => {
            loadCategories(1);
        }, 1000);
    }    
};
// Load the paginated table in the playlists page
function loadPlalists(page) {
    // If there are no items, return
    if (playlists.length == 0) {
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

    for (var i = (page - 1) * records_per_page; i < (page * records_per_page) && i < playlists.length; i++) {
        const item = playlists[i];
        console.log("categeory-name: ", getCategoryName(item.category));
        const row = document.createElement("tr");
        row.setAttribute("id", "row-" + item.id);
        const audio_file = base_url + item.audio;
        row.innerHTML = `            
                <td>${getCategoryName(item.category)}</td>
                <td><button onclick="play_audio('${audio_file}')"> Play</button></td>
                <td>${item.title}</td>
                <td>${item.description}</td>
                <td><img src="${base_url}${item.image}" alt="${item.title}" width="100"></td>
                <td><span class="edit-button" onclick='editItem(${JSON.stringify(item)})'><i class="fa-solid fa-pen-to-square button-icon"></i></span></td>
                <td><span class="delete-button" onclick="deleteItem(${item.id})"><i class="fa-solid fa-trash-can button-icon"></i></span></td>
            `;
        items.appendChild(row);
    }

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
    console.log("categories_results:", categories_results);
    console.log("categories_results length:", categories_results.length);
    // If there are no items, return
    if (categories_results.length == 0) {
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

    for (var i = (page - 1) * records_per_page; i < (page * records_per_page) && i < categories_results.length; i++) {       
        const item = categories_results[i];
        const row = document.createElement("tr");
        row.setAttribute("id", "row-" + item.id);
        row.innerHTML = `            
                <td>${item.name}</td>
                <td>${item.description}</td>
                <td><img src="${base_url}${item.image}" alt="${item.name}" width="100"></td>                
            `;
        items.appendChild(row);
    }

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
