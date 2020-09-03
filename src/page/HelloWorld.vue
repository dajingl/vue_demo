<template>
  <div>
    <div class="hello">
      <h1>{{ msg }}</h1>
      <van-button type="info">123</van-button>
    </div>
    <van-checkbox v-model="checked">复选框</van-checkbox>
  </div>
</template>

<script>
import { Button, Checkbox, CheckboxGroup, Card, SubmitBar, Toast } from "vant";

console.log(Checkbox, "----------", Button);

export default {
  name: "HelloWorld",
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
  }
};
</script>

<style lang="less" scoped>

.hello {
  color: @text-color
}

</style>
