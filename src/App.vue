<template>
    <div>
      <v-app id="bg">
        <router-view />
      </v-app>
    </div>
</template>

<script>
export default {
  name: "App",
  methods: {
    changeRTL() {
      this.$vuetify.rtl = 0.0;
    },
  },
};
</script>
<style>
@import url(https://fonts.googleapis.com/earlyaccess/droidarabicnaskh.css);
#bg {
  background: repeating-radial-gradient(
      circle,
      transparent,
      transparent 5.6px,
      #eae8e4 5.6px,
      #eae8e4 7.2px
    ),
    repeating-radial-gradient(
      circle,
      transparent,
      transparent 5.6px,
      #eae8e4 5.6px,
      #eae8e4 7.2px
    ),
    #f0f0f0;
  background-size: 32px 32px;
  background-position: 0 0, 16px 16px, 32px 16px;
  background-color: #f0f0f0;
  font-family: "Droid Arabic Naskh", Arial, Helvetica, sans-serif;
  font-size: 12px;
  text-decoration: none;
  color: black;
}
.smallnavbar{

  
background: rgb(9,47,45);
background: -moz-linear-gradient(0deg, rgba(9,47,45,1) 3%, rgba(210,230,244,1) 3%, rgba(210,230,244,1) 32%);
background: -webkit-linear-gradient(0deg, rgba(9,47,45,1) 3%, rgba(210,230,244,1) 3%, rgba(210,230,244,1) 32%);
background: linear-gradient(0deg, rgba(9,47,45,1) 3%, rgba(210,230,244,1) 3%, rgba(210,230,244,1) 32%);
filter: progid:DXImageTransform.Microsoft.gradient(startColorstr="#092f2d",endColorstr="#d2e6f4",GradientType=1);
}
</style>
