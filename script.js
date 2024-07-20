// connect to "output" elements
const toDoBoard = document.getElementById("to-do-div");
const inProgressBoard = document.getElementById("in-progress-div");
const completedBoard = document.getElementById("completed-div");

// if first run - create local storage items for later use
if (JSON.parse(localStorage.getItem("to-do-list")) === null) {
    localStorage.setItem("to-do-list", JSON.stringify(productList = []));
};
if (JSON.parse(localStorage.getItem("in-progress-list")) === null) {
    localStorage.setItem("in-progress-list", JSON.stringify(productList = []));
};
if (JSON.parse(localStorage.getItem("completed-list")) === null) {
    localStorage.setItem("completed-list", JSON.stringify(productList = []));
};

// draw all 3 sections of notes
function buildBoard() {
    drawSection("to-do");
    drawSection("in-progress");
    drawSection("completed");
    clearForm();
}

function addNote(e) {
    e.preventDefault();
    let note = {};
    for (const item of e.target) {
        if (item.nodeName === "BUTTON") continue;
        if (item.name === "due date") {
            note[item.name] = new Date(item.value).toUTCString();
            continue;
        }
        note[item.name] = item.value;
    }
    addNoteToList(note, "to-do")
    clearForm();
}

function addNoteToList(note, list) {
    const notes = JSON.parse(localStorage.getItem(`${list}-list`));
    notes.push(note);
    localStorage.setItem(`${list}-list`, JSON.stringify(notes));
    drawSection(list);
}

function deleteNoteFromList(index, list) {
    const notes = JSON.parse(localStorage.getItem(`${list}-list`));
    notes.splice(index, 1);
    localStorage.setItem(`${list}-list`, JSON.stringify(notes));
    drawSection(list);
}

function drawSection(section) {
    const list = JSON.parse(localStorage.getItem(`${section}-list`));
    const nextList = (section === "to-do") ? "in-progress" : "completed";
    const nextButtonText = (section === "to-do") ? "begin" : "done";
    let notes = "";
    for (let i = 0; i < list.length; i++) {
        notes += `<div class="container note"><div class="note-content">`;
        for (const key in list[i]) {
            console.log(typeof (list[i]["due date"]));
            // if (key === "date-input-field") {
            //     (list[i][key]).toUTCString()
            //     notes += `<span class="note-due-date">due by ${list[i][key].toUTCString()}</span>`;
            //     continue;
            // }
            notes += `${key}: ${(list[i][key]).replaceAll('\n', '<br>')}<br>`;
        }
        const nextButtonButton = (section === "completed") ? "" : `<button onclick="move('${section}', ${i}, '${nextList}')">${nextButtonText}</button>`;
        notes += `
            </div>
            <div class="note-actions">
                <button class="delete-button" onclick="deleteNoteFromList('${i}', '${section}')">X</button>
                ${nextButtonButton}
            </div>
        </div>`;
    }

    switch (section) {
        case "to-do":
            toDoBoard.innerHTML = notes;
            break;
        case "in-progress":
            inProgressBoard.innerHTML = notes;
            break;
        case "completed":
            completedBoard.innerHTML = notes;
            break;
        default:
            toDoBoard.innerHTML = "error drawing notes on one of the boards";
            break;
    }
}

function move(source, index, target) {
    const sourceList = JSON.parse(localStorage.getItem(`${source}-list`));
    const targetList = JSON.parse(localStorage.getItem(`${target}-list`));

    targetList.push(sourceList[index]);
    sourceList.splice(index, 1);

    localStorage.setItem(`${source}-list`, JSON.stringify(sourceList));
    localStorage.setItem(`${target}-list`, JSON.stringify(targetList));

    drawSection(source);
    drawSection(target);

}

function clearForm() {
    const allInputs = document.querySelectorAll('textarea, input');
    allInputs.forEach(singleInput => singleInput.value = '');
    allInputs[0].focus();
}
