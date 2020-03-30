<template>
  <div :class="{'has-logo':showLogo}">
    <logo v-if="showLogo" :collapse="isCollapse" />
    <el-scrollbar wrap-class="scrollbar-wrapper">
      <el-menu
        :default-active="activeMenu"
        :collapse="isCollapse"
        :background-color="variables.menuBg"
        :text-color="variables.menuText"
        :unique-opened="false"
        :active-text-color="variables.menuActiveText"
        :collapse-transition="false"
        mode="vertical"
      >
        <sidebar-item v-for="route in routes" :key="route.name" :item="route" :base-path="route.path" />
      </el-menu>
    </el-scrollbar>
  </div>
</template>

<script>
import { mapGetters } from "vuex";
import Logo from './Logo'
import variables from "@/styles/variables.scss";
import SidebarItem from "./SidebarItem";
import { getInfo, myActions } from "@/api/login";
import { myInstallApiList } from "@/api/centerUserApi";

export default {
  components: { SidebarItem, Logo },
  computed: {
    ...mapGetters(["sidebar", "centerUserBase"]),
    activeMenu() {
      const route = this.$route
      const { meta, path } = route
      // if set path, the sidebar will highlight the path you set
      if (meta.activeMenu) {
        return meta.activeMenu
      }
      return path
    },
    showLogo() {
      return this.$store.state.settings.sidebarLogo
    },
    variables() {
      return variables;
    },
    isCollapse() {
      return !this.sidebar.opened;
    }
  },
  data() {
    return {
      businessStylePass: false, // 最高优先级，这个为 true，则忽略 apis 的判断
      routes: []
    };
  },
  mounted() {
    let _this = this;
    Promise.all([
      getInfo(),
      myInstallApiList(1, 10000, { isUse: true }),
      myActions()
    ]).then(function(resArray) {
      if (!resArray[0].data.adminCenterUser) {
        isSubAdmin = false;
      }
      if (
        resArray[0].data.adminCenterUser &&
        resArray[0].data.adminCenterUser.isSuperAdmin
      ) {
        isSupperAdmin = true;
      }
      if (resArray[1].code == 0) {
        resArray[1].data.result.forEach(ele => {
          myApiIds.push(ele.apiId);
        });
      }
      resArray[2].data.forEach(ele => {
        myActionsUrls.push(ele.url);
      });
      // resArray[0].data.vipLevel = 0
      _this.$store.commit("SET_CENTER_USER_BASE", resArray[0].data);
      // 处理左侧菜单
      _this.routes = _this.filterRouters(_this.$router.options.routes, "");
    });
  },
  methods: {
    filterRouters(routes, path) {
      let _this = this;
      let _routes = [];
      routes
        .filter(r => {
          // 模块权限过滤
          if (r.hidden) {
            return false;
          }
          if (!r.meta) {
            return true;
          }
          if (
            r.meta.businessStyle &&
            r.meta.businessStyle.includes(_this.centerUserBase.businessStyle)
          ) {
            _this.businessStylePass = true;
            return true;
          }

          if (
            r.meta.hideOnBusinessStyle &&
            r.meta.hideOnBusinessStyle.includes(
              _this.centerUserBase.businessStyle
            )
          ) {
            return false;
          }
          if (r.meta.title == "上传文件管理" 
            && (_this.centerUserBase.businessStyle == "aimingpian" || _this.centerUserBase.businessStyle == "noodles")) {
            return false;
          }
          if (r.meta.isSuperAdmin && isSubAdmin) {
            return false;
          }
          if (!r.meta.apiIds) {
            return true;
          }
          let _r = false;
          r.meta.apiIds.forEach(apiId => {
            if (myApiIds.includes(apiId)) {
              _r = true;
              return;
            }
          });
          return _r;
        })
        .filter(r => {
          // 权限过滤
          if (!isSubAdmin) {
            return true;
          }
          if (isSupperAdmin) {
            return true;
          }
          let fullPath = (
            path + (r.path.indexOf("/") == 0 ? r.path : "/" + r.path)
          ).replace("//", "/"); // 完整路径
          if (!myActionsUrls.includes(fullPath)) {
            // console.log('84:', fullPath);
            return false;
          }
          return true;
        })
        .forEach(r => {
          let fullPath = (
            path + (r.path.indexOf("/") == 0 ? r.path : "/" + r.path)
          ).replace("//", "/"); // 完整路径
          if (r.children && r.children.length > 0) {
            r.children = _this.filterRouters(r.children, fullPath);
            if (r.children && r.children.length == 0) {
              r.children = undefined;
            }
          }
          r.fullPath = fullPath;
          _routes.push(r);
        });
      return _routes;
    }
  }
};
</script>
