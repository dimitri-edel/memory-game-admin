// Function for determining the name of the html page in which the script is being run
function getPageName() {
    const path = window.location.pathname;
    const page = path.split("/").pop();
    return page;
}

// Function for loading the navigation bar
function loadNavBar() {
    // Create the list items for the navigation bar
    const pages = ["index.html", "categories.html", "quizes.html", "playlists.html", "styles.html", "faces.html"];
    // Create the unordered list and attach it to the navbar element
    const navBar = document.getElementById("navbar");
    const ul = document.createElement("ul");
    // Attach the items to the unordered list
    for (const page of pages) {
        const li = document.createElement("li");
        const a = document.createElement("a");
        a.href = page;
        a.textContent = page.split(".")[0];
        // If the page is the current page, set the class to active
        if (page == getPageName()) {            
            a.classList.add("active");
        }
        li.appendChild(a);
        ul.appendChild(li);
    }
    navBar.appendChild(ul);    
}

// Load the navigation bar
loadNavBar();