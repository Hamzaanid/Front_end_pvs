<template>
<div>
  <v-data-table
    :headers="headers"
    :items="pvs"
    hide-default-footer
    :search="searchpv"
    :loading="load_table"
    loading-text="إنتظر قليلا"
    no-data-text="لاتوجد محاضر"
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

          </v-row>
        
        <v-dialog v-model="dialog" max-width="700px">
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
              <v-btn color="blue darken-1" text @click="close()"> رجوع </v-btn>
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
                هل تريد حفظ هذا المحضر في الأرشيف
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
import { mapGetters, mapActions } from "vuex";
export default {

  data: () => ({
    pvs:[],
    msgErr:false,
    dialog: false,
    checkbox:false,
    searchpv: "",
    load_vcard: false,
    load_table: false,
    headers: [
      {
        text: "رقم المحضر",
        align: "start",
        sortable: false,
        value: "Numpvs",
      },
      { text: "تاريخ التسجيل", value: "dateEnregPvs", sortable: false },
      { text: "تاريخ الاحالة", value: "dateMission", sortable: false },
      { text: "ممثل النيابة", value: "nameUser", sortable: false},
      { text: "تصفح", value: "lien", sortable: false },
      { text: "القرار", value: "descision", sortable: false },
      { text: "تغيير القرار", value: "actions", sortable: false }
    ],

    userhaspvs: {
      descision: "",
      traitID: 2,
      lien: "",
      userID: null,
      idpvs: null,
    },
    dialogArchive: false,
    validform:true,
    nameRules: [(v) => !!v || "حقل إجباري"],

    switch1:true,
    numapi:2,
    stringstatus:"المحاضر المعالجة"
  }),
  watch: {
    dialog(val) {
      val || this.close();
    },
    switch1(){
      if(this.switch1) {
        this.numapi = 2;
        this.stringstatus="المحاضر المعالجة";
        this.pvs_a_confirmer();
      }else{
        this.numapi = 1;
        this.stringstatus="المحاضر  غير مدروسة";
        this.pvs_a_confirmer();
      }   
     }
  },
  computed: {
  },

  methods: {
    color_desc(val){
      if(val == 1) return 'yellow lighten-1'; 
      else return 'green lighten-1';
    },
    getstatus(traitID) {
      if (traitID == 2) return "تمت الدراسة";
      else return " في طور الدراسة";
    },
    redirect(link) {
      var names = link.split("/");
      var fileLink = document.createElement("a");
      fileLink.href = baseURL.backendPDF + "/dossiers_pvs/" + names[2];
      fileLink.target = "_blank";
      fileLink.click();
    },


    close() {
      this.userhaspvs.descision = '';
      this.userhaspvs.lien = '';
      this.userhaspvs.idpvs = -1;
      this.userhaspvs.userID = -1;
      this.dialog = false;
    },
    edite_discision(item) {
      this.userhaspvs.lien = item.lien;
      this.userhaspvs.idpvs = item.id;
      this.userhaspvs.userID = item.userID;
      this.dialog = true;
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
            this.pvs_a_confirmer();
            this.close();
            this.load_vcard = false;
            //this.msgSuc=true;
          } else {
            this.load_vcard = false;
            this.msgErr=true;
          }
        })
        .catch((erreur) => {
          this.load_vcard = false;
          this.msgErr=true;
        });
    },

    ClosedialogArchive() {
      if (this.load_vcard) {
        this.dialogArchive = true;
      } else {
        this.dialogArchive = false;
      }
    },
    archive(item) {
      this.userhaspvs.idpvs = item.id;
      this.dialogArchive = true;
    },
    ArchiveConfirm() {
      this.load_vcard = true;
      axios
        .put(
          baseURL.api +
            "/users/haspvs/updateTrait/" +
            this.userhaspvs.idpvs,
          { traitID: 3 },
          { headers: { Authorization: `Bearer ${baseURL.token}` } }
        )
        .then((rep) => {
          if (rep.status == 200 || rep.status == 201) {
            this.pvs_a_confirmer();
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
    pvs_a_confirmer(){
      this.pvs=[];
      this.load_table = true;
        axios
        .get(baseURL.api + "/users/haspvs/pvs_a_confirmer/"+this.numapi, {
          headers: { Authorization: `Bearer ${baseURL.token}` },
        })
        .then((rep) => {
          this.pvs = rep.data;
          this.load_table = false;
        });
  },
  
  },
  mounted(){
    this.pvs_a_confirmer();
  }
  
  
};
</script>
