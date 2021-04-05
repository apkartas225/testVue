<template>
  <div class="container">
    <div class="user">
      <div class="user_select">
        Выбран пользователь :<b> {{ user.firstName }} {{user.lastName}}</b>
      </div>
      <div class="user_descriprion">
        <label for="description"> Описание: </label>
        <textarea rows="5" cols="33" v-model="user.description"></textarea>
      </div>
      <div class="user_address">
        Адрес проживания : <b>{{ user.address.streetAddress }}</b
        ><br />
        Город: <b>{{ user.address.city }}</b> <br />
        Провиниця/Штат: <b>{{ user.address.state }}</b> <br />
        Индекс: <b>{{ user.address.zip }}</b>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: "User",
  props: {
    user: {
      require: true,
      type: Object,
    },
  },
};
</script>

<style scoped>
textarea{
    resize: none;
}
.user {
  width: 350px;
  height: 300px;
  border: 1px solid;
  border-radius: 10px;
  display: flex;
  flex-direction: column;
  margin-top: 20px;
  margin-bottom: 50px;
}
label,
textarea {
  font-size: 0.8rem;
  letter-spacing: 1px;
}
textarea {
  outline: none;
  padding: 10px;
  line-height: 1.5;
  border-radius: 5px;
  border: 1px solid #ccc;
  box-shadow: 1px 1px 1px #999;
}

label {
  display: block;
  margin-bottom: 10px;
}
</style>
