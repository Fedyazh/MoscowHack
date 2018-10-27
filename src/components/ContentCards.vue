<template>
  <div class="wrap">
    <div class="banner-auth animated hidden">
      <div class="banner-auth__content">
        <i class="fa fa-bell" aria-hidden="true"></i>
        <span class="banner-text">
        {{ bannerAuthText }}
      </span>
      </div>
    </div>

    <form class="form-create-card" @submit.prevent="addCard">

      <div class="create-card__inputs">

        <div class="form-group box-inp-question">
          <input type="text" class="form-control" v-model="QuestionCard"  required placeholder="Вопрос карточки">
        </div>

        <div class="form-group box-inp-answer">
          <input type="text" class="form-control" v-model="AnswerCard" required placeholder="Ответ карточки">
        </div>

        <div class="form-group box-inp-tag">
          <input type="text" class="form-control" v-model="categoryCard" placeholder="Категория (если нужна) например: математика ">
        </div>


      </div>

      <button type="submit" class="btn btn-outline-warning btn-lg btn-create-card"> Создать карточку </button>
    </form>

    <div class="main-content">
      <hr class="mb-5">

      <div class="banner-main-content__content" v-if="!$store.state.userData.LoginSuccess">
        <span class="text-secondary"> Для получение карточек,вам нужно авторизоваться </span>
      </div>

      <div class="main-content__cards">

        <div class="card text-white bg-dark mb-4 animated flipInX" v-for="card in listCards">
          <div class="card-header">
            <span>Карточка</span>
            <button type="button" class="btn btn-outline-warning btn-delete-card" @click="deleteCard($event, card.timeStamp)">Удалить карту</button>
          </div>
          <div class="card-body">
            <h5 class="card-question"> {{ card.QuestionCard }}</h5>
            <p class="card-answer hidden mt-5"> <mark> {{ card.AnswerCard }} </mark></p>
            <button type="button" class="btn btn-outline-success mt-4 btn-show-answer" @click="toggleAnswer"> Скрыть / Показать ответ</button>
          </div>
        </div>

      </div>


    </div>
  </div>
</template>

<script>
  import WOW from 'wow.js';
  import * as firebase from 'firebase'

  export default {
    data() {
      return {
        listCards: [],
        categoryCards: ['Обычная'],
        bannerAuthText: 'Сперва нужно авторизоваться',

        QuestionCard: '',
        AnswerCard: '',
        categoryCard: ''
      }
    },

    created() {
      new WOW().init();
      this.getContent();
    },

    watch: {
      '$store.state.userData.LoginSuccess': function () {
        if (!this.$store.state.userData.LoginSuccess) {
          this.listCards = []
        }
      }
    },

    methods: {
      toggleAnswer(e) {
        e.target.previousElementSibling.classList.toggle('hidden');
      },

      addCard (e) {
        if (this.$store.state.userData.UidUser) {
          const timeStamp = new Date().getTime();
          const categoryCard = this.categoryCard || 'обычная';
          const card = {
            QuestionCard: this.QuestionCard,
            AnswerCard: this.AnswerCard,
            timeStamp,
            categoryCard
          };
          this.listCards.push(card);

          const UidUser = this.$store.state.userData.UidUser;
          const countCards = parseInt(this.$store.state.userData.CountCards) + 1;
          firebase.database().ref(`${UidUser}/Content/${timeStamp}`).set(card)
            .then(() => {
              firebase.database().ref().child(`/${this.$store.state.userData.UidUser}/SettingsUser`)
                .update({ CountCards: countCards})
                .then(() => {
                  this.$store.commit('updateCountCards', countCards);
                });
            });

          this.QuestionCard = '';
          this.AnswerCard = '';
          this.categoryCard = '';
        } else {
          this.runAnimAuth();
        }
      },

      deleteCard (e, timeStamp) {
        if (this.$store.state.userData.UidUser) {
          const countCards = parseInt(this.$store.state.userData.CountCards) - 1;

          firebase.database().ref(`${this.$store.state.userData.UidUser}/Content/${timeStamp}`).remove()
            .then(() => {
              firebase.database().ref().child(`/${this.$store.state.userData.UidUser}/SettingsUser`)
                .update({ CountCards: countCards})
                .then(() => {
                  this.$store.commit('updateCountCards', countCards);
                });
              e.target.parentNode.parentNode.remove();
            });
        }
      },

      getContent() {
        if (this.$store.state.userData.UidUser) {
        this.listCards = [];
        let UidUser = this.$store.state.userData.UidUser;

          firebase.database().ref(`/${UidUser}/Content/`).once('value').then((snapshot) => {
            getNotes(snapshot.val())
          });
          const _this = this;

          function getNotes(card) {
            for (let key in card) {
              _this.listCards.push({
                QuestionCard: card[key].QuestionCard,
                AnswerCard: card[key].AnswerCard,
                timeStamp: card[key].timeStamp,
              });
              // ne dodelal
              if (_this.categoryCards.indexOf(card[key].categoryCard === -1)) {
                _this.categoryCards.push(card[key].categoryCard);
              }
            }
          }

          console.log(_this.categoryCards);
        }
      },

      runAnimAuth() {
        document.querySelector('.banner-auth').classList.remove('hidden');
        document.querySelector('.banner-auth').classList.add('flipInX');
        setTimeout(() => {
          document.querySelector('.banner-auth').classList.add('flipOutX');
          setTimeout(() => {
            document.querySelector('.banner-auth').classList.remove('flipOutX');
            document.querySelector('.banner-auth').classList.remove('flipInX');
            document.querySelector('.banner-auth').classList.add('hidden');
          }, 1000);
        }, 2500)
      },

    }
  }
</script>


<style scoped>

  input {
    font-size: 1.6rem;
    box-shadow: 1px 3px 19px -12px #000000;
  }

  .wrap {

  }

  .banner-auth {
    display: flex;
    position: absolute;
    justify-content: center;
    align-items: center;

    width: 100%;
    height: 8%;
    top: 0;
    right: 0;
    margin: 0;
    padding: 0;

    font-size: 2.3rem;
    z-index: 1;
    color: black;
    background: rgba(139,197,65, 1);
    animation-duration: 1s;
  }

  .banner-auth__content {
    font-size: 2rem;
  }


  .banner-main-content__content {
    display: flex;
    justify-content: center;
    align-items: center;
    margin: 30px;

    font-size: 3.6rem;
    font-weight: bold;

  }

  .form-create-card {
    margin: 20px;
    margin-bottom: 30px;
  }

  .create-card__inputs {
    display: grid;
    grid-template-rows: 1fr 1fr;
    grid-template-columns: 1fr 1fr;
    grid-gap: 10px;

    margin: 20px;
  }



  .btn-create-card {
    font-size: 2.2rem;
    width: 350px;
    margin: 20px;
  }


  .main-content {
    padding: 20px;
    padding-top: 0;
  }

  .main-content__cards {
    display: grid;
    grid-template-columns: 1fr 1fr 1fr;
    grid-gap: 10px;
  }

  .card {
    display: inline-block;
    margin: 5px;
    min-width: 100%;
  }

  .card-header {
    display: flex;
    justify-content: space-between;
    align-items: center;

    font-size: 1.9rem;
  }

  .btn-delete-card {
    font-size: 1.5rem;
  }

  .card-body {}

  .card-question {
    font-size: 2rem;
  }

  .card-answer {
    font-size: 2.5rem;
  }

  .btn-show-answer {
    font-size: 1.5rem;
  }

  .hidden {
    display: none;
  }


</style>
