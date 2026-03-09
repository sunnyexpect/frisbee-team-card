const ADMIN_KEY = "captain2026";

new Vue({
  el: "#app",
  data: {
    page: "login",
    username: "",
    password: "",
    adminKey: "",
    isLogin: false,
    isAdmin: false,

    avatar: "https://ui-avatars.com/api/?name=球员",
    newPlayer: "",
    players: []
  },

  created() {
    const last = localStorage.getItem("lastUser");
    if (last) {
      const user = JSON.parse(last);
      this.username = user.username;
      this.password = user.password;
      this.isLogin = true;
      this.isAdmin = user.isAdmin;
    }
  },

  methods: {
    login() {
      const users = JSON.parse(localStorage.getItem("users") || "[]");
      const u = users.find(u => u.username == this.username && u.password == this.password);
      if (!u) {
        alert("账号或密码错误");
        return;
      }
      this.isLogin = true;
      this.isAdmin = u.isAdmin;
      localStorage.setItem("lastUser", JSON.stringify(u));
    },

    register() {
      const users = JSON.parse(localStorage.getItem("users") || "[]");
      if (users.some(x => x.username == this.username)) {
        alert("账号已存在");
        return;
      }
      const isAdmin = this.adminKey === ADMIN_KEY;
      users.push({
        username: this.username,
        password: this.password,
        isAdmin: isAdmin
      });
      localStorage.setItem("users", JSON.stringify(users));
      alert("注册成功，请登录");
      this.page = "login";
    },

    uploadAvatar(e) {
      const file = e.target.files[0];
      const reader = new FileReader();
      reader.onload = () => this.avatar = reader.result;
      reader.readAsDataURL(file);
    },

    saveMy() {
      alert("保存成功");
    },

    addPlayer() {
      if (!this.newPlayer) return;
      this.players.push({ name: this.newPlayer });
      this.newPlayer = "";
      alert("添加成功");
    },

    toDetail(p) {
      alert("查看：" + p.name);
    }
  }
});
