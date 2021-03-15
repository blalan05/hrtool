<template>
    <v-col cols="2" v-if=json>
        <v-card-title>Tasks</v-card-title>
        <v-list class="list-group" dense>
        <draggable :list="taskList" group="tasks">
            <template v-if="taskList.length > 0">
            <v-list-item
                two-line
                v-for="(task, i) in taskList"
                :key="i"
                class="list-group-item"
            >
                <v-list-item-content>
                <v-list-item-title>{{ task.name }}</v-list-item-title>
                <v-list-item-subtitle>{{ `${task.percentage}%` }}</v-list-item-subtitle>
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
import json from "./myData.json";

export default {
  name: "Tasks",
  data: () => ({
    addTaskMenu: false,
    addEmployeeMenu: false,
    employeeName: null,
    taskName: null,
    percentage: null,
    taskList: [],
    roles: []
  }),
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
  },
  components: {
    draggable
  }
};
</script>