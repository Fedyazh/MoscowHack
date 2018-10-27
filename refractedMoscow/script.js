const todoForm = document.querySelector('.todo-form');
const taskList = document.querySelector('.tasks-for-buy');

todoForm.addEventListener('submit', addTask);


function addTask(event) {
    event.preventDefault();

    const inputTask = event.target.querySelector('#new-task');
    const taskText = inputTask.value;

    const task = `
        <li class="task">
                <label class="task-text">${taskText}</label>
                <input type="text"/>
                <button class="delete">Delete</button>
            </li>
        `;

    taskList.innerHTML += task;
    inputTask.value = '';

    const btnDeleteTask = taskList.querySelectorAll('.task');
    console.log(btnDeleteTask);

    btnDeleteTask.forEach((elem) => {
        elem.addEventListener('click', deleteTask)

    })
}


function deleteTask(e) {
    const childTask = e.target.parentNode;

    taskList.removeChild(childTask);


}





