<template>
  <div class="home">
    <app_navbar />
    <v-main class="ma-6">
      <router-view />
    </v-main>
  </div>
</template>
<script>
import baseURL from '@/api/baseURL';
import app_navbar from '@/components/app_navbar.vue'
  export default {
    components: {
            app_navbar  
      },
    created(){
      baseURL.token = localStorage.getItem("token");
    }
  }
</script>