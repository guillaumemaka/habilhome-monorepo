<template>
  <div class="user">
    <div class="photo">
      <v-gravatar v-if="email" :email="email" />
      <img v-if="!email && avatar" :src="avatar" alt="avatar" >
    </div>
    <div class="user-info">
      <a
        data-toggle="collapse"
        :aria-expanded="!isClosed"
        @click.stop="toggleMenu"
        @click.capture="clicked"
      >
        <span>
          {{ displayName }}
          <b class="caret"></b>
        </span>
      </a>

      <fade-transition>
        <div v-show="!isClosed">
          <ul class="nav">
            <slot>
              <!-- <li>
                <a href="#vue">
                  <span class="sidebar-mini">MP</span>
                  <span class="sidebar-normal">My Profile</span>
                </a>
              </li>
              <li>
                <a href="#vue">
                  <span class="sidebar-mini">EP</span>
                  <span class="sidebar-normal">Edit Profile</span>
                </a>
              </li> -->
              <li>
                <a href="#vue">
                  <span class="sidebar-mini">S</span>
                  <span @click.self="$emit('logout')" class="sidebar-normal">Se déconnecter</span>
                </a>
              </li>
            </slot>
          </ul>
        </div>
      </fade-transition>
    </div>
  </div>
</template>
<script>
import { FadeTransition } from "vue2-transitions";
import VGravatar from 'vue-gravatar'

export default {
  components: {
    FadeTransition,
    VGravatar
  },
  props: {
    email: {
      type: String,
      default: null
    },
    title: {
      type: String,
      default: ""
    },
    avatar: {
      type: String,
      default: "/img/faces/avatar.jpg"
    }
  },
  data() {
    return {
      isClosed: true
    };
  },
  computed: {
    displayName () {
      return this.title || this.email
    }
  },
  methods: {
    clicked: function(e) {
      e.preventDefault();
    },
    toggleMenu: function() {
      this.isClosed = !this.isClosed;
    }
  }
};
</script>
<style>
.collapsed {
  transition: opacity 2s;
}
</style>
