<template>
  <md-toolbar md-elevation="0" class="md-transparent" :class="{
      'md-toolbar-absolute md-white md-fixed-top': $route.meta.navbarAbsolute
    }">
    <div class="md-toolbar-row">
      <div class="md-toolbar-section-start">
        <h3 class="md-title">{{ title }}</h3>
      </div>
      <div class="md-toolbar-section-end">
        <md-button class="md-just-icon md-round md-simple md-toolbar-toggle" :class="{ toggled: showSideBar() }" @click="toggleSidebar">
          <span class="icon-bar"></span>
          <span class="icon-bar"></span>
          <span class="icon-bar"></span>
        </md-button>

        <div class="md-collapse">
          <!-- <div class="md-autocomplete">
            <md-autocomplete
              class="search"
              :md-options="searchResult"
              :md-open-on-focus="false"
            >
              <label>Search...</label>
            </md-autocomplete>
          </div> -->
          <md-list>
            <md-list-item href="/">
              <i class="material-icons">dashboard</i>
              <p class="hidden-lg hidden-md">Dashboard</p>
            </md-list-item>

            <!-- <li class="md-list-item">
              <a
                href="#/components/notifications"
                class="md-list-item-router md-list-item-container md-button-clean dropdown"
              >
                <div class="md-list-item-content">
                  <drop-down direction="down">
                    <md-button
                      slot="title"
                      class="md-button md-just-icon md-simple"
                      data-toggle="dropdown"
                    >
                      <md-icon>notifications</md-icon>
                      <span class="notification">5</span>
                      <p class="hidden-lg hidden-md">Notifications</p>
                    </md-button>
                    <ul class="dropdown-menu dropdown-menu-right">
                      <li><a href="#">Mike John responded to your email</a></li>
                      <li><a href="#">You have 5 new tasks</a></li>
                      <li><a href="#">You're now friend with Andrew</a></li>
                      <li><a href="#">Another Notification</a></li>
                      <li><a href="#">Another One</a></li>
                    </ul>
                  </drop-down>
                </div>
              </a>
            </li> -->

            <md-list-item @click="logout">
              <i class="material-icons">power_settings_new</i>
              <p class="hidden-lg hidden-md">Se Déconnecter</p>
            </md-list-item>
          </md-list>
        </div>
      </div>
    </div>
  </md-toolbar>
</template>

<script>
import { mapState } from 'vuex'

export default {
  data() {
    return {
      searchResult: []
    }
  },
  computed: {
    ...mapState(['title']),
    ...mapState('auth', ['email', 'authenticated'])
  },
  methods: {
    logout() {
      this.$store.dispatch('auth/LOGOUT')
    },
    showSideBar() {
      if (this.$sidebar) {
        return true
      }
      return false
    },
    toggleSidebar() {
      if (this.$sidebar) {
        this.$sidebar.displaySidebar(!this.$sidebar.showSidebar)
      }
    },
    minimizeSidebar() {
      if (this.$sidebar) {
        this.$sidebar.toggleMinimize()
      }
    }
  }
}
</script>
