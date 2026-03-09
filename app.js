// ===================== 配置 =====================
const ADMIN_SECRET = "captain2026"; // 队长注册密钥
const USERS_KEY = "frisbee_users";
const PLAYERS_KEY = "frisbee_players";
// =================================================

// 头像上传组件
Vue.component('avatar-upload', {
  props: ['value'],
  template: `
  <div style="text-align:center; margin-bottom:16px">
    <img 
      :src="value || 'https://ui-avatars.com/api/?name=球员&background=random'" 
      style="width:100px; height:100px; border-radius:50%; object-fit:cover; border:3px solid #FF3366"
    >
    <input type="file" accept="image/*" @change="upload" style="margin-top:8px; font-size:12px">
  </div>
  `,
  methods: {
    upload(e) {
      const file = e.target.files[0];
      if (!file) return;
      const reader = new FileReader();
      reader.onload = () => this.$emit('input', reader.result);
      reader.readAsDataURL(file);
    }
  }
});

// 球员卡片组件
Vue.component('player-card', {
  props: ['info', 'readonly', 'isAdmin'],
  template: `
  <div class="card">
    <div style="text-align:center; padding:16px">
      <img 
        :src="info.avatar || 'https://ui-avatars.com/api/?name='+info.name" 
        style="width:120px; height:120px; border-radius:50%; object-fit:cover; border:4px solid #FFCC00"
      >
      <h2 style="margin-top:10px">{{ info.name }} #{{ info.username }}</h2>
      <p style="color:#666">{{ info.position || '全能' }}</p>
    </div>

    <div class="section">
      <div class="title">🏃 身体素质</div>
      <div class="stat" v-for="(v, key) in info.physical">
        <div class="row">
          <span>{{ key }}</span>
          <span>自:{{ v.self }} 队:{{ v.cap }}</span>
        </div>
        <div class="bar">
          <div class="self" :style="{width: v.self*10 + '%'}"></div>
          <div class="cap" :style="{width: v.cap*10 + '%'}"></div>
        </div>
      </div>
    </div>

    <div class="section">
      <div class="title">⚡ 进攻维度</div>
      <div class="stat" v-for="(v, key) in info.attack">
        <div class="row">
          <span>{{ key }}</span>
          <span>自:{{ v.self }} 队:{{ v.cap }}</span>
        </div>
        <div class="bar">
          <div class="self" :style="{width: v.self*10 + '%'}"></div>
          <div class="cap" :style="{width: v.cap*10 + '%'}"></div>
        </div>
      </div>
    </div>

    <div class="section">
      <div class="title">🛡️ 防守维度</div>
      <div class="stat" v-for="(v, key) in info.defense">
        <div class="row">
          <span>{{ key }}</span>
          <span>自:{{ v.self }} 队:{{ v.cap }}</span>
        </div>
        <div class="bar">
          <div class="self" :style="{width: v.self*10 + '%'}"></div>
          <div class="cap" :style="{width: v.cap*10 + '%'}"></div>
        </div>
      </div>
    </div>

    <div v-if="isAdmin" style="padding:16px">
      <button @click="$emit('back')" style="background:#FF3366; color:white; border:none; padding:12px; width:100%; border-radius:10px">
        返回队员列表
      </button>
    </div>
  </div>
  `
});

// 主应用
new Vue({
  el: "#app",
  data: {
    page: "login",
    tab: "login",

    username: "",
    password: "",
    adminSecret: "",
    isAdmin: false,
    currentUser: null,

    users: JSON.parse(localStorage.getItem(USERS_KEY) || "[]"),
    players: JSON.parse(localStorage.getItem(PLAYERS_KEY) || "[]"),

    avatar: "",
    position: "全能",
    selfData: {
      physical: { speed: { self:5 }, stamina: { self:5 }, power: { self:5 }, flex: { self:5 } },
      attack: { pass: { self:5 }, long: { self:5 }, run: { self:5 }, score: { self:5 } },
      defense: { mark: { self:5 }, block: { self:5 }, pos: { self:5 }, support: { self:5 } }
    },

    adminShowList: true,
    adminViewPlayer: null,
    addPlayerName: ""
  },

  methods: {
    saveUsers() { localStorage.setItem(USERS_KEY, JSON.stringify(this.users)); },
    savePlayers() { localStorage.setItem(PLAYERS_KEY, JSON.stringify(this.players)); },

    // 登录
    login() {
      const u = this.users.find(x => x.username === this.username && x.password === this.password);
      if (!u) { alert("账号或密码错误"); return; }
      this.currentUser = u;
      this.isAdmin = u.isAdmin;
      this.page = u.isAdmin ? "admin" : "user";

      const me = this.players.find(x => x.username === u.username);
      if (me) {
        this.avatar = me.avatar || "";
        this.position = me.position || "全能";
        this.selfData = me.data;
      }
    },

    // 注册
    register() {
      if (!this.username || !this.password) { alert("请输入账号密码"); return; }
      if (this.users.some(x => x.username === this.username)) { alert("账号已存在"); return; }
      this.users.push({
        username: this.username,
        password: this.password,
        isAdmin: this.adminSecret === ADMIN_SECRET
      });
      this.saveUsers();
      alert("注册成功！请登录");
      this.tab = "login";
    },

    // 保存自评
    saveMyData() {
      let me = this.players.find(x => x.username === this.currentUser.username);
      if (!me) {
        me = {
          username: this.currentUser.username,
          name: this.currentUser.username,
          avatar: this.avatar,
          position: this.position,
          data: this.selfData
        };
        this.players.push(me);
      } else {
        me.avatar = this.avatar;
        me.position = this.position;
        me.data = this.selfData;
      }
      this.savePlayers();
      alert("保存成功！");
    },

    // 管理员查看队员
    adminView(p) {
      this.adminViewPlayer = p;
      this.adminShowList = false;
    },

    // 返回列表
    backToList() {
      this.adminShowList = true;
      this.adminViewPlayer = null;
    },

    // 管理员新增队员
    addPlayer() {
      if (!this.addPlayerName) { alert("请输入队员姓名"); return; }
      const newPlayer = {
        username: this.addPlayerName,
        name: this.addPlayerName,
        avatar: "",
        position: "全能",
        data: {
          physical: { speed: { self:5, cap:5 }, stamina: { self:5, cap:5 }, power: { self:5, cap:5 }, flex: { self:5, cap:5 } },
          attack: { pass: { self:5, cap:5 }, long: { self:5, cap:5 }, run: { self:5, cap:5 }, score: { self:5, cap:5 } },
          defense: { mark: { self:5, cap:5 }, block: { self:5, cap:5 }, pos: { self:5, cap:5 }, support: { self:5, cap:5 } }
        }
      };
      this.players.push(newPlayer);
      this.savePlayers();
      alert("新增队员成功！");
      this.addPlayerName = "";
    }
  }
});
