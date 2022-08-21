<template>
  <div>
    <v-card elevation="2"
     outlined  class="mx-auto my-auto"
     >
     <v-alert dense type="error" v-model="msgErr" @click="msgErr = false"
      > تأكد من شبكة الأنترنيت 
      </v-alert>
     <v-toolbar lighten class="nvbar mb-3" flat height="34px">
       <v-toolbar-title  class=" lightengrey--text text-h6">
         تاريخ تسجيل المحضر
         </v-toolbar-title>
         </v-toolbar>
        <v-form class="px-5">
          <v-row  
          class="mt-5" dense
           align-content-center 
           no-gutters 
           justify-md="start">
       <v-col
      cols="12"
      sm="4" class="mx-4"
    >
      <v-menu
        ref="menu1"
        v-model="menu1"
        :close-on-content-click="false"
        :nudge-right="40"
        transition="scale-transition"
        offset-y
        min-width="auto"
      >
        <template v-slot:activator="{ on, attrs }">
          <v-text-field
            v-model="cher.de"
            prepend-icon="mdi-calendar"
            readonly dense
            label="من"
            v-bind="attrs"
            v-on="on"
            outlined 
          ></v-text-field>
        </template>
        <v-date-picker
          v-model="cher.de"
          no-title
          scrollable
          @input="menu1 = false"
        >
        </v-date-picker>
      </v-menu>
    </v-col>

     <v-col
      cols="12"
      sm="4" class="mx-4"
    >
      <v-menu
        ref="menu2"
        v-model="menu2"
        :close-on-content-click="false"
        :nudge-right="40"
        transition="scale-transition"
        offset-y
        min-width="auto"
      >
        <template v-slot:activator="{ on, attrs }">
          <v-text-field
            v-model="cher.a"
            prepend-icon="mdi-calendar"
            readonly
            label="إلى"
            v-bind="attrs"
            v-on="on"
            outlined dense
          ></v-text-field>
        </template>
        <v-date-picker
          v-model="cher.a"
          no-title
          scrollable
           @input="menu2 = false"
        >
        </v-date-picker>
      </v-menu>
    </v-col>
    </v-row>
          <v-row no-gutters class="ma-0 pa-0">
            <v-col cols="12" sm="4" ></v-col>

         <v-card-actions class="ma-0 pa-0">
              <v-btn
                text
               @click="cherArchplaint"
              lighten
              class="mb-2 blue pr-3 pl-4"
              elevation="2"
              height="30px"
              :loading="load"
               
            >
            <v-icon right >mdi-magnify</v-icon>             
               بحث
              </v-btn>
              </v-card-actions>
              </v-row>
    
    </v-form>
     </v-card>
<div v-show="affiche_tab">
  <v-data-table
    :headers="headers"
    :items="plaint" no-data-text="معلومات غير متاحة"
     class="elevation-1 mt-2 pa-2"
    hide-default-footer
     loading-text="إنتظر قليلا"
    >
    <template v-slot:top>
        <div class="blue lighten-5 pa-2">أرشيف الشكايات</div>
    </template>
    <template v-slot:[`item.lien`]="{item}">
      <v-chip
        color="blue lighten-4"
        lighten small
        fab
        @click="redirect(item.plaint.hasfichier.lien)"
      >  تصفح
       <v-icon
        small
        class="mr-2"
      >
        mdi-download
      </v-icon>
      </v-chip>
    </template>
    </v-data-table>
    <div class="text-center py-2">
      <v-pagination
            v-model="pagination.current"
            :length="pagination.total"
            :total-visible="11"
            @input="onPageChange"
            circle
        ></v-pagination>
     </div>
</div>
    
    

  </div>
</template>
<script>
import baseURL from '@/api/baseURL';
import axios from 'axios';
export default {
  data() {
    return {
      load: false,
      msgErr:false,
      affiche_tab:false,
      headers: [
          { text: 'مرجع الشكاية', value: 'plaint.referencePlaints', sortable: false },
          { text: 'تاريخ تسجيل ', value: 'plaint.dateEnregPlaints' },
          { text: 'موضوع الشكاية', value: 'plaint.sujetPlaints' , sortable: false},
          { text: 'القرار', value: 'descision' , sortable: false},
          { text: 'المرفق', value: 'lien', sortable: false }
        ],
    plaint:[],
    // cherche by date
    display: false,
        cher:{
          de:(new Date(Date.now() - (new Date()).getTimezoneOffset() * 60000)).toISOString().substr(0, 10),
          a:(new Date(Date.now() - (new Date()).getTimezoneOffset() * 60000)).toISOString().substr(0, 10),
        },
         menu1:false,
        menu2:false,
         pagination: {
                current: 1,
                total: 0
          }
    }
  },

  methods: {
    cherArchplaint(){
        this.load = true;
        axios.post(baseURL.api+"/users/hasplaints/getArchiveplaint?page=" + this.pagination.current,{
          cherArch:this.cher
        },{headers: {   Authorization: `Bearer ${baseURL.token}`}
        }).then(rep=>{
          if(rep.status == 200 || rep.status==201)
          {     this.plaint = rep.data.data; 
                this.pagination.current = rep.data.current_page;
                this.pagination.total = rep.data.last_page;
            }
          
          this.affiche_tab = true;
          this.load = false;
        }).catch(err=>{
          console.log(err);
          this.msgErr = true;
           this.load = false;
        });
      },
      onPageChange(){
          this.cherArchplaint();
        },
    redirect(link) {
         var names = link.split('/')
          var fileLink = document.createElement('a');
                fileLink.href =  baseURL.backendPDF+"/dossiers_plaintes/"+names[2];
                fileLink.target = "_blank"; 
                fileLink.click();
      },
  },
};
</script>
