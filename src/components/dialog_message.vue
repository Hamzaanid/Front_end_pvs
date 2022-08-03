<template>
  <div class="text-center">
    <v-snackbar
      v-model="snackbar"
      :timeout="timeout"
      centered
      :color="color"
      light
    >
      {{ text }}

      <template v-slot:action="{ attrs }">
        <v-btn
          color="blue"
          text
          v-bind="attrs"
          @click="snackbar = false"
        >
          إغلاق
        </v-btn>
      </template>
    </v-snackbar>
  </div>
</template>

<script>
  export default {
    props:{

      text:{
        default:""
      },
      snackbar:{
        default:true
      },
      timeout:{
        default:2000
      },
      color:{
        default:"light-blue accent-1"
      }
    },
    data: () => ({
     
    }),
  }
</script>