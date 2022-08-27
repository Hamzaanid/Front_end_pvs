<template>
  <div>
    قرارات التحقيق
    <v-tabs v-model="tab" active-class="smallnavbar" height="35px" class="mb-3">

      <v-tab class="text-h6 mx-10">
        <v-icon right x-small>mdi-folder-open</v-icon>
        ملفات التحقيق
      </v-tab>

      <v-tab class="text-h6 mx-10">
        الغرفة 1
      </v-tab>

      <v-tab class="text-h6 mx-10">
        الغرفة 2
      </v-tab>

    </v-tabs>

    <v-tabs-items v-model="tab">
    
     <v-tab-item>
        <Chercher_enquete />
      </v-tab-item>

      <v-tab-item>
        <Chambre1_enquete />
      </v-tab-item>

      <v-tab-item>
        <Chambre2_enquete />
      </v-tab-item>

      </v-tabs-items>
   
  </div>
</template>

<script>
import axios from "axios";
import baseURL from "@/api/baseURL";


import Chercher_enquete from "@/components/pvs_enquete/chercher_enquete.vue";
import Chambre2_enquete from "@/components/pvs_enquete/chambre2_enquete.vue";
import Chambre1_enquete from "@/components/pvs_enquete/chambre1_enquete.vue"
export default {
    data() {
        return {
            tab: false
        };
    },
    components: { Chercher_enquete, Chambre2_enquete, Chambre1_enquete }
};
</script>
