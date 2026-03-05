let items = [
	"Сделать проектную работу",
	"Полить цветы",
	"Пройти туториал по Реакту",
	"Сделать фронт для своего проекта",
	"Прогуляться по улице в солнечный день",
	"Помыть посуду",
];

const listElement = document.querySelector(".to-do__list");
const formElement = document.querySelector(".to-do__form");
const inputElement = document.querySelector(".to-do__input");

function loadTasks() {
	const raw = localStorage.getItem('tasks');
	if (raw) {
		try {
			const parsed = JSON.parse(raw);
			if (Array.isArray(parsed)) return parsed;
		} catch (e) {
			// ignore and fall back to defaults
		}
	}

	return items;

}

function createItem(item) {
	const template = document.getElementById("to-do__item-template");
	const clone = template.content.querySelector(".to-do__item").cloneNode(true);
	const textElement = clone.querySelector(".to-do__item-text");
	const deleteButton = clone.querySelector(".to-do__item-button_type_delete");
	const duplicateButton = clone.querySelector(".to-do__item-button_type_duplicate");
	const editButton = clone.querySelector(".to-do__item-button_type_edit");

	// set task text
	textElement.textContent = item;

	// delete task
	deleteButton.addEventListener('click', () => {
		clone.remove();
		const tasks = getTasksFromDOM();
		saveTasks(tasks);
	});

	// duplicate task (prepend copy)
	duplicateButton.addEventListener('click', () => {
		const itemName = textElement.textContent;
		const newItem = createItem(itemName);
		listElement.prepend(newItem);
		const tasks = getTasksFromDOM();
		saveTasks(tasks);
	});

	// enable editing
	editButton.addEventListener('click', () => {
		textElement.setAttribute('contenteditable', 'true');
		textElement.focus();
	});

	// save on blur after editing
	textElement.addEventListener('blur', () => {
		textElement.setAttribute('contenteditable', 'false');
		const tasks = getTasksFromDOM();
		saveTasks(tasks);
	});

	return clone;

}

function getTasksFromDOM() {
	const itemsNamesElements = document.querySelectorAll('.to-do__item-text');
	const tasks = [];
	itemsNamesElements.forEach((el) => tasks.push(el.textContent));
	return tasks;

}

function saveTasks(tasks) {
	localStorage.setItem('tasks', JSON.stringify(tasks));

}

// initialize app: load and render tasks, wire form
items = loadTasks();
items.forEach((item) => {
	const el = createItem(item);
	listElement.append(el);
});

formElement.addEventListener('submit', (evt) => {
	evt.preventDefault();
	const value = inputElement.value.trim();
	if (!value) return;
	const el = createItem(value);
	listElement.prepend(el);
	inputElement.value = '';
	items = getTasksFromDOM();
	saveTasks(items);
});

