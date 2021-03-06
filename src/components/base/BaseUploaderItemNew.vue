<template>
  <figure class="b-uploader-item">

    <div :id="inputId" class="b-uploader-item__preview" @click="onClick">
      <radial-progress-bar
        v-show="progress !== 100"
        :diameter="16"
        :completed-steps="progress"
        :total-steps="totalSteps"
        :strokeWidth="2"
        :startColor="`#55D287`"
        :stopColor="`#00ADB6`"
        :innerStrokeColor="`#E4E4E4`"
      >
      </radial-progress-bar>

      <template v-if="progress === 100">
        <!-- one file -->
        <div class="b-uploader-item__preview--img"
             @dragover.prevent
             @drop="onDrop"
             :style="style"
             v-if="hasPreview">
          <div v-if="type === 'video'">
            <icon-base name="video" width="18" height="18" />
          </div>

          <input
            @change="uploadFile($event.target.files[0])"
            type="file"
            ref="input"
            hidden>
        </div>

        <!-- multiple (carousel) -->
        <div class="b-uploader-item__preview--plus"
             @dragover.prevent
             @drop="onDrop"
             :style="style"
             v-else>
          <IconBase name="downloadCloud" width="32" height="22" color="#00ADB6" />

          <div>Drag and drop</div>

          <input
            :multiple="multiple"
            @click="$event.target.value = ''"
            @change="uploadFiles($event.target.files)"
            type="file"
            ref="input"
            hidden>
        </div>
      </template>

    </div>

    <div class="b-uploader-item__controls">
      <div class="b-uploader-item__label"
           :class="{ 'b-uploader-item__label--empty': !hasPreview }"
           v-if="label">
        <template v-if="!hasPreview && progress === 100">
          {{ label }}

          <span
            class="b-uploader-item__label-help"
            v-if="type === 'image'"
            :tooltip="tooltipText || 'Upload image or enter url'"
            tooltip-position="leftbottom"
            >
            <IconBase
              name="questionCircle"
              width="16"
              height="16"
              />
          </span>

          <span
            class="b-uploader-item__label-help"
            v-if="type === 'video'"
            :tooltip="tooltipText || 'Upload video or enter url'"
            tooltip-position="leftbottom"
            >
            <IconBase
              name="questionCircle"
              width="16"
              height="16"
              />
          </span>

        </template>
        <template v-else>
          {{ label }}
        </template>
      </div>

      <div class="b-uploader-item__text">
        <button
          class="b-uploader-item__button-url"
          :class="{ 'drop' : openUrl }"
          @click="openUrl = !openUrl">
          URL <IconBase name="arrowDown" width="7" />
        </button>

        <div class="b-uploader-item__remove"
             @click="$emit('remove')"
             v-if="hasPreview">
          {{$t('nav.delete')}}
        </div>
      </div>
    </div>

    <div class="b-uploader-item__url" :class="{ 'show' : openUrl }">
      <base-text-field
        :value="path"
        :hasError="error !== false"
        errorText="Invalid image url"
        @input="onInput"
      />
    </div>

    <div
      v-if="error !== false && error.statusText !== ''"
      class="b-uploader-item__error"
    >
      {{ error.statusText }}
    </div>

  </figure>
</template>

<script>
import { mapActions } from 'vuex'
import RadialProgressBar from 'vue-radial-progress'
import * as _ from 'lodash-es'
import { getCookie, ERRORS } from '@editor/util'

function getFormData (file) {
  let formData = new FormData()
  formData.append('file', file)
  return formData
}

export default {
  name: 'BaseUploaderItem',

  components: {
    RadialProgressBar
  },

  props: {
    target: {
      type: String,
      default: 'library'
    },
    item: Object,
    multiple: Boolean,
    src: String,
    type: String,
    label: String,
    tooltipText: String,
    inputId: {
      type: String,
      default: ''
    },
    index: {
      type: String,
      default: '0'
    }
  },

  data () {
    return {
      progress: 100,
      totalSteps: 100,
      error: false,
      openUrl: false
    }
  },

  computed: {
    hasPreview () {
      return this.item || this.src
    },

    pattern () {
      return new RegExp(`^${this.type}`)
    },

    style () {
      let { item, src, type } = this
      if ((!item && !src) || type === 'video') {
        return null
      }
      return {
        background: `url(${src || item.path}) no-repeat center`
      }
    },

    path () {
      return _.get(this.item, 'path') ? this.item.path : this.src
    }
  },

  methods: {
    ...mapActions('Sidebar', ['toggleShowImageLibrary']),

    async getFileData (file) {
      this.progress = 0
      this.error = false
      return new Promise((resolve, reject) => {
        let xhr = new XMLHttpRequest()

        xhr.upload.onprogress = this.loadingProgress // --- uploading progress
        xhr.open('POST', `${process.env.VUE_APP_API}upload`)
        xhr.setRequestHeader('Authorization', `Bearer ${getCookie('token')}`)
        xhr.send(getFormData(file))

        xhr.onload = xhr.onerror = () => {
          if (xhr.status === 200) {
            try {
              let response = JSON.parse(xhr.response)
              let path = response.cdnUrl
              this.clearProgress(path)
              resolve({ name: response.file, path })
            } catch (error) {
              reject(error)
            }
          } else {
            let response = JSON.parse(xhr.response)
            this.progress = 100
            this.error = {
              status: response.error.code,
              statusText: ERRORS[response.error.message] || ''
            }
            setTimeout(() => {
              this.error = false
            }, 2000)
          }
        }
      })
    },

    clearProgress (path) {
      if (this.type === 'image') {
        let image = new Image()
        image.src = path
        image.onload = () => requestAnimationFrame(() => { this.progress = 100 })
        return
      }
      requestAnimationFrame(() => { this.progress = 100 })
    },

    loadingProgress ({ loaded, total }) {
      this.progress = (loaded === total) ? 99 : parseInt((loaded / total * 100))

      if (this.progress === 99) {
        this.$emit('labelProgress', '')
      } else {
        this.$emit('labelProgress', `${this.progress}% Loading...`)
      }
    },

    async uploadFiles (fileList) {
      let pattern = this.pattern
      let files = [...fileList].filter(({ type }) => type.match(pattern))
      for (let file of files) {
        this.$emit('add', await this.getFileData(file))
      }
      this.$emit('getInputSrcFiles', files)
    },

    async uploadFile (file) {
      if (!(file && file.type.match(this.pattern))) {
        return
      }
      this.$emit('replace', await this.getFileData(file))
      this.$emit('getInputSrcFiles', file)
    },

    onDrop (e) {
      let files = e.dataTransfer.files

      e.stopPropagation()
      e.preventDefault()

      if (!files || !files[0]) {
        return
      }

      this.uploadFile(files[0])
    },

    onClick () {
      if (this.target === 'library') {
        this.toggleShowImageLibrary(true)
        this.$emit('showLibrary')
        this.$emit('setIndex', this.index)
      } else {
        this.$refs.input.click()
      }
      this.error = false
    },

    onInput (value) {
      this.debouncedInput(value, this)
    },

    debouncedInput: _.debounce((value, self) => {
      if (value === '') {
        self.$emit('remove')
      }

      // validate image url
      if (self.type === 'image') {
        let image = new Image()
        image.onload = () => {
          self.error = false
          self.inputDone(value)
        }
        image.onerror = () => {
          self.error = true
        }
        image.src = value
      } else {
        self.inputDone(value)
      }
    }, 300, { trailing: true }),

    inputDone (value) {
      if (value !== '' && this.hasPreview) {
        this.$emit('replace', { name: 'file', path: value })
      } else {
        this.$emit('add', { name: 'file', path: value })
      }
    }
  }
}
</script>

<style lang="sass" scoped>
@import '../../assets/sass/_colors.sass'
@import '../../assets/sass/_variables.sass'

.b-uploader-item
  font-family: 'Roboto', Helvetica Neue, Helvetica, Arial, sans-serif

  display: flex
  justify-content: flex-start
  align-items: flex-start
  flex-wrap: wrap

  position: relative

  margin: 0 0 $size-step/2
  padding: 0

  &__preview
    display: flex
    align-items: center
    justify-content: center
    flex-shrink: 0
    flex-basis: 45%

    width: $size-step*3.5
    height: 8rem
    margin: 0 1.1rem 0 0

    position: relative

    &>div
      display: flex
      align-items: center
      justify-content: center

      cursor: pointer
      &:hover
        border-color: $main-green

    &--img
      width: 100%
      height: 100%
      border-radius: 0.2rem
      border: 0.2rem solid $ligth-grey
      background-color: $white
      background-size: contain !important
      background-position: center center !important
      background-repeat: no-repeat !important
      position: relative

    &--plus
      display: flex
      align-items: center
      justify-content: center
      flex-direction: column
      width: 100%
      height: 100%

      color: $main-green

      background: rgba(88, 199, 205, 0.1)
      border: 1px dashed $main-green
      border-radius: 5px

      &> div
        font-size: 1rem
        line-height: 1.4rem
        margin-top: .5rem

  &__controls
    position: relative
    flex-grow: 1
    flex-basis: 50%

    font-size: 1.4rem
    line-height: 1.7rem
    letter-spacing: -0.01em

    padding-top: .5rem

  &__label
    color: $dark-grey
    font-weight: 500
    height: 5rem
    &:first-letter
      text-transform: uppercase
    &-help
      position: absolute
      right: 0rem
      text-transform: none
      cursor: pointer
      svg
        fill: $yellow
    &--empty
      // color: #999

  &__text
    margin-top: .5rem
    display: flex
    align-items: center

  &__url
    flex-basis: 100%
    margin-top: 2rem
    overflow: hidden
    height: 0
    opacity: 0
    transition: all .2s ease-out
    display: none

    &.show
      height: 3.5rem
      opacity: 1
      display: inline-block

  &__remove
    color: #A2A5A5
    cursor: pointer
    font-size: 1.4rem

  &__button-url
    background: transparent
    color: $main-green
    border: none
    display: flex
    align-items: center
    font-size: 1.4rem
    font-weight: 500
    font-family: 'Roboto', Helvetica Neue, Helvetica, Arial, sans-serif
    margin-right: 1.5rem
    padding: 0
    cursor: pointer
    outline: none

    &.drop svg
      transform: rotate(180deg)

    svg
      margin-left: .7rem

  &__error
    position: absolute
    top: 100%
    font-size: 1rem
    line-height: 1.4rem
    margin-top: .5rem
    color: #D36083
</style>
