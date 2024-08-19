<template>
  <div class="md-layout">
    <div class="md-layout-item md-medium-size-100">
      <div class="md-layout">
        <div v-for="(s, $index) in stats" :key="$index" class="md-layout-item md-medium-size-25">
          <stats-card :header-color="statsColor[s.name]">
            <template slot="header">
              <div class="card-icon">
                <md-icon>{{ statsIcons[s.name] }}</md-icon>
              </div>
              <p class="category">{{ s.stats.total | pluralize(s.name) | capitalize }}</p>
              <h3 class="title">{{ s.stats.total}}
              </h3>
            </template>

            <template slot="footer">
              <div class="stats">
                <md-icon>update</md-icon>
                Just Updated
              </div>
            </template>
          </stats-card>
        </div>
      </div>

      <!-- <time-line plain type="simple">
        <time-line-item inverted badge-type="danger" badge-icon="card_travel">
          <span slot="header" class="badge badge-danger">Some title</span>
          <p slot="content">
            Wifey made the best Father's Day meal ever. So thankful so happy so blessed. Thank you for making my family We just had fun with the “future” theme !!! It was a fun night all together ... The always rude Kanye Show at 2am Sold Out Famous viewing @ Figueroa and 12th in downtown.
          </p>

          <h6 slot="footer">
            <i class="ti-time"></i>
            11 hours ago via Twitter
          </h6>
        </time-line-item>

        <time-line-item inverted badge-type="success" badge-icon="extension">
          <span slot="header" class="badge badge-success">Another Title</span>
          <p slot="content">
            Thank God for the support of my wife and real friends. I also wanted to point out that it’s the first album to go number 1 off of streaming!!! I love you Ellen and also my number one design rule of anything I do from shoes to music to homes is that Kim has to like it....
          </p>
        </time-line-item>

        <time-line-item inverted badge-type="info" badge-icon="fingerprint">
          <span slot="header" class="badge badge-info">Another Title</span>
          <div slot="content">
            <p>
              Called I Miss the Old Kanye That’s all it was Kanye And I love you like Kanye loves Kanye Famous viewing @ Figueroa and 12th in downtown LA 11:10PM
            </p>
            <p>
              What if Kanye made a song about Kanye Royère doesn't make a Polar bear bed but the Polar bear couch is my favorite piece of furniture we own It wasn’t any Kanyes Set on his goals Kanye
            </p>
            <hr />
            <drop-down>
              <md-button slot="title" class="md-button md-info md-round dropdown-toggle" data-toggle="dropdown">
                <md-icon>build</md-icon>
              </md-button>
              <ul class="dropdown-menu" :class="{ 'dropdown-menu-right': !responsive }">
                <li>
                  <a href="#">Mike John responded to your email</a>
                </li>
                <li>
                  <a href="#">You have 5 new tasks</a>
                </li>
                <li>
                  <a href="#">You're now friend with Andrew</a>
                </li>
                <li>
                  <a href="#">Another Notification</a>
                </li>
                <li>
                  <a href="#">Another One</a>
                </li>
              </ul>
            </drop-down>
          </div>
        </time-line-item>
      </time-line> -->
    </div>
  </div>
</template>

<script>
import { StatsCard, TimeLine, TimeLineItem } from '~/components'
import { mapState } from 'vuex'
import Vue2Filters from 'vue2-filters'

export default {
  components: {
    TimeLine,
    TimeLineItem,
    StatsCard
  },
  mixins: [Vue2Filters.mixin],
  data() {
    return {
      title: 'Dashboard',
      statsIcons: {
        application: 'apps',
        object: 'settings_remote',
        theme: 'label'
      },
      statsColor: {
        application: 'blue',
        object: 'green',
        theme: 'warning'
      }
    }
  },
  computed: {
    ...mapState(['stats', 'loadingStats', 'loadingStatsError']),
    ...mapState({
      reports: state => state.reports.data,
      reportsLoaded: state => !state.reports.loading,
      reportsLoading: state => state.reports.loading,
      reportsError: state => state.reports.error
    })
  },
  async fetch({ store }) {
    await store.dispatch('GET_STATS')
    await store.dispatch('reports/GET_REPORTS')
  },
  mounted() {
    this.$store.dispatch('SET_TITLE', this.title)
  },
  head() {
    return {
      title: this.title
    }
  }
}
</script>
