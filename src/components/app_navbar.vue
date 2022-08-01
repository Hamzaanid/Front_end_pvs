<template>
<nav>
    <v-app-bar dense clipped-right class="nvbar" app height="52px">
    <v-app-bar-nav-icon 
           @click="drawer = !drawer"
            ></v-app-bar-nav-icon>
        <v-toolbar-title>
            <v-icon>mdi-gavel</v-icon>
            <span class=" text-h6"> نظام تدبير القضايا الزجرية</span>         
        </v-toolbar-title>
        <v-spacer/>
         <img  height="45px" style="border-radius:5px;"  :src="require('../assets/emblem.png')"/>
         <v-spacer/>
       
         <v-btn text>
            <span   class="font-weight-black text-h7">تسجيل الخروج</span>
            <v-icon right>mdi-logout</v-icon>
        </v-btn> 
    </v-app-bar>
    
    <v-navigation-drawer clipped right  v-model="drawer" app  class="ma-4">

     <v-card  flat outlined>
    <router-link to="" style="text-decoration:none;" class="pa-0 ma-0">
      <v-icon size="60px"  color="grey darken-3" class="mx-16 pr-6">
       mdi-account-circle-outline
       </v-icon>
       </router-link>        
  </v-card>
     <v-card
    outlined flat
  >
    <v-list rounded>
      <v-list-item-group
        color="primary"
      >
        <v-list-item
          v-for="(item, i) in items"
          :key="i"
          router :to="item.route"
        >
          <v-list-item-icon>
            <v-icon left v-text="item.action"></v-icon>
          </v-list-item-icon>
          <v-list-item-content>
            <v-list-item-title class="font-weight-bold darkgrey--text text-h6"
             v-text="item.title"></v-list-item-title>
          </v-list-item-content>
        </v-list-item>
      </v-list-item-group>
    </v-list>
     </v-card>
    </v-navigation-drawer>
</nav>
</template>
<script>
export default{
    data() {
        return {
            drawer: false,
            items: [
        {
          action: 'mdi-scale-balance',
          title: 'شكاية',
          route: '/plaintes'
        },
        {
          action: 'mdi-bank-plus',
          title: 'المحاضر',
          route: '/1'
        },
        {
          action: 'mdi-cog-sync',
          title: 'الإحالات',         
          route: '/2'
        },
        {
          action: 'mdi-poll',
          title: 'إحصائيات',
          route: '/3'
        },
        {
          action: 'mdi-account-cog',
          title: 'الحسابات',
          route: '/4'
        },
        {
          action: 'mdi-shield-star',
          title: 'الانابات',
          route: '/5'
        }
      ],
        }
    }
}
</script>