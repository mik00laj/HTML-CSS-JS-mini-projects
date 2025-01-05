let todoInput //miejsce, gdzie użytkownik wpisuje treść zadania
let errorInfo //info o braku zadań/koniecznośći wpisania tesktu
let addBtn //przycisk ADD, dodaje nowe elementu do listy
let ulList //lista zadań, tagi UL
let newToDo // nowy eleemnt  li

let popup //popup
let popupInfo //tekst w popupie jak sie doda pusty tekst
let todoToEdit //edytowany Todo
let popupInput // input w popupie
let popupAddBtn //przycisk zatwierdz w popupie
let popupCloseBtn // przycisk anuluj w popupie

const main = () => {
	prepareDOMEelements()
	prepareDOMEvents()
}

const prepareDOMEelements = () => {
	todoInput = document.querySelector('.todo-input')
	errorInfo = document.querySelector('.error-info')
	addBtn = document.querySelector('.btn-add')
	ulList = document.querySelector('.todolist ul')

	popup = document.querySelector('.popup')
	popupInfo = document.querySelector('.popup-info')
	popupInput = document.querySelector('.popup-input')
	popupAddBtn = document.querySelector('.accept')
	popupCloseBtn = document.querySelector('.cancel')
}

const prepareDOMEvents = () => {
	addBtn.addEventListener('click', addNewTodo)
	ulList.addEventListener('click', checkClick)
	popupCloseBtn.addEventListener('click', closePopup)
	popupAddBtn.addEventListener('click', changeTodoText)
	todoInput.addEventListener('keydown', enterKeyCheck)
}

const addNewTodo = () => {
	if (todoInput.value !== '') {
		newToDo = document.createElement('li')
		newToDo.textContent = todoInput.value
		createToolsArea()
		ulList.append(newToDo)

		todoInput.value = ''
		errorInfo.textContent = 'Dodano zadanie!'
		errorInfo.style.color = 'lime'
	} else {
		errorInfo.textContent = 'Wpisz treść zadania!'
		errorInfo.style.color = 'red'
	}
}

const createToolsArea = () => {
	const tools = document.createElement('div')
	tools.classList.add('tools')
	newToDo.append(tools)

	const btnComplete = document.createElement('button')
	btnComplete.innerHTML = '<i class="fas fa-check"></i>'
	btnComplete.classList.add('complete')
	tools.append(btnComplete)

	const btnEdit = document.createElement('button')
	btnEdit.classList.add('edit')
	btnEdit.textContent = 'EDIT'
	tools.append(btnEdit)

	const btnDelete = document.createElement('button')
	btnDelete.classList.add('delete')
	btnDelete.innerHTML = '<i class="fas fa-times"></i>'
	tools.append(btnDelete)
}

const checkClick = e => {
	if (e.target.matches('.complete')) {
		e.target.closest('li').classList.toggle('completed')
		e.target.classList.toggle('completed')
	} else if (e.target.matches('.edit')) {
		editTodo(e)
	} else if (e.target.matches('.delete')) {
		deleteTodo(e)
	}
}

const editTodo = e => {
	todoToEdit = e.target.closest('li')
	popupInput.value = todoToEdit.firstChild.textContent
	popup.style.display = 'flex'
}

const deleteTodo = e => {
	todoToEdit = e.target.closest('li')
	todoToEdit.remove()
	if (document.getElementsByTagName('li').length === 0) {
		errorInfo.textContent = 'Brak zadań na liście.'
		errorInfo.style.color = 'rgb(2, 84, 161)'
	} else {
		errorInfo.textContent = ''
	}
}

const closePopup = () => {
	popup.style.display = 'none'
	popupInfo.textContent = ''
}

const changeTodoText = () => {
	if (popupInput.value !== '') {
		todoToEdit.firstChild.textContent = popupInput.value
		popup.style.display = 'none'
		popupInfo.textContent = ''
	} else {
		popupInfo.textContent = 'Musisz podać jakąś treść'
	}
}

const enterKeyCheck = e => {
	if (e.key === 'Enter') {
		addNewTodo()
	}
}

// dajemy zabezpieczenie aby nasze funkcjie włączyły sie dopiero gdy cała strona się załaduje
document.addEventListener('DOMContentLoaded', main)
