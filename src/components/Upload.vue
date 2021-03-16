<template>
  <div>
    <div v-if="!uploadedData">
      <div class="dropbox">
        <input type="file" ref='file' id="selectFiles" value="Import" /><br />
        <!-- <input type="file" id='selectFiles' value='Import' :name="uploadFieldName" class="input-file"/><br /> -->
        <p>
          Drag your file here to begin<br />
          or click to browse
        </p>
      </div>
      <!-- <input type="file" id='selectFiles' value="Import" /><br /> -->
      <v-btn id="import" @click="thisUpload">Import the File!</v-btn>
      <p id="result"></p>
    </div>
    <div v-else-if="uploadedData">
      <!-- <p>{{uploadedData}}</p> -->
      <v-app-bar dense fixed>
        <Nav :uploadedData ="uploadedData" />
      </v-app-bar>
      <v-row>
        <Tasks :uploadedData ="uploadedData" />
        <Employee :uploadedData ="uploadedData" />
      </v-row>
    </div>
  </div>
</template>

<script>
//import { upload } from "../utils/helpers";
import Nav from './Nav';
import Tasks from './Tasks';
import Employee from './Employee';

export default {
  name: "Upload",
  components: {
    Nav,
    Tasks,
    Employee
  },
  data: () => {
    return {
      uploadedData: false,
    };
  },
  methods: {
    thisUpload() {
      const fr = new FileReader();
      let vm = this;
      fr.onload = (e) => {
        let result = JSON.parse(e.target.result);
        vm.uploadedData = result;
      };
      fr.readAsText(vm.$refs.file.files[0]);
    },
  },
  mounted() {
  },
};
</script>

<style lang="scss">
.dropbox {
  outline: 2px dashed grey; /* the dash box */
  outline-offset: -10px;
  background: lightcyan;
  color: dimgray;
  padding: 10px 10px;
  min-height: 200px; /* minimum height */
  position: relative;
  cursor: pointer;
}

.input-file {
  opacity: 0; /* invisible but it's there! */
  width: 100%;
  height: 200px;
  position: absolute;
  cursor: pointer;
}

.dropbox:hover {
  background: lightblue; /* when mouse over to the drop zone, change color */
}

.dropbox p {
  font-size: 1.2em;
  text-align: center;
  padding: 50px 0;
}
</style>