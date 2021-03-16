
const saveNewTask = function(uploadedData) {
    console.log(uploadedData)
    uploadedData.Tasks.push({ name: this.taskName, percentage: this.percentage });
    this.taskName = null;
    this.percentage = null;
    this.addTaskMenu = false;
};

const saveNewEmployee = function(uploadedData) {
    uploadedData.Roles.push({ name: this.employeeName, tasks: [] });
    this.employeeName = null;
    this.addEmployeeMenu = false;
};

const deleteTask = function(role, task, uploadedData) {
    uploadedData.Roles[role].tasks.splice(task, 1);
};

const editTask = function(role, task, uploadedData) {
    Object.assign(uploadedData.Roles[role].tasks[task], {
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

const cloneTask = function(task, role, uploadedData) {
    uploadedData.Roles[role].tasks.push(task);
}

// const upload = function() {
//     console.log('entered button')
//     const files = document.getElementById('selectFiles').files;
//     console.log(files)
//     if (files.length <= 0) {
//         return false
//     }

//     const fr = new FileReader();
//     let uploadedData = {54: 1};
//     fr.onload = e => {
//         let result = JSON.parse(e.target.result);
//         //console.log(result);
//         console.log(uploadedData);
//         // const formatted = JSON.stringify(result, null, 2);
//         // console.log(formatted)
//         // document.getElementById('result').innerHTML = formatted;
//         uploadedData = result;
//         //console.log(uploadedData)
//     }
//     fr.readAsText(files.item(0));
//     //console.log(uploadedData);
//     return uploadedData;
// }

module.exports = { saveNewTask, saveNewEmployee, deleteTask, editTask, setEditData, cloneTask };