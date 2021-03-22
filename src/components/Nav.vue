
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
                    <v-btn @click="exportJSON(uploadedData)">Export JSON</v-btn>
                </v-card-actions>
                <v-card-actions>
                    <v-btn @click='createPDF(uploadedData)'>Export PDF</v-btn>
                </v-card-actions>
                <v-card-actions>
                    <v-btn>Export Excel</v-btn>
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
        createPDF(uploadedData) {
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