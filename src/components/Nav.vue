
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
                    <v-btn @click='exportJSON(uploadedData), exportPDF(uploadedData), exportCSV(uploadedData)'>Export All</v-btn>
                </v-card-actions>
                </v-card>
            </v-menu>
            </v-col>
        </v-toolbar>
    </div>
</template>



<script>

import json from "./myData.json";
import {saveNewTask, saveNewEmployee, exportJSON, exportPDF, exportCSV } from '../utils/helpers';


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
        exportJSON,
        exportPDF,
        exportCSV
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