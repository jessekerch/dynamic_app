document.addEventListener("DOMContentLoaded", () => {
  const apiBaseUrl = "/api/";

  const pgContainer = document.getElementsByClassName("pg-container");
  const pgForm = pgContainer.item(0).querySelector(".form-container");
  const pgNotesList = document.getElementById("pg-notes-list");

  const mongoContainer = document.getElementsByClassName("mongo-container");
  const mongoForm = mongoContainer.item(0).querySelector(".form-container");
  const mongoNotesList = document.getElementById("mongo-notes-list");

  const modal = document.querySelector("#edit-modal");

  const makeRequest = async (path, method, body = null) => {
    const url = apiBaseUrl + path;
    const options = {
      method,
      headers: { "Content-Type": "application/json" },
    };

    if (body) {
      options.body = JSON.stringify(body);
    }

    try {
      const response = await fetch(url, options);
      if (!response.ok) {
        const errorText = await response.text();
        throw new Error(`status: ${response.status} - ${errorText} `);
      }

      if (response.status === 204) {
        return "Note Deleted!";
      }

      const res = await response.json();
      return res;
    } catch (error) {
      throw error;
    }
  };

  const displayNotes = (notes, dbName) => {
    const notesList = dbName === "pg" ? pgNotesList : mongoNotesList;
    notesList.innerHTML = "";

    if (notes.length == 0) {
      const noteItem = document.createElement("li");
      noteItem.textContent = "No Notes To Display";

      notesList.appendChild(noteItem);
    }

    notes.forEach((note) => {
      const noteItem = document.createElement("li");
      noteItem.innerHTML = `
        <span class="note-text">${note.note}</span>
        <div class="note-actions">
          <button class="edit-btn" data-id="${note.id}">Edit</button>
          <button class="delete-btn" data-id="${note.id}">Delete</button>
        </div>
      `;

      notesList.appendChild(noteItem);
    });
  };

  const fetchNotes = async (dbName) => {
    try {
      const notes = await makeRequest(dbName, "GET");
      displayNotes(notes, dbName);
    } catch (error) {
      alert(error.message);
    }
  };

  const deleteNote = async (id, dbName) => {
    try {
      return await makeRequest(`${dbName}/${id}`, "DELETE");
    } catch (error) {
      alert(error.message);
    }
  };

  const submitModalForm = async (event) => {
    event.preventDefault();
    const userInput = modalForm.elements[0].value;

    if (userInput === "") {
      alert("Please Enter a Valid Note");
      return;
    }

    const updatedNote = { note: userInput };

    try {
      const res = await makeRequest(modalForm.dataset.path, "PUT", updatedNote);
      modal.style.display = "none";
      modalForm.reset();
      fetchNotes(modalForm.dataset.dbName);
      return res;
    } catch (error) {
      alert(error.message);
    }
  };

  const updateNote = (id, dbName) => {
    modal.style.display = "block";
    const path = `${dbName}/${id}`;
    modalForm = modal.querySelector(".form-container");
    modalForm.dataset.path = path;
    modalForm.dataset.dbName = dbName;

    modalForm.removeEventListener("submit", submitModalForm);
    modalForm.addEventListener("submit", submitModalForm);
  };

  pgForm.addEventListener("submit", async (event) => {
    event.preventDefault();
    const userInput = pgForm.elements[0].value;

    if (userInput === "") {
      alert("Please Enter a Valid Note");
      return;
    }
    const newNote = { note: userInput };
    pgForm.reset();

    try {
      const res = await makeRequest("pg", "POST", newNote);
      fetchNotes("pg");
      alert(`Note ${res.note} Added!`);
    } catch (error) {
      alert(error.message);
    }
  });

  pgNotesList.addEventListener("click", async (event) => {
    event.preventDefault();
    const element = event.target.tagName;
    const className = event.target.className;

    if (element === "BUTTON" && className === "delete-btn") {
      if (confirm("Are You Sure?")) {
        const id = event.target.dataset.id;
        const res = await deleteNote(id, "pg");
        alert(res);
        fetchNotes("pg");
      }
    } else if (element === "BUTTON" && className === "edit-btn") {
      const id = event.target.dataset.id;
      updateNote(id, "pg");
    }
  });

  mongoForm.addEventListener("submit", async (event) => {
    event.preventDefault();
    const userInput = mongoForm.elements[0].value;

    if (userInput === "") {
      alert("Please Enter a Valid Note");
      return;
    }
    const newNote = { note: userInput };
    mongoForm.reset();

    try {
      const res = await makeRequest("mongo", "POST", newNote);
      fetchNotes("mongo");
      alert(`Note ${res.note} Added!`);
    } catch (error) {
      alert(error.message);
    }
  });

  mongoNotesList.addEventListener("click", async (event) => {
    event.preventDefault();
    const element = event.target.tagName;
    const className = event.target.className;

    if (element === "BUTTON" && className === "delete-btn") {
      if (confirm("Are You Sure?")) {
        const id = event.target.dataset.id;
        const res = await deleteNote(id, "mongo");
        alert(res);
        fetchNotes("mongo");
      }
    } else if (element === "BUTTON" && className === "edit-btn") {
      const id = event.target.dataset.id;
      updateNote(id, "mongo");
    }
  });

  window.addEventListener("click", (event) => {
    if (event.target === modal) {
      modal.style.display = "none";
    }
  });

  fetchNotes("pg");
  fetchNotes("mongo");
});
