<template>
  <div class="test-page">
    <a-row class="test-row"  type="flex" justify="center" align="middle">
      <a-col class="test-col" justify="center" align="middle" :xs="20" :sm="20" :md="18" :lg="18" :xl="18" :xxl="18"></a-col>
    </a-row>
  </div>
</template>

<script>
export default {
  data() {
    return {

    };
  },
  methods: {

  },
};
</script>

<style lang="less" scoped>
.test-page {
  background-color: aqua;

}
.test-row {
  height: 100%;
}
// .test-row {
//   position: absolute;
//   left: 50%;
//   top: 50%;
//   transform: translate(-50%,-50%);
// }
.test-col {
  margin:0 auto;
  margin-top: 100px;
  height: 400px;
  background-color:antiquewhite;
}
</style>