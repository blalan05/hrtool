<template>
    <v-col cols="2">
        <v-card-title>Tasks</v-card-title>
        <v-list class="list-group" dense>
        <draggable :list="uploadedData.Tasks" group="tasks">
            <template v-if="uploadedData.Tasks.length > 0">
            <v-list-item
                two-line
                v-for="(task, i) in uploadedData.Tasks"
                :key="i"
                class="list-group-item"
            >
                <v-list-item-content>
                <v-list-item-title>{{ task.name }}</v-list-item-title>
                <v-list-item-subtitle>{{ `${task.hours}hrs` }}</v-list-item-subtitle>
                </v-list-item-content>
            </v-list-item>
            </template>
            <v-list-item v-else>
            <v-list-item-title>Add a Task</v-list-item-title>
            </v-list-item>
        </draggable>
        </v-list>
    </v-col>
</template>


<script>
import draggable from "vuedraggable";
//import json from "./myData.json";

export default {
  name: "Tasks",
  data: () => ({
    addTaskMenu: false,
    addEmployeeMenu: false,
    employeeName: null,
    taskName: null,
    hours: null,
    taskList: [],
    roles: []
  }),
  props: ['uploadedData'],
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
  },
  created() {
    this.roles = this.uploadedData.Roles;
    this.taskList = this.uploadedData.Tasks;
  },
};
</script>