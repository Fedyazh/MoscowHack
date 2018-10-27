<template>
  <main>
    <div class="container">
      <div class="main__section section_center">
        <div class="section__main-auth animated rollIn">
          <h2 class="main-auth__title text-effect-shadow">{{ $store.state.modePage === 'Sign' ? 'Sign to memca' : 'Join to memca' }}</h2>
          <form class="main-auth__form" @submit.prevent="authorization">
            <label for="login">Name</label>
            <input type="text" class="margin-bot-md" v-model="userData.login" id="login" required autofocus>
            <label for="password">Password</label>
            <input type="password" class="margin-bot-md" id="password" v-model="userData.pass" required>

            <div class="alert alert-danger margin-bot-lg" role="alert" v-if="errorsAuth">
              {{ messageError }}
            </div>
            <button type="submit" class="btn form__btn-submit margin-top-md">{{ $store.state.modePage === 'Sign' ? 'Войти на сайт' : 'Зарегистрироваться' }}</button>
          </form>
          <div class="main-auth__footer margin-bot-lg">
            <span>{{ $store.state.modePage === 'Sign' ? 'New here?': 'Registered on memca?'}}</span>
            <a href="#" @click.prevent="getAnotherPage">{{ $store.state.modePage === 'Sign' ? 'Create a account': 'Sign in account.' }}</a>
          </div>
        </div>
      </div>
    </div>
  </main>
</template>

<script>
  import * as firebase  from 'firebase';

  export default {
    data () {
      return {
        modePage: '',
        errorsAuth: false,
        messageError: '',

        userData: {
          login: '',
          pass: ''
        }

      }
    },
    created() {
      this.recallLoginData();
      this.setModePage();
    },
    watch: {
      '$route': 'setModePage'
    },
    methods: {
      setModePage() {
        this.modePage = this.$route.params.modePage;
        this.$store.commit('setModePage', this.$route.params.modePage);
      },

      startAnim() {
        document.querySelector('.section__main-auth').classList.add('animated', 'rollIn');
        setTimeout(() => {
          document.querySelector('.section__main-auth').classList.remove('animated', 'rollIn');
        }, 1000)
      },

      getAnotherPage () {
       let path;
       if (this.modePage === 'Sign') {
         path = {name: 'Auth', params: {'modePage': 'Registration'}}
       } else {
         path = {name: 'Auth', params: {'modePage': 'Sign'}}
       }
        this.$router.push(path);
      },

      authorization() {
        if (this.modePage === 'Registration') {
          console.log('auth');
          firebase.auth().createUserWithEmailAndPassword(this.userData.login + '@mail.ru', this.userData.pass)
            .then((response) => {
              let path = {name: 'Auth', params: {'modePage': 'Sign'}};
              this.$router.push(path);

              let settUser = {
                Avatar: 'https://www.appointbetterboards.co.nz/Custom/Appoint/img/avatar-large.png',
                Name: response.email.replace('@mail.ru', ''),
                CountCards: 0
              };

              firebase.database().ref(response.uid + '/' + 'SettingsUser').set(settUser);

              this.errorsAuth = false;
              this.messageError = '';
            })
            .catch((error) => {
              this.errorsAuth = true;
              this.messageError = error.message;
            });
        } else if (this.modePage === 'Sign') {
          this.signIn();
        }
      },

      signIn() {
        const _this = this;
        firebase.auth().signInWithEmailAndPassword(this.userData.login + '@mail.ru', this.userData.pass)
          .then((response) => {
            let newUserData = {
              HeaderEmail: response.email,
              UidUser: response.uid,
              LoginSuccess: true,
            };

            this.saveDataAuthUser(this.userData.login, this.userData.pass);

            firebase.database().ref(`/${response.uid}/SettingsUser`).once('value').then((snapshot) => {
              getAboutUser(snapshot.val());

              function getAboutUser(user) {
                newUserData.Name = user.Name;
                newUserData.Avatar = user.Avatar;
                newUserData.CountCards = user.CountCards;

                _this.$store.commit('setUserData', newUserData);
                _this.$router.push({name: 'Content'});
                localStorage.setItem('USERDATA', JSON.stringify(newUserData));
              }
            });

          })
          .catch((error) => {
            this.errorsAuth = true;
            this.messageError = error.message;
          })
      },

      saveDataAuthUser(login, pass) {
        localStorage.setItem('login', login);
        localStorage.setItem('pass', pass);
      },

      recallLoginData() {
        if (localStorage.login && localStorage.pass) {
          this.userData.login = localStorage.getItem('login');
          this.userData.pass = localStorage.getItem('pass');
          this.restoreDataLogin = true;
        }
      }
    }
  }
</script>


<style scoped>

  input {
    box-shadow: 1px 3px 19px -12px #000000;
  }


  .text-effect-shadow {
    color: transparent;
    text-shadow: rgba(255, 255, 255, 0.5) 0 3px 3px;
    background-color: #666666;

    -webkit-background-clip: text;
  }

  .margin-bot-md {
    margin-bottom: 20px;
  }

  .margin-bot-lg {
    margin-bottom: 30px;
  }

  .margin-top-md {
    margin-top: 20px;
  }


  main {
    display: grid;
    grid-template-columns: 1fr;
    grid-template-rows: 1fr;

    -moz-border-radius-bottomleft: 5px;
    -moz-border-radius-bottomright: 5px;
    background: #2b3237;
  }

  .container {
    margin: auto;
  }

  .section_center {
    position: relative;

    display: -webkit-box;
    display: -ms-flexbox;
    display: flex;
    flex-flow: row;
    justify-content: center;

    -webkit-box-orient: horizontal;
    -webkit-box-direction: normal;
    -ms-flex-flow: row;
    -webkit-box-pack: center;
    -ms-flex-pack: center;
  }

  .section__main-auth {
    width: 40%;
  }

  .main-auth__form {
    position: relative;

    padding: 20px;
    margin: 15px 0;
    font-size: 1.7rem;

    border: 1px solid #d8dee2;
    border-radius: 5px;
    background: #fafbfc;
    box-shadow: 1px 3px 19px -8px #000000;
  }

  .main-auth__title {
    font-size: 3.2rem;
    color: darksalmon;
    text-align: center;
  }

  .main-auth__form input {
    min-height: 34px;
    line-height: 34px;

    padding: 6px 8px;
    border: 1px solid #d1d5da;
    border-radius: 3px;
  }

  .main-auth__form label {
    margin-bottom: 3px;
  }

  .main-auth__form label, .main-auth__form input {
    display: block;
    width: 100%;
  }

  .main-auth__form .secondary-controls {
    display: -webkit-box;
    display: -ms-flexbox;
    display: flex;
    justify-content: flex-start;

    -webkit-box-pack: start;
    -ms-flex-pack: start;
    -webkit-box-align: center;
    -ms-flex-align: center;

    align-items: center;
  }

  .main-auth__footer {
    display: -webkit-box;
    display: -ms-flexbox;
    display: flex;
    justify-content: space-around;

    width: 100%;
    padding: 13px 15px;
    font-size: 1.5rem;

    border: 1px solid #d8dee2;
    border-radius: 5px;
    background: #f9f9f9;
  }

  .form__btn-submit {
    position: relative;

    width: 100%;
    margin-left: auto;
    min-height: 35px;
    font-size: 1.5rem;

    border-radius: 3px;
    border: 0;
    color: white;
    cursor: pointer;
    overflow: hidden;
    background: #26a69b;
    box-shadow: 2px 2px 4px rgba(0, 0, 0, .4);
  }

  .form__btn-submit:after {
    content: '';
    position: absolute;
    top: 50%;
    left: 50%;
    width: 5px;
    height: 5px;
    background: rgba(255, 255, 255, .5);
    opacity: 0;
    border-radius: 100%;
    transform: scale(1, 1) translate(-50%);
    transform-origin: 50% 50%;
  }

  .form__btn-submit:hover {
    background: #2bbbae;
  }

  .form__btn-submit:focus:not(:active)::after {
    animation: ripple 0.8s ease-out;
  }


</style>
