<template>
  <div>
    <!-- selectioner un user ayant des  dossiers -->
    <v-card elevation="2" outlined class="mx-auto my-auto justify-center">
      <v-toolbar class="smallnavbar mb-3" flat height="34px">
        <v-toolbar-title class="darkgrey--text text-h5"
          >الاطلاع على الاحالة</v-toolbar-title
        >
      </v-toolbar>

      <v-form dense ref="form" class="ma-0 pa-0 px-2">
        <v-row no-gutters dense justify-md="start">
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
          </v-col>
        </v-row>
      </v-form>
      <v-row no-gutters>
        <v-col cols="12" sm="3" class="mr-3">
          <v-switch class="ma-0 pa-0"
            v-model="switchplainte"
            label="الشكايات"
            color="green"
          ></v-switch>
        </v-col>
        <v-col cols="12" sm="3">
          <v-switch class="ma-0 pa-0"
            v-model="switchpvs"
            label="المحاضر"
            color="green"
          ></v-switch>
        </v-col>
        <v-col cols="12" sm="3">
          <v-switch class="ma-0 pa-0"
            v-model="switchdossier"
            label="المحاضر المحالة لتحقيق"
            color="green"
          ></v-switch>
        </v-col>
      </v-row>
    </v-card>
    <!-- dialog pour changer user -->
    <v-dialog v-model="dialogUser" max-width="500px">
          
            <v-card :loading="load_change_user">
            <v-alert type="error" v-model="msgeror" @click="msgeror = false"
            >تأكد من صحة المعلومات</v-alert>
            <v-card-title>
               <v-autocomplete
              v-model="usersID"
              :items="viceProc"
              item-text="nom"
              item-value="id"
              placeholder="مساعدة في البحث"
              no-data-text="لا يوجد"
              label="ممثل النيابة"
              outlined
              dense
            ></v-autocomplete>
            </v-card-title>
              <v-card-actions>
                <v-spacer></v-spacer>
                <v-btn color="blue darken-1" text @click="dialogUser = false"> 
                رجوع </v-btn>
                <v-btn
                  color="blue darken-1"
                  text
                  :disabled="load_change_user"
                  @click="valider_change_user"
                >
                  تغيير
                </v-btn>
              </v-card-actions>
            </v-card>
          </v-dialog>
          <!-- les plaintes -->
    <v-card
      elevation="2"
      v-show="display"
      outlined
      class="mx-auto my-auto mt-3 justify-center"
      
    >
    <div class="light-blue lighten-4 pa-2"
              >الشكايات المحالة</div>
    <v-data-table v-show="switchplainte"
      :headers="headerspl"
      :items="plaint"
      hide-default-footer
      :loading="load_tableplnt"
      :search="search"
      loading-text="إنتظر قليلا"
      no-data-text="لاتوجد شكايات"
    >
      <template v-slot:top>
         
        <v-toolbar flat dense>
          <v-row no-gutters dense>
            <v-col cols="12" sm="6">
              <v-text-field
                v-model="search"
                append-icon="mdi-magnify"
                label="مرجع الشكاية"
                single-line
                hide-details
                dense
              ></v-text-field>
            </v-col>
          </v-row>
          <v-dialog v-model="dialog" max-width="500px">
          
            <v-card :loading="load_vcard">
            <v-alert dense type="error" v-model="msgErr" @click="clearAlert()"
                >  لم يتم تغيير القرار حاول مرة أخرى 
                </v-alert>
              <v-card-text>
                <v-container>
                  <v-form ref="form1" v-model="validform1">
                    <v-text-field
                    v-model="userhasplaints.descision"
                    label="القرار"
                    :rule="nameRules"
                    required
                  >
                  </v-text-field>
                  </v-form>
                  
                </v-container>
              </v-card-text>

              <v-card-actions>
                <v-spacer></v-spacer>
                <v-btn color="blue darken-1" text @click="closeplaint"> رجوع </v-btn>
                <v-btn
                  color="blue darken-1"
                  text
                  :disabled="!validform1 ||load_vcard"
                  @click="valider_edite_descision"
                >
                  تغيير
                </v-btn>
              </v-card-actions>
            </v-card>
          </v-dialog>
          <v-dialog v-model="dialogArchive1" max-width="400px">
            <v-card :loading="load_vcard">
              <v-card-title class="blue lighten-5">
                هل تريد حفظ  هذه  الشكاية في الأرشيف
              </v-card-title>
              <v-card-actions>
                <v-spacer></v-spacer>
                <v-btn color="blue darken-1" text @click="ClosedialogArchiveplaint()"> لا </v-btn>
                <v-btn
                  color="blue darken-1"
                  text
                  @click="ArchiveConfirmplaint()"
                >
                  نعم 
                </v-btn>
              </v-card-actions>
            </v-card>
          </v-dialog>
          
        </v-toolbar>
      </template>
      <template v-slot:[`item.lien`]="{ item }">
        <v-chip @click="redirectplaint(item.lien)" color="blue lighten-5">
          تصفح
          <v-icon small>mdi-download</v-icon>
        </v-chip>
      </template>
      <template v-slot:[`item.action`]="{ item }">
        <v-chip :color="color_desc(item.traitID)" lighten small fab>
          {{ getstatus(item.traitID) }}
          <v-icon
            :disabled="item.traitID == 2 ? false : true"
            small
            class="mr-2"
            @click="edite_discisionplaint(item)"
          >
            mdi-pencil
          </v-icon>
        </v-chip>
        <v-chip fab small 
        :disabled="item.traitID == 2 ? false : true"
        @click="archiveplaint(item)">
          تأكيد القرار 
        </v-chip>
      </template>
      <template v-slot:[`item.move_affect`]="{ item }">
        
        <v-chip  @click="changeUser(item,0)" lighten small 
        fab :disabled="item.traitID == 1 ? false : true">
        تغيير
          <v-icon
            small
            class="mr-2"
          >
            mdi-pencil
          </v-icon>
        </v-chip>
      </template>
    </v-data-table>
    </v-card>

    <!-- les pvs -->
    <v-card
      v-show="display"
      elevation="2"
      outlined
      class="mx-auto my-auto mt-3 justify-center"
    >
    <div class="light-blue lighten-4 pa-2"
          >المحاضر المحالة</div
        >
    <v-data-table
    v-show="switchpvs"
    :headers="headers"
    :items="pvs"
    hide-default-footer
    :search="searchpv"
    :loading="load_tablepv"
    loading-text="إنتظر قليلا"
    no-data-text="لاتوجد محاضر"
  >
    <template v-slot:top>
      <v-toolbar flat dense>
        <v-col cols="12" sm="6">
        <v-text-field
          v-model="searchpv"
          append-icon="mdi-magnify"
          label="رقم المحضر"
          single-line
          hide-details
          dense
        ></v-text-field>
        </v-col>
        <v-dialog v-model="dialog1" max-width="500px">
          <v-card :loading="load_vcard">
          <v-alert dense type="error" v-model="msgErr" @click="clearAlert()"
                >  لم يتم تغيير القرار حاول مرة أخرى   
                </v-alert>
            <v-card-text>
              <v-container>
                <v-form ref="form" v-model="validform">
                <v-row no-gutters justify-md="start">
                   <v-text-field
                  v-model="userhaspvs.descision"
                  label="القرار"
                  :rule="nameRules"
                  required
                  dense
                ></v-text-field>
                <v-spacer></v-spacer>
                    <v-checkbox
                      dense
                      v-model="checkbox"
                      label="تأكيد إحالة التحقيق"
                    ></v-checkbox>
                </v-row>
                </v-form>
              </v-container>
            </v-card-text>

            <v-card-actions class="py-0">
              <v-spacer></v-spacer>
              <v-btn color="blue darken-1" text @click="closepvs"> رجوع </v-btn>
              <v-btn
                color="blue darken-1"
                text
                @click="valider_edite_descision_pvs"
                :disabled="!validform || load_vcard"
              >
                تغيير
              </v-btn>
            </v-card-actions>
          </v-card>
        </v-dialog>
        <v-dialog v-model="dialogArchive" max-width="400px">
            <v-card :loading="load_vcard">
              <v-card-title class="blue lighten-5">
                {{ messageConfirm }}
              </v-card-title>
              <v-card-actions>
                <v-spacer></v-spacer>
                <v-btn color="blue darken-1" text @click="ClosedialogArchive()"> لا </v-btn>
                <v-btn
                  color="blue darken-1"
                  text
                  @click="ArchiveConfirm(3)"
                >
                  نعم 
                </v-btn>
              </v-card-actions>
            </v-card>
          </v-dialog>
      </v-toolbar>
    </template>
    <template v-slot:[`item.move_affect`]="{ item }">
        <v-chip  @click="changeUser(item,1)" lighten small 
        fab :disabled="item.traitID == 1 ? false : true">
          <v-icon
            small
            class="mr-2"
          >
            mdi-pencil
          </v-icon>
          تغيير
        </v-chip>
      </template>
    <template v-slot:[`item.lien`]="{ item }">
      <v-chip
        @click="redirect(item.lien)"
        color="blue lighten-5"
        class="app-link"
      >تصفح
        <v-icon small>mdi-download</v-icon>
      </v-chip>
    </template>

    <template v-slot:[`item.actions`]="{ item }">
      <v-chip :color="color_desc(item.traitID)" lighten small fab>
        {{ getstatus(item.traitID) }}
        <v-icon
          :disabled="item.traitID == 2 ? false : true"
          small
          class="mr-2"
          @click="edite_discisionpvs(item)"
        >
          mdi-pencil
        </v-icon>
      </v-chip>

      <v-chip fab small 
      :disabled="item.traitID == 2 ? false : true"
      @click="archive(item,0)">
        تأكيد القرار
      </v-chip>
    </template>
  </v-data-table>
    </v-card>

    <!-- les dossiers d'enquete -->
    <v-card
      v-show="display"
      elevation="2"
      outlined
      class="mx-auto my-auto mt-3 justify-center"
    >
    <div class="light-blue lighten-4 pa-2"
          > محاضر التحقيق</div
        >
    <v-data-table
    v-show="switchdossier"
    :headers="headers"
    :items="pvs_enquete"
    hide-default-footer
    :search="search_enquete"
    :loading="load_tablepv"
    loading-text="إنتظر قليلا"
    no-data-text="لاتوجد محاضر"
  >
    <template v-slot:top>

        <v-col cols="12" sm="6">
        <v-text-field
          v-model="search_enquete"
          append-icon="mdi-magnify"
          label="رقم المحضر"
          single-line
          hide-details
          dense
        ></v-text-field>
        </v-col>
    </template>
    <template v-slot:[`item.lien`]="{ item }">
      <v-chip
        @click="redirect(item.lien)"
        color="blue lighten-5"
        class="app-link"
      >تصفح
        <v-icon small>mdi-download</v-icon>
      </v-chip>
    </template>

    <template v-slot:[`item.actions`]="{ item }">
      <v-chip :color="color_desc(item.traitID)" lighten small fab>
        {{ getstatus(item.traitID) }}
        <v-icon
          :disabled="item.traitID == 4 ? false : true"
          small
          class="mr-2"
          @click="edite_discisionpvs(item)"
        >
          mdi-pencil
        </v-icon>
      </v-chip>

      <v-chip fab small 
      :disabled="item.traitID == 4 ? false : true"
      @click="archive(item,1)">
        تأكيد القرار
      </v-chip>
    </template>
  </v-data-table>
    </v-card>
  </div>
</template>

<script>
import baseURL from "@/api/baseURL";
import axios from "axios";

export default {
  data() {
    return {
      // change user
      IdUserChange:null,
      dialogUser:false,
      usersID:null,
      load_change_user:false,
      msgeror:false,
      choix:false,
      // cherche des dossier par vice
      display: false,
      viceProc: [],
      userid: null,
      switchpvs: true,
      switchdossier:true,
      switchplainte: true,
      // plaintes
      plaint:[],
      dialog1: false,
    dialogArchive1:false,
    search: "",
    load_vcard: false, // loader vcard
    load_tableplnt: false, // loader table vide
    headerspl: [
      {text: "مرجع الشكاية",align: "start",sortable: false,value: "referencePlaints",},
      { text: "تاريخ التسجيل", value: "dateEnregPlaints", sortable: true},
      { text: "تاريخ الاحالة", value: "dateMission", sortable: false },
      { text: "تصفح", value: "lien", sortable: false },
      { text: "القرار  ", value: "descision", sortable: false },
      { text: "تغيير القرار", value: "action", sortable: false },
      { text: "تغيير الاحالة", value: "move_affect", sortable: false }
    ],

    userhasplaints: {
      descision: "",
      traitID: 2,
      lien: "",
      userID: null,
      idplainte: null, 
    },
    load_vcard:false,
    validform:true,
    validform1:true,// valider formulaire de descision
    nameRules: [(v) => !!v || "حقل إجباري"],
    msgErr:false,
    // pvs ################
     dialog: false,
    searchpv: "",
    load_tablepv: false,
    pvs:[],
    headers: [
      {
        text: "رقم المحضر",
        align: "start",
        sortable: false,
        value: "Numpvs",
      },
      { text: "تاريخ التسجيل", value: "dateEnregPvs", sortable: false },
      { text: "تاريخ الاحالة", value: "dateMission", sortable: false },
      { text: "تصفح", value: "lien", sortable: false },
      { text: "القرار", value: "descision", sortable: false },
      { text: "تغيير القرار", value: "actions", sortable: false },
      { text: "تغيير الاحالة", value: "move_affect", sortable: false }
    ],

    userhaspvs: {
      descision: "",
      traitID: 2,
      lien: "",
      userID: null,
      idpvs: null,
    },
    dialogArchive: false,
    // les dossier d'enquetes ###########
    pvs_enquete:[],
    search_enquete:"",
    checkbox:false,
    dialog_enquete:false,
    messageConfirm:"",
    typeArchive:null,
    
    };
  },
  watch:{
    userid(){
      this.display=true;
      this.plainteDeVice();
      this.pvsDeVice();
      this.pvsEnqueteDeVice();
    },
    dialog(val){
      val || this.closeplaint()
    }
  },

  methods: {
    // 0 plaint ====== 1 pvs
    changeUser(item,num){
      this.IdUserChange = item.id;
      if(num==0){
        this.choix = "hasplaints";
         this.dialogUser = true;
      }
      if(num==1){
        this.choix = "haspvs";
        this.dialogUser = true;
      }
      
    },
    valider_change_user(){
      this.load_change_user = true
        axios
          .post(baseURL.api + "/users/"+this.choix+"/change_user/"+this.IdUserChange,{
            userID:this.usersID
          }, {
            headers: { Authorization: `Bearer ${baseURL.token}` },
          })
          .then((rep) => {
            this.load_change_user = false; this.usersID = null;
            this.plainteDeVice();  this.pvsDeVice();
            this.dialogUser = false;
            this.choix = "";
          }).catch(err=>{
            this.load_change_user = false;
            this.msgeror=true;
          });
    },
    plainteDeVice(){
      this.plaint = [];
      this.load_tableplnt = true;
            axios
          .post(baseURL.api + "/plaint/plaints_of_user",{
            userID:this.userid
          }, {
            headers: { Authorization: `Bearer ${baseURL.token}` },
          })
          .then((rep) => {
            this.plaint = rep.data;
             this.load_tableplnt = false;
            this.display = true;
          });
    },
     redirectplaint(link) {
      var names = link.split("/");
      var fileLink = document.createElement("a");
      fileLink.href = baseURL.backendPDF + "/dossiers_plaintes/" + names[2];
      fileLink.target = "_blank";
      fileLink.click();
    },
    color_desc(val){
      if(val == 1) return 'yellow lighten-1'; 
      else return 'green lighten-1';
    },
    
    getstatus(traitID) {
      if (traitID == 2 || traitID==4) return "تمت الدراسة";
      else{
        return " في طور الدراسة";
      } 
    },
    clearAlert(){
      this.msgErr = false; // masquer alert
    },

    closeplaint() {
      this.userhasplaints.descision = '';
      this.userhasplaints.lien = '';
      this.userhasplaints.idplainte = -1;
      this.userhasplaints.userID = -1;
      this.dialog = false;
      this.clearAlert();
    },
 
    edite_discisionplaint(item) {
      //this.userhasplaints.descision = item.descision;
      this.userhasplaints.lien = item.lien;
      this.userhasplaints.idplainte = item.id;
      this.userhasplaints.userID = item.userID;
      this.dialog = true;
    },

    valider_edite_descision() {
      this.load_vcard = true;
      axios
        .post(
          baseURL.api +
            "/users/hasplaints/descision/" +
            this.userhasplaints.idplainte,
          {
            userhasplaint: this.userhasplaints,
          },
          {
            headers: { Authorization: `Bearer ${baseURL.token}` },
          }
        )
        .then((rep) => {
          if (rep.status == 200) {
            this.closeplaint();
            this.plainteDeVice();
            this.load_vcard = false;
          } else {
            this.load_vcard = false;
            this.msgErr = true;
          }
        })
        .catch((erreur) => {
          this.load_vcard = false;
            this.msgErr = true;
        });
    },

           ClosedialogArchiveplaint(){
      if(this.load_vcard){
        this.dialogArchive1 = true;
      }else{
        this.dialogArchive1 = false;
      } 
    },
    archiveplaint(item) {
      this.userhasplaints.idplainte = item.id;
      this.dialogArchive1 = true;
    },
    ArchiveConfirmplaint(){
      this.load_vcard = true;
      axios
        .put(baseURL.api +"/users/hasplaints/updateTrait/"+ this.userhasplaints.idplainte,
          {traitID:3 },
          { headers: { Authorization: `Bearer ${baseURL.token}` }, }
        
        ).then((rep) => {
          if (rep.status == 200 || rep.status == 201 ) {
            this.plainteDeVice();
             this.load_vcard = false;
             this.dialogArchive1 = false;
          } else {
            this.load_vcard = false;
            this.dialogArchive1 = false;
          }
        })
        .catch((erreur) => {
           this.load_vcard = false;
           this.dialogArchive1 = false;
           // error
        });
    },
    // ####################" les pvs ##########
    pvsDeVice(){
      this.pvs = [];
      this.load_tablepv = true;
        axios
        .post(baseURL.api + "/pvs/pvs_of_user",{
          userID:this.userid
        }, {
          headers: { Authorization: `Bearer ${baseURL.token}` },
        })
        .then((rep) => {
          this.pvs = rep.data;
          this.load_tablepv = false;
        });
  },
  
     redirect(link) {
      var names = link.split("/");
      var fileLink = document.createElement("a");
      fileLink.href = baseURL.backendPDF + "/dossiers_pvs/" + names[2];
      fileLink.target = "_blank";
      fileLink.click();
    },
    closepvs() {
      this.userhaspvs.descision = '';
      this.userhaspvs.lien = '';
      this.userhaspvs.idpvs = -1;
      this.userhaspvs.userID = -1;
      this.dialog1 = false;
      this.dialog_enquete = false;
    },
    edite_discisionpvs(item) {
      this.userhaspvs.lien = item.lien;
      this.userhaspvs.idpvs = item.id;
      this.userhaspvs.userID = item.userID;

      this.dialog1 = true;
    },

    valider_edite_descision_pvs() {
      if(this.checkbox){
        this.userhaspvs.traitID = 4;
      }
      this.load_vcard = true;
      axios
        .post(
          baseURL.api + "/users/haspvs/descision/" + this.userhaspvs.idpvs,
          {userhaspvs: this.userhaspvs,},
          {
            headers: { Authorization: `Bearer ${baseURL.token}` },
          })
          .then((rep) => {
          if (rep.status == 200) {
            this.pvsDeVice(); this.pvsEnqueteDeVice();
            this.closepvs();
            this.load_vcard = false;
          } else {
            this.load_vcard = false;
          }
        })
        .catch((erreur) => {
          this.load_vcard = false;
        });
    },

    ClosedialogArchive() {
      if (this.load_vcard) {
        this.dialogArchive = true;
      } else {
        this.dialogArchive = false;
      }
    },
    archive(item,type) { 
      // /type/ : 0 archive et /type/ : 1 confirm_f_enquete
      if(type == 0) {
        this.typeArchive = 3
        this.messageConfirm = "هل تريد حفظ  هذا المحضر في الأرشيف";}
      if(type == 1) {
        this.typeArchive = 5;
        this.messageConfirm = "تأكيد إحالة المحضر إلى التحقيق ";
        }
      this.userhaspvs.idpvs = item.id;
      this.dialogArchive = true;
    },
    ArchiveConfirm(type) {
      // 3 archive plaint // 4 confirm dossier enquete
      this.load_vcard = true;
      axios
        .put(
          baseURL.api +
            "/users/haspvs/updateTrait/" +
            this.userhaspvs.idpvs,
          { traitID: this.typeArchive },
          { headers: { Authorization: `Bearer ${baseURL.token}` } }
        )
        .then((rep) => {
          if (rep.status == 200 || rep.status == 201) {
            this.pvsDeVice();
            this.pvsEnqueteDeVice();
            this.load_vcard = false;
            this.dialogArchive = false;
          } else {
            this.load_vcard = false;
            this.dialogArchive = false;
          }
        })
        .catch((erreur) => {
          this.load_vcard = false;
          this.dialogArchive = false;
        });
    },
    // le sdossier d'enquete ##################
        pvsEnqueteDeVice(){
      this.pvs_enquete = [];
      this.load_tablepv = true;
        axios
        .post(baseURL.api + "/users/haspvs/pvs_enquete",{
          userID:this.userid
        }, {
          headers: { Authorization: `Bearer ${baseURL.token}` },
        })
        .then((rep) => {
          this.pvs_enquete = rep.data;
          this.load_tablepv = false;
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
