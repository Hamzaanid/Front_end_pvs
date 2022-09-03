<template>
  <div>
    <v-card
      class="overflow-hidden mx-auto mt-15"
      color="grey lighten-5"
      max-width="40%"
      elevation="2"
      outlined
    >
      <v-toolbar flat color="cssgrad" class="py-200">
        <v-icon right>mdi-account</v-icon>
        <v-toolbar-title>تسجيل الدخول </v-toolbar-title>
      </v-toolbar>
      <v-alert type="error" dense v-model="msgErr" @click="msgErr = false"
        >تأكد من صحة المعلومات</v-alert
      >
      <v-card-text>
        <v-form ref="loginForm">
          <v-text-field
            label="إسم المرور"
            name="email"
            dense
            prepend-inner-icon="mdi-email"
            v-model="user.email" 
          />
          <v-text-field
            id="password"
            label="كلمة السر"
            name="password"
            type="password"
            prepend-inner-icon="mdi-lock"
            v-model="user.password"
          />
        </v-form>
      </v-card-text>
      <v-card-actions>
        <v-spacer />
        <v-btn @click="loginUser" color="primary" :loading="load">دخول</v-btn>
      </v-card-actions>
    </v-card>
  </div>
</template>

<script>
import { mapActions } from "vuex";
export default {
  name: "Login",
  data() {
    return {
      msgErr: false,
      load: false,
      user: {
        email: "",
        password: "",
      },
    };
  },
  watch:{
    msgErr(val){
      !val || setTimeout(()=>{ this.msgErr=false },3000)
    },
  },
  methods: {
    ...mapActions({
      login: "user/loginUser",
    }),
   async loginUser() {
    this.load = true;
      if (this.$refs.loginForm.validate()) {
       await this.login(this.user)
          .then(() => {
            this.load = false;
            this.$router.push("/");
          })
          .catch((er) => {
            this.msgErr = true;
            this.load = false;
          });
      }
    },
  },
};
</script>

<style>
.cssgrad {
 background: rgb(9,47,45);
background: -moz-linear-gradient(0deg, rgba(9,47,45,1) 3%, rgba(189,216,236,1) 3%, rgba(156,207,242,1) 32%);
background: -webkit-linear-gradient(0deg, rgba(9,47,45,1) 3%, rgba(189,216,236,1) 3%, rgba(156,207,242,1) 32%);
background: linear-gradient(0deg, rgba(9,47,45,1) 3%, rgba(189,216,236,1) 3%, rgba(156,207,242,1) 32%);
filter: progid:DXImageTransform.Microsoft.gradient(startColorstr="#092f2d",endColorstr="#9ccff2",GradientType=1);}
</style>
