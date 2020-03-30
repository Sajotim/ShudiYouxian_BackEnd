<template>  
  <div v-if="centerUserBase.agentId == 1708 || isEmpty" class="dashboard-welcom">
    <h2>您已成功登陆管理后台！</h2>
  </div>  
  <div v-else class="dashboard-container">
    <el-row :gutter="40" class="panel-group">
      <el-col v-checkInstalledApi="[18, 25, 166]" :xs="12" :sm="12" :lg="6" class="card-panel-col">
        <div class="card-panel user-box" @click="goRoutePage('/user/apiExtUser/list')">
          <div class="card-panel-icon-wrapper icon-people">
            <svg-icon icon-class="user" class-name="card-panel-icon" />
          </div>
          <div class="column-box" />
          <div class="card-panel-description">
            <div class="card-panel-text">用户数</div>
            <count-to :start-val="0" :end-val="statisticsData.users" :duration="1000" class="card-panel-num" />
          </div>
        </div>
      </el-col>
      <el-col v-checkInstalledApi="[41]" :xs="12" :sm="12" :lg="6" class="card-panel-col">
        <div class="card-panel income-box" @click="goRoutePage('/user/apiExtOrder/list')">
          <div class="card-panel-icon-wrapper icon-message">
            <svg-icon icon-class="order" class-name="card-panel-icon" />
          </div>
          <div class="column-box" />
          <div class="card-panel-description">
            <div class="card-panel-text">订单数</div>
            <count-to :start-val="0" :end-val="statisticsData.orders" :duration="1000" class="card-panel-num" />
          </div>
        </div>
      </el-col>
      <el-col v-if="hasFileStatistics" :xs="12" :sm="12" :lg="6" class="card-panel-col">
        <div class="card-panel jkje-box" @click="goRoutePage('/user/apiExtDfs/list')">
          <div class="card-panel-icon-wrapper icon-money">
            <svg-icon icon-class="files" class-name="card-panel-icon" />
          </div>
          <div class="column-box" />
          <div class="card-panel-description">
            <div class="card-panel-text">存储空间</div>
            <font style="color:red">已用 {{statisticsData.fileCapacity}}</font>
          </div>
        </div>
      </el-col>
      <el-col v-checkInstalledApi="[37]" :xs="12" :sm="12" :lg="6" class="card-panel-col">
        <div class="card-panel pz-box" @click="goRoutePage('/user/apiExtShopGoods/list')">
          <div class="card-panel-icon-wrapper icon-shoppingCard">
            <svg-icon icon-class="goods" class-name="card-panel-icon" />
          </div>
          <div class="column-box" />
          <div class="card-panel-description">
            <div class="card-panel-text">商品数量</div>
            <count-to :start-val="0" :end-val="statisticsData.goods" :duration="1000" class="card-panel-num" />
          </div>
        </div>
      </el-col>
    </el-row>
    <el-row v-if="!isSubAdmin" :gutter="40">
      <el-col :span="12">
        <el-card class="box-card">
          <div slot="header" class="clearfix">
            <span>基本信息</span>
          </div>
          <div class="text item">
            <table class="baseInfoTable">                           
              <tr v-if="centerUserBase.businessStyle != 'noodles'">
                <th width="140px" align="left">后台管理地址</th>
                <td>
                  <a :href="'https://' + centerUserBase.domain + '.sajo.fun'" target="_blank">https://{{centerUserBase.domain}}.sajo.fun</a>
                </td>
              </tr>
              <tr>
                <th width="140px" align="left">上次登录时间</th>
                <td>
                  {{centerUserBase.dateLogin}}
                </td>
              </tr>
            </table>
          </div>
        </el-card>
      </el-col>
      <el-col :span="12">
        <el-row :gutter="40">
        </el-row>
      </el-col>
    </el-row>
  </div>
</template>

<script>
import CountTo from 'vue-count-to'
import { mapGetters } from 'vuex'
import { statisticsData } from '@/api/centerUser'
import { statistics } from '@/api/apiExtDfs'
import { changeDomain, changeName, wxInfo, unBindWX } from '@/api/centerUser'

export default {
  name: 'Dashboard',
  components: {
    CountTo
  },
  computed: {
    ...mapGetters([
      'centerUserBase'
    ])
  },
  data() {
    return {
      isSubAdmin: true,
      wxInfo:{},
      collapseActiveName:'1',
      statisticsData:{
        users:0,
        orders:0,
        goods:0,
        fileCapacity:'-',
        fileCapacityLeft: '-',
        fileNumbers: 0
      },
      isEmpty: true,
      hasFileStatistics: false
    }
  },
  watch: {
    centerUserBase:function(newVal,oldVal){
      this.isSubAdmin = this.centerUserBase.adminCenterUser != null
      this.remindLimit()
    }
  },
  mounted() {
    this.isSubAdmin = this.centerUserBase.adminCenterUser != null
    statisticsData().then(res => {
      if (res.code == 0) {
        this.isEmpty = false
        this.statisticsData = Object.assign({}, this.statisticsData, res.data)
      }
    })
    statistics().then(res => {
      if (res.code == 0) {
        this.isEmpty = false
        this.hasFileStatistics = true
        this.statisticsData.fileCapacity = res.data.capacityStr
        this.statisticsData.fileNumbers = res.data.count
        this.statisticsData.fileCapacityLeft = res.data.capacityLeftStr
      }
    })
    this.fetchWxInfo()
    this.remindLimit()
  },
  methods: {
    fetchWxInfo (){
      wxInfo().then(res => {
        if (res.code == 0) {
          this.wxInfo = res.data
        }
      })
    },
    goPluginBuyPage(type){
      this.$router.push({ path: '/user/pluginInfo/list', query: {type} })
    },
    goRoutePage(url){
      this.$router.push({ path: url})
    },
    remindLimit(){ // 检测有没有被限制
      if (this.centerUserBase.extStatus && this.centerUserBase.extStatus.limit_upyun) {
        let _html = `<p>您当前图片空间已满，上传图片功能已停用；</p>`;
        _html += `<p>1、前往 "系统设置" --> "上传文件管理" , 删除不用的图片节约空间；</p>`;
        _html += `<p>2、或者 购买存储包抵扣超出部分容量；</p>`;
        _html += `<p>超出容量图片删除后，上传图片功能自动恢复；</p>`;
        this.$alert(_html, '图片空间已满', {
          dangerouslyUseHTMLString: true,
          showCancelButton: false,
          confirmButtonText: '我知道了'
        });
      }
    },
    modifyMobile(){
      this.$router.push({path: '/modifyMobile'})
    },
    changeDomain() {
      this.$prompt('您只需要输入类似 https://abc.sajo.fun 的 abc 部分即可', '请输入新域名', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        inputValue:this.centerUserBase.domain
      }).then(({
        value
      }) => {
        if (!value) {
            this.$message({
              type: 'error',
              message: '域名不能为空'
            })
            return
          }
        changeDomain(value).then(response => {          
          if(response.code === 0) {
            this.$message({
              type: 'success',
              message: '修改成功',
              onClose:()=>{
                location.reload()
              }
            })
          } else {
            this.$message({
              type: 'error',
              message: response.msg
            })
          }
        })
      }).catch(() => {
        // this.$message({
        //   type: 'info',
        //   message: '取消输入'
        // })
      })
    },
    changeName() {
      this.$prompt('请输入真实姓名', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        inputValue:this.centerUserBase.realName
      }).then(({
        value
      }) => {
        if (!value) {
            this.$message({
              type: 'error',
              message: '姓名不能为空'
            })
            return
          }
        changeName(value).then(response => {          
          if(response.code === 0) {
            this.$message({
              type: 'success',
              message: '修改成功',
              onClose:()=>{
                location.reload()
              }
            })
          } else {
            this.$message({
              type: 'error',
              message: response.msg
            })
          }
        })
      }).catch(() => {
        // this.$message({
        //   type: 'info',
        //   message: '取消输入'
        // })
      })
    },    
    unBindWX(){
      this.$confirm('确定要解除绑定吗?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        unBindWX().then(res => {
          this.$message({
            type: 'success',
            message: '解除成功'
          })
          this.fetchWxInfo()
        })
      }).catch(() => {});
    },    
    goBuyFileSpace(){
      this.$router.push({path: '/user/centerUserResourceBundle/list'})
    },
    goResourceLogs(){
      this.$router.push({path: '/user/apiExtDfs/resourceLog'})
    },
  }
}
</script>

<style lang="scss" scoped>
.dashboard-welcom {
  margin: 50px;
}
.dashboard {
  &-container {
    margin: 30px;
  }
}
.panel-group {
  margin-top: 18px;
  .card-panel-col{
    margin-bottom: 32px;
  }
  .card-panel {
    height: 108px;
    cursor: pointer;
    font-size: 12px;
    position: relative;
    overflow: hidden;
    color: #666;
    background: #fff;
    box-shadow: 0px 2px 20px rgba(0, 0, 0, 0.1);
    border-radius: 4px;
    display: flex;
    justify-content: center;
    align-items: center;
    .icon-people {
      color: #40c9c6;
    }
    .icon-message {
      color: #36a3f7;
    }
    .icon-money {
      color: #f4516c;
    }
    .icon-shoppingCard {
      color: #34bfa3
    }
    .card-panel-icon-wrapper {
      width: 30%;
      height: 60px;
      display: flex;
      justify-content: space-around;
      align-items: center;
      padding: 16px;
      transition: all 0.38s ease-out;
      border-radius: 6px;
    }
    .card-panel-icon {
      float: left;
      font-size: 48px;
    }
    .card-panel-description {
      width: 68%;
      height: 60px;
      display: flex;
      flex-direction: column;
      justify-content: center;
      align-items: center;
      font-weight: bold;
      margin-left: 0px;
      .card-panel-text {
        line-height: 18px;
        color: rgba(0, 0, 0, 0.45);
        font-size: 16px;
        margin-bottom: 12px;
      }
      .card-panel-num {
        font-size: 20px;
      }
    }
    &:hover {
      color: #fff;
      .card-panel-icon-wrapper {
        color: #fff;
      }
      .card-panel-text{
        color: #fff;
      }
    }
  }
  .column-box{
    width: 2px;
    height: 60px;
    background: #e6e6e6;
  }
  .user-box:hover{
    background: #40c9c6;
  }
  .income-box:hover{
    background: #36a3f7;
  }
  .jkje-box:hover{
    background: #f4516c;
  }
  .pz-box:hover{
    background: #34bfa3;
  }  
}
.baseInfoTable {
  width: 100%;
  line-height:40px;
}
.baseInfoTable th {
  border-bottom: 1px solid #ebeef5;
}
.baseInfoTable td {
  border-bottom: 1px solid #ebeef5;
  color:green;
}
</style>
