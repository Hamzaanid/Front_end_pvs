<template>
  <v-app id="bg">
    <router-view />
  </v-app>
</template>

<script>
export default {
  name: "App",
  methods: {
    changeRTL() {
      this.$vuetify.rtl = 0.0;
    },
  },
};0
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
  font-size: 15px;
  text-decoration: none;
  color: black;
}
.smallnavbar{
 background: rgb(0,9,13);
background: -moz-linear-gradient(0deg, rgba(0,9,13,1) 5%, rgba(173,212,230,0.9976365546218487) 6%, rgba(206,240,241,1) 28%, rgba(241,249,248,1) 82%);
background: -webkit-linear-gradient(0deg, rgba(0,9,13,1) 5%, rgba(173,212,230,0.9976365546218487) 6%, rgba(206,240,241,1) 28%, rgba(241,249,248,1) 82%);
background: linear-gradient(0deg, rgba(0,9,13,1) 5%, rgba(173,212,230,0.9976365546218487) 6%, rgba(206,240,241,1) 28%, rgba(241,249,248,1) 82%);
filter: progid:DXImageTransform.Microsoft.gradient(startColorstr="#00090d",endColorstr="#f1f9f8",GradientType=1);}
</style>
