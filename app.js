new Vue({
  el: "#app",
  data: {
    msg: "正常运行"
  },
  methods: {
    toLogin() {
      alert("点登录：账号密码登录");
    },
    toRegister() {
      alert("队长注册请输入密钥：captain2026");
    }
  }
})
