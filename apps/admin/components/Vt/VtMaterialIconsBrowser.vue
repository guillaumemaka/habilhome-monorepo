<template>
  <!-- MD ICONS MODAL -->
  <modal v-if="open" @close="close">
    <template slot="header">
      <h4 class="modal-title">Modal Title</h4>
      <md-button class="md-simple md-just-icon md-round modal-default-button" @click="$emit('close')">
        <md-icon>clear</md-icon>
      </md-button>
    </template>

    <template slot="body">
      <div class="md-layout md-gutter md-alignment-left">
        <div class="md-layout-item md-size-100" :key="`set_${idx}_${iconSet.name}`" v-for="(iconSet, idx) in icons">
          <div class="md-layout">
            <div class="md-layout-item md-size-100">
              <h2 class="left">{{iconSet.name}}</h2>
            </div>
            <div class="md-layout-item md-size-100 mb-3">
              <hr/>
            </div>
            <div class="md-layout-item md-size-100">
              <div class="md-layout">
                <!-- Grid -->
                <div class="md-layout-item md-size-5" :key="`set_${idx}_${iconSet.name}_${icon.id}`" v-for="icon in iconSet.icons">
                  <div class="md-layout md-gutter md-md-alignment-space-between-center">
                    <div class="pa-2 md-layout-item md-size-5">
                      <md-icon :style="iconStyle" @click.native="onSelectIcon(icon.id)">{{icon.id}}</md-icon>
                    </div>
                    <!-- <div class="md-layout-item md-size-5">
                      <span><strong>{{icon.id}}</strong></span>
                    </div> -->
                  </div>
                </div>
                <!-- End Grid -->
              </div>
            </div>
          </div>
        </div>
      </div>
      </div>
    </template>

    <template slot="footer">
      <md-button class="md-simple">Nice Button</md-button>
      <md-button class="md-danger md-simple" @click="$emit('close')">Close</md-button>
    </template>
  </modal>
  <!-- END MD ICONS MODAL -->
</template>

<script>
import icons from '@/assets/data/icons.json'
import { Modal } from '@/components'

export default {
  components: {
    Modal
  },
  props: {
    open: {
      type: Boolean,
      default: false
    }
  },
  data () {
    return {
      icons
    }
  },
  computed: {
    iconStyle(){
      return {
        cursor: 'pointer'
      }
    }
  },
  methods: {
    onSelectIcon(id){
      this.$emit('on-select-icon', id)
      this.$emit('close')
    }
  }
}
</script>

<style lang="scss">
.modal-container {
  max-width: 1000px;
  margin: 0px auto;
  position: relative;
  background-color: #fff;
  transition: all .3s ease;
  box-shadow: 0 27px 24px 0 rgba(0,0,0,.2), 0 40px 77px 0 rgba(0,0,0,.22);
  border-radius: 6px;
  border: none;

  .modal-body {
    max-height: 600px;
    overflow-y: scroll;
  }
}
</style>
