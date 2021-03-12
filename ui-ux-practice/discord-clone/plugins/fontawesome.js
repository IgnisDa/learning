import Vue from 'vue'
import { library, config } from '@fortawesome/fontawesome-svg-core'
import { FontAwesomeIcon } from '@fortawesome/vue-fontawesome'
import {
  faDownload,
  faFolder,
  faPlus,
  faCompass,
  faHeadphones,
  faCog,
  faMicrophone,
  faUserFriends,
  faHashtag,
  faThumbtack,
  faBell,
  faUsers,
  faInbox,
  faSearch,
  faQuestion,
  faGift,
  faImage,
  faSadCry,
} from '@fortawesome/free-solid-svg-icons'
import { faDiscord, faAlgolia } from '@fortawesome/free-brands-svg-icons'

// This is important, we are going to let Nuxt.js worry about the CSS
config.autoAddCss = false

// You can add your icons directly in this plugin. See other examples for how you
// can add other styles or just individual icons.
library.add(
  faDownload,
  faFolder,
  faPlus,
  faCompass,
  faHeadphones,
  faCog,
  faMicrophone,
  faUserFriends,
  faDiscord,
  faHashtag,
  faThumbtack,
  faBell,
  faUsers,
  faInbox,
  faQuestion,
  faSearch,
  faGift,
  faImage,
  faSadCry,
  faAlgolia
)

// Register the component globally
Vue.component('FontAwesomeIcon', FontAwesomeIcon)
