<template>
  <div>
    <v-card flat>
      <v-toolbar class="smallnavbar mb-3" flat height="34px">
        <v-toolbar-title class="darkgrey--text text-h5">
          دراسة المحاضر / الشكايات 
        </v-toolbar-title>
      </v-toolbar>
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
    <Mes_pvs v-show="switchpvs"></Mes_pvs>
    <Mes_plaintes v-show="switchplainte"></Mes_plaintes>
  </div>
</template>

<script>
import Mes_pvs from "@/components/pvs/mes_pvs.vue";
import Mes_plaintes from "@/components/plaintes/mes_plaintes.vue";
export default {
  components: {
    Mes_pvs,
    Mes_plaintes,
  },
  data() {
    return {
      switchplainte: true, // pour afficher les plaintes
      switchpvs: true, // pour afficher les pvs
    };
  },
};
</script>
