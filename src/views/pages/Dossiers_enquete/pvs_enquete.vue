<template>
  <div>
    <v-card elevation="2" outlined class="mx-auto my-auto">
      <v-toolbar class="smallnavbar mb-3" flat height="34px">
        <v-toolbar-title class="darkgrey--text text-h5">
          محاضر التحقيق
        </v-toolbar-title>
      </v-toolbar>
      <div>
        
      </div>
      <v-form class="px-5">
        <v-row dense justify-md="start" no-gutters>
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
                @click="chercher_pvs_enquete()"
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
    <v-card class="mt-2 pa-1" max-width="85%">
      
        <v-alert type="success" v-model="msgSuc" @click="msgSuc = false" dense>
          تمت العملية بنجاح 
        </v-alert>
        <v-data-table
      :headers="headers"
      :items="pvs_enquete"
      :loading="load_tab"
      hide-default-footer
      loading-text="إنتظر قليلا"
      no-data-text="لاتوجد محاضر"
    >
    <template v-slot:[`item.lien`]="{ item }">
        <v-chip
          small
          @click="redirect(item.pvs.hasfichier.lien)"
        >
          تصفح 
          <v-icon small>mdi-download</v-icon>
        </v-chip>
      </template>
      <template v-slot:[`item.actions`]="{ item }">
        <v-chip
          small
          @click="add_dossier(item)"
          :disabled="item.traitID >= 5 ? true : false"
        >
          أضف 
          <v-icon small>mdi-pencil</v-icon>
        </v-chip>
      </template>
      
    </v-data-table>
        <v-pagination
    
            v-model="pagination.current"
            :length="pagination.total"
            :total-visible="11"
            @input="onPageChange"
            class="ma-0 pa-0"
            circle
        ></v-pagination>
    </v-card>
    <v-dialog v-model="ShowForm" width="650">
      <v-card class="mt-2">
        <v-alert dense type="error" v-model="msgErr" @click="clearAlert()">
          تأكد من صحة المعلومات أو شبكة الأنترنيت
        </v-alert>
      <div class="blue lighten-4 pa-2 mb-3"> معطيات ملف التحقيق 
        <v-spacer> رقم المحضر {{ DossierEnquete.Numpvs }}  </v-spacer>
      </div>
      <v-form ref="form" v-model="valideform">
      <v-row justify-md="start" no-gutters>
        <v-col cols="12" sm="4" class="pa-0 mx-3">
          <v-text-field class="pa-0"
          v-model="DossierEnquete.NumDossier"
              label="رقم ملف التحقيق"
              placeholder="السنة-الرمز-الرقم"
              dense
              outlined
              required
              :rules="NumRules"
            ></v-text-field>
        </v-col>
        <v-col cols="12" sm="4" class="pa-0 mx-3">
          <v-select class="pa-0"
              label="نوع ملف التحقيق"
              v-model="DossierEnquete.type_dossierID"
              :items="type_dossiers"
              item-text="nom"
              item-value="id"
              dense
              required
              :rules="nameRules"
              outlined
            >
            </v-select>
        </v-col>
      </v-row>
      <v-row justify-md="start" no-gutters>
        <v-col cols="12" sm="4" class="pa-0 mx-3">
          <v-select class="pa-0"
              label="غرفة التحقيق"
              v-model="DossierEnquete.chambre_enquete"
              :items="['الغرفة 1','الغرفة 2']"
              dense
              :rules="nameRules"
              required
              outlined
            >
            </v-select>
        </v-col>
        <v-col cols="12" sm="4" class="pa-0 mx-3">
          <v-select class="pa-0"
              label=" قاضي التحقيق"
              v-model="DossierEnquete.juge_enqueteID"
              :items="juge_enquete"
              item-text="nom"
              item-value="id"
              dense
              required
              :rules="nameRules"
              outlined
            >
            </v-select>
        </v-col>
      </v-row>

      <v-row justify-md="start" no-gutters>
        <v-col cols="12" sm="4" class="pa-0 mx-3 my-0">
          <v-menu
          class="ma-0 pa-0"
              v-model="menu"
              :close-on-content-click="false"
              transition="scale-transition"
              offset-y
              min-width="auto"
            >
              <template v-slot:activator="{ on, attrs }" class="ma-0 pa-0">
                <v-text-field
                  label="تاريخ التسجيل"
                  v-model="DossierEnquete.dateEnreg"
                  :rules="nameRules"
                  append-icon="mdi-calendar"
                  readonly
                  v-bind="attrs"
                  class="ma-0 pa-0"
                  v-on="on"
                  outlined
                  dense
                ></v-text-field>
              </template>
              <v-date-picker
              class="ma-0 pa-0"
             v-model="DossierEnquete.dateEnreg"
                no-title
                @input="menu = false"
              ></v-date-picker>
            </v-menu>
        </v-col>
        <v-col cols="12" sm="4" class="pa-0 mx-3">
          <v-file-input
                  v-model="file"
                  required
                  accept="application/pdf"
                  color="blue accent-4"
                  class="mt-3"
                  placeholder="تحميل الملتمس"
                  label="تحميل الملتمس"
                  append-icon="mdi-file-plus"
                  outlined
                  :rules="PdfRules"
                  dense
                >
                  <template v-slot:selection="{ index, text }">
                    <v-chip
                      v-if="index < 2"
                      color="blue accent-4"
                      light
                      label
                      small
                    > {{ text }}
                    </v-chip>
                    <span
                      v-else-if="index === 2"
                      class="text-overline grey--text text--lighten-3 mx-2"
                    > +{{ files.length - 2 }} File(s)
                    </span>
                  </template>
                </v-file-input>
        </v-col>
      </v-row>
     
      <v-card-actions class="ma-0 py">
            <v-btn
              text
              height="30px"
              class="my-2 blue"
              elevation="2"
              :disabled="!valideform"
              :loading="load_confirm"
              @click="Confirm_add_dossier()"
            >
              <v-icon left>mdi-notebook-plus-outline</v-icon>
              تسجيل الملف
            </v-btn>
            <v-btn
              text
              height="30px"
              class="my-2 red"
              elevation="2"
              @click="reset()"
            >
              إلغاء
            </v-btn>

            <v-spacer></v-spacer>
             </v-card-actions>
         </v-form>
    </v-card>
    </v-dialog>
    
    
  </div>
</template>
<script>
import axios from 'axios';
import baseURL from '@/api/baseURL';
export default {
  data() {
    return {
      DossierEnquete:{
              userID:0,
              pvsID:0,
              NumDossier:'',
              type_dossierID:null,
              chambre_enquete:'',
              juge_enqueteID:null,
              dateEnreg:'',
              lien:'test',// supprimer ca

              Numpvs:null,
            },
             type_dossiers:[],
            juge_enquete:[],
            file:null,
        cherchant:"",
        PdfRules: [
        v => !!v || '',
         v => !v || v.type == 'application/pdf' || '',
      ],
      NumRules: [
        v => !!v || '',
         v =>  /[0-9]+\-[0-9]+\-[0-9]+/.test(v) || '',
      ],
      nameRules: [(v) => !!v || "حقل إجباري"],
       headers: [
        {text: 'رقم المحضر', value: 'pvs.Numpvs',align: 'start', sortable: false},
        { text: 'ممثل النيابة', value: 'user.nom', sortable: true },
        { text: 'المحضر', value: 'lien', sortable: true },
        { text: 'تحميل الملتمس', value: 'actions', sortable: false},
      ],
            pvs_enquete:[],       // pours les donnees de tableau
            dialog:false, // affichage de dialog
            load:false,  // load btn recherche
            load_tab:false, // load tableau
            menu:false,
            valideform:true,
            load_confirm:false, // loadoing lorsque l'ajout du dossier
            ShowForm:false, // afficher formulaire d'enregistrer dossier
            pagination: {
                current: 1,
                total: 0
          },
          msgSuc:false,
          msgErr:false,
           
    };
  },
  watch:{
    ShowForm(val){
      val || this.reset()
    },
    msgErr(val){
             !val || setTimeout(()=>{ this.msgErr=false; this.msgSuc=false; },2000)
          },
        msgSuc(val){
            !val || setTimeout(()=>{ this.msgSuc=false; this.msgErr=false; },2000)
         }
  },
  methods: {
    redirect(link) {
         var names = link.split('/')
          var fileLink = document.createElement('a');
                fileLink.href =  baseURL.backendPDF+"/dossiers_pvs/"+names[2];
                fileLink.target = "_blank"; 
                fileLink.click();
      },
    clearAlert() {
      this.msgErr =  false;
    },
    validate() {
      this.$refs.form.validate();
    },
    reset() {
      this.$refs.form.reset();
      this.DossierEnquete.pvsID = 0;
       this.DossierEnquete.userID = 0;
      this.DossierEnquete.Numpvs = null;
      this.ShowForm = false;
    },
    chercher_pvs_enquete() {
      this.ShowForm = false; this.pvs_enquete = [];
      this.load = true;
      axios
        .post(
          baseURL.api + "/Enquete/pvs_enquete",{  
            Numpvs: this.cherchant},
          { headers: { Authorization: `Bearer ${baseURL.token}` } }
        ).then((rep) => {
          if (rep.status == 200 || rep.status == 201)
          { this.pvs_enquete = rep.data;}
          else  this.msgErr=true;// message erreur
          this.load = false; 
          
        })
        .catch((err) => {
          this.msgErr=true;// message erreur
          this.load = false;
        });
    },
    add_dossier(item){
      this.DossierEnquete.pvsID = item.pvs.id;
      this.DossierEnquete.userID = item.user.id;
      this.DossierEnquete.Numpvs = item.pvs.Numpvs;
      this.ShowForm=true;
    },

    Confirm_add_dossier(){
      
      let formData = new FormData();
       formData.append("file",this.file);
      formData.append("NumDossier", this.DossierEnquete.NumDossier);
      formData.append("type_dossierID", this.DossierEnquete.type_dossierID);
      formData.append("chambre_enquete",this.DossierEnquete.chambre_enquete);
      formData.append("juge_enqueteID", this.DossierEnquete.juge_enqueteID);
      formData.append("pvsID", this.DossierEnquete.pvsID);
      formData.append("userID", this.DossierEnquete.userID);
      formData.append("Numpvs", this.DossierEnquete.Numpvs);
      formData.append("dateEnreg", this.DossierEnquete.dateEnreg);

      this.load_confirm = true;
      axios.post(
          baseURL.api + "/Enquete/storeDossier",formData,
          { headers: { Authorization: `Bearer ${baseURL.token}`,
            "Content-Type": "multipart/form-data", }
       }).then((rep) => {
          if (rep.status == 200 || rep.status == 201)
          { this.load_confirm = false; 
            this.all_pvs_enquete();
            this.ShowForm = false;
            this.msgSuc = true; window.scroll(0,0);
            }
          else  
             this.msgErr=true;// message erreur
             
          this.load_confirm = false;
        })
        .catch((err) => {
          this.msgErr=true;// message erreur
          this.load_confirm = false;
        });
    },

    all_pvs_enquete(){
      this.pvs_enquete = [];
      this.load_tab = true;
      axios.get(
          baseURL.api + "/Enquete/all_pvs_enquete?page="+this.pagination.current,
          { headers: { Authorization: `Bearer ${baseURL.token}` }
       }).then((rep) => {
        this.load_tab = false;
          this.pvs_enquete = rep.data.data;
          this.pagination.current = rep.data.current_page;
                this.pagination.total = rep.data.last_page;
        })
        .catch((err) => {
          this.msgErr = true;
        });
    },
    onPageChange(){
          this.all_pvs_enquete();
        },
    
  },
  created() {
    this.all_pvs_enquete();
    axios
      .get(baseURL.api + "/Enquete/index_type", {
        headers: { Authorization: `Bearer ${baseURL.token}` },
      })
      .then((rep) => {
        this.type_dossiers = rep.data;
      });

    axios
      .get(baseURL.api + "/Enquete/index_juge", {
        headers: { Authorization: `Bearer ${baseURL.token}` },
      })
      .then((rep) => {
        this.juge_enquete = rep.data;
      });
     }
};
</script>
