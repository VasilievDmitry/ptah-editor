import * as types from './types'
import { isObject } from './util'
import * as _ from 'lodash-es'

const DEFAULT_OPTIONS = {
  text: '',
  classes: [],
  styles: {},
  resizable: false,
  hasLink: false,
  link: {
    href: '#',
    target: '_blank',
    behavior: 'auto',
    action: ''
  },
  removable: false,
  aligned: false,
  typography: false,
  colorize: false,
  box: false, // (align text or align flex justify-content)
  canCopy: false,
  background: false,
  shape: false, // border-radius prop
  pseudo: false, // can have a pseudo-class
  isHoverAnim: false, // hover anim for button/link
  isTextEdit: false, // edit text in settings panel
  isComplex: false, // TODO: deprecated
  video: false,

  // --- Background type
  // --- variants: 'default' (default css background), 'video' (video background)
  backgroundType: 'default',

  // --- background video
  backgroundVideo: null,

  absorb: 0
}

/**
 * Deprecated types:
 * Logo, Avatar, Quote, Number, ClassList, Title
 * @type {Map}
 */
const data = new Map([
  [types.Title, () => (_.merge({}, DEFAULT_OPTIONS, {
    text: 'Title',
    aligned: true,
    removable: true,
    typography: true,
    styles: {
      'font-family': 'Lato',
      'font-size': '3.2rem',
      'font-weight': 'normal',
      'font-style': 'normal',
      'text-decoration': 'none',
      'text-align': 'center',
      'color': '#000',
      'justify-content': 'center'
    }
  }))],
  [types.Text, () => (_.merge({}, DEFAULT_OPTIONS, {
    text: 'Enter your text',
    removable: true,
    aligned: true,
    typography: true,
    styles: {
      'font-family': 'Lato',
      'font-size': '1.6rem',
      'font-weight': 'normal',
      'font-style': 'normal',
      'text-decoration': 'none',
      'text-align': 'center',
      'color': '#000',
      'justify-content': 'center'
    },
    isComplex: true
  }))],
  [types.Image, () => (_.merge({}, DEFAULT_OPTIONS, {
    resizable: true,
    removable: true,
    alt: 'Default image',
    src: 'https://gn788.cdn.stg.gamenet.ru/0/7vmhx/o_1Y5SfI.png',
    hasLink: true,
    link: {
      href: '',
      target: '_blank'
    },
    background: true,
    styles: {
      'background-image': 'url(https://gn788.cdn.stg.gamenet.ru/0/7vmhx/o_1Y5SfI.png)',
      'background-position': 'center center',
      'background-repeat': 'no-repeat',
      'background-size': 'contain',
      'background-color': 'rgba(0, 0, 0, 0)',
      'width': '256px',
      'height': '160'
    }
  }))],
  [types.Logo, () => (_.merge({}, DEFAULT_OPTIONS, {
    resizable: true,
    removable: true,
    alt: 'Default logo',
    src: 'https://gn451.cdn.gamenet.ru/TY0Xv2riHu/772cm/o_s1Xtu.png',
    hasLink: true,
    link: {
      href: '',
      target: '_blank'
    },
    background: true,
    styles: {
      'background-image': 'url(https://gn451.cdn.gamenet.ru/TY0Xv2riHu/772cm/o_s1Xtu.png)',
      'background-position': 'center center',
      'background-repeat': 'no-repeat',
      'background-size': 'cover',
      'background-color': 'rgba(0, 0, 0, 0)',
      'width': '96px',
      'height': '96px'
    }
  }))],
  [types.Link, () => (_.merge({}, DEFAULT_OPTIONS, {
    canCopy: true,
    removable: true,
    typography: true,
    isTextEdit: true,
    text: 'Click Me!',
    hasLink: true,
    link: {
      href: '',
      target: '_blank'
    },
    styles: {
      'font-family': 'Lato',
      'font-size': '1.4rem',
      'font-weight': 'normal',
      'font-style': 'normal',
      'text-decoration': 'none',
      'text-align': 'center',
      'color': '#000',
      'background-image': '',
      'background-position': 'center center',
      'background-repeat': 'no-repeat',
      'background-size': 'cover',
      'background-color': ''
    },
    pseudo: {
      hover: {
        'background-color': '',
        'background-image': '',
        'background-position': 'center center',
        'background-repeat': 'no-repeat',
        'background-size': 'cover',
        'color': ''
      }
    },
    isHoverAnim: true,
    animation: {
      value: ''
    }
  })
  )],
  [types.StyleObject, () => (_.merge({}, DEFAULT_OPTIONS,
    {
      resizable: true,
      removable: true,
      background: true,
      absorb: 0,
      styles: {
        'background-image': '',
        'background-position': 'center center',
        'background-repeat': 'no-repeat',
        'background-size': 'cover',
        'background-color': 'rgba(0,0,0,0)',
        'background-attachment': 'scroll',
        'width': '',
        'height': ''
      }
    })
  )],
  [types.Button, () => (_.merge({}, DEFAULT_OPTIONS,
    {
      canCopy: true,
      hasLink: true,
      aligned: false,
      typography: true,
      background: true,
      isTextEdit: true,
      shape: true,
      pseudo: {
        hover: {
          'background-color': '',
          'background-image': '',
          'background-position': 'center center',
          'background-repeat': 'no-repeat',
          'background-size': 'cover',
          'color': ''
        }
      },
      text: 'Click Me!',
      isHoverAnim: true,
      animation: {
        value: ''
      },
      link: {
        href: '',
        target: '_blank'
      },
      removable: true,
      styles: {
        'background-image': '',
        'background-position': 'center center',
        'background-repeat': 'no-repeat',
        'background-size': 'cover',
        'background-color': '',
        'color': '#000',
        'border-color': '',
        'font-size': '1.6rem',
        'border-radius': 0,
        'font-weight': 'normal',
        'font-style': 'normal',
        'font-family': 'Lato',
        'text-decoration': 'none',
        'justify-content': 'center',
        'text-align': 'center',
        'width': '',
        'height': ''
      },
      isComplex: true
    })
  )],
  [types.Label, () => (_.merge({}, DEFAULT_OPTIONS,
    {
      resizable: true,
      typography: true,
      background: true,
      aligned: true,
      shape: true,
      text: 'Label',
      link: {
        href: '',
        target: '_blank'
      },
      styles: {
        'background-image': '',
        'background-position': 'center center',
        'background-repeat': 'no-repeat',
        'background-size': 'cover',
        'background-color': '',
        'color': '#000',
        'border-color': '',
        'font-size': '1.2rem',
        'border-radius': 0,
        'font-weight': 'normal',
        'font-style': 'normal',
        'font-family': 'Lato',
        'text-decoration': 'none',
        'justify-content': 'center',
        'width': '',
        'height': ''
      }
    })
  )],
  [types.Icon, () => (_.merge({}, DEFAULT_OPTIONS,
    {
      text: '',
      styles: {
        'background-image': '',
        'background-position': 'center center',
        'background-repeat': 'no-repeat',
        'background-size': 'cover',
        'background-color': 'rgba(0, 0, 0, 0)',
        'border-radius': '0',
        'width': '',
        'height': ''
      }
    })
  )],
  [types.IconWithText, () => (_.merge({}, DEFAULT_OPTIONS,
    {
      aligned: true,
      removable: true,
      styles: {
        'text-align': 'left',
        'font-family': 'inherit',
        'font-size': 'inherit',
        'font-weight': 'inherit',
        'font-style': 'inherit'
      },
      isIconWithText: true,
      colorFill: {
        color:  '#fff'
      },
      sizeIcons: {
        width: 14
      },
      icon: {
        value: 'checkMark',
        name: 'checkMark',
        text: 'Default icon text',
        visible: true
      },
      isComplex: true
    })
  )],
  [types.GalleryItem, () => (_.merge({}, DEFAULT_OPTIONS, {
    removable: true,
    resizable: false,
    alt: 'Default image',
    url: 'https://gn548.cdn.gamenet.ru/TY0Xv2riHu/772oj/o_OnTml.png',
    background: true,
    styles: {
      'background-image': 'url(https://gn652.cdn.gamenet.ru/TY0Xv2riHu/772iV/o_cDot3.png)',
      'background-position': 'center center',
      'background-repeat': 'no-repeat',
      'background-size': 'contain',
      'background-color': '#fff',
      'width': '',
      'height': ''
    }
  }))],
  [types.Delimiter, () => (_.merge({}, DEFAULT_OPTIONS,
    {
      resizable: true,
      removable: true,
      styles: {
        'width': '',
        'height': ''
      }
    })
  )],
  [types.VideoElement, () => (_.merge({}, DEFAULT_OPTIONS,
    {
      background: false,
      hasVideo: true,
      removable: true,
      resizable: true,
      shape: false,
      videoUrl: 'https://www.youtube.com/watch?v=Xv1JzYDKoc8',
      loop: false,
      styles: {
        'background-color': '#fff',
        'width': '',
        'height': ''
      },
      isComplex: true
    })
  )],
  [types.Form, () => (_.merge({}, DEFAULT_OPTIONS,
    {
      resizable: false,
      removable: true,
      form: true,
      isComplex: true,
      placeholder: 'Placeholder',
      buttonText: 'Submit'
    })
  )],
  /* === Custom sections === */
  [types.ProductSection, () => (_.merge({}, DEFAULT_OPTIONS,
    {
      box: true,
      resizable: true,
      removable: true,
      background: true,
      hasProducts: true,
      products: {
        'Standart': { visible: true },
        'Full': { visible: true },
        'Deluxe': { visible: false },
        'Ultimate': { visible: false }
      },
      selectProduct: {
        name: 'Standart'
      },
      typography: true,
      styles: {
        'background-image': '',
        'background-position': 'center center',
        'background-repeat': 'no-repeat',
        'background-size': 'cover',
        'background-color': '',
        'font-family': 'Lato',
        'font-size':  1.6,
        'font-weight': false,
        'font-style': false,
        'text-decoration': false,
        'text-align': false,
        'color': '#fff'
      }
    })
  )],
  [types.GallerySlider, () => (_.merge({}, DEFAULT_OPTIONS,
    {
      resizable: true,
      removable: true,
      background: true,
      hasMultipleImages: true,
      hasHeader: true,
      galleryImages: [],
      header: 'This is a short header',
      // --- swiper options
      swiper: {
        delay: 2000
      }
    })
  )],
  [types.AvailablePlatforms, () => (_.merge({}, DEFAULT_OPTIONS,
    {
      removable: true,
      background: true,
      styles: {
        'background-image': '',
        'background-position': 'center center',
        'background-repeat': 'no-repeat',
        'background-size': 'cover',
        'background-color': ''
      },
      hasPlatforms: true,
      availablePlatforms: {
        'windows': {
          name: 'Windows',
          visible: true
        },
        'apple': {
          name: 'Apple',
          visible: true
        },
        'linuxfull': {
          name: 'Linux',
          visible: true
        },
        'steam': {
          name: 'Steam',
          visible: true
        },
        'gog': {
          name: 'GOG Galaxy',
          visible: true
        }
      },
      colorFill: {
        color:  '#fff'
      },
      sizeIcons: {
        width: 24
      },
      isComplex: true
    })
  )],
  [types.AgeRestrictions, () => (_.merge({}, DEFAULT_OPTIONS,
    {
      removable: true,
      background: true,
      styles: {
        'background-image': '',
        'background-position': 'center center',
        'background-repeat': 'no-repeat',
        'background-size': 'cover',
        'background-color': ''
      },
      hasRestrictions: true,
      ageRestrictions: {
        'age': {
          name: 'Age',
          visible: true,
          selected: { name: '0+', img: 'https://gn215.cdn.stg.gamenet.ru/0/759Ga/o_20S5qo.svg' },
          options: [
            { name: '0+', img: 'https://gn215.cdn.stg.gamenet.ru/0/759Ga/o_20S5qo.svg' },
            { name: '6+', img: 'https://gn215.cdn.stg.gamenet.ru/0/759H0/o_1KX2IR.svg' },
            { name: '12+', img: 'https://gn695.cdn.stg.gamenet.ru/0/759HF/o_DNNg8.svg' },
            { name: '18+', img: 'https://gn24.cdn.stg.gamenet.ru/0/759HU/o_1AgXj1.svg' },
            { name: '21+', img: 'https://gn822.cdn.stg.gamenet.ru/0/759Hf/o_299afp.svg' }
          ]
        },
        'pegi': {
          name: 'Pegi',
          visible: false,
          selected: { name: '3', img: 'https://gn875.cdn.stg.gamenet.ru/0/759I0/o_13iwpA.svg' },
          options: [
            { name: '3', img: 'https://gn875.cdn.stg.gamenet.ru/0/759I0/o_13iwpA.svg' },
            { name: '7', img: 'https://gn414.cdn.stg.gamenet.ru/0/759ID/o_vuop.svg' },
            { name: '12', img: 'https://gn793.cdn.stg.gamenet.ru/0/759IR/o_1S1h6M.svg' },
            { name: '16', img: 'https://gn800.cdn.stg.gamenet.ru/0/759Il/o_ANYUX.svg' },
            { name: '18', img: 'https://gn653.cdn.stg.gamenet.ru/0/759Ix/o_Xqb9n.svg' }
          ]
        },
        'usk': {
          name: 'USK',
          visible: false,
          selected: { name: '0', img: 'https://gn191.cdn.stg.gamenet.ru/0/759JH/o_1g38pS.svg' },
          options: [
            { name: '0', img: 'https://gn191.cdn.stg.gamenet.ru/0/759JH/o_1g38pS.svg' },
            { name: '6', img: 'https://gn182.cdn.stg.gamenet.ru/0/759JS/o_25hRrV.svg' },
            { name: '12', img: 'https://gn972.cdn.stg.gamenet.ru/0/759Jf/o_amDyU.svg' },
            { name: '16', img: 'https://gn972.cdn.stg.gamenet.ru/0/759Jf/o_amDyU.svg' },
            { name: '18', img: 'https://gn320.cdn.stg.gamenet.ru/0/759K2/o_x4V42.svg' }
          ]
        },
        'cero': {
          name: 'CERO',
          visible: false,
          selected: { name: 'All ages', img: 'https://gn773.cdn.stg.gamenet.ru/0/759KN/o_sazoN.svg' },
          options: [
            { name: 'All ages', img: 'https://gn773.cdn.stg.gamenet.ru/0/759KN/o_sazoN.svg' },
            { name: 'Ages 12 and up only', img: 'https://gn925.cdn.stg.gamenet.ru/0/759LL/o_zwWo0.svg' },
            { name: 'Ages 15 and up only', img: 'https://gn572.cdn.stg.gamenet.ru/0/759LZ/o_qfcL4.svg' },
            { name: 'Ages 17 and up only', img: 'https://gn959.cdn.stg.gamenet.ru/0/759Lq/o_FHJmm.svg' },
            { name: 'Ages 18 and up only', img: 'https://gn640.cdn.stg.gamenet.ru/0/759MA/o_4FtnT.svg' },
            { name: 'Education/Database', img: 'https://gn119.cdn.stg.gamenet.ru/0/759MN/o_18ADS5.svg' },
            { name: 'Rating pending', img: 'https://gn801.cdn.stg.gamenet.ru/0/759MZ/o_1b7UOI.svg' }
          ]
        }
      },
      sizeIcons: {
        width: 48
      },
      isComplex: true
    })
  )],
  [types.SocialNetworks, () => (_.merge({}, DEFAULT_OPTIONS,
    {
      removable: true,
      settings: {
        target : '_blank'
      },
      background: true,
      styles: {
        'background-image': '',
        'background-position': 'center center',
        'background-repeat': 'no-repeat',
        'background-size': 'cover',
        'background-color': ''
      },
      hasNetworks: true,
      socialNetworks: {
        'facebook': {
          name: 'Facebook',
          expand: false,
          visible: true,
          url: ''
        },
        'instagram': {
          name: 'Instagram',
          expand: false,
          visible: false,
          url: ''
        },
        'vk': {
          name: 'Vk',
          expand: false,
          visible: true,
          url: ''
        },
        'twitter': {
          name: 'Twitter',
          expand: false,
          visible: true,
          url: ''
        },
        'youtube': {
          name: 'Youtube',
          expand: false,
          visible: true,
          url: ''
        },
        'discord': {
          name: 'Discord',
          expand: false,
          visible: true,
          url: ''
        },
        'kickstarter': {
          name: 'Kickstarter',
          expand: false,
          visible: false,
          url: ''
        },
        'wechat': {
          name: 'Wechat',
          expand: false,
          visible: false,
          url: ''
        }
      },
      colorFill: {
        color:  '#fff'
      },
      sizeIcons: {
        width: 24
      },
      isComplex: true
    })
  )],
  [types.Slogan, () => (_.merge({}, DEFAULT_OPTIONS,
    {
      resizable: true,
      removable: true,
      background: true,
      text: 'Enter game slogan',
      aligned: true,
      typography: true,
      styles: {
        'font-family': 'Lato',
        'font-size':  '4.8rem',
        'font-weight': 'normal',
        'font-style': 'normal',
        'text-decoration': 'none',
        'text-align': 'center',
        'color': '#fff',
        'background-image': 'url(https://gn793.cdn.stg.gamenet.ru/0/79yeF/o_1PRuEc.png)',
        'background-position': 'center center',
        'background-repeat': 'no-repeat',
        'background-size': 'contain',
        'background-color': 'rgba(0, 0, 0, 0)',
        'justify-content': 'center',
        'width': 320,
        'height': 64,
        'border-radius': 0
      }
    })
  )],
  [types.SystemRequirements, () => (_.merge({}, DEFAULT_OPTIONS,
    {
      name: 'System Requirements',
      removable: true,
      background: true,
      hasSystemRequirements: true,
      systemRequirements: {
        'windows': {
          visible: true,
          hideTextTitle: false
        },
        'apple': {
          visible: true,
          hideTextTitle: false
        },
        'linux': {
          visible: false,
          hideTextTitle: false
        }
      },
      rowsRequirements: {
        'OS': { visible: true },
        'Processor': { visible: true },
        'Memory': { visible: true },
        'Graphics': { visible: true },
        'Direct X': { visible: true },
        'Storage': { visible: true },
        'Sound Card': { visible: false }
      },
      selectPlatform: {
        name: 'apple'
      },
      colorFill: {
        color:  '#fff'
      },
      sizeIcons: {
        width: 24
      },
      typography: false,
      styles: {
        'background-image': '',
        'background-position': 'center center',
        'background-repeat': 'no-repeat',
        'background-size': 'cover',
        'background-color':'',
        'font-family': 'Lato',
        'font-size':  '1.6rem',
        'font-weight': 'normal',
        'font-style': 'normal',
        'text-decoration': 'none',
        'text-align': 'center',
        'color': '#fff'
      }
    })
  )],
  [types.TextInherit, () => (_.merge({}, DEFAULT_OPTIONS, {
    text: 'Enter your text'
  }))],
  [types.Timer, () => (_.merge({}, DEFAULT_OPTIONS, {
    isComplex: true,
    timer: {
      // --- timer timestamp
      timestamp: null,
      // --- current UTC offset
      UTC: new Date().getTimezoneOffset() / 60 * (-1),
      // --- labels options
      labels: {
        // --- show labels
        show: true,
        // --- labels translation
        language: 'en',
        // --- labels position
        position: 'top'
      }
    }
  }))]
])

export default class Seeder {
  // Seeds values using a schema.
  static seed(schema) {
    if (isObject(schema)) {
      return Object.keys(schema).reduce((values, key) => {
        values[key] = Seeder.seed(schema[key])
        return values
      }, {})
    } else if (Array.isArray(schema)) {
      return schema.map(s => {
        return Seeder.seed(s)
      })
    }

    let value = data.get(schema)

    if (value === undefined) {
      value = schema
    }
    return typeof value === 'function' ? value() : value
  }
};
