<template>
  <div class="b-images-library-preview">
    <div class="b-images-library-preview__close" @click.prevent="$emit('close')">
      <IconBase
        name="close"
        width="14"
        height="14"
        color="#575A5F"
      />
    </div>
    <div
      class="b-images-library-preview__image"
      :style="{ 'background-image': type === 'image' ? stock ? `url(${list[index].urls.small})`: `url(${list[index].url})` : 'none' }"
    >
      <template v-if="type === 'video'">
        <video
          slot="video"
          autoplay="true"
          muted="true"
          controls="true"
          v-if="isShowVideo"
          loop>
          <source :src="list[index].url">
        </video>
        <div class="b-images-library-preview__loading" v-if="!isShowVideo">
          <base-loading />
        </div>
      </template>
      <span
        class="b-images-library-preview__prev"
        @click="prev"
        v-if="index !== 0"
      >
        <IconBase
          name="galleryArrowLeft"
          width="16"
          height="16"
          color="#A2A5A5"
        />
      </span>
      <span
        class="b-images-library-preview__next"
        @click="next"
        v-if="index !== list.length - 1"
      >
        <IconBase
          name="galleryArrowRight"
          width="16"
          height="16"
          color="#A2A5A5"
        />
      </span>
    </div>
    <div class="b-images-library-preview__controls">
      <div class="b-controls" v-if="stock">
        <div
          v-for="(size, key) in previewItem.urls" :key="key"
          v-if="key !== 'full' && key !== 'raw'"
          class="control control_column"
          @click.stop="select(size)"
        >
          {{ checkWidthByKey(key) }}
        </div>
      </div>
      <div
        v-else
        class="control"
        @click.stop="select"
      >
        <icon-base
          name="select"
          width="30"
          height="30"
        />
      </div>
      <!--div class="b-images-library-preview__controls" @click="">
        <icon-base name="deleteCircle" width="30" height="30"/>
      </div-->
    </div>
  </div>
</template>

<script>
import { VALID_TYPES } from '@editor/util'

export default {
  name: 'TheImagesLibraryPreview',

  props: {
    list: Array,
    previewItem: Object,
    type: {
      type: String,
      default: VALID_TYPES[0],
      validator: value => VALID_TYPES.includes(value)
    },
    stock: {
      type: Boolean,
      default: false
    }
  },

  data () {
    return {
      selected: null,
      index: 0,
      isShowVideo: true
    }
  },

  mounted () {
    this.selected = this.previewItem
    this.findIndex()
  },

  watch: {
    index () {
      this.selected = this.list[this.index]
    }
  },

  methods: {
    select (value) {
      this.$emit('close')

      if (this.stock) {
        this.$emit('select', value)
      } else {
        this.$emit('select', this.list[this.index].url)
      }
    },

    findIndex () {
      let index

      index = this.list.findIndex(item => {
        return !this.stock ? item.url === this.selected.url : this.checkSelected(item)
      })

      this.index = index
    },

    prev () {
      if (this.index === 0) {
        return
      }

      this.toggleShowVideo()

      this.index--
    },

    next () {
      if (this.index === this.list.length - 1) {
        return
      }

      this.toggleShowVideo()

      this.index++
    },

    toggleShowVideo () {
      this.isShowVideo = false

      setTimeout(() => {
        this.isShowVideo = true
      }, 500)
    },

    checkWidthByKey (key) {
      if (key === 'regular') {
        return '1080px'
      } else if (key === 'small') {
        return '400px'
      } else {
        return '200px'
      }
    },

    checkSelected (item) {
      const selectedArr = this.selected !== '' ? this.selected.urls.thumb.split('?') : ['']
      const itemArr = item.urls.thumb.split('?')

      if (selectedArr[0] === itemArr[0]) {
        return true
      }

      return false
    }
  }
}
</script>

<style lang="sass" scoped>
.b-images-library-preview
  position: absolute
  top: 0
  right: 0
  bottom: 0
  left: 0
  z-index: 10

  background-color: #fff
  border-radius: 1rem
  &__prev,
  &__next
    width: 3.2rem
    height: 3.2rem

    position: absolute
    top: 50%
    z-index: 1
    margin-top: -.8rem

    display: flex
    justify-content: center
    align-items: center

    background-color: rgba(#ffffff, 0.2)
    border-radius: 100%

    cursor: pointer
    &:hover
      background-color: rgba(#ffffff, 0.6)
  &__prev
    left: 2rem
  &__next
    right: 2rem
  &__image
    position: absolute
    top: 6rem
    right: 0
    bottom: 7rem
    left: 0

    display: flex
    align-items: center
    justify-content: center

    background-color: rgba(0, 0, 0, 0.18)
    background-repeat: no-repeat
    background-position: center
    background-size: contain

    & > video
      width: 100%
      height: 100%

      position: relative
      z-index: 0
  &__controls
    position: absolute
    right: 0
    bottom: 0
    left: 0
    z-index: 1

    height: 7rem

    display: flex
    justify-content: center
    align-items: center
    & .control
      opacity: .8
      cursor: pointer
      &_column
          opacity: .8
          font-size: 1.2rem
          color: #00ADB6
          & svg
            opacity: .5
            margin-left: .3rem
          &:hover
            svg
              opacity: 1
      &:hover
        opacity: 1
  &__close
    position: absolute
    top: 1.7rem
    right: 1.7rem
    z-index: 1

    cursor: pointer

    width: 3.6rem
    height: 3.6rem

    display: flex
    justify-content: center
    align-items: center

    border-radius: 100%
    transition: background .3s cubic-bezier(.2,.85,.4,1.275)
    & svg
      transition: fill .3s cubic-bezier(.2,.85,.4,1.275)
    &:hover
      cursor: pointer
      background: rgba(#000000, 0.05)
    &:active
      cursor: pointer
      background: rgba(#00ADB6, 0.05)
      & svg
        fill: $main-green

.b-controls
  display: flex

  & .control
    width: 100%
    display: flex
    justify-content: space-between
    margin: .4rem
</style>
