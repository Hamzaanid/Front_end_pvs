<template>
  <div>
    <v-data-table
      :headers="headers"
      :items="plaint"
      hide-default-footer
      :loading="load_table"
      :search="search"
      loading-text="إنتظر قليلا"
      no-data-text="لاتوجد شكايات"
    >
      <template v-slot:top>
        <v-toolbar flat dense>
          <v-row no-gutters dense>
            <v-switch class="mt-2 mr-6"
              v-model="switch1"
              color="green"
              :label="`${stringstatus}`"
            ></v-switch>
          </v-row>
          <v-row no-gutters dense>
            <v-col cols="12" sm="6" class="mr-2">
              <v-text-field
                v-model="search"
                append-icon="mdi-magnify"
                label="مرجع الشكاية"
                single-line
                hide-details
              ></v-text-field>
            </v-col>
          </v-row>
          <v-dialog v-model="dialog" max-width="500px">
          <v-alert dense type="error" v-model="msgErr" @click="clearAlert()"
      >  لم يتم تغيير القرار حاول مرة أخرى   
      </v-alert>
            <v-card :loading="load_vcard">
              <v-card-text>
                <v-container>
                  <v-form ref="form" v-model="validform">
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
                <v-btn color="blue darken-1" text @click="close"> رجوع </v-btn>
                <v-btn
                  color="blue darken-1"
                  text
                  :disabled="!validform || load_vcard"
                  @click="valider_edite_descision"
                >
                  تغيير
                </v-btn>
              </v-card-actions>
            </v-card>
          </v-dialog>
          <v-dialog v-model="dialogArchive" max-width="400px">
            <v-card :loading="load_vcard">
              <v-card-title class="blue lighten-5">
                هل تريد حفظ  هذه  الشكاية في الأرشيف
              </v-card-title>
              <v-card-actions>
                <v-spacer></v-spacer>
                <v-btn color="blue darken-1" text @click="ClosedialogArchive()"> لا </v-btn>
                <v-btn
                  color="blue darken-1"
                  text
                  @click="ArchiveConfirm()"
                >
                  نعم 
                </v-btn>
              </v-card-actions>
            </v-card>
          </v-dialog>
          
        </v-toolbar>
       
      </template>
      <template v-slot:[`item.lien`]="{ item }">
        <v-chip @click="redirect(item.lien)" color="blue lighten-5">
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
            @click="edite_discision(item)"
          >
            mdi-pencil
          </v-icon>
        </v-chip>
        <v-chip fab small 
        :disabled="item.traitID == 2 ? false : true"
        @click="archive(item)">
          تأكيد القرار 
        </v-chip>
      </template>
    </v-data-table>

  </div>
</template>
<script>
import baseURL from "@/api/baseURL";
import axios from "axios";
import { Action, mapActions, mapGetters, mapState } from "vuex";

export default {
  data: () => ({
    plaint:[],
    dialog: false,
    dialogArchive:false,
    search: "",
    load_vcard: false, // loader vcard
    load_table: false, // loader table vide
    headers: [
      {
        text: "مرجع الشكاية",
        align: "start",
        sortable: false,
        value: "referencePlaints",
      },
      { text: "تاريخ التسجيل", value: "dateEnregPlaints", sortable: true },
      { text: "تاريخ الاحالة", value: "dateMission", sortable: false },
      { text: "تصفح", value: "lien", sortable: false },
      { text: "القرار  ", value: "descision", sortable: false },
      { text: "تغيير القرار", value: "actions", sortable: false },
    ],

    userhasplaints: {
      descision: "",
      traitID: 2,
      lien: "",
      userID: null,

      idplainte: null, 
    },
    load_vcard:false,
    validform:true,// valider formulaire de descision
    nameRules: [(v) => !!v || "حقل إجباري"],
    msgErr:false,
    // change plaint
    switch1:true,
    numapi:2,
    stringstatus:"الشكايات المعالجة"
  }),

  watch: {
    dialog(val) {
      val || this.close();
    },
    switch1(){
      if(this.switch1) {
        this.numapi = 2;
        this.stringstatus="الشكايات المعالجة";
        this.plainte_a_confirmer();
      }else{
        this.numapi = 1;
        this.stringstatus="الشكايات  غير مدروسة";
        this.plainte_a_confirmer();
      }   
     }
  },

  methods: {
    ...mapActions(["plainteDeVice"]),
    redirect(link) {
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
      if (traitID == 2) return "تمت الدراسة";
      else return " في طور الدراسة";
    },
    clearAlert(){
      this.msgErr = false; // masquer alert
    },

    close() {
      this.userhasplaints.descision = '';
      this.userhasplaints.lien = '';
      this.userhasplaints.idplainte = -1;
      this.userhasplaints.userID = -1;
      this.dialog = false;
      this.clearAlert();
    },
 
    edite_discision(item) {
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
            this.plainte_a_confirmer();
            this.close();
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

           ClosedialogArchive(){
      if(this.load_vcard){
        this.dialogArchive = true;
      }else{
        this.dialogArchive = false;
      } 
    },
    archive(item) {
      this.userhasplaints.idplainte = item.id;
      this.dialogArchive = true;
    },
    ArchiveConfirm(){
      this.load_vcard = true;
      axios
        .put(baseURL.api +"/users/hasplaints/updateTrait/"+ this.userhasplaints.idplainte,
          {traitID:3 },
          { headers: { Authorization: `Bearer ${baseURL.token}` }, }
        
        ).then((rep) => {
          if (rep.status == 200 || rep.status == 201 ) {
            this.plainte_a_confirmer();
             this.load_vcard = false;
             this.dialogArchive = false;
          } else {
            this.load_vcard = false;//
            this.dialogArchive = false;
          }
        })
        .catch((erreur) => {
           this.load_vcard = false;
           this.dialogArchive = false;
        });
    },

    plainte_a_confirmer(){
      this.plaint=[];
      this.load_table = true;
        axios
        .get(baseURL.api + "/users/hasplaints/plaint_a_confirmer/"+this.numapi, {
          headers: { Authorization: `Bearer ${baseURL.token}` },
        })
        .then((rep) => {
          this.plaint = rep.data;
          this.load_table = false;
        });
  },
  
  },
  mounted(){
    this.plainte_a_confirmer();
  }
};
</script>
