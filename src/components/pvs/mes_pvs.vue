<template>
    <div>
        المحاضر
        <v-data-table
    :headers="headers"
    :items="pvs"
    :loading="load_tab"
    hide-default-footer
    loading-text="إنتظر قليلا"
    no-data-text="لاتوجد محاضر"
  >
  <template v-slot:top>
    <v-btn color="blue lighten-4 ma-1" x-small @click="get_mes_pvs()">refresh</v-btn>
  <v-dialog v-model="dialog" max-width="500px">
          <v-card :loading="load_vcard">
              <v-container>
                <v-form ref="form" v-model="valideform" class="pa-1">
                <v-row no-gutters justify-md="start">
                  <v-text-field
                      dense
                      :rules="nameRules"
                      v-model="userhaspvs.descision"
                      label="القرار"
                    ></v-text-field>
                    <v-spacer></v-spacer>
                    <v-checkbox
                      dense
                      v-model="checkbox"
                      label="تأكيد إحالة التحقيق"
                    ></v-checkbox>
                </v-row>
                </v-form>
                    
              </v-container>

              <v-card-actions class="pt-0 mt-0">
              <v-spacer></v-spacer>
              <v-btn color="blue darken-1" text @click="closedialog">
                رجوع
              </v-btn>
              <v-btn color="blue darken-1" text :disabled="!valideform || load_vcard" @click="valider_Fait_descision" >
                تأكيد
              </v-btn>

            </v-card-actions>
          </v-card>
        </v-dialog>
  </template>
  <template v-slot:[`item.lien`]="{item}">
      <v-chip
      small
      @click="redirect(item.lien)"
      color="blue lighten-5"
      > تصفح
      <v-icon small>mdi-download</v-icon></v-chip>
    </template>

    <template v-slot:[`item.actions`]="{item}">
        <v-chip 
      small 
      @click="edit_item(item)"
      :disabled="item.traitID == 1 ? false : true">
      القرار
      <v-icon small>mdi-pencil</v-icon>
      </v-chip>
    </template>

  </v-data-table>
    </div>
</template>

<script>
import axios from 'axios';
import baseURL from '@/api/baseURL';

export default{
    data(){
        return {
            headers: [
        {text: 'رقم المحضر', value: 'Numpvs',align: 'start', sortable: false},
        { text: 'تاريخ التسجيل', value: 'dateEnregPvs', sortable: true },
        { text: 'تاريخ الاحالة', value: 'dateMission', sortable: true },
        { text: 'المرفق', value: 'lien',sortable: false },
        { text: 'القرار', value: 'descision', sortable: false },
        { text: 'كتابة القرار', value: 'actions', sortable: false},
        
      ],
            pvs:[],       // pours les donnees de tableau
            dialog:false, // affichage de dialog
            load_tab:false, // load tableau vide des pvs
            userhaspvs:{     // edited item ogenerer new pdf au backend
                descision:'',
                traitID:2,
                lien:'',
                idpvs:null,
            },
            valideform:true,
            nameRules: [(v) => !!v || "حقل إجباري"],
            load_url:false, // ici loader application
            load_vcard:false, // lorsque on veut ajouter la descision
            checkbox:false,

        }
    },
    watch:{
      dialog(val){
        val || this.closedialog()
      }
    },

    methods:{
        // fermer le dialog
         closedialog(){
            this.dialog = false ;
            this.userhaspvs.lien ='';
          this.userhaspvs.idpvs = -1;
          this.userhaspvs.descision = '';
          this.checkbox = false;

        },

        // navigate to document
        redirect(link) { 
          var names = link.split('/')
          var fileLink = document.createElement('a');
                fileLink.href =  baseURL.backendPDF+"/dossiers_pvs/"+names[2] ;
                fileLink.target = "_blank"; 
                fileLink.click();
              
      },
        // changer la descision dans la table userhaspvs(descision)
        edit_item(item){
          this.dialog= true;
          this.userhaspvs.lien = item.lien;
          this.userhaspvs.idpvs = item.id;
        },
        valider_Fait_descision(){
          this.load_vcard = true;
          if(this.checkbox){
            this.userhaspvs.traitID = 4;
          }
         axios
            .post(baseURL.api + "/users/haspvs/signer_pvs/"+this.userhaspvs.idpvs,{
              userhaspvs:this.userhaspvs
            },{
              headers: { Authorization: `Bearer ${baseURL.token}` },
            })
            .then(async(rep) => {
              if(rep.status == 200){
                await this.get_mes_pvs();
                this.closedialog();
                this.load_vcard = false;
              }else{
                this.load_vcard = false;
              }
            }).catch(erreur=>{
              this.load_vcard = false;
            });
        },

        get_mes_pvs(){
          this.load_tab = true;
        axios
      .get(baseURL.api + "/users/haspvs/mespvs", {
        headers: { Authorization: `Bearer ${baseURL.token}` },
      })
      .then((rep) => {
        this.pvs = rep.data;
        this.load_tab=false;
      }).catch(erreur=>{
        this.load_tab = false;
      });
        }
       
    },

    created(){ 
      this.get_mes_pvs();// les pvs de ce utilisateur
    }
}
</script>