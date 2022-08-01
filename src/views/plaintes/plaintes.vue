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
       إضافة شكاية
      </v-tab>
      <v-tab
      class="text-h6 mx-10"
      
      >
      <v-icon right>mdi-note-search</v-icon>
      بحث عن شكاية
      </v-tab>
       </v-tabs>
    <v-tabs-items v-model="tab">
      <v-tab-item
      >
      <ajoutplainte></ajoutplainte>
      </v-tab-item>
      <v-tab-item
      >
      <chercheplainte />
      </v-tab-item>
      </v-tabs-items>
  </div>
</template>

<script>
import ajoutplainte from '@/components/plaintes/ajout_plainte.vue'
import chercheplainte from '@/components/plaintes/cherche_plainte.vue'
  export default {
    components: {
      ajoutplainte,
      chercheplainte
    },
    data() {
      return {
        tab: null,
      }
    }
  }
</script>
