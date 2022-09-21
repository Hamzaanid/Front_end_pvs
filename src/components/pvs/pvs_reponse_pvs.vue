<template>
    <div>
    <v-card elevation="2" outlined class="mx-auto my-auto">
      <v-toolbar class="smallnavbar mb-3" flat height="34px">
        <v-toolbar-title class="darkgrey--text text-h5">
          بحث عن محضر
        </v-toolbar-title></v-toolbar>
       <div>
        <v-alert dense type="success" v-model="msgSuc" @click="clearAlert()"
      > تم إضافة المحضر الجوابي بنجاح 
      </v-alert>
      
      </div>
      <v-form class="px-5">
        <v-row dense justify-md="start" no-gutters >
          <v-col cols="12" sm="4">
            <v-text-field
              v-model="cherchant"
              label=" رقم المحضر"
              class="mt-2 ml-4 pa-0"
              outlined
              dense
            ></v-text-field>
          </v-col>
          <v-col>
            <v-card-actions>
              <v-btn
                text
                @click="chercher_pvs"
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
    <v-card class="my-5">
        <v-data-table
          :headers="headers"
          :items="pvs"
          no-data-text="معلومات غير متاحة"
          class="elevation-1"
          hide-default-footer
          :loading="table_vide"
          loading-text="إنتظر قليلا"
        >
        <template v-slot:[`item.lien`]="{ item }">
            <v-chip color="blue lighten-4" lighten small 
            @click="redirect(item.pvs.hasfichier.lien)"
            fab>
              {{ getstatus(item.traitID) }}
              <v-icon
                small
                class="mr-2"
              >
                mdi-download
              </v-icon>
            </v-chip>
          </template>
          <template v-slot:[`item.action`]="{ item }">
            <v-btn small color="blue lighten-5" @click="addpvsReponse(item)"
              ><v-icon left> mdi-pencil </v-icon>
              أضف
            </v-btn>
          </template>
    
    </v-data-table>
    </v-card>
     <v-dialog v-model="dialog" max-width="400px">
          <v-card :loading="load_vcard">
            <div class="pa-1 blue lighten-5">{{Numpvs}}</div>
            <v-alert dense type="error" v-model="msgErr" @click="clearAlert()"
                > تأكد من صحة المعلومات أو شبكة الأنترنيت 
            </v-alert>
                <v-form ref="form" v-model="valideform" class="pa-1">
                <v-row no-gutters justify-md="start">
                    <v-file-input
                    v-model="filePvsReponse"
                    color="blue accent-4"
                    accept="application/pdf"
                    placeholder="تحميل المحضر الجوابي"
                    append-icon="mdi-file-plus"
                    full-width
                    dense
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
            </v-file-input>
                </v-row>
                </v-form>
              <v-card-actions class="pt-0 mt-0">
              <v-spacer></v-spacer>
              <v-btn color="blue darken-1" text @click="closedialog">
                رجوع
              </v-btn>
              <v-btn color="blue darken-1" text :disabled="!valideform || load_vcard" @click="confirm_addpvsReponse" >
                تأكيد
              </v-btn>

            </v-card-actions>
          </v-card>
        </v-dialog>
        
    </div>
</template>
<script>
    import axios from 'axios';
    import baseURL from '@/api/baseURL';
    export default {
        data(){
            return {
      load: false,
      table_vide: false,
      headers: [
        { text: "  رقم المحضر", value: "pvs.Numpvs" },
        { text: " تاريخ التسجيل", value: "pvs.dateEnregPvs" },
        { text: "موضوع المحضر", value: "pvs.sujetpvs" },
        { text: 'ممثل النيابة', value: 'user.nom', sortable: false },
         { text: "القرار", value: "descision" },
        { text: "المرفق", value: "lien", sortable: false },
        { text: " محضر جوابي", value: "action", sortable: false },
      ],
      pvs: [],
      cherchant: "",
      msgErr:false,
      msgSuc:false,

      // pvs reponse 
        dialog:false,
        load_vcard:false,
        valideform:true,
        filePvsReponse:null,
        PdfRules: [
        v => !!v || 'حقل إجباري',
         v => !v || v.type == 'application/pdf' || '',
      ],
        Numpvs:"",
        idpvs:0,
            }
        },
        watch:{
    msgErr(val){
      !val || setTimeout(()=>{ this.msgSuc=false; this.msgErr=false; },2000)
    },
     msgSuc(val){
      !val || setTimeout(()=>{ this.msgSuc=false; this.msgErr=false; },2000)
    },
    dialog(val){
        val || this.closedialog()
      },
  },
  methods:{
    redirect(link) {
      var names = link.split("/");
      var fileLink = document.createElement("a");
      fileLink.href = baseURL.backendPDF + "/dossiers_pvs/" + names[2];
      fileLink.target = "_blank";
      fileLink.click();
    },

    clearAlert(){
      this.msgErr = this.msgSuc = false;
    },
    chercher_pvs() {
      this.showupdate = false;
      this.load = true;
      axios
        .post(
          baseURL.api + "/pvs/ByNumpvs",
          {
            Numpvs: this.cherchant,
          },
          { headers: { Authorization: `Bearer ${baseURL.token}` } }
        )
        .then((rep) => {
          if (rep.status == 200 || rep.status == 201) this.pvs = rep.data;
          else this.msgErr=true;// message erreur

          this.load = false;
        })
        .catch((err) => {
          this.msgErr=true;// message erreur
          this.load = false;
        });
    },
    getstatus(traitID){

        if (traitID < 3 || traitID == 4) return  " غير معالج";
        else {
        if(traitID == 3) return "معالج";
        else {
            if(traitID == 5) return " الإحالة على التحقيق";
            if(traitID == 6) return "ملف تحقيق";
         } 
       }
    },
    addpvsReponse(item){
        this.dialog = true;
        this.Numpvs = item.pvs.Numpvs;
        this.idpvs = item.pvs.id;
     },
    closedialog(){
        this.$refs.form.reset();
        this.Numpvs = "";
        this.idpvs =0;
        this.dialog = false;
        this.load_vcard = false;
     },
     confirm_addpvsReponse(){
        this.load_vcard = true;
        let formData = new FormData();
      formData.append("file", this.filePvsReponse);
      formData.append("Numpvs",this.Numpvs);
      formData.append("idpvs",this.idpvs);
       axios
        .post(`${baseURL.api}/pvs/add_pvs_reponse`,formData,{
          headers: {
            Authorization: `Bearer ${baseURL.token}`,
            "Content-Type": "multipart/form-data",
          },
        })
        .then((rep) => {
          if (rep.status == 200 || rep.status == 201) 
             { 
                this.msgSuc=true;
                this.closedialog();
            }
          else 
            this.msgErr=true;// message erreur
        })
        .catch((err) => {
          this.msgErr=true;// message erreur
          this.closedialog();
        });
     }
  }
    }
</script>