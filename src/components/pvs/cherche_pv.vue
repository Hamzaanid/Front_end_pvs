<template>
  <div class="chercher_pvs">
    <v-card elevation="2" outlined class="mx-auto my-auto">
      <v-toolbar class="smallnavbar mb-3" flat height="34px">
        <v-toolbar-title class="darkgrey--text text-h5">
          بحث عن محضر
        </v-toolbar-title></v-toolbar>
       <div>
        <v-alert dense type="success" v-model="msgSuc" @click="clearAlert()"
      > تم تغيير المحضر  بنجاح  
      </v-alert>
      <v-alert dense type="error" v-model="msgErr" @click="clearAlert()"
      > تأكد من صحة المعلومات أو شبكة الأنترنيت 
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
      <div>
        <v-data-table
          :headers="headers"
          :items="pvss"
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
            <v-btn small color="blue lighten-5" @click="editItem(item)"
            :disabled="item.traitID >= 3 ? true : false"
              ><v-icon left> mdi-pencil </v-icon>
              معاينة
            </v-btn>
          </template>
        </v-data-table>
      </div>
      <div class="text-center"></div>
    </v-card>

    <v-card class="mt-3" v-show="showupdate">
      <div class="pa-2 blue lighten-5 mb-5">معاينة المحضر</div>
      <v-form dense ref="form" v-model="valideform" class="ma-0 pa-0 px-2">
        <v-row no-gutters dense justify-md="start">
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
              ref="menu2"
              v-model="menu2"
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
                  disabled
                  dense
                ></v-text-field>
              </template>
              <v-date-picker
                v-model="pvs.dateEnregPvs"
                no-title
                scrollable
                @input="menu2 = false"
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
              disabled
            >
            </v-select>
          </v-col>
            <v-col cols="12" sm="3" class="ml-2">
              <v-text-field
                v-model="pvs.Numpvs"
                dense
                outlined
                required
                label="رقم المحضر"
                :rules="nameRules"
                disabled
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

        <v-row no-gutters dense justify-md="start">
          <v-col cols="12" sm="3" class="mx-1"></v-col>
          <v-card-actions class="ma-0 pa-0">
            <v-btn
              text
              height="30px"
              class="my-2 blue"
              elevation="2"
              :loading="load"
              :disabled="!valideform"
              @click="Modifiepvs"
            >
              <v-icon left>mdi-notebook-plus-outline</v-icon>
              تغيير المحضر
            </v-btn>
            <v-btn
              text
              height="30px"
              class="my-2 red"
              elevation="2"
              @click="showupdate = false"
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
import baseURL from "@/api/baseURL";
import axios from "axios";
export default {
  data() {
    const defaultForm = Object.freeze({
      typepvsID: 0,
      TypeSourcePvsID: 0,
      typePoliceJudicID: 0,
      sujetpvs: "",
      Numpvs: "",
      dateEnregPvs: new Date(
        Date.now() - new Date().getTimezoneOffset() * 60000
      )
        .toISOString()
        .substr(0, 10),
      policeJudics: "",
      datePvs: "",
      heureRealisation: "",
      contreInnconue: null,
    });
    return {
      pvs: Object.assign({}, defaultForm),
      load: false,
      table_vide: false,
      headers: [
        { text: "  رقم المحضر", value: "pvs.Numpvs" },
        { text: "نوع المحضر", value: "pvs.typepvs.nom" },
        { text: " تاريخ التسجيل", value: "pvs.dateEnregPvs" },
        { text: "موضوع المحضر", value: "pvs.sujetpvs" },
         { text: "القرار  ", value: "descision" },
        { text: "المرفق", value: "lien", sortable: false },
        { text: "تغيير", value: "action", sortable: false },
      ],
      pvss: [],
      cherchant: "",


      showupdate: false,
      idpv: -1,
      nameRules: [(v) => !!v || "حقل ضروري"],
      typepvs: [],
      typesource: [],
      typepolice: [],

      menu1: false,
      menu2: false,
      valideform: true,
        // gestion des message d'erreur
      msgErr:false,
      msgSuc:false,
    };
  },
  methods: {
    redirect(link) {
      var names = link.split("/");
      var fileLink = document.createElement("a");
      fileLink.href = baseURL.backendPDF + "/dossiers_pvs/" + names[2];
      fileLink.target = "_blank";
      fileLink.click();
    },
    getstatus(traitID) {
      if (traitID < 3 || traitID == 4) return  " غير معالج";
      else {
        if(traitID == 3) return "معالج";
        else return " الإحالة على التحقيق";
        }
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
          if (rep.status == 200 || rep.status == 201) this.pvss = rep.data;
          else this.msgErr=true;// message erreur

          this.load = false;
        })
        .catch((err) => {
          this.msgErr=true;// message erreur
          this.load = false;
        });
    },
    editItem(item) {
      this.pvs = item.pvs; //this.pvs[0];
      this.idpv = item.pvs.id;
      this.showupdate = true;
    },

    async Modifiepvs() {
      this.load = true;
      await axios
        .put(
          `${baseURL.api}/pvs/update/${this.idpv}`,
          { pv: this.pvs },
          { headers: { Authorization: `Bearer ${baseURL.token}` } }
        )
        .then((rep) => {
          if (rep.status == 200 || rep.status == 201) {
            this.showupdate = false;
            this.chercher_pvs();
          } else this.msgErr=true;// message erreur
          this.load = false;
        })
        .catch((err) => {
          this.load = false;
          this.msgErr=true;// message erreur
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
