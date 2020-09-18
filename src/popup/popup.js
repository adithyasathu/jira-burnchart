import Vue from 'vue';
import App from './App';

import {
  MdButton,
  MdDialog,
  MdContent,
  MdCheckbox,
  MdIcon,
  MdToolbar,
  MdTable,
  MdSnackbar,
  MdField,
  MdSwitch,
  MdMenu,
  MdList,
} from 'vue-material/dist/components';

Vue.use(MdField);
Vue.use(MdMenu);
Vue.use(MdList);
Vue.use(MdButton);
Vue.use(MdCheckbox);
Vue.use(MdIcon);
Vue.use(MdToolbar);
Vue.use(MdTable);
Vue.use(MdSnackbar);
Vue.use(MdSwitch);
Vue.use(MdContent);
Vue.use(MdDialog);

global.browser = require('webextension-polyfill');
Vue.prototype.$browser = global.browser;

/* eslint-disable no-new */
let popup = new Vue({
  el: '#app',

  render: h => h(App)
});
