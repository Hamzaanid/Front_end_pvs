<template>
  <div class="ajout_plaint">
    <v-card elevation="2" outlined class="mx-auto my-auto justify-center">
      <v-toolbar class="smallnavbar mb-3" flat height="34px">
        <v-toolbar-title class="darkgrey--text text-h5"
          >معطيات الشكاية</v-toolbar-title
        >
      </v-toolbar>
      <!-- meassage -->
      <div>
        <v-alert dense type="success" v-model="msgSuc" @click="clearAlert()"
      > تم تسجيل الشكاية  بنجاح  
      </v-alert>
      <v-alert dense type="error" v-model="msgErr" @click="clearAlert()"
      > تأكد من صحة المعلومات أو شبكة الأنترنيت 
      </v-alert>
      </div>
      
      <v-form dense ref="form" v-model="valideform" class="ma-0 pa-0 px-2">
        <v-row justify-md="start" no-gutters dense>
          <v-col cols="12" sm="4" class="ml-2">
            <v-select
              v-model="plaint.TypePlaintID"
              class="blue-lighten-6"
              label="نوع الشكاية"
              :items="typePlaints"
              item-text="nom"
              item-value="id"
              :rules="nameRules"
              dense
              outlined
              required
            >
            </v-select>
          </v-col>

          <v-col cols="12" sm="4" class="ml-2">
            <v-select
              label="مصدر الشكاية"
              v-model="plaint.SourcePlaintID"
              :items="sourceplaints"
              item-text="nom"
              item-value="id"
              :rules="nameRules"
              dense
              required
              outlined
            >
            </v-select>
          </v-col>
        </v-row>

        <v-row justify-md="start" dense no-gutters>
          <v-col cols="12" sm="4" class="ml-2">
            <v-text-field
              dense
              outlined
              required
              label="مرجع الشكاية"
              v-model="plaint.referencePlaints"
              :rules="NumRules"
              placeholder="السنة-الرمز-الرقم"
            ></v-text-field>
          </v-col>
          <v-col cols="12" sm="4" class="ml-2">
            <v-menu
              v-model="menu"
              :close-on-content-click="false"
              transition="scale-transition"
              offset-y
              min-width="auto"
            >
              <template v-slot:activator="{ on, attrs }">
                <v-text-field
                  label="تاريخ التسجيل"
                  v-model="plaint.dateEnregPlaints"
                  :rules="nameRules"
                  append-icon="mdi-calendar"
                  readonly
                  v-bind="attrs"
                  v-on="on"
                  outlined
                  dense
                ></v-text-field>
              </template>
              <v-date-picker
                v-model="plaint.dateEnregPlaints"
                no-title
                @input="menu = false"
              ></v-date-picker>
            </v-menu>
          </v-col>
        </v-row>

        <v-row justify-md="start" no-gutters dense>
          
          <v-col cols="12" sm="7" class="ml-2">
            <v-textarea
              clearable
              dense
              label="موضوع الشكاية"
              v-model="plaint.sujetPlaints"
              :rules="nameRules"
              rows="1"
              outlined
              no-resize
            >
            </v-textarea>
          </v-col>
        </v-row>

        <template
          ><v-card flat class="mt-4 mr-4">
            <v-row dense justify-md="start" no-gutters
              ><v-col cols="12" sm="4">
                <v-file-input
                  v-model="file"
                  required
                  accept="application/pdf"
                  color="blue accent-4"
                  counter
                  class="mt-3"
                  label="تحميل المُرفق"
                  placeholder="تحميل المُرفق"
                  append-icon="mdi-file-plus"
                  outlined
                  :rules="PdfRules"
                  dense
                  full-width
                >
                  <template v-slot:selection="{ index, text }">
                    <v-chip
                      v-if="index < 2"
                      color="blue accent-4"
                      light
                      label
                      small
                    >
                      {{ text }}
                    </v-chip>

                    <span
                      v-else-if="index === 2"
                      class="text-overline grey--text text--lighten-3 mx-2"
                    >
                      +{{ files.length - 2 }} File(s)

                    </span>
                  </template>
                </v-file-input>
                </v-col
              ><v-col cols="12" sm="4"> </v-col> </v-row
          ></v-card>
        </template>
        <v-row no-gutters dense justify-md="start">
          <v-col cols="12" sm="4"></v-col>
          <v-card-actions class="mt-4">
            <v-btn
              text
              height="30px"
              class="my-2 blue"
              elevation="2"
              :disabled="!valideform"
              :loading="load"
              @click="addPlaint"
            >
              <v-icon left>mdi-notebook-plus-outline</v-icon>
              تسجيل الشكاية
            </v-btn>
            <v-btn
              text
              height="30px"
              class="my-2 red"
              elevation="2"
              @click="reset"
            >
              إلغاء
            </v-btn>

            <v-spacer></v-spacer>
             </v-card-actions>
             </v-row>
      </v-form>
    </v-card>
  </div>
</template>

<script>
import baseURL from "../../api/baseURL.js";
import axios from "axios";
export default {
  data() {
    const defaultForm = Object.freeze({
    //  contreInconnu: null,
      TypePlaintID: null,
      SourcePlaintID: null,
      referencePlaints: "",
     // datePlaints: "",
      dateEnregPlaints: new Date(
        Date.now() - new Date().getTimezoneOffset() * 60000
      )
        .toISOString()
        .substr(0, 10),
     // dateFaits: "",
      //EmplaceFaits: "",
      sujetPlaints: "",
    });

    return {
      plaint: Object.assign({}, defaultForm),
      file: null,
      sourceplaints: [],
      typePlaints: [],
      tab: null,
      valideform: true,
      load: false,
      menu: false,
      nameRules: [(v) => !!v || "حقل إجباري"],
      NumRules: [
        v => !!v || '',
         v =>  /[0-9]+\-[0-9]+\-[0-9]+/.test(v) || '',
      ],
      PdfRules: [
        v => !!v || '',
         v => !v || v.type == 'application/pdf' || '',
      ],
      // gestion des message d'erreur
      msgErr:false,
      msgSuc:false,
    };
  },

  methods: {
    validate() {
      this.$refs.form.validate();
    },
    reset() {
      this.$refs.form.reset();
    },
    clearAlert(){
      this.msgErr = this.msgSuc = false;
    },
    async addPlaint() {
      this.validate();
      this.load = true;
      let formData = new FormData();
      formData.append("TypePlaintID",this.plaint.TypePlaintID); 
      formData.append("SourcePlaintID",this.plaint.SourcePlaintID); 
      formData.append("referencePlaints",this.plaint.referencePlaints); 
      formData.append("dateEnregPlaints",this.plaint.dateEnregPlaints); 
      formData.append("sujetPlaints",this.plaint.sujetPlaints); 
      formData.append("file", this.file);
      await axios
        .post(`${baseURL.api}/plaint/store`, formData,{
          headers:{
            Authorization: `Bearer ${baseURL.token}`,
            "Content-Type": "multipart/form-data",
          },
        })
        .then((rep) => {
          if (rep.status == 200 || rep.status == 201) {
            this.msgSuc = true; // message succes
           this.reset();
            this.file = null;
            this.load=false;
          }else{
            this.msgErr = true;
           this.load = false;
          }
        }).catch(err=>{
          console.log(err);
           this.msgErr = true;
           this.load = false;
        });
    },

  },

  created() {
    axios.get(baseURL.api + "/plaint/type/index", {
        headers: { Authorization: `Bearer ${baseURL.token}` },
      })
      .then((rep) => {
        this.typePlaints = rep.data;
      }).catch(er=>{}); // ici gerer connexion !!!

    axios
      .get(baseURL.api + "/plaint/source/index", {
        headers: { Authorization: `Bearer ${baseURL.token}` },
      })
      .then((rep) => {
        this.sourceplaints = rep.data;
      }).catch(er=>{});  // ici gerer connexion !!!
  },
};
</script>
