<template>
    <v-app>
      <Tasks />
    </v-app>
</template>

<script>
import Tasks from './components/Tasks';

export default {
  name: "Home",
  components: {
    Tasks
  }
};
</script>