<template>
  <div>
    <!-- <v-app-bar dense fixed>
      <Nav />
    </v-app-bar> -->
    <v-app>
      <v-row>
        <!-- <Tasks />
        <Employee /> -->
        <Upload />
      </v-row>
    </v-app>
  </div>
</template>

<script>
//import Nav from './components/Nav';
//import Tasks from './components/Tasks';
//import Employee from './components/Employee';
import Upload from './components/Upload';
//import JSON from './components/myData.json'

//const uploadData = JSON

export default {
  name: "App",
  components: {
    Upload
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
