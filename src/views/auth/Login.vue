<template>
  <div>
    <v-row class="mb-10">
      <v-col cols="12" sm="12" class="my-8"></v-col>
    </v-row>
    <v-card
      class="overflow-hidden mx-auto mt-15"
      max-width="35%"
      elevation="2"
      outlined
    >
    <v-card-title class=" cssgrad pb-0" >
         <v-flex class="text-center">
                  <v-img class="mx-auto"
                  max-height="37px"
                  src="../../assets/emblem.png"
                  max-width="38px">
                 </v-img>
        </v-flex>
    </v-card-title>
    <v-toolbar flat dark
       class="d-flex text-h6 justify-center cssgrad" 
      >
      النظام المحلي لتدبير المحاضر
        
       </v-toolbar>

      <v-alert type="error" dense v-model="msgErr" @click="msgErr = false"
        >تأكد من صحة المعلومات</v-alert
      >
      <v-card-text>
        <v-form ref="loginForm">
          <v-text-field
            label="إسم المستخدم"
            name="email"
            dense outlined
            prepend-inner-icon="mdi-email"
            v-model="user.email" 
          />
          <v-text-field
            id="password"
            label="كلمة السر"
            name="password"
            outlined dense
            type="password"
            prepend-inner-icon="mdi-lock"
            v-model="user.password"
          />
        </v-form>
      </v-card-text>
      <v-card-actions>
        <v-spacer />
        <v-btn  @click="loginUser"  dark class="blue lighten-2" :loading="load">
          تسجيل الدخول</v-btn>
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
  background: rgb(255,255,255);
  background: linear-gradient(90deg, rgba(255,255,255,1) 0%, rgba(0,169,255,1) 0%, rgba(0,165,249,1) 1%, rgba(95,192,242,1) 17%, rgba(47,167,227,1) 100%);
}
</style>
