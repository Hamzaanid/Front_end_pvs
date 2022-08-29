<template>
  <div class="home">
    <app_navbar/>
    <v-main class="ma-6">
      <router-view />
    </v-main>
  </div>
</template>
<script>
import baseURL from '@/api/baseURL';
import app_navbar from '@/components/app_navbar.vue'
import axios from 'axios';
import { mapActions } from 'vuex';
  export default {
    components: {
            app_navbar  
      },
      data(){
        return { }
      },
      
    created(){
      baseURL.token = localStorage.getItem("token");
   /*   this.dialog = true;
      axios
      .get(baseURL.api + "/users/profile", {
        headers: { Authorization: `Bearer ${baseURL.token}` },
      })
      .then((rep) => {
        this.profile(rep.data.role.nom);
        this.dialog = false;
        this.shownavbar = true;
      }).catch(err=>{
        localStorage.removeItem('token');
        this.$router.push('login');
      }); */
    },
    methods:{
      ...mapActions('user', ['profile'])
    },
   
  
  }
</script>