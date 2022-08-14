<template>
  <div>
    <v-card elevation="2" outlined class="mx-auto my-auto justify-center">
      <v-toolbar class="smallnavbar mb-3" flat height="34px">
        <v-toolbar-title class="darkgrey--text text-h5"
          >الاطلاع على الاحالة</v-toolbar-title
        >
      </v-toolbar>

      <v-form dense ref="form" class="ma-0 pa-0 px-2">
        <v-row no-gutters dense>
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
      </v-row>
    </v-card>
    <v-card
      elevation="2"
      v-show="display"
      outlined
      class="mx-auto my-auto mt-3 justify-center"
    >
      <suivi_plainteVue v-show="switchplainte" :idUser="userid"></suivi_plainteVue>
    </v-card>
    <v-card
      v-show="display"
      elevation="2"
      outlined
      class="mx-auto my-auto mt-3 justify-center"
    >
      <suivi_pvVue v-show="switchpvs" :idUser="userid"></suivi_pvVue>
    </v-card>
  </div>
</template>

<script>
import suivi_plainteVue from "@/components/plaintes/suivi_plaintes.vue";
import suivi_pvVue from "@/components/pvs/suivi_pvs.vue";
import baseURL from "@/api/baseURL";
import axios from "axios";
import { mapActions } from "vuex";

export default {
  components: {
    suivi_plainteVue,
    suivi_pvVue,
  },
  data() {
    return {
      load_cherche: false,
      display: false,
      viceProc: [],
      userid: null,

      Allplaintes: [],
      Allpvs: [],
      switchpvs: true,
      switchplainte: true,
    };
  },
  watch:{
    userid(){
      this.cherche_document();
      this.load_cherche = true;
    }
  },

  methods: {
    ...mapActions(["plainteDeVice", "pvsDeVice"]),

    async cherche_document() {
      try {
        this.load_cherche = true;
        await this.plainteDeVice(this.userid);
        await this.pvsDeVice(this.userid);
        this.load_cherche = false;
        this.display = true;
      } catch (err) {
        this.display = true;
        return;
      }
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
