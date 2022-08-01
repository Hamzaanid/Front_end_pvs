<template>
  <div class="home">
    <app_navbar />
    <v-main class="ma-6">
      <router-view />
    </v-main>
  </div>
</template>
<script>
import app_navbar from '@/components/app_navbar.vue'
  export default {
    components: {
            app_navbar  
      },
  }
</script>