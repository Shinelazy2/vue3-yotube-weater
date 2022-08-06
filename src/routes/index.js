import { createRouter, createWebHashHistory } from "vue-router";
import Home from "../pages/Home.vue";

export default createRouter({
  // hash 모드 : 특정 페이지에서 새로고침했을때, 페이지를 찾을 수 없음과 같은 메시지 알림을 방지
  history: createWebHashHistory(),
  routes: [
    {
      path: "/",
      name: Home,
      component: Home,
    },
  ],
});
