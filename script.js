document.addEventListener('DOMContentLoaded', function() {


	let csvSelector = document.querySelector("#csvFileInput");
	// Function to handle the file selection
	function handleFileSelect(event) {
		const file = event.target.files[0];
		if (!file) {
			alert('No file selected.');
			return;
		}

		const reader = new FileReader();
		reader.onload = function(e) {
			const contents = e.target.result;
			parseCSV(contents);
		};
		reader.readAsText(file);
	}

	// Function to parse the CSV content
	function parseCSV(csv) {
		const rows = csv.split('\n'); // Split by rows (newlines)

		const studentList = document.getElementById('studentList');
		studentList.innerHTML = ''; // Clear the list

		const header = rows[0].split(','); // First row is the header, split by commas

		rows.slice(1).forEach((row) => {
			const cols = row.split(';'); // Split by commas (for columns)
			const li = document.createElement('li');
			var divLi = document.createElement("div")
			var cb = document.createElement('input');
			var p = document.createElement("span")
			p.setAttribute("class","studentName")
			cb.type = "checkbox"
			cb.setAttribute("class","cbStudent")
			cb.checked = true
			divLi.appendChild(cb)
			var student = `${cols[0]}`; // Display the first column (student name)
			p.textContent = student.replace(/["']/g, "")
			divLi.appendChild(p);
			li.appendChild(divLi);
			studentList.appendChild(li);
		});
	}

	function group(list, nb) {
		// Create an array of empty groups
		let result = Array.from({ length: nb }, () => []);

		// Shuffle the list
		let shuffled = list.slice().sort(() => Math.random() - 0.5);

		// Distribute items into groups
		shuffled.forEach((item, index) => {
			result[index % nb].push(item);
		});

		return result;
	}
	function getListOfStudents(){
		let inputs = document.querySelectorAll(".cbStudent");
		let studentList = [];
		inputs.forEach((input)=> {
			if(input.checked)
			{
				studentList.push(input.nextElementSibling.innerText);
			}
		})
		return studentList;
	}
	// Function to update the text file to save
	let fileContent = "";
	function setFileContent(groups){
		// Define the content for the text file
		let content = "Groups :\n"
		groups.forEach((aGroup) =>{
			content += "\n";
			content += "Group " + (groups.indexOf(aGroup)+1) +":\n"
			aGroup.forEach((element) =>{
				content += "-"+element +"\n"
			})
		})
		fileContent = content
	}
	// Function to start  
	let minutes = 0;
	let seconds = 0;
	const timerElement = document.querySelector("#timer");
	function startTimer(min,sec)
	{
		// Timer
		let temps = min * 60 + sec;
		return setInterval(() => {
			minutes = parseInt(temps / 60, 10);
			seconds = parseInt(temps % 60, 10);

			minutes = minutes < 10 ? "0" + minutes : minutes;
			seconds = seconds < 10 ? "0" + seconds : seconds;

			timerElement.innerText = `${minutes}:${seconds}`;
			temps = temps <= 0 ? 0 : temps - 1;
		}, 1000);
	}
    // Add an event listener for the file input
    document.querySelector("#csvFileInput").addEventListener('change', handleFileSelect);
	// Check everything
	document.querySelector("#cross").addEventListener("click",function(){
		cbstudents = document.querySelectorAll(".cbStudent")
		cbstudents.forEach((student) => {
			student.checked = true
		});
	})
	// Uncheck everything
	document.querySelector("#uncross").addEventListener("click",function(){
		cbstudents = document.querySelectorAll(".cbStudent")
		cbstudents.forEach((student) => {
			student.checked = false
		});
	})
	// Generate the groups
	document.querySelector("#group").addEventListener("click", function (){
		// Empty the current groups
		document.querySelector("#groups").innerHTML = ""
		// Select the number of groups by the select
		let nbOfGroups = document.querySelector("select").value
		// Get the list of students checked
		let listOfStudents = getListOfStudents();
		// Separate into groups
		let groups = group(listOfStudents,nbOfGroups)

		groups.forEach((onegroup) =>{
			// Create a div
			let div = document.createElement("div");
			div.setAttribute("class","col-md-6 mb-3");
			div.innerText = "Group " + (groups.indexOf(onegroup)+1);
			// Create a list
			let ul = document.createElement("ul");
			ul.setAttribute("class","list-group");
			// Loop to create the elements of the list
			onegroup.forEach((element)=>{
				let li = document.createElement("li")
				li.setAttribute("class","list-group-item")
				li.innerText = element;
				ul.appendChild(li);
				div.appendChild(ul)
			})
			// Add the div holding the groups to the document
			document.querySelector("#groups").appendChild(div)
		})
		// Update the file content
		setFileContent(groups)
	})
	// Event listener to save the groups
	document.querySelector("#saveGroups").addEventListener("click", function() {
		// Create a Blob object with the content, specifying 'text/plain' MIME type
		const blob = new Blob([fileContent], { type: "text/plain" });

		// Create an invisible download link
		const link = document.createElement("a");
		link.href = URL.createObjectURL(blob);
		link.download = "groups"+Date()+".txt";  // Set the file name

		// Trigger the download by simulating a click event on the link
		link.click();

		// Clean up and release the URL object to free memory
		URL.revokeObjectURL(link.href);
	});
	// Add event listenr to start the timer
	let lock = false;
	document.querySelector("#timerStart").addEventListener("click", function(){
		let tDuration = 0;
		if(!lock)
		{
			minutes = document.querySelector("#timerDuration").value;
			seconds = 0;
			lock = true;
		}
		let interval = startTimer(minutes,seconds)
		// Add event listener to stop the timer
		document.querySelector("#timerStop").addEventListener("click",function(){
			clearInterval(interval)
		})
		document.querySelector("#timerReset").addEventListener("click", function (){
			clearInterval(interval)
			lock = false
			timerElement.innerText = `00:00`;
		})
	})
});
