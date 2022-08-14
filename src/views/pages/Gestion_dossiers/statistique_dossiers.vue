<template>
<div>
  <v-tabs
      v-model="tab"
       active-class="smallnavbar"
       height="35px"
       class="mb-3"
    >
    <v-tab
      class="text-h6 mx-10"
      >
      <v-icon right small>mdi-file-chart</v-icon>
       إحصائيات المحاضر
      </v-tab>
      <v-tab
      class="text-h6 mx-10"
      
      >
      <v-icon right small>mdi-file-chart</v-icon>
     إحصائيات الشكايات 
      </v-tab>
       </v-tabs>
    <v-tabs-items v-model="tab">

            <v-tab-item>
            <Statistique_pvs />
            </v-tab-item>

            <v-tab-item>
            <Statistique_plainte />
            </v-tab-item>

     </v-tabs-items>
      

  </div>
</template>

<script>
import Statistique_plainte from '@/components/plaintes/statistique_plainte.vue'
import Statistique_pvs from '@/components/pvs/statistique_pvs.vue'

  export default {
    components: {
        Statistique_plainte,
        Statistique_pvs
    },
    data() {
      return {
        tab: null,
      }
    }
  }
</script>
