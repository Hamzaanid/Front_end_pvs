<template>
<div class="ajout">

     <v-card elevation="2" 
      outlined  class="mx-auto my-auto justify-center"
     >
     <v-toolbar class="smallnavbar mb-3" flat height="34px" app>
      <v-toolbar-title  class=" darkgrey--text text-h5">معطيات الشكاية</v-toolbar-title>
     </v-toolbar>
        <v-form 
        dense
         ref="form"
         v-model="valideform"
        class="ma-0 pa-0 px-2">
          
           <v-row no-gutters dense >
           <v-col cols="12" sm="4" class="ml-2">
            <v-select
            v-model="plaint.TypePlaintID"
            class="blue-lighten-6" 
            label="نوع الشكاية" 
            :items="typeplaint"
            :rules="nameRules"
             dense
            outlined
            required 
            >
            </v-select>
          </v-col>
          
          <v-col cols="12" sm="4" class="ml-2">
            <v-select
            label="مصدر الشكاية"
            v-model="plaint.SourcePlaintID"
            :items="sourceplaint"
            :rules="nameRules"
            dense 
            required 
            outlined
            >
            </v-select>
          </v-col>
          </v-row>

          <v-row  dense no-gutters>
           <v-col cols="12" sm="4" class="ml-2">
          <v-text-field 
            dense
            outlined
            required 
            label="مرجع الشكاية"
            v-model="plaint.referencePlaints"
            :rules="nameRules"
          ></v-text-field>
        </v-col>
        <v-col cols="12" sm="4" class="ml-2">
          <v-text-field dense 
            single-line
            outlined 
            label="مكان الوقائع"
            v-model="plaint.EmplaceFaits"
          ></v-text-field>
        </v-col>
  </v-row>
  <v-row no-gutters dense>
         <v-col
      cols="12"
      sm="4" class="ml-2"
    >

      <v-menu
        v-model="menu2"
        :close-on-content-click="false"
        transition="scale-transition"
        offset-y
        min-width="auto"
      >
        <template v-slot:activator="{ on, attrs }">
          <v-text-field
            label="تاريخ التسجيل"
            v-model="plaint.dateEnregPlaints"
            :rules="nameRules"
            append-icon="mdi-calendar"
            readonly
            v-bind="attrs"
            v-on="on"
            outlined
            dense
          ></v-text-field>
        </template>
        <v-date-picker
        v-model="plaint.dateEnregPlaints"
          @input="menu2 = false"
        ></v-date-picker>
      </v-menu>
      
    </v-col>
    <v-col cols="12" sm="7" class="ml-2">
    <v-textarea
    clearable dense
    label="موضوع الشكاية"
    v-model="plaint.sujetPlaints"
    :rules="nameRules"
    rows="1"
    outlined
    no-resize
    >
    </v-textarea>
    </v-col>
        </v-row>
        </v-form>

   </v-card>
   <v-card 
  outlined  class="mx-auto my-4"
  flat
     >
        <v-form>
  <v-spacer></v-spacer>

        <template><v-card flat  class="mt-9 mr-4">
          <v-form><v-row  dense justify align-content-center><v-col cols="12" sm="4">
 <v-file-input
    color="blue accent-4"
    counter class="mt-3"
    label="أضف المُرفق"
    multiple
    placeholder="أضف المُرفق"
    prepend-icon="mdi-file-plus"
    outlined dense
    :show-size="1000"
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
  </v-file-input></v-col><v-col cols="12" sm="4">
    </v-col>
      </v-row></v-form></v-card>
 </template>
  <v-row>
    <v-col cols="12" sm="4"></v-col>
   <v-card-actions class="mt-4">
              <v-btn
               text
              height="30px"
              class="my-2 blue"
              elevation="2"
              :disabled="!valideform"
              @click="validate"

            >
            <v-icon left >mdi-notebook-plus-outline</v-icon>             
               تسجيل الشكاية
              </v-btn>
              <v-btn
          text
          height="30px"
              class="my-2 red"
              elevation="2"
              @click="reset"
        >
          إلغاء
        </v-btn>
        <v-spacer></v-spacer>
              </v-card-actions></v-row>
          </v-form>
  </v-card>
</div>

</template>
 
 
<script>
export default {
   data () {
     const defaultForm = Object.freeze({
         contreInconnu:null,
        TypePlaintID:null,
        SourcePlaintID: null,
        referencePlaints:"",
        datePlaints:"",
        dateEnregPlaints:(new Date(Date.now() - (new Date()).getTimezoneOffset() * 60000)).toISOString().substr(0, 10),
        dateFaits:"",
        EmplaceFaits: "",
        sujetPlaints:""
      })
       return {
         plaint: Object.assign({}, defaultForm),
         typeplaint:["type1","type2"],
         sourceplaint:["src1","src2"],

         tab:null,
         valideform:true,
         
         menu: false, menu1: false,  menu2: false,
         nameRules: [ v => !!v || 'Name is required' ],
       }
  },
  methods: {
      validate () {
        this.$refs.form.validate()
      },
      reset () {
        this.$refs.form.reset()
      }
  },
  created(){
    console.log(this.$store.state.md_pvs.test);
  }
}
</script>