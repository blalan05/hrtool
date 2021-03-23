
<template>
    <div>
        <v-toolbar dense fixed>
            <v-col>
            <v-menu offset-y :close-on-content-click="false" v-model="addTaskMenu">
                <template #activator="{ on }">
                <v-btn v-on="on">Add Task</v-btn>
                </template>
                <v-card>
                <v-card-text>
                    <v-text-field label="Task Name" v-model="taskName"></v-text-field>
                    <v-text-field
                    label="Amount"
                    suffix="hrs"
                    hint="Hours per Week"
                    v-model="hours"
                    ></v-text-field>
                </v-card-text>
                <v-card-actions>
                    <v-btn @click="saveNewTask(uploadedData)">Save</v-btn>
                </v-card-actions>
                </v-card>
            </v-menu>
            </v-col>
            <v-menu offset-y :close-on-content-click="false">
                <template #activator="{ on }">
                <v-btn v-on="on">Add Employee</v-btn>
                </template>
                <v-card>
                <v-card-text>
                    <v-text-field label="Employee" v-model="employeeName"></v-text-field>
                    <v-text-field label="Avg Hours" v-model="avgHours" suffix='hrs' hint='Average hours per week'></v-text-field>
                </v-card-text>
                <v-card-actions>
                    <v-btn @click="saveNewEmployee(uploadedData)">Save</v-btn>
                </v-card-actions>
                </v-card>
            </v-menu>
            <v-col>
            <v-menu offset-y :close-on-content-click="false">
                <template #activator="{ on }">
                    <v-btn v-on="on">Export</v-btn>
                <!-- <v-btn v-on="on" @click="exportJSON(uploadedData)">Export JSON</v-btn> -->
                </template>
                <v-card>
                <v-card-text>
                    <v-text-field id='fileName' label="Filename" v-model="filename"></v-text-field>
                </v-card-text>
                <v-card-actions>
                    <v-btn @click='exportJSON(uploadedData)'>Export JSON</v-btn>
                </v-card-actions>
                <v-card-actions>
                    <v-btn @click='exportPDF(uploadedData)'>Export PDF</v-btn>
                </v-card-actions>
                <v-card-actions>
                    <v-btn @click='exportCSV(uploadedData)'>Export Excel</v-btn>
                </v-card-actions>
                <v-card-actions>
                    <v-btn>Export All</v-btn>
                </v-card-actions>
                </v-card>
            </v-menu>
            </v-col>
            <!-- <v-col>
                <v-text-field id='fileName' label="Filename" v-model="filename"></v-text-field>
            </v-col> -->
        </v-toolbar>
    </div>
</template>



<script>

import json from "./myData.json";
import {saveNewTask, saveNewEmployee } from '../utils/helpers';

const pdfMake= require('pdfmake/build/pdfmake.js');
const pdfFonts = require('pdfmake/build/vfs_fonts.js');
pdfMake.vfs = pdfFonts.pdfMake.vfs;

import XLSX from 'xlsx';

export default {
    name: "Nav",
    data: () => ({
        addTaskMenu: false,
        addEmployeeMenu: false,
        employeeName: null,
        avgHours: null,
        taskName: null,
        hours: null,
        filename: null,
        taskList: [],
        roles: []
    }),
    props: ['uploadedData'],
    methods: {
        saveNewTask,
        saveNewEmployee,
        exportJSON(uploadedData) {
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
        },
        exportPDF(uploadedData) {
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
        },
        exportCSV(uploadedData) {
            //defines the default export filename and overwrites if the user adds a filename
            let enteredFileName = document.getElementById('fileName').value;
            let filename = 'employee_tasks.xlsx';
            if (enteredFileName.length > 0) {
                filename = enteredFileName + '.xlsx';
            }
            document.getElementById('fileName').value = '';



// -----------------------------------------Previous Attempt---------------------------------------------------------


            // let ideaArray = [];
            // let ideaName = [];
            // let ideaHours = [];
            // let ideaTitle = [];
            // let ideaTask = [];
            // let ideaTotal = [];

            // //find longest task list index
            // let maxTask = 0
            // let maxIndex = 0
            // for (let i = 0; i<uploadedData.Roles.length; i++) {
            //     if (uploadedData.Roles[i].tasks.length > maxTask) {
            //         maxTask = uploadedData.Roles[i].tasks.length
            //         maxIndex = i
            //     }
            // }
   
            //creates the aoa for the tasklist (only the first 4 employees)
            // let count = 1
            // let employeeCount = 0

            // for (let j = 0; j<uploadedData.Roles[maxIndex].tasks.length; j++) {
            //     let tempArray = [];
            //     while (count < (employeeCount*4)) {
            //         if (uploadedData.Roles[count-1].tasks[j-1] === undefined) {
            //             //console.log(uploadedData.Roles[(count-1)].tasks[j-1].name)
            //             console.log('count ' + count)
            //             console.log('while limit ' + employeeCount*4)
            //             tempArray.push('','','','','');
            //             count += 1
            //         } else{
            //             console.log(uploadedData.Roles[(count-1)].tasks[j-1].name)
            //             console.log('j-1 ' + (j-1))
            //             console.log('count ' + count)
            //             console.log('while limit ' + employeeCount*4)
            //             tempArray.push(uploadedData.Roles[count-1].tasks[j-1].name, parseInt(uploadedData.Roles[count-1].tasks[j-1].hours), Math.floor((uploadedData.Roles[count-1].tasks[j-1].hours/uploadedData.Roles[count-1].avgHours)*100), '', '');
            //             count += 1
            //         }
            //     }
            //     employeeCount += 1
            //     ideaTask.push(tempArray);
            // }
            // console.log(ideaTask);





            // var jk = 0;
            // for (let j = 0; j<uploadedData.Roles[maxIndex].tasks.length; j++) {
            //     let tempArray = [];
            //     if(uploadedData.Roles.length > (4*(j+1))){
            //         for (let k = jk; k<4*(j+1); k++) {
            //             if (uploadedData.Roles[k].tasks[j] === undefined) {
            //                 tempArray.push('','','','','');
            //             } else{
            //                 tempArray.push(uploadedData.Roles[k].tasks[j].name, parseInt(uploadedData.Roles[k].tasks[j].hours), Math.floor((uploadedData.Roles[k].tasks[j].hours/uploadedData.Roles[k].avgHours)*100), '', '');
            //             }
            //         }
            //         ideaTask.push(tempArray);
            //     } else {
            //         console.log((uploadedData.Roles.length - (4*(j+1))))
            //     }
            // }
            // console.log(ideaTask);

            // for (let i =0; i<uploadedData.Roles.length; i++){
            //     if(!((i+1)% 4 === 0)) {
            //         ideaName.push(uploadedData.Roles[i].name, '','','','');
            //         ideaHours.push('Average Hours', parseInt(uploadedData.Roles[i].avgHours), 'Assigned Hours', uploadedData.Roles[i].assignedHours, '')
            //         ideaTitle.push('Task', 'Hours', 'Percent','','')
            //         ideaTotal.push('Total', null, null,'','')
            //     } else {
            //         ideaName.push(uploadedData.Roles[i].name, '','','','');
            //         ideaHours.push('Average Hours', parseInt(uploadedData.Roles[i].avgHours), 'Assigned Hours', uploadedData.Roles[i].assignedHours, '')
            //         ideaTitle.push('Task', 'Hours', 'Percent','','')
            //         ideaTotal.push('Total', null, null,'','')

            //         //adding to total array
            //         ideaArray.push(ideaName);
            //         ideaArray.push(ideaHours);
            //         ideaArray.push(ideaTitle);

            //         //loops through ideaTask to populate tasks (only first 4 employees)
            //         for (let i = 0; i<ideaTask.length; i++) {
            //             ideaArray.push(ideaTask[i]);
            //         }

            //         ideaArray.push(ideaTotal);
            //         ideaArray.push(['']);
            //         ideaArray.push(['']);

            //         //clear temp arrays
            //         ideaName = [];
            //         ideaHours = [];
            //         ideaTitle = [];
            //         // ideaTask = [];
            //         ideaTotal = [];
            //     }
            // }
            // ideaArray.push(ideaName);
            // ideaArray.push(ideaHours);
            // ideaArray.push(ideaTitle);
            // //ideaArray.push(ideaTask[0]);
            // ideaArray.push(ideaTotal);


//----------------------------------------------Initial Chunking Attempt----------------------------------------

            // let ideaArray = [];
            let ideaName = [];
            let ideaHours = [];
            let ideaTitle = [];
            let ideaTask = [];
            let ideaTotal = [];
            let ideaArray = [];
            let perChunk = 4;
            
            let result = uploadedData.Roles.reduce((resultArray, user, index) => {
                const chunkIndex = Math.floor(index/perChunk)

                if(!resultArray[chunkIndex]) {
                    resultArray[chunkIndex] = []
                }

                resultArray[chunkIndex].push(user)

                return resultArray
            }, [])

            let allUsers = [];

            for (let i = 0; i < result.length; i++) {
                let userRow = [];
                let userNames = [];
                let userHours = [];
                let userTasks = [];


                //find longest task list length
                let maxTask = result[i].reduce((total, u) => total = u.tasks.length > total? u.tasks.length : total, 0)

                for (let j = 0; j <result[i].length; j++) {
                    userNames.push(result[i][j].name, '','','','');
                    userHours.push('Average Hours', parseInt(result[i][j].avgHours), 'Assigned Hours', result[i][j].assignedHours, '')
                

                    let tempArray = [];
                    for (let k = 0; k<maxTask; k++) {
                        if (result[i][j].tasks[k] === undefined) {
                            tempArray.push('','','','','');
                        } else{
                            tempArray.push(result[i][j].tasks[k].name, parseInt(result[i][j].tasks[k].hours), Math.floor((result[i][j].tasks[k].hours/result[i][j].avgHours)*100), '', '');
                        }
                    }
                    userTasks.push(tempArray);

            
                    // for (let j = 0; j<uploadedData.Roles[maxIndex].tasks.length; j++) {
                    //     let tempArray = [];
                    //     if(uploadedData.Roles.length > (4*(j+1))){
                    //         for (let k = jk; k<4*(j+1); k++) {
                    //             if (uploadedData.Roles[k].tasks[j] === undefined) {
                    //                 tempArray.push('','','','','');
                    //             } else{
                    //                 tempArray.push(uploadedData.Roles[k].tasks[j].name, parseInt(uploadedData.Roles[k].tasks[j].hours), Math.floor((uploadedData.Roles[k].tasks[j].hours/uploadedData.Roles[k].avgHours)*100), '', '');
                    //             }
                    //         }
                    //         ideaTask.push(tempArray);
                    //     } else {
                    //         console.log((uploadedData.Roles.length - (4*(j+1))))
                    //     }
                    // }
                    // console.log(ideaTask);


                }
                console.log(userTasks);

                userRow.push(userNames);
                userRow.push(userHours)
                userRow.push(['Task', 'Hours', 'Percent','',''])
                userRow.push(userTasks);
                userTasks = [];
                userRow.push(['Total', null, null,'',''])
                userRow.push([''], ['']);
                allUsers.push(userRow);
            }




            for (let i =0; i<uploadedData.Roles.length; i++){
                if(!((i+1)% 4 === 0)) {
                    ideaName.push(uploadedData.Roles[i].name, '','','','');
                    ideaHours.push('Average Hours', parseInt(uploadedData.Roles[i].avgHours), 'Assigned Hours', uploadedData.Roles[i].assignedHours, '')
                    ideaTitle.push('Task', 'Hours', 'Percent','','')
                    ideaTotal.push('Total', null, null,'','')
                } else {
                    ideaName.push(uploadedData.Roles[i].name, '','','','');
                    ideaHours.push('Average Hours', parseInt(uploadedData.Roles[i].avgHours), 'Assigned Hours', uploadedData.Roles[i].assignedHours, '')
                    ideaTitle.push('Task', 'Hours', 'Percent','','')
                    ideaTotal.push('Total', null, null,'','')

                    //adding to total array
                    ideaArray.push(ideaName);
                    ideaArray.push(ideaHours);
                    ideaArray.push(ideaTitle);

                    //loops through ideaTask to populate tasks (only first 4 employees)
                    for (let i = 0; i<ideaTask.length; i++) {
                        ideaArray.push(ideaTask[i]);
                    }

                    ideaArray.push(ideaTotal);
                    ideaArray.push(['']);
                    ideaArray.push(['']);

                    //clear temp arrays
                    ideaName = [];
                    ideaHours = [];
                    ideaTitle = [];
                    // ideaTask = [];
                    ideaTotal = [];
                }
            }
            ideaArray.push(ideaName);
            ideaArray.push(ideaHours);
            ideaArray.push(ideaTitle);
            //ideaArray.push(ideaTask[0]);
            ideaArray.push(ideaTotal);



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
            let ws = XLSX.utils.aoa_to_sheet(ideaArray);
            let ws_name = 'All Employees';
            XLSX.utils.aoa_to_sheet(ideaArray);
            XLSX.utils.book_append_sheet(wb,ws, ws_name);

            //exports the file
            XLSX.writeFile(wb, filename, false);
        }
    },
    filters: {
        totalPercentage(data) {
        let total = 0;
        data.forEach(task => {
            total += parseFloat(task.hours);
        });
        return `${total}%`;
        }
    },
    created() {
        this.roles = json.Roles;
        this.taskList = json.Tasks;
    }
};
</script>