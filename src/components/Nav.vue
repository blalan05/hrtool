
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
                    suffix="%"
                    hint="Percentage out of 40hrs"
                    v-model="percentage"
                    ></v-text-field>
                </v-card-text>
                <v-card-actions>
                    <v-btn @click="saveNewTask">Save</v-btn>
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
                </v-card-text>
                <v-card-actions>
                    <v-btn @click="saveNewEmployee">Save</v-btn>
                </v-card-actions>
                </v-card>
            </v-menu>
        </v-toolbar>
    </div>
</template>



<script>

import json from "./myData.json";
import {saveNewTask, saveNewEmployee } from '../utils/helpers';
export default {
    name: "Nav",
    data: () => ({
        addTaskMenu: false,
        addEmployeeMenu: false,
        employeeName: null,
        taskName: null,
        percentage: null,
        taskList: [],
        roles: []
    }),
    methods: {
        saveNewTask,
        saveNewEmployee
    },
    filters: {
        totalPercentage(data) {
        let total = 0;
        data.forEach(task => {
            total += parseFloat(task.percentage);
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