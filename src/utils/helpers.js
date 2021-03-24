
const saveNewTask = function(uploadedData) {
    uploadedData.Tasks.push({ name: this.taskName, hours: this.hours });
    this.taskName = null;
    this.hours = null;
    this.addTaskMenu = false;
};

const saveNewEmployee = function(uploadedData) {
    uploadedData.Roles.push({ name: this.employeeName, avgHours: this.avgHours, tasks: [] });
    this.employeeName = null;
    this.avgHours = null;
    this.addEmployeeMenu = false;
};

const deleteTask = function(role, task, uploadedData) {
    uploadedData.Roles[role].tasks.splice(task, 1);
};

const editTask = function(role, task, uploadedData) {
    Object.assign(uploadedData.Roles[role].tasks[task], {
    name: this.taskName,
    hours: this.hours
    });
    this.taskName = null;
    this.hours = null;
}

const setEditData = function(taskData) {
    this.taskName = taskData.name;
    this.hours = taskData.hours;
}

const cloneTask = function(task, role, uploadedData) {
    uploadedData.Roles[role].tasks.push(task);
}

const editAvgHours = function(r, uploadedData) {
    Object.assign(uploadedData.Roles[r], {
        name: this.newEmployeeName,
        avgHours: this.avgHours,
    });
    this.newEmployeeName = null;
    this.avgHours = null;
}

const setEditAvgHours = function(itemData) {
    this.newEmployeeName = itemData.name;
    this.avgHours = itemData.avgHours;
}

const deleteEmployee = function(r, item, uploadedData) {
    uploadedData.Roles.splice(r,1);
};

module.exports = { saveNewTask, saveNewEmployee, deleteTask, editTask, setEditData, cloneTask, setEditAvgHours, editAvgHours, deleteEmployee };