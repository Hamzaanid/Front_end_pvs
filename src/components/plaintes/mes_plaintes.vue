<template>
    <div>
        الشكايات
        <v-alert type="error" v-model="msgErr" @click="msgErr = false" dense>
        تأكد من شبكة الأنترنيت 
        </v-alert>
        <v-alert type="success" v-model="msgSuc" @click="msgSuc = false" dense>
          تمت العملية بنجاح 
        </v-alert>
        <v-data-table
    :headers="headers"
    :items="plaintes"
    :loading="load_tab"
    loading-text="إنتظر قليلا"
    no-data-text="لاتوجد شكايات"
  >
  
  <template v-slot:top>
   <v-btn color="blue lighten-4 ma-1" x-small @click="get_mes_plaintes()">تحديث</v-btn>
  <v-dialog v-model="dialog" max-width="500px">
          <v-card :loading="load_vcard">
              <v-container>
                <v-form ref="form" v-model="valideform">
                    <v-text-field
                      :rules="nameRules"
                      v-model="userhasplaintes.descision"
                      label="القرار"
                    ></v-text-field>
                </v-form>
                    
              </v-container>

              <v-card-actions>
              <v-spacer></v-spacer>
              <v-btn color="blue darken-1" text @click="closedialog">
                رجوع
              </v-btn>
              <v-btn color="blue darken-1" text :disabled="!valideform || load_vcard" @click="valider_edite_descision" >
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
      @click="edit_item(item)">
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
        { text: 'مرجع الشكاية', align: 'start', sortable: false, value: 'referencePlaints'},
        { text: 'تاريخ التسجيل', value: 'dateEnregPlaints', sortable: true },
        { text: 'تاريخ الاحالة', value: 'dateMission', sortable: true },
        { text: 'المرفق', value: 'lien',sortable: false},
        { text: 'القرار', value: 'descision', sortable: false},
        { text: 'كتابة القرار', value: 'actions', sortable: false},
        
      ],
            plaintes:[],       // pours les donnees de tableau
            dialog:false, // affichage de dialog
            load_tab:false, // load tableau vide des plaintes
            userhasplaintes:{     // edited item ogenerer new pdf au backend
                descision:'',
                traitID:2,
                lien:'',
                idplainte:null,
            },
            valideform:true,
            nameRules: [(v) => !!v || "حقل ضروري"],
            load_url:false, // ici loader application
            load_vcard:false, // lorsque on veut ajouter la descision
            msgErr:false,
            msgSuc:false,

            // pour update decision
            updateDecision:0,

        }
    },
    watch:{
      dialog(val){
        val || this.closedialog()
      },
          msgErr(val){
             !val || setTimeout(()=>{ this.msgErr=false; this.msgSuc=false; },2000)
          },
        msgSuc(val){
            !val || setTimeout(()=>{ this.msgSuc=false; this.msgErr=false; },2000)
         }
       },

    methods:{
        // fermer le dialog
         closedialog(){
            this.dialog = false ;
            this.userhasplaintes.lien ='';
          this.userhasplaintes.idplainte = -1;
          this.userhasplaintes.descision = '';
          this.updateDecision = 0;
        },

        // navigate to document
        redirect(link) { 
          var names = link.split('/')
          var fileLink = document.createElement('a');
                fileLink.href =  baseURL.backendPDF+"/dossiers_plaintes/"+names[2];
                fileLink.target = "_blank"; 
                fileLink.click();
              
      },
        // changer la descision dans la table userhasplaintes(descision)
        edit_item(item){
          this.dialog= true;
          this.userhasplaintes.lien = item.lien;
          this.userhasplaintes.idplainte = item.id;
          this.updateDecision = item.traitID;
        },
      
        valider_edite_descision(){
          let typeApi = "";
          if(this.updateDecision == 1){
            typeApi = "signer_plainte";
          }else{
            if(this.updateDecision==2){
              typeApi = "descision";
            }
          }
          this.load_vcard = true;
                axios
            .post(baseURL.api + "/users/hasplaints/"+typeApi+"/"
                +this.userhasplaintes.idplainte,{
              userhasplaint:this.userhasplaintes
            },{
              headers: { Authorization: `Bearer ${baseURL.token}` },
            })
            .then(async(rep) => {
              if(rep.status == 200){
                await this.get_mes_plaintes();
                this.closedialog();
                this.load_vcard = false;
                this.msgSuc=true; window.scroll(0,0);
              }else{
                this.load_vcard = false;
              }
            }).catch(erreur=>{
              this.load_vcard = false;
            });
        },

        get_mes_plaintes(){
          this.load_tab = true;
        axios.get(baseURL.api + "/users/hasplaints/mesplaintes", {
        headers: { Authorization: `Bearer ${baseURL.token}` },
      })
      .then((rep) => {
        this.plaintes = rep.data;
        this.load_tab=false;
      }).catch(erreur=>{
        this.load_tab = false;
        this.msgErr=true
      });
        }
       
    },

    created(){ 
      this.get_mes_plaintes();// les plaintes de ce utilisateur
    }
}
</script>