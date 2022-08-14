<template>
  <v-data-table
    :headers="headers"
    :items="pvs"
    hide-default-footer
    :search="search"
    :loading="load_table"
    loading-text="إنتظر قليلا"
    no-data-text="لاتوجد محاضر"
  >
    <template v-slot:top>
      <v-toolbar flat dense>
        <v-toolbar-title class="light-blue lighten-5"
          >المحاضر المحالة</v-toolbar-title
        >
        <v-divider class="mx-4" inset vertical></v-divider>
        <v-spacer></v-spacer>
        <v-text-field
          v-model="search"
          append-icon="mdi-magnify"
          label="رقم المحضر"
          single-line
          hide-details
        ></v-text-field>
        <v-dialog v-model="dialog" max-width="500px">
          <v-card :loading="load_vcard">
            <v-card-text>
              <v-container>
                <v-form ref="form" v-model="validform">
                  <v-text-field
                  v-model="userhaspvs.descision"
                  label="القرار"
                  :rule="nameRules"
                ></v-text-field>
                </v-form>
                
              </v-container>
            </v-card-text>

            <v-card-actions>
              <v-spacer></v-spacer>
              <v-btn color="blue darken-1" text @click="close"> رجوع </v-btn>
              <v-btn
                color="blue darken-1"
                text
                @click="valider_edite_descision"
                :disabled="validform"
              >
                تغيير
              </v-btn>
            </v-card-actions>
          </v-card>
        </v-dialog>
        <v-dialog v-model="dialogArchive" max-width="400px">
            <v-card :loading="load_vcard">
              <v-card-text>
                هل تريد حفظ  هذه المحضر في الأرشيف
              </v-card-text>
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
      >
        <v-icon>mdi-download</v-icon>
      </v-chip>
    </template>

    <template v-slot:[`item.actions`]="{ item }">
      <v-chip color="blue lighten-4" lighten small fab>
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
        حفظ
      </v-chip>
    </template>
  </v-data-table>
</template>
<script>
import baseURL from "@/api/baseURL";
import axios from "axios";
import { mapGetters, mapActions } from "vuex";
export default {
  props:{
    idUser:Number
  },
  data: () => ({
    dialog: false,
    search: "",
    load_vcard: false,
    load_table: true,
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
      { text: "تغيير", value: "actions", sortable: false },
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
    nameRules: [(v) => !!v || "حقل ضروري"],
  }),
  watch: {
    dialog(val) {
      val || this.close();
    },
    pvs() {
      if (this.plaint != []) {
        this.load_table = false;
      }
    },
  },
  computed: {
    ...mapGetters(["getAllpvs_vice"]),
    pvs() {
      return this.getAllpvs_vice;
    },
  },

  methods: {
    ...mapActions(["pvsDeVice"]),
    redirect(link) {
      var names = link.split("/");
      var fileLink = document.createElement("a");
      fileLink.href = baseURL.backendPDF + "/dossiers_pvs/" + names[2];
      fileLink.target = "_blank";
      fileLink.click();
    },

    getstatus(traitID) {
      if (traitID == 2) return "تمت المعالجة";
      else return " في طور المعالجة";
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

    valider_edite_descision() {
      this.load_vcard = true;
      axios
        .post(
          baseURL.api + "/users/haspvs/descision/" + this.userhaspvs.idpvs,
          {
            userhaspvs: this.userhaspvs,
          },
          {
            headers: { Authorization: `Bearer ${baseURL.token}` },
          }
        )
        .then((rep) => {
          if (rep.status == 200) {
            this.close();
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
            this.pvsDeVice(this.idUser);
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
  },
};
</script>
