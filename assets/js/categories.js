var categories_results = [];

// Function to get all categories
function getCategoriesResults() {
    console.log("getCategories");
    const request = new Request(`${base_url}/playlist/category/get-all/${api_key}`, {
        method: "GET",
        headers: {
            "Content-Type": "application/json",
        }
    });

    fetch(request)
        .then((response) => {            
            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }
            return response.json();
        })
        .then((data) => {            
            // If the categories array is not empty, clear it
            if (categories_results.length > 0) {
                categories_results = [];
            }
            data.forEach((category) => {
                // Add every category to the categories_results array
                categories_results.push(category);
            })
            console.log("getCategoriesResults() results length inside the fetch().then() bloack: ", categories_results.length);
        }).catch((error) => {
            console.log(error);
        });   
        console.log("getCategoriesList() results length before returning: ", categories_results.length); 
}
// Get the name of the category by its id
function getCategoryName(id) {
    let name = "";
    categories_results.forEach((category) => {
        if (category.id === id) {
            name = category.name;
        }
    });    
    return name;
}