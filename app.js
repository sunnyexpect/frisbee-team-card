const DATA_URL = "https://raw.githubusercontent.com/sunnyexpect/frisbee-team-card/main/data.json";
const ADMIN_KEY = "captain2026";

Vue.component('card', {
  props: ['player', 'isAdmin'],
  template: `
  <div class="card">
    <div class="basic">
      <h3>{{ player.name }} #{{ player.number }}</h3>
    </div>

    <div class="section">
      <div class="title">身体素质</div>
      <div class="stat" v-for="(v, key) in player.physical">
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
      <div class="title">进攻维度</div>
      <div class="stat" v-for="(v, key) in player.attack">
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
      <div class="title">防守维度</div>
      <div class="stat" v-for="(v, key) in player.defense">
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
  </div>
  `
});

new Vue({
  el: "#app",
  data: {
    page: "login",
    uid: "",
    my: null,
    players: [],
    current: null
  },
  methods: {
    async login() {
      await this.load();
      if (this.uid === ADMIN_KEY) {
        this.page = "admin";
        return;
      }
      const me = this.players.find(p => p.number === this.uid);
      if (me) {
        this.my = me;
        this.page = "user";
      } else {
        alert("编号不存在，请联系队长");
      }
    },
    async load() {
      const res = await fetch(DATA_URL);
      this.players = await res.json();
    },
    select(p) {
      this.current = p;
    }
  }
});
