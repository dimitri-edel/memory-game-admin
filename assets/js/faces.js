selected_item = null;

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
            <select id="category" name="category">
                ${renderCategoryOptions()}
            </select>
            <span id="category-validator" class="validator-message"></span>
        </td>
        <td>
            <input id="image" type="file" name="image" accept="image/*">
            <span id="image-validator" class="validator-message"></span>
        </td>
        <td>
            <span class="add-button" onclick="addItem()">
                <i class="fa-solid fa-check button-icon"></i>
            </span>
        </td>
        <td>
            <span class="cancel-button" onclick="hideAddItemTable()">
                <i class="fa-solid fa-xmark button-icon"></i>
            </span>
        </td>`;
    // Append the row to the table
    items.appendChild(row);
    // Hide the add button
    document.getElementById("add-button-container").style.display = "none";
}

function hideAddItemTable() {
    // Remove the row
    const row = document.getElementById("add_item_row");
    row.remove();
    // Show the add button
    document.getElementById("add-button-container").style.display = "block";
}
