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
                 <v-card class=" px-2" flat color="red lighten-2" dense>
                      المحاضر  في طور الدراسة
                        <v-icon
                            class="shrink ma-2"
                        >mdi-progress-alert</v-icon>
                    <v-divider lighten class="mb-2"></v-divider>
                    <v-spacer></v-spacer>
                    <div class="text-h6">
                       <v-chip class="px-4 py-1" @click="pvsDeViceEnCours()">
                     {{ statpvs.pvsenCours }}
                        </v-chip>   
                        
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
                      <v-chip class="px-4 py-1" @click="plainteDeViceEnCours()">
                     {{ statplaints.plaintsenCours }}
                        </v-chip>   
                    </div>
                 </v-card>
              </v-col>
                </v-row>
                
            </v-card>
        </v-container>
      <v-dialog v-model="dialog"
      scrollable
      max-width="600px"
      >
      <v-card>
        <v-data-table
      :headers="headers"
      :items="plpvEnCour"
      hide-default-footer
      :loading="load_table"
      loading-text="إنتظر قليلا"
      no-data-text="لاتوجد معلومات"
    ></v-data-table>
    <v-card-actions>
                <v-spacer></v-spacer>
                <v-btn
                  color="blue darken-1"
                  text
                  @click="closetable()"
                >
                  إلغاء 
                </v-btn>
              </v-card-actions>
      </v-card>
      </v-dialog>
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
      //kkk
      dialog:false,
      plpvEnCour:[],
      load_table: true, // loader table vide
      headers:[],
      // plaint
    headersplaint: [
      {text: "مرجع الشكاية",align: "start",sortable: false,value: "plaint.referencePlaints"},
      { text: "موضوع الشكاية", value: "plaint.sujetPlaints", sortable: true },
      { text: "تاريخ التسجيل", value: "plaint.dateEnregPlaints", sortable: true },
      { text: "تاريخ الاحالة", value: "dateMission", sortable: false }
    ],
    // pvs
    headerspvs: [
      {text: "رقم المحضر",align: "start",sortable: false,value: "pvs.Numpvs"},
      { text: "موضوع المحضر", value: "pvs.sujetpvs", sortable: true},
      { text: "تاريخ التسجيل", value: "pvs.dateEnregPvs", sortable: false },
      { text: "تاريخ الاحالة", value: "dateMission", sortable: false }
    ],

    };
  },
  watch: {
      dialog (val) {
        if(!val) return this.closetable();
      },
      userid(){
        this.getStatic_vice();
      }
  },
  methods: {
    closetable(){
      this.dialog = false;
      this.plpvEnCour =[];
      this.headers = [];
    },

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
    plainteDeViceEnCours(){
      this.headers = this.headersplaint;
      this.plpvEnCour = [];
      this.dialog = true;
      this.load_table = true;
            axios
          .post(baseURL.api + "/users/hasplaints/affiche_plainte_statistic",{
            userID:this.userid
          }, {
            headers: { Authorization: `Bearer ${baseURL.token}` },
          })
          .then((rep) => {
            this.plpvEnCour = rep.data;
             this.load_table = false;
          });
    },
    pvsDeViceEnCours(){
      this.headers = this.headerspvs;
      this.plpvEnCour = [];
      this.dialog = true;
      this.load_table = true;
            axios
          .post(baseURL.api + "/users/haspvs/affiche_pvs_statistic",{
            userID:this.userid
          }, {
            headers: { Authorization: `Bearer ${baseURL.token}` },
          })
          .then((rep) => {
            this.plpvEnCour = rep.data;
             this.load_table = false;
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