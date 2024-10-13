/*  The code was posted on stackoverflow.com @https://stackoverflow.com/questions/25434813/simple-pagination-in-javascript */
var current_page = 1;
var records_per_page = 2;

var objJson = [
    { adName: "AdName 1"},
    { adName: "AdName 2"},
    { adName: "AdName 3"},
    { adName: "AdName 4"},
    { adName: "AdName 5"},
    { adName: "AdName 6"},
    { adName: "AdName 7"},
    { adName: "AdName 8"},
    { adName: "AdName 9"},
    { adName: "AdName 10"}
]; // Can be obtained from another source, such as your objJson variable

function prevPage()
{
    if (current_page > 1) {
        current_page--;
        changePage(current_page);
    }
}

function nextPage()
{
    if (current_page < numPages()) {
        current_page++;
        changePage(current_page);
    }
}

function changePage(page)
{
    var btn_next = document.getElementById("btn_next");
    var btn_prev = document.getElementById("btn_prev");    
    var page_span = document.getElementById("page");

    // Validate page
    if (page < 1) page = 1;
    if (page > numPages()) page = numPages();

    for (var i = (page-1) * records_per_page; i < (page * records_per_page); i++) {
        // Append the items to the table
        const items = document.getElementById("listing-items");
        items.innerHTML = "";
        resultsJSON.forEach((item) => {
            const row = document.createElement("tr");
            const audio_file = base_url + item.audio;
            row.innerHTML = `
                <td>${item.id}</td>
                <td>${item.category}</td>
                <td>${item.audio}<button value="Play" onclick="play_audio('${audio_file}')"> </td>
                <td>${item.title}</td>
                <td>${item.description}</td>
                <td><img src="${base_url}${item.image}" alt="${item.title}" width="100"></td>
            `;
            items.appendChild(row);
        });
        // listing_table.innerHTML += resultsJSON[i].id + "<br>";
        // listing_table.innerHTML += resultsJSON[i].category + "<br>";
        // listing_table.innerHTML += resultsJSON[i].audio + "<br>";
        // listing_table.innerHTML += resultsJSON[i].title + "<br>";
        // listing_table.innerHTML += resultsJSON[i].description + "<br>";
        // listing_table.innerHTML += resultsJSON[i].image + "<br>";        
    }
    page_span.innerHTML = page;

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

function numPages()
{
    return Math.ceil(resultsJSON.length / records_per_page);
}

window.onload = function() {
    changePage(1);
};