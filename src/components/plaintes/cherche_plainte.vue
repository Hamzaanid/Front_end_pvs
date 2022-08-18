<template>
<div class="chercher_plaint">
     <v-card elevation="2" outlined  class="mx-auto my-auto" >
     <v-toolbar  class="smallnavbar mb-3" flat height="34px">
       <v-toolbar-title  class="darkgrey--text text-h5">بحث عن شكاية
       </v-toolbar-title>
       </v-toolbar>
       <div>
          <v-alert dense type="success" v-model="msgSuc" @click="clearAlert()"
          > تم تغيير الشكاية  بنجاح  
          </v-alert>
          <v-alert dense type="error" v-model="msgErr" @click="clearAlert()"
          > تأكد من صحة المعلومات أو شبكة الأنترنيت 
          </v-alert>
      </div>
    <v-form class="px-5">
          <v-row  dense justify-md="center" no-gutters>
     <v-col cols="12" sm="4">
          <v-text-field 
          v-model="cherchant"
            label="مرجع الشكاية"
            class="mt-2 ml-4 pa-0"
            outlined dense 
          ></v-text-field>
        </v-col>
        <v-col>
           <v-card-actions>
              <v-btn
                text
               @click="chercher_plaint"
              class="mt-1 blue"
              elevation="2"
               :loading="load"
               height="30px"
            >
            <v-icon right >mdi-magnify</v-icon>         
               بحث
              </v-btn>
              
              </v-card-actions>
        </v-col>
        
    </v-row>

    </v-form>
         </v-card> 

         <v-card class="mt-5">
  <div>
    <v-data-table
    :headers="headers"
    :items="plaint" no-data-text="معلومات غير متاحة"
     class="elevation-1 "
    hide-default-footer
    :loading="table_vide"
     loading-text="إنتظر قليلا"
    >
    <template v-slot:[`item.lien`]="{item}">
      <v-chip
        color="blue lighten-4"
        lighten small
        fab
        @click="redirect(item.plaint.hasfichier.lien)"
      >  {{ getstatus(item.traitID) }}
       <v-icon
        small
        class="mr-2"
      >
        mdi-download
      </v-icon>
      </v-chip>
    </template>
    <template v-slot:[`item.action`]="{ item }">
      <v-btn
      :disabled="item.traitID == 3 ? true : false"
        small
        color="blue lighten-5"
        @click="editItem(item)"
      ><v-icon left>
       mdi-pencil
      </v-icon>
        معاينة
      </v-btn>
    </template>
    </v-data-table>
  </div>
         <div class="text-center"> </div>
     </v-card>

     <v-card v-show="showupdate" elevation="2" outlined class="mx-auto my-auto mt-4 justify-center">
          <div class="pa-2 blue lighten-5 mb-5">معاينة الشكاية</div>

      <v-form dense ref="form" v-model="valideform" class="ma-0 pa-0 px-2">
        <v-row no-gutters justify-md="start" dense>
          <v-col cols="12" sm="4" class="ml-2">
            <v-select
              v-model="plainte.TypePlaintID"
              class="blue-lighten-6"
              label="نوع الشكاية"
              :items="typePlaints"
              item-text="nom"
              item-value="id"
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
              v-model="plainte.SourcePlaintID"
              :items="sourceplaints"
              item-text="nom"
              item-value="id"
              :rules="nameRules"
              dense required outlined
            >
            </v-select>
          </v-col>
        </v-row>

        <v-row dense no-gutters justify-md="start">
          <v-col cols="12" sm="4" class="ml-2">
            <v-text-field
              dense
              outlined
              required
              label="مرجع الشكاية"
              v-model="plainte.referencePlaints"
              :rules="nameRules"
              disabled
            ></v-text-field>
          </v-col>
          <v-col cols="12" sm="4" class="ml-2">
            <v-text-field
              dense
              outlined
              label="مكان الوقائع"
              v-model="plainte.EmplaceFaits"
            ></v-text-field>
          </v-col>
        </v-row>

        <v-row no-gutters dense justify-md="start">
          <v-col cols="12" sm="4" class="ml-2">
            <v-menu
              v-model="menu"
              :close-on-content-click="false"
              transition="scale-transition"
              offset-y
              min-width="auto"
            >
              <template v-slot:activator="{ on, attrs }">
                <v-text-field
                  label="تاريخ التسجيل"
                  v-model="plainte.dateEnregPlaints"
                  :rules="nameRules"
                  disabled
                  append-icon="mdi-calendar"
                  readonly
                  v-bind="attrs"
                  v-on="on" outlined  dense
                ></v-text-field>
              </template>
              <v-date-picker
                v-model="plainte.dateEnregPlaints"
                @input="menu = false"
              ></v-date-picker>
            </v-menu>
          </v-col>
          <v-col cols="12" sm="7" class="ml-2">
            <v-textarea
              clearable
              dense
              label="موضوع الشكاية"
              v-model="plainte.sujetPlaints"
              :rules="nameRules"
              rows="1"
              outlined
              no-resize
            >
            </v-textarea>
          </v-col>
        </v-row>

        <v-row no-gutters dense justify-md="start">
          <v-col cols="12" sm="4"></v-col>
          <v-card-actions class="ma-0">
            <v-btn
              text
              height="30px"
              class="my-2 blue"
              elevation="2"
              :disabled="!valideform"
              :loading="load"
              @click="ModifiePlaint"
            >
              <v-icon left>mdi-notebook-plus-outline</v-icon>
              تغيير الشكاية
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
            
            <v-spacer></v-spacer> </v-card-actions
        ></v-row>
      </v-form>
    </v-card>
  
</div>
</template>

<script>
import baseURL from '@/api/baseURL'
import axios from 'axios'
export default {
    data(){
        return {
          load:false,
          table_vide:false,
        headers: [
          { text: 'مرجع الشكاية', value: 'plaint.referencePlaints' },
          { text: 'تاريخ تسجيل ', value: 'plaint.dateEnregPlaints' },
          { text: 'موضوع الشكاية', value: 'plaint.sujetPlaints' },
          { text: "القرار  ", value: "descision" },
          { text: 'المرفق', value: 'lien', sortable: false },
          { text: 'تغيير ', value: 'action', sortable: false },
        ],
        plaint: [],
        plainte:{
      contreInconnu: null,
      TypePlaintID: 0,
      SourcePlaintID: 0,
      referencePlaints: "",
      datePlaints: "",
      dateEnregPlaints: "",
      dateFaits: "",
      EmplaceFaits: "",
      sujetPlaints: "",
        },

        cherchant:"",
      showupdate:false,
      idpl:null,
      nameRules: [(v) => !!v || "حقل ضروري"],
      typePlaints:[],
      sourceplaints:[],
      menu:false,
      valideform: true,
      // gestion des message d'erreur
      msgErr:false,
      msgSuc:false,
        }
    },
    methods:{
    redirect(link) {
         var names = link.split('/')
          var fileLink = document.createElement('a');
                fileLink.href =  baseURL.backendPDF+"/dossiers_plaintes/"+names[2];
                fileLink.target = "_blank"; 
                fileLink.click();

      },
    getstatus(traitID){
        if(traitID == 3)
        return 'معالج'
        else 
        return ' غير مدروس'
      },
      clearAlert(){
      this.msgErr = this.msgSuc = false;
    },

    reset() {
      this.showupdate = false
      //this.$refs.form.reset();
    },

      chercher_plaint(){
        this.load = true;
        axios.post(baseURL.api+"/plaint/Byreference",{
          reference:this.cherchant
        },{headers: {   Authorization: `Bearer ${baseURL.token}`}
        }).then(rep=>{
          if(rep.status == 200 || rep.status==201)
             this.plaint = rep.data;
          this.load = false;
        }).catch(err=>{
          this.msgErr = true;
           this.load = false;
        });
      },
      editItem(item){
        this.plainte = item.plaint;
        this.idpl = item.plaint.id;
        this.showupdate = true;
      },

      async ModifiePlaint(){ 
           this.load = true;
        await axios.put( `${baseURL.api}/plaint/update/${this.idpl}`,
                 { plaint : this.plainte }, 
                 {headers: {   Authorization: `Bearer ${baseURL.token}`}
                    }).then( rep=>{
                      if(rep.status == 200 || rep.status == 201)
                      { this.reset();
                       this.chercher_plaint();
                        this.load = false;
                       }else{
                        this.msgErr=true;
                       }
                     
                    }).catch(err=>{
                      this.msgErr=true;
                    });
      },
    },

    created() {
    axios
      .get(baseURL.api + "/plaint/type/index", {
        headers: { Authorization: `Bearer ${baseURL.token}` },
      })
      .then((rep) => {
        this.typePlaints = rep.data;
      });

    axios
      .get(baseURL.api + "/plaint/source/index", {
        headers: { Authorization: `Bearer ${baseURL.token}` },
      })
      .then((rep) => {
        this.sourceplaints = rep.data;
      });
  },
}

</script>
