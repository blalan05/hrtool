<template>
  <div>
    <v-app>
      <v-row>
        <Upload />
      </v-row>
    </v-app>
  </div>
</template>

<script>
import Upload from './components/Upload';

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
