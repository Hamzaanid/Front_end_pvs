<template>
  <div>
    <v-card class="pa-0 ma-0">
      <v-alert dense type="error" v-model="msgErr" @click="msgErr = false"
      > تأكد من شبكة الأنترنيت 
      </v-alert>
      <v-form class="px-5">
        <v-row dense justify-md="start" no-gutters>
          <v-col cols="12" sm="4">
            <v-text-field
              v-model="cherchantarchive"
              label="مرجع الشكاية"
              class="mt-2 ml-4 pa-0"
              outlined
              dense
            ></v-text-field>
          </v-col>
          <v-col>
            <v-card-actions>
              <v-btn
                text
                @click="cherArchplaint"
                class="mt-1 blue"
                elevation="2"
                :loading="load"
                height="30px"
              >
                <v-icon right>mdi-magnify</v-icon>
                بحث
              </v-btn>
            </v-card-actions>
          </v-col>
        </v-row>
      </v-form>
    </v-card>

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

  </div>
</template>
<script>
import baseURL from '@/api/baseURL';
import axios from 'axios';
export default {
  data() {
    return {
      cherchantarchive: "",
      load: false,
      msgErr:false,
      affiche_tab:false,
      headers: [
          { text: 'مرجع الشكاية', value: 'plaint.referencePlaints' },
          { text: 'تاريخ تسجيل ', value: 'plaint.dateEnregPlaints' },
          { text: 'موضوع الشكاية', value: 'plaint.sujetPlaints' },
          { text: 'الملف', value: 'lien', sortable: false }
        ],
    plaint:[],
    }
  },

  methods: {
    cherArchplaint(){
        this.load = true;
        axios.post(baseURL.api+"/users/hasplaints/getArchiveplaint",{
          referenece:this.cherchantarchive
        },{headers: {   Authorization: `Bearer ${baseURL.token}`}
        }).then(rep=>{
          if(rep.status == 200 || rep.status==201)
          this.plaint = rep.data; 
          
          this.affiche_tab = true;
          this.load = false;
        }).catch(err=>{
          this.msgErr = true;
           this.load = false;
        });
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
