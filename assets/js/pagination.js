/*  The code was posted on stackoverflow.com @https://stackoverflow.com/questions/25434813/simple-pagination-in-javascript */
var current_page = 1;
var records_per_page = 2;

function prevPage() {
    // Unselect item for memory-game-admin.js
    // Even if there is no item selected, the variable needs to be set to null
    selected_item = null;

    if (current_page > 1) {
        current_page--;
        changePage(current_page);
    }
}

function nextPage() {
    // Unselect item for memory-game-admin.js
    // Even if there is no item selected, the variable needs to be set to null
    selected_item = null;

    if (current_page < numPages()) {
        current_page++;
        changePage(current_page);
    }
}

// Function for going to the first page
function firstPage() {
    // Unselect item for memory-game-admin.js
    // Even if there is no item selected, the variable needs to be set to null
    selected_item = null;

    current_page = 1;
    changePage(current_page);
}

// Function for going to the last page
function lastPage() {
    // Unselect item for memory-game-admin.js
    // Even if there is no item selected, the variable needs to be set to null
    selected_item = null;

    current_page = numPages();
    changePage(current_page);
}

function changePage(page) {
    // If there are no items, return
    if (resultsJSON.length == 0) {
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

    for (var i = (page - 1) * records_per_page; i < (page * records_per_page) && i < resultsJSON.length; i++) {
        const item = resultsJSON[i];
        const row = document.createElement("tr");
        row.setAttribute("id", "row-" + item.id);
        const audio_file = base_url + item.audio;
        row.innerHTML = `
            <td>${item.id}</td>
            <td>${item.category}</td>
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
    } else {
        btn_prev.style.visibility = "visible";
    }

    if (page == numPages()) {
        btn_next.style.visibility = "hidden";
    } else {
        btn_next.style.visibility = "visible";
    }
}

function numPages() {
    return Math.ceil(resultsJSON.length / records_per_page);
}

window.onload = function () {
    changePage(1);
};