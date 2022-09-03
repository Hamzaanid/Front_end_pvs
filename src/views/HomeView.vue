<template>
  <div class="home">
    <v-dialog v-model="dialog" persistent max-width="400px">
      <v-card :loading="load" class="pa-2">
      </v-card>
    </v-dialog>
    <app_navbar v-if="navbar"/>
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
        return {
          navbar:false,
          dialog:true,
          load:true,
         }
      },
      
      beforeCreate(){
      baseURL.token = localStorage.getItem("token");
      this.dialog = true;
      axios
      .get(baseURL.api + "/users/profile", {
        headers: { Authorization: `Bearer ${baseURL.token}` },
      })
      .then((rep) => {
        this.profile(rep.data);
        this.navbar = true;
        this.dialog = false;
      }).catch(err=>{
        localStorage.removeItem('token');
        this.$router.push('login');
      });
    },
    methods:{
      ...mapActions('user', ['profile'])
    },
   
  
  }
</script>