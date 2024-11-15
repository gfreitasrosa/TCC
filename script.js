// Function to open the popup for creating a new trail
function openTrailPopup() {
    setMinDate(); // Ensure date validation is applied
    const popup = document.getElementById("trail-popup");
    popup.style.display = "flex"; // Display the popup
}

// Add event listener to 'Criar trilha' button
document.querySelectorAll(".open-trail-popup").forEach((element) => {
    element.addEventListener("click", function (event) {
        event.preventDefault(); // Prevent default action
        openTrailPopup();
    });
});

// Function to set the minimum selectable date in the date picker to today's date
function setMinDate() {
    const trailDateInput = document.getElementById("trail-date");
    const today = new Date();
    const yyyy = today.getFullYear();
    const mm = String(today.getMonth() + 1).padStart(2, '0'); // Month is zero-indexed
    const dd = String(today.getDate()).padStart(2, '0');

    trailDateInput.min = `${yyyy}-${mm}-${dd}`; // Format as YYYY-MM-DD
}

// Close the popup when 'Cancelar' is clicked
document.getElementById("cancel-trail").addEventListener("click", function () {
    document.getElementById("trail-popup").style.display = "none";
});

// Function to create a new trail
document.getElementById("save-trail").addEventListener("click", function () {
    const trailName = document.getElementById("trail-name").value;
    const trailDate = document.getElementById("trail-date").value;
    const trailReminder = document.getElementById("trail-reminder").checked;

    if (trailName && trailDate) {
        // Create a new trail card
        const trailCard = document.createElement("div");
        trailCard.classList.add("trail-card");
        trailCard.innerText = trailName;

        // Add click event to open the trail screen
        trailCard.addEventListener("click", function () {
            displayTrailScreen(trailName, trailDate, trailReminder);
        });

        // Add the trail card to vertical-navbar
        document.getElementById("vertical-navbar").appendChild(trailCard);

        // Close the popup and reset fields
        document.getElementById("trail-popup").style.display = "none";
        document.getElementById("trail-name").value = "";
        document.getElementById("trail-date").value = "";
        document.getElementById("trail-reminder").checked = false;
    } else {
        alert("Por favor insira um nome e uma data final para a trilha.");
    }
});

// Function to display the trail screen
function displayTrailScreen(name, date, reminder) {
    const main = document.getElementById("main");
    main.innerHTML = ""; // Clear the main area initially

    // Create the main structure for trail details and tasks
    main.innerHTML = `
    <div style="display: flex; flex-direction: column; width: 100%; gap: 20px; height: 100%;">
    <!-- Top section: Name, Date, Reminder, and Progress -->
    <div style="display: flex; flex-direction: row; justify-content: center; align-items: flex-start; gap: 10px; background-color: #516ED045; padding: 20px; border-radius: 10px; width: 100%; box-sizing: border-box;">
    <div style="display: flex; flex-direction: row; justify-content: center; align-items: flex-start; position: relative">
    <ul style="display: flex; flex-wrap: nowrap; justify-content: space-around; align-content: center; list-style-type: none">
    <li style="text-decoration: none; display: inline-block;"><label>
    <input type="checkbox" ${reminder ? "checked" : ""}> Reminder
    </label></li>
    <li style="text-decoration: none; display: inline-block;"><h2>${name}</h2></li>
    <li style="text-decoration: none; display: inline-block;"><h2 id="progress-display" style="font-size: 18px; color: green; font-weight: bold;">Progress: 0%</h2></li>
    <li style="text-decoration: none; display: inline-block;"><h2>Data final: ${date}</h2></li>
    </ul>
    </div>
    </div>

    <!-- Task management section -->
    <div style="display: flex; flex-direction: row; gap: 20px; width: 100%; height: 100%; box-sizing: border-box;">
    <!-- Task list -->
    <div style="display: flex; flex-direction: column; align-items: center; gap: 10px; width: 200px; max-height: 100%; background-color: #516ED045; padding: 20px; border-radius: 10px; box-sizing: border-box; overflow-y: auto;">
    <button id="create-task" style="margin-bottom: 10px;">Create Task</button>
    <div id="task-list" style="flex-grow: 1; overflow-y: auto; width: 100%;"></div>
    </div>

    <!-- Task details -->
    <div id="task-details" style="flex-grow: 1; width: calc(100% - 220px); max-height: 100%; background-color: #516ED045; padding: 20px; border-radius: 10px; box-sizing: border-box; overflow-y: auto;">
    <h3>Select a task to view details</h3>
    </div>
    </div>
    </div>
    `;

    const createTaskButton = document.getElementById("create-task");
    if (createTaskButton) {
        createTaskButton.addEventListener("click", function () {
            const taskName = prompt("Enter task name:");
            if (taskName) {
                const taskId = `task-${Date.now()}`; // Generate unique ID
                const taskItem = document.createElement("p");
                taskItem.innerText = taskName;
                taskItem.classList.add("task-item");
                taskItem.dataset.id = taskId;

                taskItem.addEventListener("click", function () {
                    displayTaskDetails(taskName, taskId);
                });

                const taskList = document.getElementById("task-list");
                if (taskList) taskList.appendChild(taskItem);

                // Update progress
                updateProgress();
            }
        });
    }

    updateProgress();
}



// Function to display task details
function displayTaskDetails(taskName, taskId) {
    const taskDetailsContainer = document.getElementById("task-details");
    taskDetailsContainer.innerHTML = `
    <h3>Task Details</h3>
    <p>Task Name: ${taskName}</p>
    <p>Status:
    <select>
    <option>Ongoing</option>
    <option>Concluded</option>
    </select>
    </p>
    <button onclick="deleteTask('${taskId}')">Delete Task</button>
    <textarea id="task-notes" placeholder="Task notes..." style="resize:none; width: 100%; height: 450px; margin-top: 10px;"></textarea>
    `;

    tinymce.init({
        selector: '#task-notes', // Target the textarea with id "task-notes"
        plugins: 'advlist autolink lists link image charmap print preview hr anchor pagebreak',
        toolbar: 'undo redo | bold italic | alignleft aligncenter alignright | bullist numlist outdent indent | link image | code',
        menubar: false, // Optional: Disable the menu bar
        statusbar: false, // Optional: Disable the status bar
    });
}

// Change font size dynamically
function changeFontSize() {
    const size = prompt("Enter font size (e.g., 16px, 20px, etc.):");
    if (size) {
        document.execCommand('fontSize', false, size);
    }
}

// Change font family
function changeFontFamily(selectElement) {
    const font = selectElement.value;
    document.execCommand('fontName', false, font);
}


// Function to delete a task
function deleteTask(taskId) {
    const taskList = document.getElementById("task-list");
    const taskToDelete = Array.from(taskList.children).find(
        task => task.dataset.id === taskId
    );
    if (taskToDelete) taskToDelete.remove();

    // Clean up TinyMCE editor if it's active
    if (tinymce.get('task-notes')) {
        tinymce.get('task-notes').remove(); // Destroy TinyMCE instance
    }
    document.getElementById("task-details").innerHTML = "<h3>Select a task to view details</h3>";
    updateProgress();
}

// Function to update progress
function updateProgress() {
    const taskList = document.getElementById("task-list");
    if (!taskList) return;

    const totalTasks = taskList.childElementCount;
    const completedTasks = Array.from(taskList.children).filter(task =>
    task.classList.contains("concluded")
    ).length;

    const progress = totalTasks > 0 ? (completedTasks / totalTasks) * 100 : 0;
    const progressDisplay = document.getElementById("progress-display");
    if (progressDisplay) {
        progressDisplay.innerText = `Progress: ${progress.toFixed(0)}%`;
    }
}
