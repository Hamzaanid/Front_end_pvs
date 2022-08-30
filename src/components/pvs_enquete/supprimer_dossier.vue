<template>
    <div>
      <v-card elevation="2" outlined class="mx-auto my-auto py-3">
        <v-form class="px-5">
          <v-row dense justify-md="start" no-gutters>
            <v-col cols="12" sm="4">
              <v-text-field
                v-model="cherDossier"
                label="رقم المحضر"
                class="mt-2 ml-4 pa-0"
                outlined
                dense
              ></v-text-field>
            </v-col>
            <v-col>
              <v-card-actions>
                <v-btn
                  text
                  @click="chercher_dossiers"
                  class="mt-1 blue"
                  elevation="2"
                  :loading="load"
                  height="30px"
                >
                  <v-icon right>mdi-magnify</v-icon>
                  بحث
                </v-btn>
              </v-card-actions>
            </v-col>
          </v-row>
        </v-form>
      </v-card>
  
      <v-card class="mt-5" v-show="affiche_table">
       <v-alert dense type="success" v-model="msgSuc" @click="clearAlert()"
        > تم حذف المحضر بنجاح 
        </v-alert>
        <v-alert dense type="error" v-model="msgErr" @click="clearAlert()"
        > تأكد من شبكة الأنترنيت 
        </v-alert>
        <div>
          <v-data-table
            :headers="headers"
            :items="dossiers"
            no-data-text="معلومات غير متاحة"
            class="elevation-1"
            hide-default-footer
            :loading="table_vide"
            loading-text="إنتظر قليلا"
          >
            <template v-slot:[`item.lien`]="{ item }">
              <v-chip
                color="blue lighten-4"
                lighten
                small
                fab
                @click="redirect(item.lien)"
              >
              تصفح الملتمس 
                <v-icon small class="mr-2"> mdi-download </v-icon>
              </v-chip>
            </template>
            <template v-slot:[`item.move`]="{ item }">
              <v-btn small color="blue lighten-5" @click="deleteItem(item.id)"
                :disabled="item.traiter == true ? true : false">
                <v-icon left> mdi-delete </v-icon>
                {{statusmoltamas(item.traiter) }}
              </v-btn>
            </template>
          </v-data-table>
        </div>
        <div class="text-center"></div>
      </v-card>
      <v-dialog v-model="dialog" max-width="400px">
        <v-card>
          <v-card-title class="d-flex justify-center pa-2 font-weight-black">
            سيتم حذف هذا المحضر بشكل نهائي
          </v-card-title>
          <v-card-actions class="d-flex justify-center">
            <v-btn
              color="red lighten-2 mx-4"
              height="24px"
              @click="dialog = false"
            >
              إلغاء
            </v-btn>
  
            <v-btn
              color="green lighten-2 mx-4"
              height="24px"
              :loading="load_dialog"
              @click="valideDeleteItem"
            >
              تأكيد
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
        load: false,
        affiche_table: false,
        table_vide: false,
        headers: [
        { text: 'رقم ملف التحقيق', value: 'NumDossier',align: 'start', sortable: true },
        { text: 'رقم المحضر', value: 'pvs.Numpvs', sortable: true },
        { text: ' تاريخ التسجيل', value: 'dateEnreg', sortable: true },
        { text: 'ممثل النيابة', value: 'user.nom', sortable: true },
        { text: 'غرفة التحقيق', value: 'chambre_enquete',sortable: false },
        { text: ' قاضي التحقيق', value: 'juge_enquete.nom', sortable: false },
        { text: 'الملتمس', value: 'lien', sortable: false },
        { text: 'تغيير', value: 'move', sortable: false },
      ],
      dossiers: [],
        cherDossier: "",
        iddossiersdelete: -1,
        dialog: false,
        load_dialog: false,
         // gestion des message d'erreur
        msgErr:false,
        msgSuc:false,
      };
    },
    watch:{
    msgErr(val){
      !val || setTimeout(()=>{ this.msgSuc=false; this.msgErr=false; },2000)
    },
     msgSuc(val){
      !val || setTimeout(()=>{ this.msgSuc=false; this.msgErr=false; },2000)
    },
    dialog(val){
        if(!val){
            this.load_dialog = false;
        }
    }
  },
    methods: {
        statusmoltamas(traiter){
      if(traiter) return " تم تحميل الملتمس " 
      else return " حذف "
    },
      redirect(link) {
        var names = link.split("/");
        var fileLink = document.createElement("a");
        fileLink.href = baseURL.backendPDF + "/dossiersEnquete/" + names[2];
        fileLink.target = "_blank";
        fileLink.click();
      },
       clearAlert(){
        this.msgErr = this.msgSuc = false;
      },
      
      chercher_dossiers() {
        this.load = true;
        axios
          .post(
            baseURL.api+"/Enquete/chercheDossier",
            {
                NumDossier: this.cherDossier,
            },
            { headers: { Authorization: `Bearer ${baseURL.token}` } }
          )
          .then((rep) => {
            if (rep.status == 200 || rep.status == 201) {
              this.dossiers = rep.data;
            }
            this.load = false;
            this.affiche_table = true;
          })
          .catch((err) => {
            this.load = false;
            this.msgErr = true;
            this.affiche_table = true;
          });
      },
      deleteItem(id) {
        this.iddossiersdelete = id;
        this.dialog = true;
      },
      valideDeleteItem() {
        this.load_dialog = true;
        axios
          .delete(baseURL.api + "/Enquete/delete/"+this.iddossiersdelete, {
            headers: { Authorization: `Bearer ${baseURL.token}` },
          })
          .then((rep) => {
            if (rep.status == 200 || rep.status == 201) {
              this.chercher_dossiers();
              this.msgSuc = true;
              this.load_dialog = false;
              this.dialog = false;
            }
            this.load = false;
            this.affiche_table = true;
          })
          .catch((err) => {
            this.load = false;
            this.load_dialog = false;
            this.msgErr = true;
            this.affiche_table = true;
          });
      },
    },
  };
  </script>
  