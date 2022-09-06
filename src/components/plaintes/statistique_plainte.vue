<template>
<div class="chercher_plaint">
 <v-spacer></v-spacer>
     <v-card elevation="2"
  outlined  class="mx-auto my-auto"
     >
     <v-toolbar lighten class="nvbar mb-3" flat height="34px">
       <v-toolbar-title  class=" lightengrey--text text-h6">
         تاريخ تسجيل الشكاية
         </v-toolbar-title>
         </v-toolbar>
    <v-form class="px-5">
          <v-row  class="mt-5"
          dense justify-md="start" align-content-center no-gutters>
       <v-col
      cols="12"
      sm="4" class="mx-4"
    >
      <v-menu
        ref="menu1"
        v-model="menu1"
        :close-on-content-click="false"
        :nudge-right="40"
        transition="scale-transition"
        offset-y
        min-width="auto"
      >
        <template v-slot:activator="{ on, attrs }">
          <v-text-field
            v-model="cher.de"
            prepend-icon="mdi-calendar"
            readonly dense
            label="من"
            v-bind="attrs"
            v-on="on"
            outlined 
          ></v-text-field>
        </template>
        <v-date-picker
          v-model="cher.de"
          no-title
          scrollable
          @input="menu1 = false"
        >
        </v-date-picker>
      </v-menu>
    </v-col>

     <v-col
      cols="12"
      sm="4" class="mx-4"
    >
      <v-menu
        ref="menu2"
        v-model="menu2"
        :close-on-content-click="false"
        :nudge-right="40"
        transition="scale-transition"
        offset-y
        min-width="auto"
      >
        <template v-slot:activator="{ on, attrs }">
          <v-text-field
            v-model="cher.a"
            prepend-icon="mdi-calendar"
            readonly
            label="إلى"
            v-bind="attrs"
            v-on="on"
            outlined dense
          ></v-text-field>
        </template>
        <v-date-picker
          v-model="cher.a"
          no-title
          scrollable
           @input="menu2 = false"
        >
        </v-date-picker>
      </v-menu>
    </v-col>
    </v-row>
          <v-row no-gutters class="ma-0 pa-0" justify-md="start">
            <v-col cols="12" sm="4" ></v-col>

         <v-card-actions class="ma-0 pa-0">
              <v-btn
                text
               @click="stat"
              lighten
              class="mb-2 blue pr-3 pl-4"
              elevation="2"
              height="30px"
              :loading="loading"
               
            >
            <v-icon right >mdi-magnify</v-icon>             
               بحث
              </v-btn>
              </v-card-actions>
              </v-row>
    
    </v-form>
     </v-card>
     
     <!-- <app-statpl v-show="display"></app-statpl> -->
    <v-row no-gutters class="mt-2" v-show="display" justify-md="start">

        <v-col cols="12" sm="5" class="mx-2">
                <v-card class="elevation-1 px-2" color="green lighten-3" dense>
                    الشكايات المعالجة
                        <v-icon
                        class="shrink ma-2"
                        contain
                        size="35px"
                        style="flex-basis: 65px"
                    >mdi-progress-check</v-icon>

                    <v-divider lighten class="mb-2"></v-divider>
                    <v-spacer></v-spacer>
                    <span class="text-h6">
                        ({{ statistic.Traiter }})
                    </span>
               </v-card>
        </v-col>


        <v-col cols="12" sm="5" class="mx-2">
                <v-card class="elevation-1 px-2" color="orange lighten-3" dense>
                      الشكايات  في طور الدراسة
                        <v-icon
                            class="shrink ma-2"
                            contain
                            size="35px"
                            style="flex-basis: 65px"
                        >mdi-progress-alert</v-icon>

                    <v-divider lighten class="mb-2"></v-divider>
                    <v-spacer></v-spacer>
                    <span class="text-h6">
                        ({{ statistic.enCours }})
                    </span>
               </v-card>
        </v-col>

    </v-row>

    <v-row no-gutters class="my-2" v-show="display" justify-md="start">
        <v-col cols="12" sm="3"></v-col>
        <v-col cols="12" sm="5">
                <v-card class="elevation-1 px-2" color="red lighten-2" dense>
                     الشكايات غير موزعة 
                        <v-icon
                            class="shrink ma-2"
                            contain
                            size="35px"
                            style="flex-basis: 65px"
                        >mdi-progress-alert</v-icon>

                    <v-divider lighten class="mb-2"></v-divider>
                    <v-spacer></v-spacer>
                    <span class="text-h6">
                         ({{ statistic.NonTraiter }})
                    </span>
               </v-card>
        </v-col>
    </v-row>
    <v-row no-gutters justify-md="start" v-show="display" class="px-5 --text text-h6" >
      <v-spacer></v-spacer>
      <v-chip class="pa-1 ma-1 blue lighten-2">
        مجموع الشكايات خلال  هذه الفترة
         <span class="text-h6">
                       :  {{ statistic.total }}
           </span>
      </v-chip>
    </v-row>
</div>
</template>

<script>
import baseURL from '@/api/baseURL';
import axios from 'axios';
export default {
    data(){
        return {
        display: false,
        loading:false,
        cher:{
          de:(new Date(Date.now() - (new Date()).getTimezoneOffset() * 60000)).toISOString().substr(0, 10),
          a:(new Date(Date.now() - (new Date()).getTimezoneOffset() * 60000)).toISOString().substr(0, 10),
        },
        statistic:{},
        
        menu1:false,
        menu2:false,
      }
    },
    methods:{
      stat(){
        this.loading=true;
        let token = localStorage.getItem("token");
              axios.post(baseURL.api +'/plaint/statistique',{
                cher:this.cher
              },{
              headers:  { Authorization: `Bearer ${token}` }
          }).then(response => {
            this.statistic = response.data;
            this.loading=false;
            this.display=true;
          }).catch(er=>{
              this.loading=false; 
              this.display=true;
              console.log(er)
            });
      }
    },
}
</script>