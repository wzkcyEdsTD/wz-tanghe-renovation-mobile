<template>
  <div class="login">
    <div class="circle circle-1">
      <div class="circle circle-2"></div>
      <div class="circle circle-3">
        <span class="login-title">智慧塘河</span>
        <div class="login-username">
          <img src="@/assets/images/login/username.png" />
          <input type="text" v-model="username" />
        </div>
        <div class="login-password">
          <img src="@/assets/images/login/password.png" />
          <input type="password" v-model="password" />
        </div>
        <button class="login-submit" @click="login">
          <span>登录</span>
        </button>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  data() {
    return {
      username: "",
      password: "",
    };
  },
  methods: {
    // 登录
    login() {},
  },
};
</script>

<style lang="less" scoped>
.login {
  width: 100%;
  height: 100%;
  overflow: hidden;
  .bg-image("~@/assets/images/login/login-bg");

  .circle {
    box-sizing: border-box;
    border-radius: 50%;
  }

  .circle-1 {
    position: absolute;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%);
    width: 77.56vh;
    height: 77.56vh;
    border: solid 0.5vh rgba(255, 255, 255, 0.3);

    .circle-2 {
      position: absolute;
      top: 50%;
      left: 50%;
      transform: translate(-50%, -50%);
      width: 62.63vh;
      height: 62.63vh;
      background-color: rgba(255, 255, 255, 0.3);

      &::after {
        content: "";
        position: absolute;
        top: 50%;
        left: 50%;
        transform: translate(-50%, -50%);
        width: 71.69vh;
        height: 71.69vh;
        background-color: rgba(255, 255, 255, 0.3);
        border-radius: 50%;
      }
    }

    .circle-3 {
      position: absolute;
      top: 50%;
      left: 50%;
      transform: translate(-50%, -50%);
      width: 62.63vh;
      height: 62.63vh;

      > * {
        position: absolute;
        left: 50%;
        transform: translateX(-50%);
      }

      .login-title {
        display: block;
        top: 10.44vh;
        height: 9.56vh;
        line-height: 9.56vh;
        font-family: YouSheBiaoTiHei;
        font-size: 7.38vh;
        color: #fff;

        &::after {
          content: "";
          position: absolute;
          top: 50%;
          left: 50%;
          transform: translate(-50%, -50%);
          width: 28.38vh;
          height: 8vh;
          .bg-image("~@/assets/images/login/login-title-bg");
          z-index: -1;
        }
      }

      .login-submit {
        top: 43.94vh;
        height: 4.94vh;
        line-height: 4.94vh;
        background-color: #0062ff;
        border: none;
        border-radius: 0.75vh;
        font-family: PingFang;
        font-size: 2.63vh;
        color: #fff;
        padding: 0 1.75vh;
        cursor: pointer;
      }

      .login-username,
      .login-password {
        display: flex;
        align-items: center;
        width: 47.63vh;
        height: 6vh;
        background-color: rgba(255, 255, 255, 0.4);
        box-sizing: border-box;
        padding: 0 2.13vh;

        > img {
          width: 3vh;
          height: 2.75vh;
          margin-right: 2.75vh;
        }

        > input {
          flex: 1;
          background: transparent;
          border: none;
          outline: none;
          font-family: PingFang;
          font-size: 2vh;
          letter-spacing: 0.1em;
          color: #fff;
        }
      }

      .login-username {
        top: 26.63vh;
      }

      .login-password {
        top: 35.31vh;
      }
    }
  }
}
</style>