
const pdfMake= require('pdfmake/build/pdfmake.js');
const pdfFonts = require('pdfmake/build/vfs_fonts.js');
pdfMake.vfs = pdfFonts.pdfMake.vfs;


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


const exportJSON = function(uploadedData) {
    let textToSave = JSON.stringify(uploadedData);
    let enteredFileName = document.getElementById('fileName').value;
    let filename = 'employee_tasks.json';
    if (enteredFileName.length > 0) {
        filename = enteredFileName + '.json';
    }
    document.getElementById('fileName').value = '';
    let element = document.createElement('a');

    element.setAttribute('href', 'data:application/json,' + textToSave);
    element.setAttribute('download', filename);
    element.style.display = 'none';
    document.body.appendChild(element);
    element.click();
    document.body.removeChild(element);
};

const exportPDF = function(uploadedData) {
    let enteredFileName = document.getElementById('fileName').value;
    let filename = 'employee_tasks.pdf';
    if (enteredFileName.length > 0) {
        filename = enteredFileName + '.pdf';
    }
    document.getElementById('fileName').value = '';

    let today = new Date();
    let currentMinutes = today.getMinutes();
    if (currentMinutes < 10) {
        currentMinutes = '0'+currentMinutes;
    }
    let dateHeader = (today.getMonth() + 1) + '/' + today.getDate() + '/' + today.getFullYear() + ' ' + today.getHours() + ':' + currentMinutes;


    let docDefinition = {
        header: { text: dateHeader, margin: [0, 15, 25, 0], alignment: 'right'},
        footer: function(currentPage, pageCount) { return { text: currentPage.toString() + ' of ' + pageCount, margin: [0,0,25,0], alignment: 'right' } },
        content: [],
        styles: {
            header: {
                fontSize: 14,
                bold: true,
                margin: [30, 0, 25, 0],
            },
            subheader: {
                fontSize: 12,
                bold: false,
                margin: [30, 0, 25, 0],
            },
            tableHeader: {
                fontSize: 14,
                bold: true,
                alignment: 'center'
            },
            exampleTable: {
                margin: [30, 5, 30, 15],
            }
        }
    };
    for (let i = 0; i<uploadedData.Roles.length; i++){
        docDefinition.content.push({text: `Name : ${uploadedData.Roles[i].name}`, style: 'header'});
        docDefinition.content.push({text: `Average Hours: ${uploadedData.Roles[i].avgHours},    Assigned Hours: ${uploadedData.Roles[i].assignedHours}`, style: 'subheader'});
        docDefinition.content.push({
            style: 'exampleTable', 
            table: {
                headerRows: 1,
                widths: [305, 60, 60],
                body: []
            },
            layout: {
                fillColor: function (rowIndex) {
                    return (rowIndex % 2 === 0) ? '#CCCCCC' : null;
                }
            }
        });
        let currentAvgHr = uploadedData.Roles[i].avgHours;
        docDefinition.content[(3*i)+2].table.body.push([{text: 'Tasks', style: 'tableHeader'}, {text: 'Hours', style: 'tableHeader'}, {text: 'Percent', style: 'tableHeader'}]);

        // Sort the tasks by amount of hours with max coming first
        uploadedData.Roles[i].tasks.sort(function(a,b) {
            return b.hours - a.hours
        });

        for (let j = 0; j <uploadedData.Roles[i].tasks.length; j++) {
            docDefinition.content[(3*i)+2].table.body.push(Object.values(uploadedData.Roles[i].tasks[j]));
            let currentTaskHr = uploadedData.Roles[i].tasks[j].hours;
            docDefinition.content[(3*i)+2].table.body[(j+1)].push(Math.floor((currentTaskHr/currentAvgHr)*100));
        }
    }
    pdfMake.createPdf(docDefinition).download(filename);
};

module.exports = { saveNewTask, saveNewEmployee, deleteTask, editTask, setEditData, cloneTask, setEditAvgHours, editAvgHours, deleteEmployee, exportJSON, exportPDF };