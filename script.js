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

    // Only display task management content if there are tasks
    main.innerHTML = `
        <div style="display: flex; flex-direction: column; gap: 20px;">
			<div syle="display: flex; flex-direction: column; background-color: green;">
				<h2>${name}</h2>
				<p>Completion Date: ${date}</p>
				<label>
					<input type="checkbox" ${reminder ? "checked" : ""}> Reminder
				</label>
			</div>
			<div style="display: flex; flex-direction: row; gap: 20px; width:1400px; height:900px">
				<!-- Task list and create task button -->
				<div style="display: flex; flex-direction: column; gap: 10px; width: 200px; background-color: #516ED045; padding: 20px; border-radius: 10px;">
					<button id="create-task">Create Task</button>
					<div id="task-list" style="margin-top: 10px;"></div>
				</div>

				<!-- Task details area -->
				<div id="task-details" style="flex-grow: 1; background-color: #516ED045; padding: 20px; border-radius: 10px;">
					<h3>Select a task to view details</h3>
				</div>
			</div>
		</div>
    `;

    // Event listener to create tasks
    document.getElementById("create-task").addEventListener("click", function () {
        const taskName = prompt("Enter task name:");
        if (taskName) {
            const taskItem = document.createElement("p");
            taskItem.innerText = taskName;
            taskItem.classList.add("task-item");
            taskItem.addEventListener("click", function () {
                displayTaskDetails(taskName);
            });
            document.getElementById("task-list").appendChild(taskItem);
        }
    });
}

// Function to display task details
function displayTaskDetails(taskName) {
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
        <button onclick="deleteTask('${taskName}')">Delete Task</button>
        <textarea placeholder="Task notes..." style="resize:none; width: 100%; height: 650px; margin-top: 10px;"></textarea>
    `;
}

// Function to delete a task
function deleteTask(taskName) {
    const taskList = document.getElementById("task-list");
    const tasks = Array.from(taskList.children);
    tasks.forEach(task => {
        if (task.innerText === taskName) {
            task.remove();
        }
    });
    document.getElementById("task-details").innerHTML = "<h3>Select a task to view details</h3>";
    updateProgress();
}

// Function to update the progress percentage
function updateProgress() {
    const totalTasks = document.getElementById("task-list").childElementCount;
    const completedTasks = Array.from(document.getElementById("task-list").children).filter(task => 
        task.classList.contains("concluded")).length;
    const progress = totalTasks > 0 ? (completedTasks / totalTasks) * 100 : 0;
    document.querySelector("#main p:nth-child(5)").innerText = `Progress: ${progress.toFixed(0)}%`;
}