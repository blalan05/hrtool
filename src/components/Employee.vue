<template>
    <v-col cols="10" >
        <v-data-iterator
            :items="uploadedData.Roles" 
            :footer-props="{'items-per-page-options': [12, 24, 36, -1]}"
            >
        <template #default="props">
            <v-row>
            <v-col
                cols="3"
                v-for="(item, r) in props.items"
                :options="{group: 'tasks'}"
                :key="item.r"
            >
                <v-card>
                <v-card-title>{{ item.name }} - {{ item.tasks | totalPercentage }}  <span>Avg. Hours <v-btn> {{ item.avgHours }} </v-btn></span></v-card-title>
                <v-card-text>
                    <v-list class="list-group" dense>
                    <draggable :list="item.tasks" group="tasks">
                        <template v-if="item.tasks.length > 0">
                        <v-list-item
                            two-line
                            v-for="(task, i) in item.tasks"
                            :key="i"
                            class="list-group-item"
                        >
                            <v-list-item-content>
                            <v-list-item-title>{{ task.name }}</v-list-item-title>
                            <v-list-item-subtitle>{{ `${Math.floor((task.hours/item.avgHours)*100)}%` }}</v-list-item-subtitle>
                            </v-list-item-content>
                            <v-list-item-action>
                            <v-menu offset-y :close-on-content-click="false">
                                <template #activator="{ on }">
                                <v-btn v-on="on" icon>
                                    <v-icon>mdi-dots-vertical</v-icon>
                                </v-btn>
                                </template>
                                <v-list dense>
                                <v-list-item>
                                    <v-menu offset-y :close-on-content-click="false">
                                    <template #activator="{ on }">
                                        <v-list-item-title v-on="on" @click="setEditData(task)">
                                        <v-icon>mdi-pencil</v-icon>Edit
                                        </v-list-item-title>
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
                                        <v-btn @click="editTask(r, i, uploadedData)">Save</v-btn>
                                        </v-card-actions>
                                    </v-card>
                                    </v-menu>
                                </v-list-item>
                                <v-list-item @click="cloneTask(task, r, uploadedData)">
                                    <v-list-item-title>
                                    <v-icon>mdi-content-copy</v-icon>Clone
                                    </v-list-item-title>
                                </v-list-item>
                                <v-list-item @click="deleteTask(r, i, uploadedData)">
                                    <v-list-item-title>
                                    <v-icon>mdi-delete</v-icon>Delete
                                    </v-list-item-title>
                                </v-list-item>
                                </v-list>
                            </v-menu>
                            </v-list-item-action>
                        </v-list-item>
                        </template>
                        <v-list-item v-else>
                        <v-list-item-title>Add Task</v-list-item-title>
                        </v-list-item>
                    </draggable>
                    </v-list>
                </v-card-text>
                </v-card>
            </v-col>
            </v-row>
        </template>
        </v-data-iterator>
    </v-col>
</template>

<script>
import draggable from "vuedraggable";
//import json from "./myData.json";
import {saveNewTask, saveNewEmployee, deleteTask, editTask, setEditData, cloneTask } from '../utils/helpers';
//import Upload from './Upload';

export default {
  name: "Employee",
  data: () => ({
    addTaskMenu: false,
    addEmployeeMenu: false,
    employeeName: null,
    taskName: null,
    hours: null,
    taskList: [],
    roles: [],
    value: 40
  }),
  props: ['uploadedData'],
  methods: {
    saveNewTask,
    saveNewEmployee,
    deleteTask,
    editTask,
    setEditData,
    cloneTask
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
  components: {
    draggable
  }
};
</script>