<template>
  <v-data-table
    :headers="headers"
    :items="user"
    :search="searchuser"
    no-data-text="معلومات غير متاحة"
    class="elevation-1 font-weight-black text-h6"
    hide-default-footer
    :loading="table_vide"
    loading-text="إنتظر قليلا"
  >
    <template v-slot:top>
      <v-row no-gutters>
        <v-col cols="12" sm="6">
          <v-btn color="blue lighten-4 ma-1" x-small @click="getUser()">refresh</v-btn>
        </v-col>
        <v-col cols="12" sm="4">
        <v-text-field
          v-model="searchuser"
          append-icon="mdi-magnify"
          label="إسم المستخدم"
          single-line
          dense
        ></v-text-field>
        </v-col>
      </v-row>
      
      <v-toolbar class="smallnavbar mb-3" flat height="34px">
        <v-toolbar-title class="darkgrey--text text-h5">
          المستخدمين</v-toolbar-title>
      </v-toolbar>
          <v-alert dense type="error" v-model="msgErr" @click="msgErr=false"
          > تأكد من صحة المعلومات أو شبكة الأنترنيت 
          </v-alert>
      <v-dialog v-model="dialog" max-width="500px">
        <v-card>
          <v-card-title>
            <span class="text-h5">تغير المعلومات</span>
          </v-card-title>

          <v-card-text>
            <v-container>
              <v-row no-gutters>
                <v-col cols="12" sm="6" md="4">
                  <v-text-field
                    v-model="editedItem.nom"
                    label="إسم المستخدم"
                  ></v-text-field>
                </v-col>
                <v-col cols="12" sm="6" md="4">
                  <v-text-field
                    v-model="editedItem.numUser"
                    label="رقم الهاتف"
                  ></v-text-field>
                </v-col>
                <v-col cols="12" sm="6" md="4">
                  <v-text-field
                    v-model="editedItem.email"
                    label="البريد الالكتروني"
                  ></v-text-field>
                </v-col>
                </v-row>
                <v-row no-gutters>
                <v-col cols="12" sm="6" md="4">
                  <v-select
                    v-model="editedItem.idRole"
                    :items="Role"
                    item-value="id"
                    item-text="nom"
                    label="دوره"
                    dense
                  ></v-select>
                  <v-text-field
                  type="password"
                  v-model="editedItem.password"
                  label="كلمة السر"
                  dense
                ></v-text-field>
                <v-file-input
                  v-model="file"
                  accept="image/png,image/jpeg"
                  color="blue accent-4"
                  counter
                  class="mt-3"
                  label="أضف التوقيع"
                  placeholder="أضف التوقيع"
                  prepend-icon="mdi-file-plus"
                  dense
                  full-width
                ></v-file-input>
                  <v-switch v-model="editedItem.active" label="نشيط"></v-switch>
                </v-col>
              </v-row>
            </v-container>
          </v-card-text>

          <v-card-actions>
            <v-spacer></v-spacer>
            <v-btn lighten class="red lighten-3" text @click="close">
              إلغاء
            </v-btn>
            <v-btn
              class="blue lightenen-2"
              lighten
              text
              @click="save"
              :loading="load_pop_edit"
            >
              تأكيد
            </v-btn>
          </v-card-actions>
        </v-card>
      </v-dialog>

      <v-dialog v-model="dialogDelete" max-width="500px">
        <v-card>
          <v-card-title class="text-h5"
            >هل ان متأكد من هذه العملية</v-card-title
          >
          <v-card-actions>
            <v-spacer></v-spacer>
            <v-btn class="red lightenen-1" lighten text @click="closeDelete"
              >إلغاء</v-btn
            >
            <v-btn
              class="blue lightenen-3"
              :loading="load_pop_delete"
              lighten
              text
              @click="deleteItemConfirm"
              >نعم</v-btn
            >
            <v-spacer></v-spacer>
          </v-card-actions>
        </v-card>
      </v-dialog>
    </template>

    <template v-slot:[`item.action`]="{ item }">
      <v-chip :color="getColor(item.active)" lighten small fab> </v-chip>

      <v-icon small class="mr-2" @click="editItem(item)"> mdi-pencil </v-icon>
      <v-icon small @click="deleteItem(item)"> mdi-delete </v-icon>
    </template>
  </v-data-table>
</template>
<script>
import axios from "axios";
import baseURL from "@/api/baseURL";
export default {
  data: () => ({
    dialog: false,
    dialogDelete: false,
    table_vide: true,
    load_pop_edit: false,
    load_pop_delete: false,
    searchuser:'',
    Role: [],
    headers: [
      { text: "إسم المستخدم", align: "start", sortable: true, value: "nom" },
      { text: "رقم الهاتف", value: "numUser", sortable: false },
      { text: "البريد الالكتروني", value: "email", sortable: false },
      { text: "دوره", value: "role.nom", sortable: false },
      { text: "تغيير", value: "action", sortable: false },
    ],
    editedIndex: -1,
    user: [],
    editedItem: {},
    msgErr:false, msgSuc:false,
    file:null
  }),
  watch: {
    dialog(val) {
      val || this.close();
    },
    dialogDelete(val) {
      val || this.closeDelete();
    },
    msgErr(val){
      !val || setTimeout(()=>{ this.msgSuc=false; this.msgErr=false; },2000)
    },
     msgSuc(val){
      !val || setTimeout(()=>{ this.msgSuc=false; this.msgErr=false; },2000)
    }
  },

  methods: {
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
            console.log(rep.data);
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
    getColor(active) {
      if (active == false) {
        active = "dis";
        return "red lightenen-3";
      } else return "green lighten-1";
    },

    editItem(item) {
      this.editedIndex = this.user.indexOf(item);
      this.editedItem = Object.assign({}, item);
      this.dialog = true;
    },
    close() {
      this.dialog = false;
    },
    async save() {
      this.load_pop_edit = true;
      if (this.editedIndex > -1) {
        let formData = new FormData();
      formData.append("img", this.file);
      if(!this.editedItem.password) this.editedItem.password="";
      const json = JSON.stringify(this.editedItem);
      formData.append("users",json);
        //Object.assign(this.user[this.editedIndex], this.editedItem)
        await axios
          .post(
            baseURL.api + "/users/update/" + this.editedItem.id,formData,
            { headers: { Authorization: `Bearer ${baseURL.token}`,
                   "Content-Type": "multipart/form-data", }
         })
          .then(async (res) => {
            this.table_vide = true;
            await this.getUser();
            this.table_vide = false;
            this.load_pop_edit = false;
            this.file = null;
            console.log(res);
          }).catch(err=>{
            this.msgErr=true;
            console.log(err);
            this.load_pop_edit = false;
          });
      }
      this.close();
    },

    deleteItem(item) {
      this.editedIndex = this.user.indexOf(item);
      this.editedItem = Object.assign({}, item);
      this.dialogDelete = true;
    },
    closeDelete() {
      this.dialogDelete = false;
    },
    async deleteItemConfirm() {
      this.load_pop_delete = true;

      await axios
        .delete(baseURL.api + "/users/delete/" + this.editedItem.id, {
          headers: { Authorization: `Bearer ${baseURL.token}` },
        })
        .then(async (res) => {
          this.table_vide = true;
          await this.getUser();
          this.table_vide = false;
          this.load_pop_delete = false;
          return res;
        })
        .catch((er) => {
          //this.openSnackbar("هذا المستخدم لم يكمل مهامه بعد");
          this.load_pop_delete = false;
        });
      this.closeDelete();
    },
    async getUser() {
    this.table_vide = true;
      this.user = [];
      await axios
        .get(baseURL.api + "/users/index", {
          headers: {
            Authorization: `Bearer ${baseURL.token}`,
          },
        })
        .then((res) => {
          this.user = res.data;
          this.table_vide = false;
          return res;
        });
    },
  },
  created() {
    this.getUser();

    axios
      .get(baseURL.api + "/users/role/index", {
        headers: {
          Authorization: `Bearer ${baseURL.token}`,
        },
      })
      .then((res) => {
        this.Role = res.data;
        return res;
      });
  },
};
</script>
