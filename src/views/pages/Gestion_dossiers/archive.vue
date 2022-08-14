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
      <v-icon right x-small>mdi-folder-open</v-icon>
       أرشيف المحاضر   
      </v-tab>
      <v-tab
      class="text-h6 mx-10"
      
      >
      <v-icon right x-small>mdi-folder-open</v-icon> 
      أرشيف الشكايات 
      </v-tab>
       </v-tabs>
    <v-tabs-items v-model="tab">

      <v-tab-item>
      <archive_pvs></archive_pvs>
      
      </v-tab-item>

      <v-tab-item>
      <archive_plaintes></archive_plaintes>
      </v-tab-item>

      </v-tabs-items>
      

  </div>
</template>

<script>
import Archive_plaintes from '@/components/plaintes/archive_plaintes.vue';
import Archive_pvs from '@/components/pvs/archive_pvs.vue';

  export default {
    components: {
        Archive_plaintes,
        Archive_pvs,
    },
    data() {
      return {
        tab: null,
      }
    }
  }
</script>