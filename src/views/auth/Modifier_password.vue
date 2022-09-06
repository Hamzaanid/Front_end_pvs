<template>
  <div>
    <v-card>
      <div class="smallnavbar pa-3">تغيير كلمة السر</div>
      <v-form ref="valid" v-model="valid">
        <v-alert dense type="success" v-model="msgSuc" @click="clearAlert()"
          >تم تغيير كلمة المرور بنجاح
          </v-alert>
          <v-alert dense type="error" v-model="msgErr" @click="clearAlert()"
          >لم يتم تغيير كلمة المرور
          </v-alert>
        <v-col cols="12" sm="4">
          <v-row no-gutters>
            <v-text-field
              type="password"
              v-model="user.lastPassword"
              label="كلمة السر الحالية"
              dense
              outlined
              required
            ></v-text-field>
          </v-row>

          <v-row no-gutters>
            <v-text-field
              type="password"
              :rules="Rulepass"
              v-model="user.newPassword"
              label="كلمة السر الجديدة"
              dense
              outlined
              required
            ></v-text-field>
          </v-row>
          <v-row no-gutters>
            <v-text-field
              type="password"
              v-model="passwordConfirm"
              :rules="[
                () => !!passwordConfirm || '',
                () => passwordConfirm == this.user.newPassword || 'غير صحيح',
              ]"
              label="تأكيد كلمة السر "
              dense
              outlined
              required
            ></v-text-field>
          </v-row>
        </v-col>
        <v-row dnese no-gutters class="pb-2">
          <v-btn
            :disabled="!valid"
            color="blue"
            class="mr-4 pa-0"
            :loading="loadValid"
            height="27px"
            @click="validate"
          >
            إنشاء
          </v-btn>

          <v-btn color="red" height="27px" class="mr-4 pa-0" @click="reset">
            إلغاء
          </v-btn>
        </v-row>
      </v-form>
    </v-card>
  </div>
</template>
<script>
import baseURL from '@/api/baseURL';
import axios from 'axios';
export default {
  data() {
    return {
      user: {
        lastPassword: "",
        newPassword: "",
      },
      passwordConfirm: "",
      valid:true,
      loadValid:false,
      Rulepass: [(v) => !!v || "", (v) => (v && v.length >= 6) || "ضعيف"],
      msgErr:false,
      msgSuc:false,
    };
  },
  watch:{
      msgErr(val){
      !val || setTimeout(()=>{ this.msgSuc=false; this.msgErr=false; },2000)
    },
     msgSuc(val){
      !val || setTimeout(()=>{ this.msgSuc=false; this.msgErr=false; },2000)
    }
    },

  methods: {
    reset() {
      this.$refs.valid.reset();
    },
    validate(){
        this.loadValid = true
        this.$refs.valid.validate();
       axios
        .put(baseURL.api+'/users/UpdatePassword', {
          userput:this.user,
          password:this.passwordConfirm
        }, {
          headers: {
            Authorization: `Bearer ${baseURL.token}`
          },
        })
        .then((rep) => {
          if (rep.status == 200 || rep.status == 201) {
            this.reset(); this.loadValid = false;
            this.msgSuc = true;
          }else{
            this.loadValid=false;
          this.msgErr = true;
          }
        }).catch(err=>{
          this.loadValid=false;
          this.msgErr = true;
        });
    }
  },
};
</script>
