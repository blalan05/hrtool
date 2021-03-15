<template>
  <div>
    <v-app-bar dense fixed>
      <Nav />
    </v-app-bar>
    <v-app>
      <v-row>
        <Tasks />
        <Employee />
      </v-row>
    </v-app>
  </div>
</template>

<script>
import Nav from './components/Nav';
import Tasks from './components/Tasks';
import Employee from './components/Employee';
//import JSON from './components/myData.json'

//const uploadData = JSONz

export default {
  name: "App",
  components: {
    Nav,
    Tasks,
    Employee,
  }
};
</script>

<style>
#app {
  font-family: Avenir, Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: #2c3e50;
  margin-top: 60px;
}
</style>
