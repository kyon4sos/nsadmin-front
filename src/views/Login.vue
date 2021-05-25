<template>
  <section class="login-page" @click="handleClick">
    <canvas
      class="background"
      ref="background"
      style="width: 100%; height: 100%"
    ></canvas>
    <a-row>
      <a-col
        class="login-form__wrap"
        :xs="22"
        :sm="22"
        :md="14"
        :lg="14"
        :xl="14"
        :xxl="14"
      >
        <section class="login-form">
          <a-row>
            <a-col :xs="0" :sm="0" :md="12" :lg="12" :xl="12" :xxl="12">
              <div class="slogan">
                <h4>Welcome</h4>
                <h3>欢迎使用</h3>
                <h2>管理系统</h2>
                <span>neko studio+</span>
              </div>
            </a-col>
            <a-col
              class="form"
              :xs="24"
              :sm="24"
              :md="12"
              :lg="12"
              :xl="12"
              :xxl="12"
            >
              <a-form
                :label-col="labelCol"
                :wrapper-col="wrapperCol"
                ref="loginFormRef"
                :model="loginFormModel"
                :rules="loginFormRules"
                hideRequiredMark
              >
                <a-form-item justify="center" name="username">
                  <a-input
                    autocomplete="off"
                    v-model:value="loginFormModel.username"
                    placeholder="请输入用户名"
                  />
                </a-form-item>
                <a-form-item justify="center" name="password">
                  <a-input
                    v-model:value="loginFormModel.password"
                    type="password"
                    autocomplete="off"
                    placeholder="请输入密码"
                  />
                </a-form-item>
                <a-form-item justify="center">
                  <a-button type="primary" block @click.prevent="onSubmit"
                    >登录</a-button
                  >
                </a-form-item>
              </a-form>
            </a-col>
          </a-row>
        </section>
      </a-col>
    </a-row>
    <section class="footer">
      copyright@{{ new Date().getFullYear() }} neko studio
    </section>
  </section>
</template>

<script>
import { reactive, toRaw, ref, onBeforeUnmount, h } from "vue";
import { SmileOutlined } from "@ant-design/icons-vue";
import { notification } from "ant-design-vue";
import { useRouter } from "vue-router";
import { useStore } from "vuex";
import { login, getRoutes } from "@/request";
import Particles from "particlesjs";
export default {
  setup() {
    const router = useRouter();
    const store = useStore();
    const loginFormModel = reactive({
      username: "",
      password: "",
    });
    const data = reactive({
      particles: null,
    });
    const loginFormRef = ref();
    const loginFormRules = {
      username: [
        {
          required: true,
          message: "请输入用户名",
        },
        {
          min: 3,
          max: 20,
          message: "最少3个字符",
          trigger: "blur",
        },
      ],
      password: [
        {
          required: true,
          message: "请输入密码",
        },
      ],
    };

    const openNotification = (data) => {
      notification.open({
        message: "欢迎回来",
        description: data,
        icon: h(SmileOutlined, { style: "color: #108ee9" }),
      });
    };
    const onSubmit = () => {
      loginFormRef.value
        .validate()
        .then(() => {
          login(toRaw(loginFormModel)).then((res) => {
            store.dispatch("SET_USER_INFO", res.data);
            router.push("/");
            openNotification(res.username);
          });
        })
        .catch(() => {});
    };
    const background = ref(null);
    // onMounted(() => {
    //   data.particles = Particles.init({
    //     selector: `.${background.value.classList[0]}`,
    //     // selector: ".background",
    //     color: "#ef5d84",
    //     connectParticles: true,
    //     responsive: [
    //       {
    //         breakpoint: 768,
    //         options: {
    //           maxParticles: 140,
    //           color: "#31abcd",
    //           connectParticles: false,
    //         },
    //       },
    //       {
    //         breakpoint: 425,
    //         options: {
    //           maxParticles: 100,
    //           connectParticles: true,
    //         },
    //       },
    //       {
    //         breakpoint: 320,
    //         options: {
    //           maxParticles: 0,
    //         },
    //       },
    //     ],
    //   });
    // });
    onBeforeUnmount(() => {
      console.log("login unmount");
      // data.particles.destroy();
    });
    return {
      background,
      labelCol: { span: 4 },
      wrapperCol: { span: 20 },
      loginFormModel,
      onSubmit,
      loginFormRef,
      loginFormRules,
    };
  },
};
</script>

<style lang="less" scoped>
.login-page {
  width: 100%;
  height: 100%;
  background-color: @color-2;
  position: relative;
  overflow: hidden;
  .login-form__wrap {
    margin: 0 auto;
    margin-top: 100px;
  }
  .login-form {
    box-shadow: 1px 1px 10px #aaa;
    height: 400px;
    background-color: @color-bg-1;
    position: relative;
    border-radius: 30px;
    z-index: 2;
    margin: 0 auto;
    padding: 48px 48px;
    .slogan {
      h4 {
        font-size: 24px;
        font-weight: 400;
      }
      h3 {
        font-weight: 700;
        font-size: 48px;
        margin-bottom: 0px;
      }
      h2 {
        font-size: 32px;
      }
      h4,
      h3,
      h2 {
        color: @color-deep;
      }
      span {
        display: inline-block;
        width: 200px;
        height: 40px;
        line-height: 40px;
        text-align: center;
        color: #fff;
        font-size: 20px;
        margin-top: 8px;
        font-weight: 700;
        background-color: @color-primary;
        opacity: 0.5;
        border-radius: 8px;
      }
    }
    .form {
      margin-top: 70px;
    }
  }
  .background {
    position: absolute;
    display: block;
    top: 0;
    left: 0;
    z-index: 0;
    width: 100%;
    height: ~"calc(100% - 100px)";
  }
  &::before {
    content: "";
    width: 100vw;
    height: 100vw;
    display: block;
    background-color: @color-health;
    position: absolute;
    border-radius: 50%;
    left: -60vw;
  }
}
.footer {
  height: 100px;
  width: 100%;
  color: #474747;
  display: flex;
  justify-content: center;
  align-items: center;
  font-size: 1rem;
}
</style>