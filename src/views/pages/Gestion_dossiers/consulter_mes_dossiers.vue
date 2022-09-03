<template>
  <div>
    <v-tabs v-model="tab" active-class="smallnavbar" height="35px" class="mb-3">
      <v-tab class="text-h6 mx-10">
        <v-icon right small>mdi-file-eye</v-icon>
        دراسة المحاضر / الشكايات
      </v-tab>
      <v-tab class="text-h6 mx-10" v-if="Statistique_particul_vice">
        <v-icon right small>mdi-file-chart</v-icon>
        إحصائيات خاصة
      </v-tab>
    </v-tabs>
    <v-tabs-items v-model="tab">
      <v-tab-item>
        <v-card flat>
          <v-row no-gutters>
            <v-col cols="12" sm="3" class="mr-3">
              <v-switch
                v-model="switchplainte"
                label="الشكايات"
                color="green"
              ></v-switch>
            </v-col>
            <v-col cols="12" sm="3">
              <v-switch
                v-model="switchpvs"
                label="المحاضر"
                color="green"
              ></v-switch>
            </v-col>
          </v-row>
        </v-card>
        <div class="cyan lighten-5 pa-2"></div>
        <Mes_pvs v-show="switchpvs"></Mes_pvs>
        <div class="cyan lighten-5 pa-2"></div>
        <Mes_plaintes v-show="switchplainte"></Mes_plaintes>
      </v-tab-item>

      <v-tab-item v-if="Statistique_particul_vice"> 
        <Statistique_vice></Statistique_vice>
      </v-tab-item>
    </v-tabs-items>
  </div>
</template>

<script>
import Mes_pvs from "@/components/pvs/mes_pvs.vue";
import Mes_plaintes from "@/components/plaintes/mes_plaintes.vue";
import Statistique_vice from "./statistique_vice.vue";
export default {
  components: {
    Mes_pvs,
    Mes_plaintes,
    Statistique_vice
},
  data() {
    return {
      tab: null,
      switchplainte: true, // pour afficher les plaintes
      switchpvs: true, // pour afficher les pvs
    };
  },
  computed:{
    Statistique_particul_vice(){
      return this.$store.state.user.statistic_p;
    }
  }
};
</script>
