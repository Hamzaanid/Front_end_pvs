<template>
    <div>
      <v-tabs
          v-model="tab"
           active-class="smallnavbar"
           height="35px"
           class="mb-3"
        >
       
          <v-tab  class="text-h6 mx-10" >
          الشكايات
          </v-tab>

          <v-tab class="text-h6 mx-10" >
            المحاضر
          </v-tab>

          <v-tab class="text-h6 mx-10" >
            محاضرالتحقيق
          </v-tab>

          <v-tab class="text-h6 mx-10">
            الاطلاع على الاحالة
          </v-tab>

           </v-tabs>

        <v-tabs-items v-model="tab">

          <v-tab-item>  <Suivi_plaintes></Suivi_plaintes>
          </v-tab-item>

          <v-tab-item>  <Suivi_pvs></Suivi_pvs>
          </v-tab-item>

          <v-tab-item>   <Suivi_pvs_enquete></Suivi_pvs_enquete> 
          </v-tab-item>

         <v-tab-item>   <Suivi_traitement></Suivi_traitement>
          </v-tab-item>

          </v-tabs-items>
          
      </div>
    </template>
    
    <script>
import Suivi_plaintes from '@/components/plaintes/suivi_plaintes.vue';
import Suivi_traitement from './suivi_traitement.vue';
import Suivi_pvs from '@/components/pvs/suivi_pvs.vue';
import Suivi_pvs_enquete from '@/components/pvs_enquete/suivi_pvs_enquete.vue';
    
      export default {
        components: {
    Suivi_traitement,
    Suivi_pvs,
    Suivi_plaintes,
    Suivi_pvs_enquete
},
        data() {
              return {
            tab: null,
          }
        }
      }
    </script>
    