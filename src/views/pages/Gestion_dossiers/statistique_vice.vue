<template>
    <div>
        <v-card :loading="load">
             <v-toolbar class="smallnavbar mb-3" flat height="34px">
        <v-toolbar-title class="darkgrey--text text-h5"
           >  إحصائيات   </v-toolbar-title
        >
      </v-toolbar>
            <v-container class="pa-2 ma-2" v-show="true">
        <v-alert dense type="error" v-model="msgErr" @click="msgErr=false"
          > تأكد من صحة المعلومات أو شبكة الأنترنيت 
          </v-alert>
            <v-card class="ma-1 pa-1 pb-3">
                    <div class="text-h5 pr-2 mb-1"> المحاضر</div>k
                <v-row no-gutters justify-md="start">
                <v-col cols="12" sm="5" class="mx-2">
                <v-card class=" px-2" flat color="green lighten-2" dense>
                    المحاضر  المعالجة
                        <v-icon
                        class="shrink ma-2"
                    >mdi-progress-check</v-icon>

                    <v-divider lighten class="mb-2"></v-divider>
                    <v-spacer></v-spacer>
                    <div class="text-h6">
                      {{ statpvs.pvstraiter }}
                    </div>
               </v-card>
        </v-col>

                <v-col cols="12" sm="5" class="mx-2">
                 <v-card class=" px-2" flat color="red lighten-2" dense>
                      المحاضر  في طور الدراسة
                        <v-icon
                            class="shrink ma-2"
                        >mdi-progress-alert</v-icon>
                    <v-divider lighten class="mb-2"></v-divider>
                    <v-spacer></v-spacer>
                    <div class="text-h6">
                        {{ statpvs.pvsenCours }}
                    </div>
                 </v-card>
              </v-col>
                </v-row>
                
            </v-card>

            <v-card class="ma-1 pa-1 pb-3">
                <div class="text-h5 pr-2 mb-1"> الشكايات</div>
                <v-row no-gutters justify-md="start">
                <v-col cols="12" sm="5" class="mx-2">
                <v-card  flat class="px-2" color="green lighten-2" dense>
                    الشكايات  المعالجة
                        <v-icon
                        class="shrink ma-2"
                    >mdi-progress-check</v-icon>

                    <v-divider lighten class="mb-2"></v-divider>
                    <v-spacer></v-spacer>
                    <div class="text-h6">
                        {{ statplaints.plaintstraiter }}
                    </div>
               </v-card>
                 </v-col>

                <v-col cols="12" sm="5" class="mx-2">
                 <v-card flat class=" px-2" color="red lighten-2" dense>
                      الشكايات  في طور الدراسة
                        <v-icon
                            class="shrink ma-2"
                        >mdi-progress-alert</v-icon>
                    <v-divider lighten class="mb-2"></v-divider>
                    <v-spacer></v-spacer>
                    <div class="text-h6">
                        {{ statplaints.plaintsenCours }}
                    </div>
                 </v-card>
              </v-col>
                </v-row>
                
            </v-card>
        </v-container> 
        </v-card>
       
    </div>
</template>
<script>
import baseURL from "@/api/baseURL";
import axios from "axios";

export default {
  data() {
    return {
      msgErr:false,
      statpvs:{},
      statplaints:{},
      load:false,

    };
  },
  methods: {

    async getStatic_vice() {
      this.load = true;
        axios.get(baseURL.api+"/users/haspvs/statistic_vice/0",
        {headers: {   Authorization: `Bearer ${baseURL.token}`}
        }).then(rep=>{
          if(rep.status == 200 || rep.status==201)
             this.statpvs = rep.data;
             this.load = false;
             
        }).catch(err=>{
          this.msgErr = true;
          this.load = false;
        });

        axios.get(baseURL.api+"/users/hasplaints/statistic_vice/"+this.userid,
        {headers: {   Authorization: `Bearer ${baseURL.token}`}
        }).then(rep=>{
          if(rep.status == 200 || rep.status==201)
             this.statplaints = rep.data;
        }).catch(err=>{
          this.msgErr = true;
           this.load = false;
        });
    },
  },

  created() {
    this.getStatic_vice();
  },
};
</script>