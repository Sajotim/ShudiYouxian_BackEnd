<template>
  <div class="app-container" v-loading="listLoading" element-loading-text="Loading">  
    
    <el-button size="small" type="primary" @click="installAll">启用所有模块</el-button>  
    <el-button size="small" type="danger" @click="uninstallAll">禁用所有模块</el-button>  
    <el-button size="small" type="success" @click="installShopMods">一键配置商城模块</el-button>  
    <div style="margin-top:20px;margin-bottom:20px;">
      <el-alert
        title="启用/禁用模块后，请F5刷新后台后即可看到左侧菜单的最新变化！（不刷新页面，菜单不变）"
        type="success"
        :closable="false">
      </el-alert>
    </div>
    <el-row :gutter="16" style="margin-top:20px;">
      <el-col :span="6" v-for="item in list" :key="item.id" style="margin-bottom:15px;">
        <el-card class="box-card">
          <div slot="header" class="clearfix">
            <el-badge :hidden="!item.isVip" value="会员专享"> <span> {{item.name}} &nbsp; </span> </el-badge>
            <el-switch
              style="display: block;float: right; padding: 3px 0"
              v-model="item.switchvalue"
              active-color="#13ce66"
              inactive-color="#ff4949"
              active-text="启用模块"
              @change="switchChange($event, item.id)">
            </el-switch>
          </div>
          <div v-if="item.switchvalue" class="text item">
            QPS:{{item.myApi.qps == 0 ? '不限' : item.myApi.qps}}
            <el-button 
            v-if="item.myApi.qps > 0 || item.myApi.leftNumber != -1"
            style="float: right; padding: 3px 0" 
            type="danger"
            @click="openBuyList(item.id)">购买套餐</el-button>
          </div>
          <div v-else class="text item">
            QPS:{{item.qps == 0 ? '不限' : item.qps}}
          </div>
          <div v-if="item.switchvalue" class="text item">
            剩余次数:{{item.myApi.leftNumber == -1 ? '不限' : item.myApi.leftNumber}}
          </div>
          <div v-else class="text item">
            免费次数:{{item.freeNumber == -1 ? '不限' : item.freeNumber}}
          </div>
        </el-card>
      </el-col>
    </el-row>

    <el-dialog title="在线选购套餐" :visible.sync="dialogTableVisible2">
      <el-table :data="list2" fit highlight-current-row empty-text="暂无数据">
        <el-table-column prop="qps" label="QPS"></el-table-column>
        <el-table-column prop="leftNumber" label="次数"></el-table-column>
        <el-table-column prop="price" label="价格"></el-table-column>
        <el-table-column label="操作">
          <template slot-scope="scope">
            <el-button type="text" class='delete' @click="goBuy(scope.row.id)" style="color:red">购买</el-button>
          </template>
        </el-table-column>
      </el-table>
    </el-dialog>
    
    <el-dialog title="在线支付" :visible.sync="dialogTableVisible">
      <form :action="alipayPostData.gateway" method="POST" target="_blank">
        <input type="hidden" v-for="(v, k) in alipayPostData.params" v-bind:key="k" :name="k" :value="v" />
        <el-button type="success" native-type="submit" round>打开支付宝</el-button>
      </form>
    </el-dialog>
  </div>
</template>

<script>
import { allApiList, myInstallApiList, installApi, uninstallApi, apiBuyList, getPayData } from '@/api/centerUserApi'
import { Message, MessageBox } from 'element-ui'
import { mapGetters } from 'vuex'

export default {
  computed: {
    ...mapGetters([
      'centerUserBase'
    ])
  },
  data() {
    return {
      page:1,
      pageSize:10,
      totalRow:0,

      list: [],
      list2: [],
      listLoading: true,
      dialogTableVisible : false,
      dialogTableVisible2 : false,
      alipayPostData:{}
    }
  },
  mounted() {
    this.myInstallApiList()
  },
  methods: {
    handleSizeChange(val) {
      this.pageSize = val;
      this.fetchData();
    },
    handleCurrentChange(val) {
      this.page = val;
      this.fetchData();
    },
    allApiList(myapis) {
      allApiList(1, 10000, {isShow:true}).then(response => {
        let apis = []
        if (response.code == 0) {
          apis = response.data.result
          this.initApisFieldIsUse(apis, myapis)
        } else {
          this.listLoading = false
        }
      })
    },
    myInstallApiList() {
      this.listLoading = true
      myInstallApiList(1, 10000).then(res => {
        let myapis = []
        if (res.code === 0) {
          myapis = res.data.result
        }
        this.allApiList(myapis)
      })
    },
    initApisFieldIsUse(apis, myapis) {
      apis.forEach(ele => {
        const o = myapis.find(myApi => {
          return myApi.apiId === ele.id
        })
        ele.myApi = o
        if (o && o.isUse) {
          ele.switchvalue = true
        } else {
          ele.switchvalue = false
        }
      })
      this.list = apis
      this.listLoading = false
    },
    switchChange(switchvalue, id) {
      let resResult = null
      if (switchvalue) {
        resResult = installApi(id)
      } else {
        resResult = uninstallApi(id)
      }
      resResult.then(res => {
        if (res.code === 0) {
          Message({
            message: '操作成功',
            type: 'success',
            duration: 1 * 1000
          })
          this.myInstallApiList()
        } else {
          Message({
            message: res.msg,
            type: 'error',
            duration: 3 * 1000
          })
        }
      })
    },
    installAll() {
      this.$confirm('确定要安装所有模块吗?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        this.list.forEach(ele => {
          installApi(ele.id)
        })
        Message({
          message: '安装成功',
          type: 'success',
          duration: 1000
        })
        this.myInstallApiList()
      }).catch(() => {})
    },
    uninstallAll() {
      this.$confirm('确定要卸载所有模块吗?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        this.list.forEach(ele => {
          uninstallApi(ele.id)
        })
        Message({
          message: '卸载成功',
          type: 'success',
          duration: 1000
        })
        this.myInstallApiList()
      }).catch(() => {});
    },
    installShopMods(){
      this.$confirm('确定要一键配置商城模块吗?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        [5, 6, 18, 17, 28, 30, 36, 37, 41, 50, 70, 88, 94, 69, 106, 101, 34, 116, 122, 113, 68, 21].forEach(id => {
          installApi(id)
        })
        Message({
          message: '配置成功',
          type: 'success',
          duration: 1000
        })
        this.myInstallApiList()
      }).catch(() => {});
    },
    openBuyList(apiId){
      apiBuyList(apiId).then(res => {
        if (res.code == 0) {
          this.list2 = res.data
          this.dialogTableVisible2 = true
        } else {
          Message({
            message: res.msg,
            type: 'error',
            duration: 3 * 1000
          })
        }        
      })
    },
    goBuy(id){
      getPayData(this.centerUserBase.id, id).then(res => {
        // 弹框点击确定调整支付宝付款
        this.alipayPostData = res.data;
        this.dialogTableVisible = true;
      })
    }
  }
}
</script>
<style>
  .text {
    font-size: 14px;
  }

  .item {
    margin-bottom: 18px;
  }

  .clearfix:before,
  .clearfix:after {
    display: table;
    content: "";
  }
  .clearfix:after {
    clear: both
  }

  .box-card {
    width: 100%;
  }
</style>