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
      <v-icon right>mdi-account-details</v-icon>
         تسيير الحسابات   
      </v-tab>
      <v-tab
      class="text-h6 mx-10"
      
      >
      <v-icon right>mdi-account-plus</v-icon>
       إنشاء حساب 
      </v-tab>
       </v-tabs>
    <v-tabs-items v-model="tab">

      <v-tab-item>
        <gest_user></gest_user>
      </v-tab-item>

      <v-tab-item>
        <Add_compte></Add_compte>
      </v-tab-item>

      </v-tabs-items>
      

  </div>
</template>

<script>
import gest_user from '@/components/Administration.vue/gest_user.vue'
import Add_compte from '@/components/Administration.vue/add_compte.vue'

  export default {
  components: { gest_user, Add_compte },
    data() {
      return {
        tab: null,
      }
    }
  }
</script>
