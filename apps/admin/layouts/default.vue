<template>
  <div
    class="wrapper">
    <notifications></notifications>
    <side-bar
      :title="appName"
      :active-color="sidebarBackground"
      :background-image="sidebarBackgroundImage"
      :data-background-color="sidebarBackgroundColor"
    >
      <user-menu @logout="LOGOUT" :email="email" :title="displayName" />
      <mobile-menu></mobile-menu>
      <template slot="links">
        <sidebar-item v-if="hasRole(link.role)" :exact="link.exact || false" :key="link.name" v-for="link of links" :link="link">
        </sidebar-item>
      </template>
    </side-bar>
    <div class="main-panel">
      <top-navbar></top-navbar>

      <div
        :class="{ content: !$route.meta.hideContent }"
        @click="toggleSidebar"
      >
        <zoom-center-transition :duration="200" mode="out-in">
          <!-- your content here -->
          <nuxt/>
        </zoom-center-transition>
      </div>
      <content-footer v-if="!$route.meta.hideFooter"></content-footer>
    </div>
  </div>
</template>
<script>
/* eslint-disable no-new */
import { mapState, mapActions } from 'vuex'
import PerfectScrollbar from 'perfect-scrollbar'
import { ZoomCenterTransition } from 'vue2-transitions'
import ContentFooter from './ContentFooter.vue'
import TopNavbar from './TopNavbar.vue'
import MobileMenu from './Extra/MobileMenu.vue'
import UserMenu from './Extra/UserMenu.vue'

import 'perfect-scrollbar/css/perfect-scrollbar.css'


function hasElement(className) {
  return document.getElementsByClassName(className).length > 0
}

function initScrollbar(className) {
  if (hasElement(className)) {
    new PerfectScrollbar(`.${className}`)
  } else {
    // try to init it later in case this component is loaded async
    setTimeout(() => {
      initScrollbar(className)
    }, 100)
  }
}

export default {
  middleware: ['authenticated'],
  components: {
    TopNavbar,
    ContentFooter,
    MobileMenu,
    UserMenu,
    ZoomCenterTransition
  },
  head() {
    return {
      titleTemplate: `%s - ${this.appName}`
    }
  },
  data() {
    return {
      sidebarBackgroundColor: 'black',
      sidebarBackground: 'rose',
      sidebarBackgroundImage: '/img/sidebar-2.jpg',
      sidebarMini: true,
      sidebarImg: true
    }
  },
  computed: {
    ...mapState({
      links: 'navigations',
      appName: 'appName',
      email: state => state.auth.email,
      authenticated: state => state.auth.authenticated,
      userInfo: state => state.auth.userInfo
    }),
    displayName () {
      return `${this.userInfo.firstName} ${this.userInfo.lastName}`
    }
  },
  methods: {
    ...mapActions('auth', ['LOGOUT']),
    hasRole(role) {
      return this.userInfo.roles.includes(role)
    },
    toggleSidebar() {
      if (this.$sidebar && this.$sidebar.showSidebar) {
        this.$sidebar.displaySidebar(false)
      }
    },
    minimizeSidebar() {
      if (this.$sidebar) {
        this.$sidebar.toggleMinimize()
      }
    }
  },
  mounted() {
    let docClasses = document.body.classList
    let isWindows = navigator.platform.startsWith('Win')
    if (isWindows) {
      // if we are on windows OS we activate the perfectScrollbar function
      initScrollbar('sidebar')
      initScrollbar('sidebar-wrapper')
      initScrollbar('main-panel')

      docClasses.add('perfect-scrollbar-on')
    } else {
      docClasses.add('perfect-scrollbar-off')
    }
  },
  watch: {
    authenticated: function(authenticated) {
      if (!authenticated) {
        this.$router.push('/login')
      }else{
        this.$router.push('/')
      }
    },
    sidebarMini() {
      this.minimizeSidebar()
    }
  }
}
</script>
<style lang="scss">
$scaleSize: 0.95;
@keyframes zoomIn95 {
  from {
    opacity: 0;
    transform: scale3d($scaleSize, $scaleSize, $scaleSize);
  }
  to {
    opacity: 1;
  }
}
.main-panel .zoomIn {
  animation-name: zoomIn95;
}
@keyframes zoomOut95 {
  from {
    opacity: 1;
  }
  to {
    opacity: 0;
    transform: scale3d($scaleSize, $scaleSize, $scaleSize);
  }
}
.main-panel .zoomOut {
  animation-name: zoomOut95;
}
</style>
