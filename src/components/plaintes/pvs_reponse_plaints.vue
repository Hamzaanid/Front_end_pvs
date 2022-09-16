<template>
    <div class="ajout">
      <v-card elevation="2" outlined class="mx-auto my-auto justify-center">
        <v-toolbar class="smallnavbar mb-3" flat height="34px">
          <v-toolbar-title class="darkgrey--text text-h5">
            معطيات المحضر الجوابي
          </v-toolbar-title>
        </v-toolbar>
        <div>
          <v-alert dense type="success" v-model="msgSuc" @click="clearAlert()">
            تم تسجيل المحضر بنجاح
          </v-alert>
          <v-alert dense type="error" v-model="msgErr" @click="clearAlert()">
            تأكد من صحة المعلومات أو شبكة الأنترنيت
          </v-alert>
          <v-alert dense type="error" v-model="msgErr1" @click="clearAlert()">
            لا توجد شكاية بهذا المرجع
          </v-alert>
        </div>
        <v-form dense ref="form" v-model="valideform" class="ma-0 pa-0 px-2">
          <v-row justify-md="start" no-gutters dense>
            <v-col cols="12" sm="3" class="ml-2">
                <v-text-field
                  v-model="pvs.referenceplaint"
                  dense
                  outlined
                  placeholder="السنة-الرمز-الرقم"
                  required
                  label="مرجع الشكاية"
                  :rules="NumRules"
                ></v-text-field>
              </v-col>
          </v-row>
          <v-row justify-md="start" no-gutters dense>
            <v-col cols="12" sm="3" class="ml-2">
              <v-select
                v-model="pvs.TypeSourcePvsID"
                :items="typesource"
                item-text="nom"
                item-value="id"
                label="نوع المصدر"
                :rules="nameRules"
                dense
                required
                outlined
              >
              </v-select>
            </v-col>
            <v-col cols="12" sm="3" class="ml-2">
              <v-select
                v-model="pvs.typePoliceJudicID"
                class="blue-lighten-6"
                label="صنف الضابطة القضائية"
                :rules="nameRules"
                :items="typepolice"
                item-text="nom"
                item-value="id"
                dense
                outlined
                required
              >
              </v-select>
            </v-col>
            <v-col cols="12" sm="3" class="ml-2">
              <v-text-field
                v-model="pvs.policeJudics"
                dense
                outlined
                label=" الضابطة القضائية   "
              ></v-text-field>
            </v-col>
          </v-row>
  
          <v-row no-gutters dense class="ma-0 pa-0" justify-md="start">
            <v-col cols="12" sm="3" class="ml-2">
              <v-menu
                v-model="menu"
                :close-on-content-click="false"
                transition="scale-transition"
                offset-y
                min-width="auto"
              >
                <template v-slot:activator="{ on, attrs }">
                  <v-text-field
                    v-model="pvs.dateEnregPvs"
                    label="تاريخ التسجيل "
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
                  v-model="pvs.dateEnregPvs"
                  @input="menu = false"
                  no-title
                ></v-date-picker>
              </v-menu>
            </v-col>
            <v-col cols="12" sm="3" class="ml-2">
              <v-select
                v-model="pvs.typepvsID"
                :items="typepvs"
                item-text="nom"
                item-value="id"
                class="blue-lighten-6"
                label="نوع المحضر"
                :rules="nameRules"
                dense
                outlined
                required
              >
              </v-select>
            </v-col>
            <v-col cols="12" sm="3" class="ml-2">
                <v-text-field
                  v-model="pvs.Numpvs"
                  dense
                  outlined
                  placeholder="السنة-الرمز-الرقم"
                  required
                  label="رقم المحضر"
                  :rules="NumRules"
                ></v-text-field>
              </v-col>
            </v-row>
            <v-row no-gutters dense justify-md="start">
              <v-col cols="12" sm="7" class="ml-2">
                <v-textarea
                  v-model="pvs.sujetpvs"
                  clearable
                  dense
                  label="موضوع المحضر"
                  :rules="nameRules"
                  required
                  rows="1"
                  outlined
                  no-resize
                >
                </v-textarea>
              </v-col>
            </v-row>
  
          <v-row dense justify-md="start">
            <v-col cols="12" sm="4">
              <v-file-input
                v-model="file"
                color="blue accent-4"
                accept="application/pdf"
                counter
                label="تحميل المُرفق"
                placeholder="تحميل المُرفق"
                append-icon="mdi-file-plus"
                outlined
                dense
                full-width
                :rules="PdfRules"
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
              </v-file-input></v-col
            >
          </v-row>
  
          <v-row no-gutters dense justify-md="start">
            <v-col cols="12" sm="4"></v-col>
            <v-card-actions>
              <v-btn
                text
                height="30px"
                class="my-2 blue"
                elevation="2"
                :loading="load"
                :disabled="!valideform"
                @click="addPvsReponse"
              >
                <v-icon left>mdi-notebook-plus-outline</v-icon>
                تسجيل المحضر
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
              <v-spacer></v-spacer> </v-card-actions
          ></v-row>
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
        typepvsID: 0,
        TypeSourcePvsID: 0,
        typePoliceJudicID: 0,
        sujetpvs: "",
        Numpvs: "",
        dateEnregPvs: new Date(Date.now() - new Date().getTimezoneOffset() * 60000
                      ).toISOString().substr(0, 10),
  
        policeJudics: "",
        datePvs: "",
        heureRealisation: "",
        contreInnconue: null,
        referenceplaint:""
      });
      return {
        pvs: Object.assign({}, defaultForm),
        typesource: [],
        typepvs: [],
        typepolice: [],
        file: null,
  
        valideform: true,
        menu: false,
        menu1: false,
        nameRules: [(v) => !!v || "حقل إجباري "],
        NumRules: [
          v => !!v || 'حقل إجباري ',
           v =>  /[0-9]+\-[0-9]+\-[0-9]+/.test(v) || '',
        ],
        PdfRules: [
          v => !!v || 'حقل إجباري',
           v => !v || v.type == 'application/pdf' || '',
        ],
        load: false,
        // gestion des message d'erreur
        msgErr: false,
        msgSuc: false,
        msgErr1:false,
      };
    },
    watch:{
      msgErr(val){
        !val || setTimeout(()=>{ this.msgSuc=false; this.msgErr=false; },2000)
      },
       msgSuc(val){
        !val || setTimeout(()=>{ this.msgSuc=false; this.msgErr=false; },2000)
      },
      msgErr1(val){
        !val || setTimeout(()=>{ this.msgSuc=false; this.msgErr1=false; },2000)
      },
    },
  
    methods: {
      clearAlert() {
        this.msgErr = this.msgSuc = false;
      },
      validate() {
        this.$refs.form.validate();
      },
      reset() {
        this.$refs.form.reset();
      },
  
      async addPvsReponse() {
        this.validate();
        this.load=true;
        let formData = new FormData();
        formData.append("file", this.file);
        const json = JSON.stringify(this.pvs);
        formData.append("pv",json);
        await axios
          .post(`${baseURL.api}/pvs/pvsReponsePlaints`,formData,{
            headers: {
              Authorization: `Bearer ${baseURL.token}`,
              "Content-Type": "multipart/form-data",
            },
          })
          .then((rep) => {
            if (rep.status == 200 || rep.status == 201) {
              this.reset();
              this.file = null;
              this.msgSuc = true; // affiche msg succes
            }
            if(rep.status == 501){
              this.msgErr1=true;
            }
            this.load = false; this.msgErr = false;
          })
          .catch((err) => {
            if(err.status == 501){
              this.msgErr1=true;
            }else{
               this.msgErr = true; this.msgSuc = false;
            }
            this.load = false;
             
          });
      },
  
  
    },
  
    created() {
      axios
        .get(baseURL.api + "/pvs/type/index", {
          headers: { Authorization: `Bearer ${baseURL.token}` },
        })
        .then((rep) => {
          this.typepvs = rep.data;
        });
  
      axios
        .get(baseURL.api + "/pvs/typesource/index", {
          headers: { Authorization: `Bearer ${baseURL.token}` },
        })
        .then((rep) => {
          this.typesource = rep.data;
        });
  
      axios
        .get(baseURL.api + "/pvs/typepolice/index", {
          headers: { Authorization: `Bearer ${baseURL.token}` },
        })
        .then((rep) => {
          this.typepolice = rep.data;
        });
    },
  };
  </script>
  