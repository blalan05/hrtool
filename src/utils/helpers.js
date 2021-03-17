
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

module.exports = { saveNewTask, saveNewEmployee, deleteTask, editTask, setEditData, cloneTask, setEditAvgHours, editAvgHours, deleteEmployee };