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
      <v-icon right>mdi-note-plus</v-icon>
       إضافة محضر
      </v-tab>
      <v-tab
      class="text-h6 mx-10"
      
      >
      <v-icon right>mdi-note-search</v-icon>
      بحث عن محضر
      </v-tab>
       </v-tabs>
    <v-tabs-items v-model="tab">
      <v-tab-item
      >
      <Ajoutpv></Ajoutpv>
      </v-tab-item>
      <v-tab-item
      >
      <Cherchepv />
      </v-tab-item>
      </v-tabs-items>
  </div>
</template>

<script>
import Ajoutpv from '@/components/pvs/ajoutpv.vue'
import Cherchepv from '@/components/pvs/cherche_pv.vue'
  export default {
    components: {
    Ajoutpv,
    Cherchepv,
    
  
},
    data() {
      return {
        tab: null,
      }
    }
  }
</script>