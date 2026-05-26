const DB_URL = "https://lb7sherenok-default-rtdb.europe-west1.firebasedatabase.app/todos";

let todos = [];

const list = document.getElementById("todo-list");
const itemCountSpan = document.getElementById("item-count");
const uncheckedCountSpan = document.getElementById("unchecked-count");

const loading = document.getElementById("loading");
const errorBlock = document.getElementById("error");


// ==========================
// ЗБЕРЕЖЕННЯ В БД (POST)
// ==========================

async function addTodo(todo) {

    try {

        showLoading(true);

        const response = await fetch(`${DB_URL}.json`, {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify({
                text: todo.text,
                completed: todo.completed
            })
        });

        const data = await response.json();

        // Firebase повертає:
        // { name: "random_id" }

        todo.id = data.name;

        todos.push(todo);

        render();

    } catch (error) {

        showError("Помилка додавання");

    } finally {

        showLoading(false);

    }
}


// ==========================
// ОТРИМАННЯ ДАНИХ (GET)
// ==========================

async function loadTodos() {

    try {

        showLoading(true);

        const response = await fetch(`${DB_URL}.json`);

        const data = await response.json();

        todos = [];

        if (data) {

            for (let key in data) {

                todos.push({
                    id: key,
                    text: data[key].text,
                    completed: data[key].completed
                });
            }
        }

        render();

    } catch (error) {

        showError("Помилка завантаження");

    } finally {

        showLoading(false);

    }
}


// ==========================
// ОНОВЛЕННЯ (PATCH)
// ==========================

async function updateTodo(todo) {

    try {

        showLoading(true);

        await fetch(`${DB_URL}/${todo.id}.json`, {
            method: "PATCH",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify({
                completed: todo.completed
            })
        });

    } catch (error) {

        showError("Помилка оновлення");

    } finally {

        showLoading(false);

    }
}


// ==========================
// ВИДАЛЕННЯ (DELETE)
// ==========================

async function deleteTodo(id) {

    try {

        showLoading(true);

        await fetch(`${DB_URL}/${id}.json`, {
            method: "DELETE"
        });

        todos = todos.filter(todo => todo.id !== id);

        render();

    } catch (error) {

        showError("Помилка видалення");

    } finally {

        showLoading(false);

    }
}


// ==========================
// СТВОРЕННЯ НОВОЇ СПРАВИ
// ==========================

function newTodo() {

    const text = prompt("Введіть нову справу");

    if (!text || text.trim() === "") {
        return;
    }

    const todo = {
        text: text,
        completed: false
    };

    addTodo(todo);
}


// ==========================
// ПЕРЕКЛЮЧЕННЯ СТАТУСУ
// ==========================

function toggleTodo(id) {

    const todo = todos.find(t => t.id === id);

    todo.completed = !todo.completed;

    updateTodo(todo);

    render();
}


// ==========================
// РЕНДЕР
// ==========================

function render() {

    list.innerHTML = "";

    todos.forEach(todo => {

        const li = document.createElement("li");

        li.innerHTML = `
            <input
                type="checkbox"
                ${todo.completed ? "checked" : ""}
            >

            <span>
                ${todo.text}
            </span>

            <button>
                Видалити
            </button>
        `;

        const checkbox = li.querySelector("input");

        checkbox.addEventListener("change", () => {
            toggleTodo(todo.id);
        });

        const button = li.querySelector("button");

        button.addEventListener("click", () => {
            deleteTodo(todo.id);
        });

        list.appendChild(li);
    });

    itemCountSpan.textContent = todos.length;

    uncheckedCountSpan.textContent =
        todos.filter(todo => !todo.completed).length;
}


// ==========================
// LOADING
// ==========================

function showLoading(value) {

    loading.style.display = value
        ? "block"
        : "none";
}


// ==========================
// ERROR
// ==========================

function showError(message) {

    errorBlock.textContent = message;

    setTimeout(() => {
        errorBlock.textContent = "";
    }, 3000);
}


// ==========================
// СТАРТ
// ==========================

loadTodos();