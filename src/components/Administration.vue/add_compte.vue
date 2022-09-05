<template>
 <div>
     <v-card>
        <v-toolbar class="smallnavbar mb-3" flat height="34px">
        <v-toolbar-title class="darkgrey--text text-h5">
           إنشاء حساب جديد </v-toolbar-title
        >
      </v-toolbar>
       <v-alert dense type="success" v-model="msgSuc" @click="clearAlert()"
          >  تم إنشاء الحساب بنجاح 
          </v-alert>
          <v-alert dense type="error" v-model="msgErr" @click="clearAlert()"
          > تأكد من صحة المعلومات أو شبكة الأنترنيت 
          </v-alert>
         <v-form
            ref="valid"
          v-model="valid"
        >
     <v-col cols="12" sm="4">
 
  <v-row no-gutters>
     <v-text-field
      v-model="user.nom"
      :rules="nameRules"
      label="الإسم الكامل "
      dense outlined
      required
    ></v-text-field>
  </v-row>
   
   <v-row no-gutters>
    <v-text-field
      v-model="user.email"
      label="البريد الإلكتروني"
      dense 
      outlined
    ></v-text-field>
   </v-row>
    <v-row no-gutters>
     <v-text-field
          v-model="user.numUser"
          :rules="numberRules"
          label=" رقم الهاتف"
          dense outlined
          required
        ></v-text-field>
    </v-row>
        
        <v-row no-gutters>
          <v-select
      v-model="user.idRole"
      :items="items"
      :rule="[(v) => !!v || '']"
      item-text="nom"
      item-value="id"
      dense outlined
      label="دوره"
      required
    ></v-select>
        </v-row>
    
 
    <v-row no-gutters>
        <v-col cols="12" sm="5" class="ml-6">
          <v-text-field
          type="password"
          v-model="user.password"
          label="كلمة السر"
          dense outlined
          :rules="Rulepass"
          required
        ></v-text-field>
        </v-col>
        <v-col cols="12" sm="6">
        <v-text-field
        ref="password"
        dense outlined
          v-model="password"
          type="password"
          label="تأكيد كلمة السر "
          :rules="[
              () => !!password || 'ضروري',
              () => password == this.user.password || 'غير صحيح',
              
            ]"
          required
        ></v-text-field>
        </v-col>
    </v-row>
    </v-col>
    <v-row no-gutters>
      <v-col cols="12" sm="2">
        <v-checkbox
      v-model="user.active"
      label="نشط"
      :value="!user.active"
    ></v-checkbox></v-col>
    <v-col cols="12" sm="5">
      <v-file-input
                  v-model="file"
                  accept="image/png,image/jpeg"
                  color="blue accent-4"
                  counter
                  class="mt-3"
                  label="أضف التوقيع"
                  placeholder="أضف التوقيع"
                  append-icon="mdi-file-plus"
                  outlined
                  dense
                  full-width
                >
                  <template v-slot:selection="{ index, text }">
                    <v-chip
                      v-if="index < 2"
                      color="blue accent-4"
                      light
                      label
                      small
                    >
                      {{ text }}
                    </v-chip>

                    <span
                      v-else-if="index === 2"
                      class="text-overline grey--text text--lighten-3 mx-2"
                    >
                      +{{ files.length - 2 }} File(s)
                    </span>
                  </template>
                </v-file-input>
    </v-col>
    </v-row>
    
    
    <v-row no-gutters>
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

    <v-btn
      color="red"
      height="27px"
      class="mr-4 pa-0"
      @click="reset"
    >
       إلغاء
    </v-btn>
    </v-row>

  </v-form>

  
   </v-card>
  </div>
</template>
<script>
import axios from 'axios';
import baseURL from '@/api/baseURL';
  export default {
    data: () => ({
      valid: true,
      loadValid:false,
      user:{
          nom:'',
          email:'',
          password:'',
          active:true,
          numUser:'',
          idRole:null
      },
      file:null,

      password:'',
      name: '',
      nameRules: [
        v => !!v || '',
        v => (v && v.length <= 20) || '',
      ],
      email: '',
      emailRules: [
        v => !!v || ' ',
         v =>  /.+@.+\..+/.test(v) || '',
      ],
      numberRules: [
        v => !!v || '' ,
        v => /[0-9][0-9][0-9]/.test(v) || '',
      ],
      Rulepass: [
        v => !!v || ' ',
         v =>  (v && v.length >= 6) || 'ضعيف',
      ],
      items: [],
      // gestion des message d'erreur
      msgErr:false,
      msgSuc:false,
    }),
    watch:{
      msgErr(val){
      !val || setTimeout(()=>{ this.msgSuc=false; this.msgErr=false; },2000)
    },
     msgSuc(val){
      !val || setTimeout(()=>{ this.msgSuc=false; this.msgErr=false; },2000)
    }
    },
    methods: {
      clearAlert(){
      this.msgErr = this.msgSuc = false;
    },
      async validate() {
        this.loadValid = true
        this.$refs.valid.validate();
      let formData = new FormData();
      formData.append("img", this.file);
      const json = JSON.stringify(this.user);
      formData.append("users",json);
      await axios
        .post(baseURL.api+'/users/store', formData, {
          headers: {
            Authorization: `Bearer ${baseURL.token}`,
            "Content-Type": "multipart/form-data",
          },
        })
        .then((rep) => {
          if (rep.status == 200 || rep.status == 201) {
            this.reset();
            this.file = null;
            this.loadValid=false;
            this.msgSuc = true;
          }
          
        }).catch(err=>{
          this.loadValid=false;
          this.msgErr = true;
        });
    },

      reset () {
        this.$refs.valid.reset()
      },
      
    },
    created(){
        axios.get(baseURL.api+'/users/role/index',{
            headers:{Authorization:`Bearer ${baseURL.token}`}
        }).then(res => {
            this.items = res.data;
        })
    }
  }
</script>