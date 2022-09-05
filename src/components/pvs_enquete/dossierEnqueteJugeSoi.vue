<template>
    <div>
      <v-card :loading="loadFile" outlined>
        <v-dialog v-model="dialog" max-width="400px">
        <v-card>
         <v-form ref="form" v-model="validForm">
               <v-row no-gutters>
                 <v-col cols="12" sm="10">
                   <v-file-input
                   :rules="PdfRules"
               v-model="DescisionEnquete.file"
               label="تحميل القرار"
               placeholder="تحميل القرار"
               accept="application/pdf"
               required
             ></v-file-input>
                 </v-col>
               </v-row>
               <v-spacer></v-spacer>
               <v-btn small text 
               :disabled="!validForm || loadFile"
             @click="saveDescsion()" class="ma-1" color="blue">
             تأكيد
             </v-btn>
             <v-btn small text color="red"
             @click="closeDialog()">
             إلغاء
             </v-btn>
             </v-form>
        </v-card>
         </v-dialog>
       <v-data-table
       :headers="headers"
       :items="pvs_enquete"
       :loading="load_tab"
       hide-default-footer
       loading-text="إنتظر قليلا"
       no-data-text="لاتوجد محاضر"
     >
      <template v-slot:top>
         <v-row class="pt-3 pr-2" dense>
           <v-col cols="12" sm="4">
             <v-text-field
               v-model="cherDossier"
               label="رقم الملف"
               dense
             ></v-text-field>
           </v-col>
           <v-col cols="12" sm="4">
             <v-btn small
                 @click="chercher_dossier()"
                 class="mt-1 blue"
                 :loading="loadcherchedossier"
               >
                 <v-icon right>mdi-magnify</v-icon>
                 بحث
               </v-btn>
           </v-col>
         </v-row>
       </template>
 
       <template v-slot:[`item.lien`]="{ item }">
         <v-chip
           small
           @click="redirect(item.lien)"
           color="blue lighten-4"
         >
            تصفح  الملتمس  
           <v-icon small> mdi-download</v-icon>
         </v-chip>
       </template>
       <template v-slot:[`item.desc`]="{item}">
         <v-chip
           small
           @click="redirectDesc(item.lienDescision)"
           v-show="item.traiter"
           :color="item.traiter == 1 ? 'green' :'red' "
         > تصفح القرار  
         <v-icon small>mdi-download</v-icon>
         </v-chip>
         <v-chip small v-show="!item.traiter"
         :color="item.traiter == 1 ? 'green' :'red'"
         @click="openDialog(item)">
         تحميل القرار
         <v-icon small>mdi-cloud-upload</v-icon>
         </v-chip>
       </template>
       
     </v-data-table>
         <v-pagination
             v-model="pagination.current"
             :length="pagination.total"
             :total-visible="11"
             @input="onPageChange"
             class="ma-0 pa-0"
             circle
         ></v-pagination>
      </v-card>
    </div>
 </template>
 
 <script>
 import baseURL from '@/api/baseURL'
 import axios from 'axios'
 export default{
   data(){
     return{
       PdfRules: [
         v => !!v || '',
          v => !v || v.type == 'application/pdf' || '',
       ],
       validForm:true,
       headers: [
         { text: 'رقم ملف التحقيق', value: 'NumDossier',align: 'start', sortable: true },
         { text: 'رقم المحضر', value: 'pvs.Numpvs', sortable: true },
         { text: ' تاريخ التسجيل', value: 'dateEnreg', sortable: true },
         { text: 'ممثل النيابة', value: 'user.nom', sortable: true },
         { text: 'غرفة التحقيق', value: 'chambre_enquete',sortable: false },
         { text: ' قاضي التحقيق', value: 'juge_enquete.nom', sortable: false },
         { text: ' الملتمس', value: 'lien', sortable: false },
         { text: 'القرار', value: 'desc', sortable: false },
       ],
       pvs_enquete:[], 
       load_tab:false,
       loadcherchedossier:false,
       cherDossier:'',
       pagination: {
                 current: 1,
                 total: 0
           },
       dialog:false,
       loadFile:false,
       DescisionEnquete:{
         id:null,
         NumDossier:'',
         file:null,
       }
     }
   },
   watch:{
     dialog(val){
       val || this.closeDialog()
     }
   },
   methods:{
     saveDescsion () {
       this.loadFile = true;
       let formData = new FormData();
        formData.append("file",this.DescisionEnquete.file);
       formData.append("NumDossier", this.DescisionEnquete.NumDossier);
       axios.post(baseURL.api+"/Enquete/addDescisionEnquete/"+this.DescisionEnquete.id,
        formData, 
        { headers: { Authorization: `Bearer ${baseURL.token}` }
        }).then(async (rep) => {
          this.loadFile = false;
          this.cherDossier = this.DescisionEnquete.NumDossier;
          await this.chercher_dossier();
          this.dialog =false;
         })
         .catch((err) => {
           this.loadFile = false;
         });
       },
 
       openDialog (item) { 
         this.dialog = true;
         this.DescisionEnquete.id = item.id;
         this.DescisionEnquete.NumDossier = item.NumDossier;
        },
       closeDialog() {
         this.dialog = false;
         this.DescisionEnquete.file = null;
         this.DescisionEnquete.id = null;
         this.DescisionEnquete.NumDossier = '';
       },
     redirect(link) {
          var names = link.split('/')
           var fileLink = document.createElement('a');
                 fileLink.href =  baseURL.backendPDF+"/dossiersEnquete/"+names[2];
                 fileLink.target = "_blank"; 
                 fileLink.click();
       },
     redirectDesc(link) {
          var names = link.split('/')
           var fileLink = document.createElement('a');
                 fileLink.href =  baseURL.backendPDF+"/DescisionEnquetePDF/"+names[2];
                 fileLink.target = "_blank"; 
                 fileLink.click();
       },
     descision(traiter){
       if(traiter) return "تحميل"
       else return "غير معالج"
     },
     chercher_dossier(){
       this.pvs_enquete = [];
       this.loadcherchedossier = true;
       axios.post(baseURL.api+"/Enquete/dossiersJuge",{
         NumDossier: this.cherDossier
       }, { headers: { Authorization: `Bearer ${baseURL.token}` }
        }).then((rep) => {
           this.pvs_enquete = rep.data;
           this.loadcherchedossier = false
         })
         .catch((err) => {
           this.loadcherchedossier = false
         });
     },
     dossiersEnquetePaginate(){
       this.pvs_enquete = [];
       this.load_tab = true;
       axios.get(
           baseURL.api + "/Enquete/paginate_mes_fileJuge?page="+this.pagination.current,
           { headers: { Authorization: `Bearer ${baseURL.token}` }
        }).then((rep) => {
         this.load_tab = false;
           this.pvs_enquete = rep.data.data;
           this.pagination.current = rep.data.current_page;
                 this.pagination.total = rep.data.last_page;
         })
         .catch((err) => {
           this.load_tab = false;
           this.msgErr = true;
         });
     },
     onPageChange(){
           this.dossiersEnquetePaginate();
         },
 
   },
   created(){
     this.dossiersEnquetePaginate();
   }
 }
 </script>