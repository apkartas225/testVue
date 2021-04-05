<template>
  <div class="container">
    <div class="row">
      <button @click="isVisibleTable = !isVisibleTable">Добавить</button>
      <div class="input-group inputs">
        <input
          v-model="search"
          type="text"
          class="form-control"
          placeholder="Search..."
          aria-label=""
          aria-describedby="basic-addon1"
        />
        <span id="addon-wrapping"></span>
      </div>
    </div>
    <div class="chooseType" v-if="isVisibleChoose">
      <div class="smallSize" @click="getUser(false)">
        Маленький формат данных
      </div>
      <div class="bigSize" @click="getUser(true)">
        Большой формат данных
      </div>
    </div>
    <hr />
    <div id="fountainG" class="load" v-if="isLoad">
      <div id="fountainG_1" class="fountainG"></div>
      <div id="fountainG_2" class="fountainG"></div>
      <div id="fountainG_3" class="fountainG"></div>
      <div id="fountainG_4" class="fountainG"></div>
      <div id="fountainG_5" class="fountainG"></div>
      <div id="fountainG_6" class="fountainG"></div>
      <div id="fountainG_7" class="fountainG"></div>
      <div id="fountainG_8" class="fountainG"></div>
    </div>

    <form :class="{ addTable: isVisibleTable }">
      <table>
        <tr>
          <td
            scope="col"
            :key="index + 'newUser'"
            v-for="(header, index) in tableHeaders"
          >
            {{ header.text }}
          </td>
        </tr>
        <tr>
          <td scope="col">
            <input
              @blur="validateField"
              class="form-control"
              type="text"
              v-model.trim="person.id"
              id="id"
              :class="$v.person.id.$error ? 'is-invalid' : false"
            />
          </td>
          <td scope="col">
            <input
              @blur="validateField"
              class="form-control"
              type="text"
              v-model.trim="person.firstName"
              id="firtsName"
              :class="$v.person.firstName.$error ? 'is-invalid' : false"
            />
          </td>
          <td scope="col">
            <input
              @blur="validateField"
              class="form-control"
              type="text"
              v-model.trim="person.lastName"
              id="lastName"
              :class="$v.person.lastName.$error ? 'is-invalid' : false"
            />
          </td>
          <td scope="col">
            <input
              @blur="validateField"
              type="text"
              class="form-control"
              v-model.trim="person.email"
              id="email"
              :class="$v.person.email.$error ? 'is-invalid' : false"
            />
          </td>
          <td scope="col">
            <input
              @blur="validateField"
              type="text"
              class="form-control"
              :class="$v.person.phone.$error ? 'is-invalid' : false"
              v-model.trim="person.phone"
              id="phone"
            />
          </td>
        </tr>
      </table>

      <div class="btn">
        <button
          @click="addNewPerson"
          v-if="isInVisibleButton"
          type="button"
          class="btn btn-success addButton"
        >
          Добвавить в таблицу
        </button>
      </div>
    </form>

    <div class="table_scroll">
      <table class="table table-striped table_scroll">
        <thead>
          <tr>
            <td
              scope="col"
              :key="header.value"
              @click="changeSorting(header.value)"
              v-for="header in tableHeaders"
            >
              {{ header.text }}
              <span
                class="d-inline-block"
                v-if="sortParams.fieldName === header.value"
                :class="{ revers: sortParams.isDesc }"
                >^</span
              >
            </td>
          </tr>
        </thead>
        <tbody>
          <tr
            v-for="user in people"
            :key="user.id + user.firstName"
            @click="selectUser(user)"
          >
            <td>
              {{ user.id }}
            </td>
            <td class="name">
              {{ user.firstName }}
            </td>
            <td>
              {{ user.lastName }}
            </td>
            <td>
              {{ user.email }}
            </td>
            <td>
              {{ user.phone }}
            </td>
          </tr>
        </tbody>
      </table>
    </div>
    <User v-if="selectedUser && selectedUser.id" :user="selectedUser" />
    <Paginate
      v-if="pagination && pagesAmount > 1"
      :page-count="pagesAmount"
      :click-handler="changePage"
      :prev-text="'Prev'"
      :next-text="'Next'"
      :page-class="'classLi'"
      :container-class="'classNamePag'"
    />
  </div>
</template>

<script>
import Paginate from "vuejs-paginate";
import { validationMixin } from "vuelidate";
import { email, numeric, required } from "vuelidate/lib/validators";
import User from "../components/User";
import userService from "../services/usersSevice"

export default {
  name: "UsersList",
  mixins: [validationMixin],
  components: {
    User,
    Paginate,
  },
  data: () => ({
    usersList: [],
    search: "",
    isVisibleTable: true,
    isInVisibleButton: false,
    person: {
      id: "",
      firstName: "",
      lastName: "",
      email: "",
      phone: "",
      address: {
        city: "",
        state: "",
        streetAddress: "",
        zip: "",
      },
    },
    selectedUser: {},
    tableHeaders: [
      {text: "Id", value: "id"},
      {text: "First Name", value: "firstName"},
      {text: "Last Name", value: "lastName"},
      {text: "Email", value: "email"},
      {text: "Phone", value: "phone"}
    ],
    isLoad: false,

    sortParams: {
      fieldName: "",
      isDesc: false,
    },
    isVisibleChoose: true,
    pagination: false,
    currentPage: 1
  }),
  methods: {
    changePage(pageNum) {
      this.currentPage = pageNum;
    },

    changeSorting(fieldName) {
      if (this.sortParams.fieldName === fieldName) {
        this.sortParams.isDesc = !this.sortParams.isDesc;
      } else {
        this.sortParams.fieldName = fieldName;
        this.sortParams.isDesc = false;
      }
    },
    validateField() {
      this.$v.person.id.$touch();
      this.$v.person.firstName.$touch();
      this.$v.person.lastName.$touch();
      this.$v.person.phone.$touch();
      this.$v.person.email.$touch();
      if (!this.$v.person.$error) {
        console.log("Валидация прошла успешно");
        this.isInVisibleButton = true;
      } else {
        console.log("ERROR");
      }
    },
    getUser(isLargeAmount = false) {
      const amount = isLargeAmount ? "350" : "30";
      const delay = isLargeAmount ? "3" : "0";

      this.isLoad = true;
      this.isVisibleChoose = false;

      userService.getUsers(amount, delay)
        .then((response) => {
          this.usersList = response.data;
        })
        .finally(() => {
          this.isLoad = false;
          if (isLargeAmount) this.pagination = true;
        });
    },
    addNewPerson() {
      this.usersList.unshift(this.person);
    },
    selectUser(user) {
      this.selectedUser = user;
    },
    sortUsersByName(users) {
      return users.sort((user1, user2) => {
        if (
          user1[this.sortParams.fieldName] < user2[this.sortParams.fieldName]
        ) {
          return this.sortParams.isDesc ? -1 : 1;
        } else if (
          user1[this.sortParams.fieldName] > user2[this.sortParams.fieldName]
        ) {
          return this.sortParams.isDesc ? 1 : -1;
        } else {
          return 0;
        }
      });
    },
    paginateUsers(users) {
      if (this.currentPage && this.pagination) {
        const start = (this.currentPage - 1) * 30;
        let end = this.currentPage * 30;
        end = end > this.usersList.length ?  this.usersList.length : end;
        return users.slice(start, end);
      }
    }
  },

  computed: {
    pagesAmount() {
      const listLength = this.usersList.length;
      if (this.pagination && listLength) {
        return Math.ceil(listLength/30);
      }
      return 0;
    },
    people() {
      let users = this.usersList.filter((person) =>
        person.firstName.toLowerCase().includes(this.search.toLowerCase())
      );

      if (this.sortParams.fieldName) {
        users = this.sortUsersByName(users);
      }

      if (this.pagination) {
        users = this.paginateUsers(users);
      }

      return users;
    },
  },
  validations: {
    person: {
      id: { required, numeric },
      firstName: { required },
      lastName: { required },
      email: { required, email },
      phone: { required, numeric },
    },
  },
};
</script>

<style scoped>

.classNamePag {
  display: flex;
  justify-content: space-between;
  width: 400px;
}
.chooseType {
  color: brown;
  font-size: 25px;
  position: absolute;
  left: 0;
  right: 0;
  margin: auto;
  top: 30%;
  width: 700px;
  display: flex;
  justify-content: space-between;
}
.revers {
  transform: rotate(180deg);
}
.btn {
  width: 400px;
  display: flex;
  justify-content: space-between;
}
.btn button {
  width: 100px;
}
.addButton {
  margin-top: 20px;
  height: 60px;
}
.container {
  margin-top: 50px;
}
.input-group {
  width: 30%;
}
.row button {
  border: none;
  width: 100px;
  height: 30px;
}
.row {
  display: flex;
  justify-content: space-between;
}
table {
  transition: 0.5s;
}
.addTable {
  display: none;
}
input {
  width: 90%;
  margin-right: 10px;
}
.load {
  color: red;
  width: 12%;
  position: absolute;
  left: 0;
  right: 0;
  margin: auto;
  top: 40%;
}
.bigSize {
  cursor: pointer;
}
.smallSize {
  cursor: pointer;
}
.table {
  margin-top: 50px;
}
.table_scroll {
  height: 10%;
  overflow-y: scroll;
}
#fountainG {
  position: absolute;
  width: 234px;
  height: 28px;
  margin: auto;
}

.fountainG {
  position: absolute;
  top: 0;
  background-color: rgb(0, 0, 0);
  width: 28px;
  height: 28px;
  animation-name: bounce_fountainG;
  -o-animation-name: bounce_fountainG;
  -ms-animation-name: bounce_fountainG;
  -webkit-animation-name: bounce_fountainG;
  -moz-animation-name: bounce_fountainG;
  animation-duration: 1.5s;
  -o-animation-duration: 1.5s;
  -ms-animation-duration: 1.5s;
  -webkit-animation-duration: 1.5s;
  -moz-animation-duration: 1.5s;
  animation-iteration-count: infinite;
  -o-animation-iteration-count: infinite;
  -ms-animation-iteration-count: infinite;
  -webkit-animation-iteration-count: infinite;
  -moz-animation-iteration-count: infinite;
  animation-direction: normal;
  -o-animation-direction: normal;
  -ms-animation-direction: normal;
  -webkit-animation-direction: normal;
  -moz-animation-direction: normal;
  transform: scale(0.3);
  -o-transform: scale(0.3);
  -ms-transform: scale(0.3);
  -webkit-transform: scale(0.3);
  -moz-transform: scale(0.3);
  border-radius: 19px;
  -o-border-radius: 19px;
  -ms-border-radius: 19px;
  -webkit-border-radius: 19px;
  -moz-border-radius: 19px;
}

#fountainG_1 {
  left: 0;
  animation-delay: 0.6s;
  -o-animation-delay: 0.6s;
  -ms-animation-delay: 0.6s;
  -webkit-animation-delay: 0.6s;
  -moz-animation-delay: 0.6s;
}

#fountainG_2 {
  left: 29px;
  animation-delay: 0.75s;
  -o-animation-delay: 0.75s;
  -ms-animation-delay: 0.75s;
  -webkit-animation-delay: 0.75s;
  -moz-animation-delay: 0.75s;
}

#fountainG_3 {
  left: 58px;
  animation-delay: 0.9s;
  -o-animation-delay: 0.9s;
  -ms-animation-delay: 0.9s;
  -webkit-animation-delay: 0.9s;
  -moz-animation-delay: 0.9s;
}

#fountainG_4 {
  left: 88px;
  animation-delay: 1.05s;
  -o-animation-delay: 1.05s;
  -ms-animation-delay: 1.05s;
  -webkit-animation-delay: 1.05s;
  -moz-animation-delay: 1.05s;
}

#fountainG_5 {
  left: 117px;
  animation-delay: 1.2s;
  -o-animation-delay: 1.2s;
  -ms-animation-delay: 1.2s;
  -webkit-animation-delay: 1.2s;
  -moz-animation-delay: 1.2s;
}

#fountainG_6 {
  left: 146px;
  animation-delay: 1.35s;
  -o-animation-delay: 1.35s;
  -ms-animation-delay: 1.35s;
  -webkit-animation-delay: 1.35s;
  -moz-animation-delay: 1.35s;
}

#fountainG_7 {
  left: 175px;
  animation-delay: 1.5s;
  -o-animation-delay: 1.5s;
  -ms-animation-delay: 1.5s;
  -webkit-animation-delay: 1.5s;
  -moz-animation-delay: 1.5s;
}

#fountainG_8 {
  left: 205px;
  animation-delay: 1.64s;
  -o-animation-delay: 1.64s;
  -ms-animation-delay: 1.64s;
  -webkit-animation-delay: 1.64s;
  -moz-animation-delay: 1.64s;
}

@keyframes bounce_fountainG {
  0% {
    transform: scale(1);
    background-color: rgb(0, 0, 0);
  }

  100% {
    transform: scale(0.3);
    background-color: rgb(255, 255, 255);
  }
}

@-o-keyframes bounce_fountainG {
  0% {
    -o-transform: scale(1);
    background-color: rgb(0, 0, 0);
  }

  100% {
    -o-transform: scale(0.3);
    background-color: rgb(255, 255, 255);
  }
}

@-ms-keyframes bounce_fountainG {
  0% {
    -ms-transform: scale(1);
    background-color: rgb(0, 0, 0);
  }

  100% {
    -ms-transform: scale(0.3);
    background-color: rgb(255, 255, 255);
  }
}

@-webkit-keyframes bounce_fountainG {
  0% {
    -webkit-transform: scale(1);
    background-color: rgb(0, 0, 0);
  }

  100% {
    -webkit-transform: scale(0.3);
    background-color: rgb(255, 255, 255);
  }
}

@-moz-keyframes bounce_fountainG {
  0% {
    -moz-transform: scale(1);
    background-color: rgb(0, 0, 0);
  }

  100% {
    -moz-transform: scale(0.3);
    background-color: rgb(255, 255, 255);
  }
}
</style>
