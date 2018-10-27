import Vue from 'vue';
import Vuex from 'vuex';

Vue.use(Vuex);

export default new Vuex.Store({
  state: {
    modePage: '',

    userData: {
      headerEmail: 'Anonim@mail.ru',
      Name: 'Anonim',
      LoginSuccess: false,
      UidUser: false,
      CountCards: 0,
      Avatar: 'https://www.appointbetterboards.co.nz/Custom/Appoint/img/avatar-large.png'
    },

    animated: {
      run: true,
      textBanner: '321'
    },

    categoryCards: ['Обычная']

  },
  mutations: {
    setModePage(state, strValue) {
      state.modePage = strValue;
    },
    setUserData(state, objDataUser) {
      state.userData = objDataUser;
    },
    setAvatar(state, fileAvatar) {
      state.userData.Avatar = fileAvatar;
    },
    updateCountCards(state, intCountCards) {
      state.userData.CountCards = intCountCards;
    }
  }
});
