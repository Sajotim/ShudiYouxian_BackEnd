<template>
  <div v-if="buyedPlugin" ref="rightPanel" :class="{show:show}" class="rightPanel-container">
    <div class="rightPanel-background" />
    <div class="rightPanel">
      <div class="handle-button" :style="{'top':buttonTop+'px','background-color':'#486586'}" @click="show=!show">
        <i :class="show?'el-icon-close':'el-icon-info'" />
      </div>
      <div class="rightPanel-items">
        <div class="gooking">
          <el-steps v-if="remarkList && remarkList.length > 0" :space="120" direction="vertical" :active="remarkList.length">
            <el-step v-for="item in remarkList" :key="item.id" icon="el-icon-info" :title="item.dateAdd" :description="item.admin +'记录: ' + item.remark"></el-step>
          </el-steps>
          <el-alert
            v-if="!remarkList || remarkList.length === 0"
            title="-=暂无记录=-"
            center
            type="error"
            :closable="false">
          </el-alert>
          <p>&nbsp;</p>
          <el-form>
            <el-form-item prop="username">
              <el-input
                type="textarea"
                :rows="5"
                placeholder="请填写备忘事项"
                v-model="remark">
              </el-input>
            </el-form-item>          
          </el-form>
          <el-button type="danger" size="small" style="width:100%" @click="addRemark">填写备注</el-button>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { addClass, removeClass } from '@/utils'
import { fetchRemarkList, saveRemark } from '@/api/remark'
import { buyedPlugins } from '@/api/pluginInfo'
import { mapGetters } from 'vuex'

export default {
  name: 'Remark',
  props: {
    type: {
      default: '',
      type: String
    },
    refId: {
      default: 0,
      type: Number
    },
    clickNotClose: {
      default: false,
      type: Boolean
    },
    buttonTop: {
      default: 450,
      type: Number
    }
  },
  computed: {
    ...mapGetters([
      'centerUserBase'
    ]),
    theme() {
      return this.$store.state.settings.theme
    }
  },
  data() {
    return {
      show: false,
      buyedPlugin: false,

      remark: undefined,
      remarkList: []
    }
  },
  watch: {
    show(value) {
      if (value && !this.clickNotClose) {
        this.addEventClick()
      }      
    },
    centerUserBase(value) {
      this.checkBuyedPlugins()
    },
    refId(value) {
      this.fetchRemarkList()
    }
  },
  mounted() {    
    this.checkBuyedPlugins()
    this.fetchRemarkList()
    //this.insertToBody()
  },
  beforeDestroy() {
    const elx = this.$refs.rightPanel
    elx.remove()
  },
  methods: {
    addEventClick() {
      window.addEventListener('click', this.closeSidebar)
    },
    closeSidebar(evt) {
      const parent = evt.target.closest('.rightPanel')
      if (!parent) {
        this.show = false
        window.removeEventListener('click', this.closeSidebar)
      }
    },
    insertToBody() {
      const elx = this.$refs.rightPanel
      const body = document.querySelector('body')
      body.insertBefore(elx, body.firstChild)
    },
    checkBuyedPlugins(){
      if (this.centerUserBase.vipLevel == 2) {
        this.buyedPlugin = true
        return
      }
      buyedPlugins().then(res => {
        if (res.code == 0) {          
          res.data.forEach(ele => {
            if (ele.type === 6) {
              this.buyedPlugin = true
            }
          })
        }
      })
    },
    fetchRemarkList () {
      if (!this.refId) {
        return
      }
      fetchRemarkList(this.type, this.refId).then(res => {
        this.remarkList = []
        if (res.code === 0) {
          this.remarkList = res.data
        }
      })
    },
    addRemark () {
      const remark = this.remark
      if (!remark) {
        this.$message.error('备忘事项内容不能为空');
        return
      }
      if (remark.length > 200) {
        this.$message.error('备忘事项最多200字');
        return
      }
      saveRemark(this.type, this.refId, remark).then(res => {
        if (res.code != 0) {
          this.$message.error(res.msg);
          return
        }
        this.remark = undefined
        this.fetchRemarkList()
      })
    }
  }
}
</script>
<style lang="scss" scoped>
.rightPanel-background {
  opacity: 0;
  transition: opacity .3s cubic-bezier(.7, .3, .1, 1);
  background: rgba(0, 0, 0, .2);
  width: 0;
  height: 0;
  top: 0;
  left: 0;
  position: fixed;
  z-index: -1;
}

.rightPanel {
  background: #fff;
  z-index: 3000;
  position: fixed;
  height: 100vh;
  width: 100%;
  max-width: 260px;
  top: 0px;
  left: 0px;
  box-shadow: 0px 0px 15px 0px rgba(0, 0, 0, .05);
  transition: all .25s cubic-bezier(.7, .3, .1, 1);
  transform: translate(100%);
  z-index: 40000;
  left: auto;
  right: 0px;
}

.show {
  transition: all .3s cubic-bezier(.7, .3, .1, 1);

  .rightPanel-background {
    z-index: 20000;
    opacity: 1;
    width: 100%;
    height: 100%;
  }

  .rightPanel {
    transform: translate(0);
  }
}

.handle-button {
  position: absolute;
  left: -48px;
  border-radius: 6px 0 0 6px !important;
  width: 48px;
  height: 48px;
  pointer-events: auto;
  cursor: pointer;
  pointer-events: auto;
  font-size: 24px;
  text-align: center;
  color: #fff;
  line-height: 48px;

  i {
    font-size: 24px;
    line-height: 48px;
  }
}
.gooking {
  padding: 20px;
  height: 100vh;
  overflow:scroll;
}
.el-steps--vertical {
  height: auto;
}
</style>
