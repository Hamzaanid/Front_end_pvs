<template>
   <div>
     <v-card>
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
        <v-alert type="error" v-model="msgErr" @click="msgErr = false" dense>
        تأكد من شبكة الأنترنيت 
        </v-alert>
      </template>

      <template v-slot:[`item.lien`]="{ item }">
        <v-chip
          small
          @click="redirect(item.lien)"
        >
          تصفح 
          <v-icon small> mdi-download</v-icon>
        </v-chip>
      </template>
      <template v-slot:[`item.desc`]="{ item }">
        <v-chip
          small
          @click="redirectDesc(item.lienDescision)"
          :disabled="!item.traiter"
        >
         {{ descision(item.traiter) }}
          <v-icon small> mdi-download</v-icon>
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
          msgErr:false,
    }
  },
  watch:{
    msgErr(val){
             !val || setTimeout(()=>{ this.msgErr=false },2000)
          },
  },
  methods:{
     redirectDesc(link) {
         var names = link.split('/')
          var fileLink = document.createElement('a');
                fileLink.href =  baseURL.backendPDF+"/DescisionEnquetePDF/"+names[2];
                fileLink.target = "_blank"; 
                fileLink.click();
      },
    redirect(link) {
         var names = link.split('/')
          var fileLink = document.createElement('a');
                fileLink.href =  baseURL.backendPDF+"/dossiersEnquete/"+names[2];
                fileLink.target = "_blank"; 
                fileLink.click();
      },
    descision(traiter){
      if(traiter) return "تصفح القرار"
      else return "غير معالج"
    },
    chercher_dossier(){
      this.pvs_enquete = []; 
      this.loadcherchedossier = true;
      axios.post(baseURL.api+"/Enquete/EnqueteChambreCherche/الغرفة 2",{
        NumDossier: this.cherDossier
      }, { headers: { Authorization: `Bearer ${baseURL.token}` }
       }).then((rep) => {
          this.pvs_enquete = rep.data;
          this.loadcherchedossier = false
        })
        .catch((err) => {
          this.loadcherchedossier = false;
          this.msgErr = true;
        });
    },
    dossiersEnquetePaginate(){
      this.pvs_enquete = [];
      this.load_tab = true;
      axios.get(
          baseURL.api + "/Enquete/paginateChambre2?page="+this.pagination.current,
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