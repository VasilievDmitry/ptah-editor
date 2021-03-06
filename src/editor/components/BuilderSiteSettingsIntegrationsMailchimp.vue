<template>
  <div
    class="b-integrations-mailchimp"
    >
    <div class="b-integrations-mailchimp__inner">
      <div class="b-integrations-mailchimp__layout-padding">
        <template v-if="integrationComplete">
          <img
            class="b-integrations-mailchimp__logo"
            src="https://cdn.ptah.pro/prod/5ee8d62d480c4e00018c404d/475f16d3-5641-486a-978c-8d94cdabe398.png"
          >
          <div class="b-panel__control">
            <base-caption>
              Select a list to collect leads
            </base-caption>
            <base-select
              :options="lists"
              :value="selectedList"
              @input="setList($event)"
            />
          </div>

          <p class="b-integrations-mailchimp__descr">
            E-mail addresses from the "Form" section will now be sent to this list
          </p>
        </template>

        <template v-if="!integrationComplete">
          <iframe :src="frameSrc" frameborder="none" width="100%" height="100%"></iframe>
        </template>
      </div>
    </div>
  </div>
</template>

<script>
import { mapActions, mapState } from 'vuex'
import BuilderModalContentLayout from './BuilderModalContentLayout'
import * as _ from 'lodash-es'
import store from '@store'

export default {
  name: 'BuilderSiteSettingsIntegrationsMailchimp',

  components: {
    BuilderModalContentLayout
  },

  data () {
    return {
      lists: [],
      selectedList: {},
      frameSrc: ''
    }
  },

  computed: {
    ...mapState(['currentLanding']),
    ...mapState('User', ['user', 'mcLists']),

    integrationComplete () {
      return this.user.mailchimpIntegration
    },

    savedList () {
      return this.currentLanding.settings.mailchimpList
    }
  },

  async beforeRouteEnter (to, from, next) {
    await store.dispatch('User/getUser')
    next()
  },

  created () {
    if (this.integrationComplete) {
      this.getLists()
    } else {
      this.mailchimpLogin()
        .then((response) => {
          this.frameSrc = response.redirect
        })
      this.listenFrame()
    }
  },

  methods: {
    ...mapActions(['storeSettings', 'activateCheckListItem']),
    ...mapActions('User', [
      'mailchimpLists',
      'getUser',
      'mailchimpLogin',
      'mailchimpCallback'
    ]),

    listenFrame () {
      window.addEventListener('message', (e) => {
        let data = {}

        try {
          data = JSON.parse(e.data)
        } catch (e) { }

        if (data.code) {
          this.mailchimpCallback(data)
            .then(() => this.getLists())
            .then(() => {
              this.activateCheckListItem('integrations')
              return this.getUser()
            })
        }
      })
    },

    getLists () {
      return this.mailchimpLists()
        .then(() => {
          let list = {}
          this.lists = this.mcLists.lists.slice()

          if (this.savedList) {
            list = _.find(this.lists, (o) => o.name === this.savedList)
          } else {
            list = this.lists[0]
          }

          if (list !== undefined) {
            this.setList(list)
          }
        })
    },

    setList (list) {
      this.selectedList = list
      let sUrl = list.subscribe_url_long

      let url = ''
      let pos = sUrl.indexOf('?u=')
      url = sUrl.substring(0, pos) + '/post' + sUrl.substring(pos)

      this.storeSettings({ mailchimpUrl: url })
      this.storeSettings({ mailchimpList: list.name })
    }
  }
}
</script>

<style lang="sass" scoped>
.b-integrations-mailchimp
  position: absolute
  top: 0
  right: 0
  bottom: 0
  left: 0
  z-index: 0

  &__inner
    position: absolute
    top: 0
    right: 1rem
    bottom: 0
    left: 0
    z-index: 0

    padding: 0 2.5rem
  &__logo
    max-width: 100%
    margin: 2rem 0 4rem

  &__descr
    font-size: 1.6rem
    line-height: 2rem

  &__controls
    justify-content: flex-start !important
    border-top: none !important

iframe
  position: absolute
  top: 0
  right: 0
  bottom: 0
  left: 0
  z-index: 0

  border: none
</style>
