const ADMIN_KEY = "captain2026";
const DB_KEY = "FRISBEE_TEAM_DATA";

new Vue({
  el: "#app",
  data: {
    activeTab: "login",
    loginUser: "",
    loginPwd: "",
    regUser: "",
    regPwd: "",
    regAdminKey: "",

    user: null,
    isLoggedIn: false,

    myInfo: {
      name: "",
      avatar: "",
      position: "全能",
      physical: { speed:5, stamina:5, power:5 },
      attack: { pass:5, long:5 },
      defense: { mark:5, block:5 }
    },

    players: [],
    currentPlayer: null,
    newPlayerName: ""
  },

  created() {
    this.loadFromStorage();
    this.autoLogin();
  },

  methods: {
    // 云端读写
    loadFromStorage() {
      const data = JSON.parse(localStorage.getItem(DB_KEY) || '{"users":[],"players":[]}');
      this.users = data.users || [];
      this.players = data.players || [];
    },
    saveToStorage() {
      localStorage.setItem(DB_KEY, JSON.stringify({ users: this.users, players: this.players }));
    },

    // 自动登录
    autoLogin() {
      const last = localStorage.getItem("LAST_LOGIN");
      if (!last) return;
      const u = this.users.find(x => x.username === last);
      if (u) {
        this.user = u;
        this.isLoggedIn = true;
      }
    },

    // 登录
    login() {
      const u = this.users.find(x => x.username === this.loginUser && x.password === this.loginPwd);
      if (!u) return alert("账号或密码错误");
      this.user = u;
      this.isLoggedIn = true;
      localStorage.setItem("LAST_LOGIN", u.username);
    },

    // 注册
    register() {
      if (this.users.some(x => x.username === this.regUser)) return alert("账号已存在");
      this.users.push({
        username: this.regUser,
        password: this.regPwd,
        isAdmin: this.regAdminKey === ADMIN_KEY
      });
      this.saveToStorage();
      alert("注册成功");
      this.activeTab = "login";
    },

    // 头像上传
    uploadAvatar(e) {
      const f = e.target.files[0];
      const r = new FileReader();
      r.onload = () => this.myInfo.avatar = r.result;
      r.readAsDataURL(f);
    },

    saveMyInfo() {
      const me = this.players.find(x => x.name === this.user.username);
      if (me) Object.assign(me, this.myInfo);
      else this.players.push({ ...this.myInfo, name: this.user.username });
      this.saveToStorage();
      alert("保存成功");
    },

    // 管理员
    addPlayer() {
      if (!this.newPlayerName) return;
      this.players.push({
        name: this.newPlayerName,
        avatar: "",
        position: "全能",
        physical: { speed:5, stamina:5, power:5 },
        attack: { pass:5, long:5 },
        defense: { mark:5, block:5 }
      });
      this.saveToStorage();
      this.newPlayerName = "";
    },

    openDetail(p) { this.currentPlayer = p; },
    closeDetail() { this.currentPlayer = null; }
  }
});
