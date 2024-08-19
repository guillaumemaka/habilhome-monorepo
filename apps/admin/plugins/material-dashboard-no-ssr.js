import Vue from 'vue'
// Notifications plugin. Used on Notifications page
import Notifications from '@/components/NotificationPlugin'
// Sidebar on the right. Used as a local plugin in DashboardLayout.vue
import SideBar from '@/components/SidebarPlugin'

Vue.use(SideBar)
Vue.use(Notifications)
