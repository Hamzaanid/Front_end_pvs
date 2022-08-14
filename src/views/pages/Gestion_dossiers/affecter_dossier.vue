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
      <v-icon right>mdi-gavel</v-icon>
        إحالة محضر
      </v-tab>
      <v-tab
      class="text-h6 mx-10"
      
      >
      <v-icon right>mdi-gavel</v-icon>
     إحالة شكاية
      </v-tab>
       </v-tabs>
    <v-tabs-items v-model="tab">

      <v-tab-item>
        <affecter_pv />
      
      </v-tab-item>

      <v-tab-item>
      <affecter_plainte></affecter_plainte>
      </v-tab-item>

      </v-tabs-items>
      

  </div>
</template>

<script>
import affecter_plainte from '@/components/plaintes/affecter_plainte.vue'
import affecter_pv from '@/components/pvs/affecter_pv.vue'

  export default {
    components: {
      affecter_plainte,
      affecter_pv,
    },
    data() {
      return {
        tab: null,
      }
    }
  }
</script>
