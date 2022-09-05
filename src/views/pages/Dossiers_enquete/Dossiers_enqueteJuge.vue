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
        ملفات التحقيق
        </v-tab>
        <v-tab
        class="text-h6 mx-10"
        
        >
        <v-icon right>mdi-gavel</v-icon>
        قرارات التحقيق
        </v-tab>
         </v-tabs>
      <v-tabs-items v-model="tab">
  
        <v-tab-item>
         <DossierEnqueteJugeSoi></DossierEnqueteJugeSoi>
        </v-tab-item>
  
        <v-tab-item>
          <DecisionEnqueteJuge></DecisionEnqueteJuge>
        </v-tab-item>
  
        </v-tabs-items>
        
  
    </div>
  </template>
  
  <script>
import DossierEnqueteJugeSoi from '@/components/pvs_enquete/dossierEnqueteJugeSoi.vue'
import DecisionEnqueteJuge from '../../../components/pvs_enquete/DecisionEnqueteJuge.vue'
  
    export default {
      components: {
    DossierEnqueteJugeSoi,
    DecisionEnqueteJuge
},
      data() {
        return {
          tab: null,
        }
      }
    }
  </script>
  