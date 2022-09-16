<template>
    <div>
      <div class="pa-3 blue lighten-4">المحاضر الجوابية</div>
      <v-tabs v-model="tab" active-class="smallnavbar" height="35px" class="mb-3">
        <v-tab class="text-h6 mx-10">
          <v-icon right>mdi-note-plus</v-icon>
          المحاضر
        </v-tab>
        <v-tab class="text-h6 mx-10">
          <v-icon right>mdi-note-search</v-icon>
          الشكايات
        </v-tab>
      </v-tabs>
      <v-tabs-items v-model="tab">

        <v-tab-item>
            <Pvs_reponse_pvs></Pvs_reponse_pvs>
        </v-tab-item>
  
        <v-tab-item>
            <Pvs_reponse_plaints></Pvs_reponse_plaints>
        </v-tab-item>

      </v-tabs-items>
    </div>
  </template>
  
  <script>
import Pvs_reponse_pvs from '@/components/pvs/pvs_reponse_pvs.vue';
import Pvs_reponse_plaints from '@/components/plaintes/pvs_reponse_plaints.vue';

  
  export default {
    components: {
    Pvs_reponse_pvs,
    Pvs_reponse_plaints
},
    data() {
      return {
        tab: null,
      };
    },
  };
  </script>
  