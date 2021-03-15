
const saveNewTask = function() {
    this.taskList.push({ name: this.taskName, percentage: this.percentage });
    this.taskName = null;
    this.percentage = null;
    this.addTaskMenu = false;
};

const saveNewEmployee = function() {
    this.roles.push({ name: this.employeeName, tasks: [] });
    this.employeeName = null;
    this.addEmployeeMenu = false;
};

const deleteTask = function(role, task) {
    this.roles[role].tasks.splice(task, 1);
};

const editTask = function(role, task) {
    Object.assign(this.roles[role].tasks[task], {
    name: this.taskName,
    percentage: this.percentage
    });
    this.taskName = null;
    this.percentage = null;
}

const setEditData = function(taskData) {
    this.taskName = taskData.name;
    this.percentage = taskData.percentage;
}

const cloneTask = function(task, role) {
    this.roles[role].tasks.push(task);
}

const upload = function() {
    console.log('entered button')
    const files = document.getElementById('selectFiles').files;
    if (files.length <= 0) {
        return false
    }

    const fr = new FileReader();

    fr.onload = e => {
        const result = JSON.parse(e.target.result);
        console.log(result)
        const formatted = JSON.stringify(result, null, 2);
        console.log(formatted)
        document.getElementById('result').innerHTML = formatted;
    }
    const uploadedData = fr.readAsText(files.item(0));
    console.log(uploadedData)
    return uploadedData;
}

module.exports = { saveNewTask, saveNewEmployee, deleteTask, editTask, setEditData, cloneTask, upload };