// Class for comunicating with the API
class ApiController {
    constructor() {
        this.categories = [];
        this.playlists = [];
    }


    getCategories = () => {
        let promise = new Promise((resolve, reject) => {
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
                    if (this.categories.length > 0) {
                        this.categories = [];
                    }
                    data.forEach((category) => {
                        // Add every category to the categories array
                        this.categories.push(category);
                    });
                    resolve(this.categories);
                }).catch((error) => {
                    reject(error);
                });

        });
        return promise;
    }
    getCategoryName = (id) => {
        let name = "";
        this.categories.forEach((category) => {
            if (category.id === id) {
                name = category.name;
            }
        });    
        return name;
    }

    getPlaylists = (filter) => {
        if(filter == null || filter == undefined){
            filter = "none";
        }

        let promise = new Promise((resolve, reject) => {            
            const request = new Request(`${base_url}/playlist/get-all/${filter}/${api_key}`, {
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
                    // If the playlists array is not empty, clear it
                    if (this.playlists.length > 0) {
                        this.playlists = [];
                    }
                    // Add every playlist to the playlists array
                    data.forEach((item) => {
                        this.playlists.push(item);
                    });
                    // Complete the promise
                    resolve(this.playlists);
                })
                .catch((error) => {
                    // Reject the promise
                    reject(error);
                });

        });
        return promise;
    }

    addPlaylist = ({ category, audio, title, description, image }) => {
        let promise = new Promise((resolve, reject) => {
            const formData = new FormData();
            formData.append("category", category);
            formData.append("audio", audio);
            formData.append("title", title);
            formData.append("description", description);
            formData.append("image", image);

            const token1 = this.getCookie("token1");
            const token2 = this.getCookie("token2");

            const request = new Request(`${base_url}/playlist/post/`, {
                method: "POST",
                body: formData,
                headers: new Headers({
                    "token1": token1,
                    "token2": token2
                })
            });

            fetch(request)
                .then((response) => {
                    console.log(response);
                    if (!response.ok) {
                        throw new Error(`HTTP error! status: ${response.status}`);
                    }
                    return response.json();
                })
                .then((data) => {                    
                    // Add the new item to the playlists array
                    this.playlists.push(data);
                    resolve(data);
                })
                .catch((error) => {
                    reject(error);
                });
        });
        return promise;
    }

    updatePlayist = ({ id, category, audio, title, description, image }) => {
        console.log("submitted items: ", id, category, audio, title, description, image);
        let promise = new Promise((resolve, reject) => {
            const formData = new FormData();
            formData.append("category", category);
            if(audio != null){formData.append("audio", audio);}
            formData.append("title", title);
            formData.append("description", description);
            if(image != null){formData.append("image", image);}

            const token1 = this.getCookie("token1");
            const token2 = this.getCookie("token2");

            // Create a request object
            const request = new Request(`${base_url}/playlist/update-item/${id}/`, {
                method: "PUT",
                body: formData,
                headers: new Headers({
                    "token1": token1,
                    "token2": token2
                })
            });

            fetch(request)
                .then((response) => {
                    console.log(response);
                    if (!response.ok) {
                        throw new Error(`HTTP error! status: ${response.status}`);
                    }
                    return response.json();
                })
                .then((data) => {
                    // Update the playlists
                    this.playlists = this.playlists.map(item => {
                        if (item.id === id) {
                            item.category = data.category;
                            item.audio = data.audio;
                            item.title = data.title;
                            item.description = data.description;
                            item.image = data.image;
                        }
                        return item;
                    });
                    resolve(data);
                })
                .catch((error) => {
                    reject(error);
                });
        });
        return promise;
    }

    deletePlaylist = (id) => {
        let promise = new Promise((resolve, reject) => {
        const token1 = this.getCookie("token1");
        const token2 = this.getCookie("token2");

        const request = new Request(`${base_url}/playlist/delete-item/${id}/`, {
            method: "DELETE",
            headers: new Headers({
                "token1": token1,
                "token2": token2
            })
        });

        fetch(request)
            .then((response) => {
                console.log(response);
                if (!response.ok) {
                    throw new Error(`HTTP error! status: ${response.status}`);
                }
                return;
            })
            .then((data) => {
                // Remove the item from the playlists
                this.playlists = this.playlists.filter(item => item.id !== id);
                resolve(data);
            })
            .catch((error) => {
                reject(error);
            }
            );
        });
        return promise;
    }


    getCookie = (name) => {
        const value = `; ${document.cookie}`;
        const parts = value.split(`; ${name}=`);
        if (parts.length === 2) return parts.pop().split(";").shift();
    }

    login({ username, password }) {
        console.log("username: ", username);
        console.log("password: ", password);
        let promise = new Promise((resolve, reject) => {
        const request = new Request("http://localhost:8000/game_admin/login/", {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify({ username: username, password: password }),
        });

        // const request2 = request.clone();

       fetch(request)
            .then((response) => { 
                // print the response status code in the console
                if(response.status !== 200){
                    reject("Your username or password is incorrect");
                }
                console.log(response.status);
                return response.json();
            })
            .then((data) => {
                // Copy thoken1 and token2 from the data object to the cookie
                document.cookie = `token1=${data.token1}`;
                document.cookie = `token2=${data.token2}`;
                resolve(data);
            })
            .catch((error) => {
                reject(error);
            });
        });
        return promise;
    }
}

var apiController = new ApiController();
