import XLSX from 'xlsx';

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

const exportCSV = function(uploadedData) {
    //defines the default export filename and overwrites if the user adds a filename
    let enteredFileName = document.getElementById('fileName').value;
    let filename = 'employee_tasks.xlsx';
    if (enteredFileName.length > 0) {
        filename = enteredFileName + '.xlsx';
    }
    document.getElementById('fileName').value = '';

// -----------------------------------Created Individual Employee Sheets -------------------------------------
    //create new excel book
    let wb = XLSX.utils.book_new();
    //loops through each employee in the json file and creates approriate aoa
    for (let i = 0; i < uploadedData.Roles.length; i++) {
        //creates a parent array for each employee
        let wsArray = [];
        let nameArray = [uploadedData.Roles[i].name];
        wsArray.push(nameArray);

        let hoursArray = ['Average Hours', parseInt(uploadedData.Roles[i].avgHours), 'Assigned Hours', uploadedData.Roles[i].assignedHours];
        wsArray.push(hoursArray);

        let titleArray = ['Task', 'Hours', 'Percent'];
        wsArray.push(titleArray);

        for (let j = 0; j < uploadedData.Roles[i].tasks.length; j++) {
            let taskArray = [uploadedData.Roles[i].tasks[j].name, parseInt(uploadedData.Roles[i].tasks[j].hours), Math.floor((uploadedData.Roles[i].tasks[j].hours/uploadedData.Roles[i].avgHours)*100)];
            wsArray.push(taskArray);
        }

        let totalArray = ['Total', null, null];
        wsArray.push(totalArray);

        //gives the length of the array (ie where to but functions) in Column B and C
        let formulaHeight = wsArray.length;
        //adds data to the current worksheet
        let ws = XLSX.utils.aoa_to_sheet(wsArray);

        //add function for the total hours and percent
        ws[`B${formulaHeight}`] = {f: `SUM(B4:B${formulaHeight-1})`};
        ws[`C${formulaHeight}`] = {f: `SUM(C4:C${formulaHeight-1})`};

        //adds name to worksheet and adds worksheet to the excelbook
        let ws_name = uploadedData.Roles[i].name;
        XLSX.utils.book_append_sheet(wb,ws, ws_name);
    }


//----------------------------------------------Initial Chunking for All Employees Sheet---------------------------------------------------

    // Splits the Employees into arrays of max length 4
    let perChunk = 4;
    let result = uploadedData.Roles.reduce((resultArray, user, index) => {
        const chunkIndex = Math.floor(index/perChunk)

        if(!resultArray[chunkIndex]) {
            resultArray[chunkIndex] = []
        }

        resultArray[chunkIndex].push(user)

        return resultArray
    }, [])

    let userRow = [];
    // loops through each individual sub array in the result array (max 4 employees)
    for (let i = 0; i < result.length; i++) {
        //define temp user arrays for each result subarray
        let userNames = [];
        let userHours = [];
        let userTitle = [];
        let userTotal = [];

        //find longest task list length
        let maxTask = result[i].reduce((total, u) => total = u.tasks.length > total? u.tasks.length : total, 0)
        //loop throught the tasks of each employee until reaching the end of the longest task array
        for (let j = 0; j <result[i].length; j++) {
            userNames.push(result[i][j].name, '','','','');
            userHours.push('Average Hours', parseInt(result[i][j].avgHours), 'Assigned Hours', result[i][j].assignedHours, '')
            userTitle.push('Task', 'Hours', 'Percent','','')
            userTotal.push('Total', null, null,'','');
        }
    
        userRow.push(userNames);
        userRow.push(userHours);
        userRow.push(userTitle);

        //loops through each employee (max 4) at the given task
        for (let k = 0; k<maxTask; k++) {
            let tempArray = [];
            for (let j = 0; j < result[i].length; j++) {
                if (result[i][j].tasks[k] === undefined) {
                    tempArray.push('','','','','');
                } else{
                    tempArray.push(result[i][j].tasks[k].name, parseInt(result[i][j].tasks[k].hours), Math.floor((result[i][j].tasks[k].hours/result[i][j].avgHours)*100), '', '');
                }
            }
            userRow.push(tempArray);
        }

        userRow.push(userTotal);
        userRow.push([''], ['']);
    }
    

    let ws = XLSX.utils.aoa_to_sheet(userRow);
    let ws_name = 'All Employees';


    //------------------------------------Add functions to the All Employees Sheet--------------------------------------------

    let runningTotal = 0;
    let sumStart = 0;
    for (let i = 0; i <result.length; i++) {
        let maxTask = result[i].reduce((total, u) => total = u.tasks.length > total? u.tasks.length : total, 0) + 4
        let columnArray = ['B', 'C', 'G', 'H', 'L', 'M', 'Q', 'R'];
        if (i > 0) {
            let lastMaxTask = result[i-1].reduce((total, u) => total = u.tasks.length > total? u.tasks.length : total, 0) + 6
            sumStart += lastMaxTask
            runningTotal += (maxTask + 2);

            //add function for the total hours and percent
            for (let j = 0; j < result[i].length; j++) {
                ws[`${columnArray[j*2]}${runningTotal}`] = {f: `SUM(${columnArray[j*2]}${sumStart}:${columnArray[j*2]}${runningTotal-1})`};
                ws[`${columnArray[(j*2)+1]}${runningTotal}`] = {f: `SUM(${columnArray[(j*2)+1]}${sumStart}:${columnArray[(j*2)+1]}${runningTotal-1})`};
            }
        } else {
            runningTotal = maxTask
            sumStart = 4

            //add function for the total hours and percent
            for (let j = 0; j < result[i].length; j++) {
                ws[`${columnArray[j*2]}${runningTotal}`] = {f: `SUM(${columnArray[j*2]}${sumStart}:${columnArray[j*2]}${runningTotal-1})`};
                ws[`${columnArray[(j*2)+1]}${runningTotal}`] = {f: `SUM(${columnArray[(j*2)+1]}${sumStart}:${columnArray[(j*2)+1]}${runningTotal-1})`};
            }
        }
    }
    XLSX.utils.book_append_sheet(wb,ws, ws_name);

    //exports the file
    XLSX.writeFile(wb, filename, false);
}

module.exports = { saveNewTask, saveNewEmployee, deleteTask, editTask, setEditData, cloneTask, setEditAvgHours, editAvgHours, deleteEmployee, exportJSON, exportPDF, exportCSV };