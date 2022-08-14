<template>
<div class="traiter_plaint">
     <v-card elevation="2"  outlined  class="mx-auto my-auto pt-2">
      <v-alert dense type="error" v-model="msgErr" @click="clearAlert()"
      > تأكد من صحة المعلومات أو شبكة الأنترنيت 
      </v-alert>
    <v-form class="px-5">
         <v-row  dense justify-md="start" class="ma-0" no-gutters>
            <div>تاريخ تسجيل المحضر </div>
       <v-col cols="12" sm="4" class="mx-2">
      <v-menu
        ref="menu1"
        v-model="menu1"
        :close-on-content-click="false"
        transition="scale-transition"
        offset-y
        min-width="auto"
      >
        <template v-slot:activator="{ on, attrs }">
          <v-text-field dense
            v-model="date_cher.de"
            class="mt-3 ml-3"
            prepend-icon="mdi-calendar"
            readonly
            label="من " 
            v-bind="attrs"
            v-on="on"
            outlined
          ></v-text-field>
        </template>
        <v-date-picker
          v-model="date_cher.de"
          @input="menu1 = false"
          no-title
          scrollable
        > 
        </v-date-picker>
      </v-menu>
    </v-col>

    <v-col cols="12" sm="4" class="mx-4">
      <v-menu
        ref="menu2"
        v-model="menu2"
        :close-on-content-click="false"
        transition="scale-transition"
        offset-y
        min-width="auto"
      >
        <template v-slot:activator="{ on, attrs }">
          <v-text-field dense
            v-model="date_cher.a"
            class="mt-3 ml-3"
            prepend-icon="mdi-calendar"
            readonly
            label=" إلى"
            v-bind="attrs"
            v-on="on"
            outlined
          ></v-text-field>
        </template>
        <v-date-picker
          v-model="date_cher.a"
          @input="menu2 = false"
          no-title
          scrollable
        >
        </v-date-picker>
      </v-menu>
    </v-col>
    </v-row>
    <v-row no-gutters class="ma-0 pa-0" justify-md="start">
      <v-col cols="12" sm="4"></v-col>
      <v-col cols="12" sm="4">
        <v-btn
                text
               @click="chercher_plaint"
              light
              class="my-2 blue font-weight-bold"
              elevation="2"
              :loading="load"
              height="30px"
            >
            <v-icon right >mdi-magnify</v-icon>             
               بحث
              </v-btn>
      </v-col>      
    </v-row>

    <v-card flat class="ma-2" v-show="active">
      <v-alert dense type="success" v-model="msgSuc" @click="clearAlert()"
      >  تمت الإحالة بنجاح  
      </v-alert>
    <form>
    <v-data-table
    v-model="selected"
    :headers="headers"
    :items="plaint"
    item-key="id" 
    no-data-text="معلومات غير متاحة"
    show-select hide-default-footer
    class="elevation-1 mb-10"
  >
  <template v-slot:[`item.lien`]="{ item }">
            <v-chip color="blue lighten-4" lighten small 
            @click="redirect(item.hasfichier.lien)"
            fab>
              تصفح
              <v-icon
                small
                class="mr-2"
              >
                mdi-download
              </v-icon>
            </v-chip>
          </template>
  </v-data-table>

  <v-row  dense justify-md="start" no-gutters><v-col cols="12" sm="3">
          <v-autocomplete
            v-model="userhasplaint.userID"
            :rules="[() => !!viceProc || 'المرجوا ملأ هذا الحقل']"
            :items="viceProc"
            item-text="nom"
            item-value="id"
            placeholder="مساعدة في البحث"
            no-data-text="لا يوجد"
            label="ممثل النيابة"
            
            required 
            outlined dense
          ></v-autocomplete></v-col>
          <v-col cols="12" sm="4" class="mr-6">
      <v-menu
        ref="menu3"
        v-model="menu3"
        :close-on-content-click="false"
        transition="scale-transition"
        offset-y
        min-width="auto"
      >
        <template v-slot:activator="{ on, attrs }">
          <v-text-field dense
            v-model="userhasplaint.dateMission"
            prepend-inner-icon="mdi-calendar"
            disabled
            readonly
            label="تاريخ الاحالة"
            v-bind="attrs"
            v-on="on"
            outlined
          ></v-text-field>
        </template>
        <v-date-picker
          v-model="userhasplaint.dateMission"
          no-title
          scrollable
          @input="menu3 = false"
        >
        </v-date-picker>
      </v-menu>
      </v-col>
      </v-row>

      <v-row no-gutters  class="ma-0 pa-0" justify-md="start">
       <v-col cols="13" sm="4"></v-col>
           <v-card-actions  class="ma-0 pa-0">
              <v-btn
                text
               @click="affecter_plaints"
              light
              class="my-2 green lighten-1"
              elevation="2"
              :loading="load2"
              height="30px"
            >
            <v-icon right >mdi-note-check-outline</v-icon>             
              إضافة
              </v-btn>
              
              </v-card-actions>
      </v-row>
  </form> </v-card>
    </v-form>
     </v-card>

</div>
</template>

<script>
import axios from 'axios'
import baseURL from '@/api/baseURL'
export default {
    data(){
        return {
          load:false,
          load2:false,
          viceProc: [],
          selected: [],
         active:false,

          userhasplaint:{
          userID:[],
          plaintID:null,
          traitID:1,
          descision:"jjjj",
          dateMission:(new Date(Date.now() - (new Date()).getTimezoneOffset() * 60000))
                    .toISOString().substr(0, 10)
        },
        
        date_cher:{
          de:(new Date(Date.now() - (new Date()).getTimezoneOffset() * 60000))
                   .toISOString().substr(0, 10),
          a:(new Date(Date.now() - (new Date()).getTimezoneOffset() * 60000))
                   .toISOString().substr(0, 10),
        }, 

        menu1: false, menu2: false, menu3:false, 
         
        headers: [
          {text: 'مرجع الشكاية',align: 'start',sortable: false,value: 'referencePlaints'},
          { text: 'نوع الشكاية', value: 'type_plaint.nom',sortable: false, },
          { text: 'تاريخ التسجيل', value: 'dateEnregPlaints', sortable: false,},
          { text: 'موضوع الشكاية', value: 'sujetPlaints' ,sortable: false,},
          { text: 'ملف الشكاية', value: 'lien', sortable: false,},
        ],
        plaint: [],//les plaintes de recherche
         // gestion des message d'erreur
      msgErr:false,
      msgSuc:false,
       
       }
    },
      
       methods:{
         clearAlert(){
      this.msgErr = this.msgSuc = false;
    },

         redirect(link) {
      var names = link.split("/");
      var fileLink = document.createElement("a");
      fileLink.href = baseURL.backendPDF + "/dossiers_plaintes/" + names[2];
      fileLink.target = "_blank";
      fileLink.click();
    },


         async chercher_plaint(){
          this.load = true;
            axios.post(baseURL.api +'/plaint/Bydate',{
               dateEnrg:this.date_cher
            },{
              headers:  
               {Authorization: `Bearer ${baseURL.token}`}
          }).then(response => {
                  this.plaint = response.data;
                  this.load=false; this.active=true;
                }).catch(err=>{
                  this.load=false; this.active=true;
                  this.msgErr = true;// message d'erreur
                });  
                
        },

        async affecter_plaints(){
          this.load2=true;
          let IDs=[];
         for(let i=0;i<this.selected.length;i++){
           IDs.push(this.selected[i].id);
          }   
        this.userhasplaint.plaintID=IDs;
           await axios.post(baseURL.api +'/users/hasplaints/store',{
              userhasplaint:this.userhasplaint
            },{ headers:{Authorization: `Bearer ${baseURL.token}`}
           }).then(async response => {
                  this.selected = [];
                  await this.chercher_plaint();
                  window.scroll(0, 0);
                  this.msgSuc =true; // message d'succ
                  this.load2=false;
                  return response;
                }).catch(err=>{
                  this.load2=false;
                  this.msgErr = true;// message d'erreur
                })
        },
        
       },

       created(){
        axios
      .get(baseURL.api + "/users/viceProc", {
        headers: { Authorization: `Bearer ${baseURL.token}` },
      })
      .then((rep) => {
        this.viceProc = rep.data;
      });
       }
       
    }
</script>
