/* Class for pagination */
class Paginator {
    constructor() {
        this.current_page = 1;
        this.records_per_page = 2;
        this.btn_next = document.getElementById("btn-next");
        this.btn_prev = document.getElementById("btn-prev");
        this.btn_first = document.getElementById("btn-first");
        this.btn_last = document.getElementById("btn-last");
        this.page_span = document.getElementById("page");
        this.total_pages_span = document.getElementById("total_pages");
        this.onChangeEvent = [];
    }

    addEventListener = (event, callback) => {
        /* Add event listeners 
            on-change event listeners will be executed when the page is changed
        */
        switch (event) {
            case "on-change":
                this.onChangeEvent.push(callback);
                break;
        }
    }

    validatePage = () => {
        // Validate page
        if (this.current_page < 1) {
            this.current_page = 1;
        }
        if (this.current_page > this.numPages()) {
            this.current_page = this.numPages();
        }
    }

    renderButtons = () => {
        // Validate page
        this.validatePage();

        this.page_span.innerHTML = this.current_page;
        this.total_pages_span.innerHTML = this.numPages();

        if (this.current_page == 1) {
            this.btn_prev.style.visibility = "hidden";
            this.btn_first.style.visibility = "hidden";
        } else {
            this.btn_prev.style.visibility = "visible";
            this.btn_first.style.visibility = "visible";
        }

        if (this.current_page == this.numPages()) {
            this.btn_next.style.visibility = "hidden";
            this.btn_last.style.visibility = "hidden";
        } else {
            this.btn_next.style.visibility = "visible";
            this.btn_last.style.visibility = "visible";
        }
    }

    prevPage = () => {
        // Render the buttons
        this.renderButtons();
        // Unselect item for playlists.js
        // Even if there is no item selected, the variable needs to be set to null
        selected_item = null;

        if (this.current_page > 1) {
            this.current_page--;
            this.changePage(this.current_page);
        }
        
    }

    nextPage = () => {
        // Render the buttons
        this.renderButtons();
        // Unselect item for playlists.js
        // Even if there is no item selected, the variable needs to be set to null
        selected_item = null;

        if (this.current_page < numPages()) {
            this.current_page++;
            this.changePage(this.current_page);
        }
    }

    firstPage = () => {
        // Render the buttons
        this.renderButtons();
        // Unselect item for playlists.js
        // Even if there is no item selected, the variable needs to be set to null
        selected_item = null;

        this.current_page = 1;
        this.changePage(this.current_page);        
    }

    lastPage = () => {
        // Render the buttons
        this.renderButtons();
        // Unselect item for playlists.js
        // Even if there is no item selected, the variable needs to be set to null
        selected_item = null;

        this.current_page = numPages();
        this.changePage(this.current_page);        
    }

    numPages = () => {
        // If the current page is the playlists page, return the number of pages for the playlists
        if (this.getPageName() == "playlists.html") {
            let num = Math.ceil(apiController.playlists.length / records_per_page);
            if (num <= 0) {
                return 1;
            }
            return num;
        } else if (this.getPageName() == "categories.html") {
            let num = Math.ceil(apiController.categories.length / records_per_page);
            if (num <= 0) {
                return 1;
            }
            return num;
        }
    }

    getPageName = () => {
        const path = window.location.pathname;
        const page = path.split("/").pop();
        return page;
    }

    changePage = (page) => {
        this.currentPage = page;

        // call the event listeners
        this.onChangeEvent.forEach((callback) => {
            // Get the first and last index of the records to be displayed
            // Ceiling is the number of records in the array and must be 
            // be supplied to the for-loop in the playlists.js and categories.js
            // like so: i = first_index; i < last_index && i < ceiling; i++
            const { first_index, last_index, ceiling } = this.getChangedIndexes();
            callback({ first_index, last_index, ceiling });
        });
    }


    getChangedIndexes =() => {
        const first_index = (this.current_page - 1) * this.records_per_page;
        const last_index = this.current_page * this.records_per_page;
        // Ceiling is the number of records in the array and must be 
        // be supplied to the for-loop in the playlists.js and categories.js
        // like so: i = first_index; i < last_index && i < ceiling; i++
        const ceiling = 0;
        const page_name = this.getPageName();
        if (page_name == "playlists.html") {
            ceiling = apiController.playlists.length;
        } else if (page_name == "categories.html") {
            ceiling = apiController.categories.length;
        }
        return { first_index, last_index, ceiling };
    }
}

var paginator = new Paginator();