<template>
  <v-content>
    <v-container>
      <v-row>
        <v-col cols="2">
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
        <v-col cols="10">
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
          <v-data-iterator :items="roles">
            <template #default="props">
              <v-row>
                <v-col
                  cols="3"
                  v-for="(item, r) in props.items"
                  :options="{group: 'tasks'}"
                  :key="item.r"
                >
                  <v-card>
                    <v-card-title>{{ item.name }} - {{ item.tasks | totalPercentage }}</v-card-title>
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
                                <v-list-item-subtitle>{{ `${task.percentage}%` }}</v-list-item-subtitle>
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
                                              suffix="%"
                                              hint="Percentage out of 40hrs"
                                              v-model="percentage"
                                            ></v-text-field>
                                          </v-card-text>
                                          <v-card-actions>
                                            <v-btn @click="editTask(r, i)">Save</v-btn>
                                          </v-card-actions>
                                        </v-card>
                                      </v-menu>
                                    </v-list-item>
                                    <v-list-item @click="cloneTask(task, r)">
                                      <v-list-item-title>
                                        <v-icon>mdi-content-copy</v-icon>Clone
                                      </v-list-item-title>
                                    </v-list-item>
                                    <v-list-item @click="deleteTask(r, i)">
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
      </v-row>
    </v-container>
  </v-content>
</template>
<script>
import draggable from "vuedraggable";
import json from "./myData.json";

export default {
  name: "HelloWorld",
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
    saveNewTask() {
      this.taskList.push({ name: this.taskName, percentage: this.percentage });
      this.taskName = null;
      this.percentage = null;
      this.addTaskMenu = false;
    },
    saveNewEmployee() {
      this.roles.push({ name: this.employeeName, tasks: [] });
      this.employeeName = null;
      this.addEmployeeMenu = false;
    },
    deleteTask(role, task) {
      this.roles[role].tasks.splice(task, 1);
    },
    editTask(role, task) {
      Object.assign(this.roles[role].tasks[task], {
        name: this.taskName,
        percentage: this.percentage
      });
      this.taskName = null;
      this.percentage = null;
    },
    setEditData(taskData) {
      this.taskName = taskData.name;
      this.percentage = taskData.percentage;
    },
    cloneTask(task, role) {
      this.roles[role].tasks.push(task);
    }
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
  },
  components: {
    draggable
  }
};
</script>
