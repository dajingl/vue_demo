<template>
  <div>
    <div class="hello">
      <h1>{{ msg }}</h1>
      <van-button type="info" @click="goBack">123</van-button>
    </div>
  </div>
</template>

<script>
import { Button, Checkbox, CheckboxGroup, Card, SubmitBar, Toast } from "vant";


       console.log( window.history.length)
export default {
  name: "Home",
  components: {
    [Button.name]: Button,
    [Card.name]: Card,
    [Checkbox.name]: Checkbox,
    [SubmitBar.name]: SubmitBar,
    [CheckboxGroup.name]: CheckboxGroup
  },
  data() {
    return {
      checked: true,
      msg: "Welcome to Your Vue.js App"
    };
  },
   methods: {
    goBack() {
       console.log( window.history,'-------------',this.$router)
       this.$router.push('/home/test')
    }
  }
};
</script>

<style lang="less" scoped>

.hello {
  color: @text-color
}

</style>
