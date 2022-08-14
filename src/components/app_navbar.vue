<template>
  <nav>
    <v-app-bar dense clipped-right class="nvbar" height="52px" app>
      <v-app-bar-nav-icon @click="drawer = !drawer"></v-app-bar-nav-icon>
      <v-toolbar-title>
        <v-icon>mdi-gavel</v-icon>
        <span class="text-h6"> نظام تدبير القضايا الزجرية</span>
      </v-toolbar-title>
      <v-spacer />
      <img
        height="45px"
        style="border-radius: 5px"
        :src="require('../assets/emblem.png')"
      />
      <v-spacer />

      <v-btn @click="logout" target="_blank" text
        >تسجيل الخروج
        <span class="mr-2"></span>
        <v-icon>mdi-logout</v-icon>
      </v-btn>
    </v-app-bar>

    <v-navigation-drawer height="485px" clipped right v-model="drawer" app class="ma-4 mb-5">
      <v-card flat outlined>
        <router-link to="" style="text-decoration: none" class="pa-0 ma-0">
          <v-icon size="50px" class="d-flex justify-center">
            mdi-account-circle-outline
          </v-icon>
        </router-link>
        <v-card-text
          class="d-flex justify-center px-3 py-0 ma-0 font-weight-black"
          > {{ username }}</v-card-text
        >
      </v-card>

      <v-card outlined flat>
        <v-list rounded>
          <v-list-item-group color="primary">
            <v-list-item
              v-for="(item, i) in items"
              :key="i"
              router
              :to="item.route"
              dense
              v-show="item.show"
            >
              <v-list-item-icon>
                <v-icon left v-text="item.action"></v-icon>
              </v-list-item-icon>
              <v-list-item-content>
                <v-list-item-title
                  class="font-weight-bold darkgrey--text text-h6"
                  v-text="item.title"
                ></v-list-item-title>
              </v-list-item-content>
            </v-list-item>
          </v-list-item-group>
        </v-list>
      </v-card>
    </v-navigation-drawer>
  </nav>
</template>
<script>
import { mapGetters, mapActions } from "vuex";
import loginpage from "@/views/auth/Login.vue";
export default {
  data() {
    return {
      drawer: false,
      items: [
        {
          action: "mdi-scale-balance",
          title: "شكاية",
          route: "/plaintes",
          show:this.$store.state.user.showDrwer.dossierajout,
        },
        {
          action: "mdi-bank-plus",
          title: "المحاضر",
          route: "/pvs",
           show:this.$store.state.user.showDrwer.dossierajout,
        },
        {
          action: "mdi-plus-thick",
          title: "الإحالات",
          route: "/traiter",
           show:this.$store.state.user.showDrwer.dashproc,
        },
        {
          action: "mdi-folder-eye",
          title: "المطالعة",
          route: "/suivi",
           show:this.$store.state.user.showDrwer.dashproc,
        },
        {
          action: "mdi-file-eye",
          title: "تتبع الملفات",
          route: "/mes_dossiers",
           show:this.$store.state.user.showDrwer.mesdossier_stat,
        },
        {
          action: "mdi-file-chart",
          title: " الإحصائيات",
          route: "/statistique",
           show:this.$store.state.user.showDrwer.mesdossier_stat,
        },
        {
          action: "mdi-folder-cog",
          title: " إدارة الملفات",
          route: "/adminDossiers",
           show:this.$store.state.user.showDrwer.dashproc,
        },
        {
          action: "mdi-account-cog",
          title: "الحسابات",
          route: "GesyionUser",
           show:this.$store.state.user.showDrwer.gestUser,
        },
        {
          action: "mdi-archive-cog",
          title: "الأرشيف",
          route: "archive",
           show:this.$store.state.user.showDrwer.dashproc,
        },
      ],
    };
  },
  components: {
    loginpage,
  },
  computed:{
    username(){
      return this.$store.state.user.userDetails.name;
    }
  },
  created() {
    this.checkUserState();
  },
  
  methods: {
    changeRTL() {
      this.$vuetify.rtl = 0.0;
    },
    ...mapActions({
      logoutUser: "user/logoutUser",
      checkUserState: "user/setLoggedInState",
    }),
    logout() {
      this.logoutUser().then(() => {
        this.$router.push("login");
         localStorage.clear();
      });
    },
  },
};
</script>
