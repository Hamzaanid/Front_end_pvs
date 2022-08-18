<template>
    <div>
        <v-card>
            <v-toolbar class="smallnavbar mb-3" flat height="34px">
        <v-toolbar-title class="darkgrey--text text-h5"
           >  إحصائيات بممثل النيابة </v-toolbar-title
        >
      </v-toolbar>
      <v-form dense ref="form" class="ma-0 pa-0 px-2">
        <v-alert dense type="error" v-model="msgErr" @click="msgErr=false"
          > تأكد من صحة المعلومات أو شبكة الأنترنيت 
          </v-alert>

        <v-row no-gutters dense>
          <v-col cols="12" sm="5" class="ml-2">
            <v-autocomplete
              v-model="userid"
              :items="viceProc"
              item-text="nom"
              item-value="id"
              placeholder="مساعدة في البحث"
              no-data-text="لا يوجد"
              label="ممثل النيابة"
              outlined
              dense
            ></v-autocomplete>
          </v-col >
          <v-col cols="12" sm="3" class="ml-3">
            <v-btn
                text
               @click="getStatic_vice"
              class="mt-1 blue"
              elevation="2"
               :loading="load"
               height="30px"
            >
            <v-icon right >mdi-magnify</v-icon>         
               بحث
              </v-btn>
          </v-col>
        </v-row>
      </v-form>
        </v-card>
        <v-container class="pa-2 ma-2" v-show="display">
            <v-card class="ma-1 pa-1 pb-3">
                    <div class="text-h5 pr-2 mb-1"> المحاضر</div>
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
                 <v-card class=" px-2" flat color="orange lighten-2" dense>
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
                 <v-card flat class=" px-2" color="orange lighten-2" dense>
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
         
    </div>
</template>
<script>
import baseURL from "@/api/baseURL";
import axios from "axios";

export default {
  data() {
    return {
      display: false,
      msgErr:false,
      load:false,
      viceProc: [],
      userid: null,
      statpvs:{},
      statplaints:{},

    };
  },
  methods: {

    async getStatic_vice() {
      this.load = true;
        axios.get(baseURL.api+"/users/haspvs/statistic_vice/"+this.userid,
        {headers: {   Authorization: `Bearer ${baseURL.token}`}
        }).then(rep=>{
          if(rep.status == 200 || rep.status==201)
             this.statpvs = rep.data;
             
        }).catch(err=>{
          this.msgErr = true;
           this.load = false;
        });

        axios.get(baseURL.api+"/users/hasplaints/statistic_vice/"+this.userid,
        {headers: {   Authorization: `Bearer ${baseURL.token}`}
        }).then(rep=>{
          if(rep.status == 200 || rep.status==201)
             this.statplaints = rep.data;
              this.load = false;
              this.display = true
        }).catch(err=>{
          this.msgErr = true;
           this.load = false;
        });
    },
  },

  created() {
    axios
      .get(baseURL.api + "/users/viceProc", {
        headers: { Authorization: `Bearer ${baseURL.token}` },
      })
      .then((rep) => {
        this.viceProc = rep.data;
      });
  },
};
</script>