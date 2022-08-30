<template>
  <div>
    <v-tabs v-model="tab" active-class="smallnavbar" height="35px" class="mb-3">
      <v-tab class="text-h6 mx-10">
        <v-icon right x-small>mdi-folder-open</v-icon>
        المحاضر
      </v-tab>
      <v-tab class="text-h6 mx-10">
        <v-icon right x-small>mdi-folder-open</v-icon>
        الشكايات
      </v-tab>
      <v-tab class="text-h6 mx-10">
        <v-icon right x-small>mdi-folder-open</v-icon>
        kklklks
      </v-tab>
    </v-tabs>
    <v-tabs-items v-model="tab">
      <v-tab-item>
        <supprimer_pvsVue />
      </v-tab-item>

      <v-tab-item>
        <supprimer_plainteVue></supprimer_plainteVue>
      </v-tab-item>

      <v-tab-item>
        <Supprimer_dossier></Supprimer_dossier>
      </v-tab-item>
    </v-tabs-items>
  </div>
</template>

<script>
import supprimer_plainteVue from "@/components/plaintes/supprimer_plainte.vue";
import supprimer_pvsVue from "@/components/pvs/supprimer_pvs.vue";
import Supprimer_dossier from "@/components/pvs_enquete/supprimer_dossier.vue";

export default {
  components: {
    supprimer_plainteVue,
    supprimer_pvsVue,
    Supprimer_dossier
},
  data() {
    return {
      tab: null,
    };
  },
};
</script>
