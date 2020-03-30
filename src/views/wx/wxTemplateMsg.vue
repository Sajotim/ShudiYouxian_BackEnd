<template>
  <div class="app-container">
    
    <div class="filter-container">
      <el-select clearable style="width: 200px" class="filter-item" v-model="searchData.type" placeholder="类型">
        <el-option label="小程序" value="0"></el-option>
        <el-option label="服务号" value="1"></el-option>
      </el-select>
      <el-select clearable style="width: 200px" class="filter-item" v-model="searchData.module" placeholder="所属模块">
        <el-option label="商城订单" value="order"></el-option>
        <el-option label="留言评论" value="comment"></el-option>
        <el-option label="CMS文章投稿" value="cmsnews"></el-option>
        <el-option label="分销商申请" value="saleDistributionApply"></el-option>
      </el-select>
      <el-input clearable @keyup.enter.native="fetchData" style="width: 200px;" class="filter-item" placeholder="模板消息ID" v-model="searchData.template_id">
      </el-input>
      <el-select clearable style="width: 200px" class="filter-item" v-model="searchData.isUse" placeholder="启用状态">
        <el-option label="启用" value="true"></el-option>
        <el-option label="禁用" value="false"></el-option>
      </el-select>
      <el-button class="filter-item" size="medium" type="primary" icon="el-icon-search" @click="fetchData">搜索</el-button>
      <el-button class="filter-item" size="medium" style="margin-left: 10px;" @click="handleCreate" type="success" icon="el-icon-plus">添加</el-button>
    </div>
    
    <el-table :data="list" v-loading="listLoading" element-loading-text="Loading" fit highlight-current-row empty-text="暂无数据" @selection-change="handleSelectionChange">
      <el-table-column label="类型/模板ID">
        <template slot-scope="scope">
          <el-tag type="success" v-if="scope.row.type == 0">小程序</el-tag>
          <el-tag type="danger" v-if="scope.row.type == 1">服务号</el-tag><br>
          {{ scope.row.templateId }}
        </template>        
      </el-table-column>
      <el-table-column label="模块/触发状态">
        <template slot-scope="scope">
          {{ scope.row.moduleStr }}<br>
          {{ scope.row.trigger }}
        </template>        
      </el-table-column>
      <el-table-column label="状态" width="100%">
        <template slot-scope="scope">
          <el-tag type="success" v-if="scope.row.isUse">启用</el-tag>
          <el-tag type="danger" v-if="!scope.row.isUse">禁用</el-tag>
        </template>
      </el-table-column>
      <el-table-column label="添加/修改" width="160">
        <template slot-scope="scope">
          {{scope.row.dateAdd}}<br>{{scope.row.dateUpdate?scope.row.dateUpdate:'-'}}
        </template>
      </el-table-column>
      <el-table-column label="操作" width="100%">
        <template slot-scope="scope">
          <el-button type="text" @click="handleUpdate(scope.row.id)">编辑</el-button>
          <el-button type="text" @click="delData(scope.row.id)" style="color:red">删除</el-button>
        </template>
      </el-table-column>
    </el-table>
    <el-pagination
      @size-change="handleSizeChange"
      @current-change="handleCurrentChange"
      :current-page="page"
      :page-sizes="[10, 20, 50, 100]"
      :page-size="pageSize"
      layout="total, sizes, prev, pager, next, jumper"
      :total="totalRow" style="margin-top:20px;">
    </el-pagination>

    <el-dialog :title="pushData.dialogTitle" :visible.sync="pushData.dialogFormVisible" :close-on-click-modal="false" :close-on-press-escape="false">
      <el-form :rules="rules" ref="addEditPopForm" :model="pushData" label-position="left" label-width="100px">
        <el-form-item label="类型" prop="type" >
          <el-select v-model="pushData.type" placeholder="请选择">
            <el-option label="小程序" :value="0"></el-option>
            <el-option label="服务号" :value="1"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="模块" prop="module" >
          <el-select v-model="pushData.module" placeholder="请选择">
            <el-option label="商城订单" value="order"></el-option>
            <el-option label="留言评论" value="comment"></el-option>
            <el-option label="CMS文章投稿" value="cmsnews"></el-option>
            <el-option label="分销商申请" value="saleDistributionApply"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="模板ID" prop="templateId" >
          <el-input v-model="pushData.templateId" clearable></el-input>
        </el-form-item>
        <el-form-item label="触发状态" prop="trigger" >
          <el-col :span="4">
            <el-input v-model="pushData.trigger" clearable></el-input>
          </el-col>
          <el-col :span="20" style="padding-left:20px;color:orange;">数字类型，对应模块的数据，状态改变为该状态时发送模板消息</el-col>
        </el-form-item>
        <el-form-item label="链接地址" prop="url" >
          <el-input v-model="pushData.url" clearable></el-input>
        </el-form-item>
        <el-form-item label="模板数据" prop="content" >
          <el-input v-model="pushData.content" type="textarea" :rows="10" clearable></el-input>
          <div>变量的格式、长度有限制: <a href="https://developers.weixin.qq.com/miniprogram/dev/api-backend/open-api/subscribe-message/subscribeMessage.send.html" target="_blank" style="color:red;">查看说明</a></div>
        </el-form-item>
        <el-form-item label="状态" prop="isUse" >
          <el-select v-model="pushData.isUse" placeholder="请选择">
            <el-option label="启用" :value="true"></el-option>
            <el-option label="禁用" :value="false"></el-option>
          </el-select>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button size="medium" @click="pushData.dialogFormVisible = false">取消</el-button>
        <el-button size="medium" type="primary" @click="handleCreateSave">确定</el-button>
      </div>
    </el-dialog>

  </div>
</template>

<script>
import { fetchDataList, infoData, delData, saveData } from '@/api/wxTemplateMsg'
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

      rules: {
        type: [
          { required: true, message: '不能为空'},
        ],
        module: [
          { required: true, message: '不能为空'},
        ],
        templateId: [
          { required: true, message: '不能为空'},
        ],
        trigger: [
          { required: true, message: '不能为空'},
        ],
        content: [
          { required: true, message: '不能为空'},
        ],
        isUse: [
          { required: true, message: '不能为空'},
        ],
      },

      searchData:{},

      pushData: {
        dialogTitle : undefined,
        dialogFormVisible:false,

        id:undefined,
        type:0,
        module:undefined,
        templateId:undefined,
        trigger:undefined,
        url:undefined,
        content:`{
  "thing6": {
    "value": "您的订单已发货，请注意查收",
    "color": "#173177"
  },
  "character_string1": {
    "value": "00001",
    "color": "#173177"
  },
  "date9": {
    "value": "2019-12-08 21:16:50",
    "color": "#173177"
  }
}`,
        isUse: true,
      },

      multipleSelection: [],
      list: null,
      listLoading: true,
      statisticsData:{}
    }
  },
  created() {
    this.pushDataTmp = Object.assign({}, this.pushData)
    this.fetchData()
  },
  mounted() {
    
  },
  methods: {
    handleSizeChange(val) {
      this.pageSize = val;
      this.fetchData();
    },
    handleCurrentChange(val) {
      this.page = val
      this.fetchData()
    },
    handleSelectionChange(val) {
      this.multipleSelection = val
    },
    fetchData() {
      this.list = null
      this.listLoading = true
      fetchDataList(this.page, this.pageSize, this.searchData).then(response => {
        if (response.code == 0) {
          this.list = response.data.result
          this.totalRow = response.data.totalRow
        }
        this.listLoading = false
      })
    },
    handleCreate(){
      this.pushData = Object.assign({}, this.pushDataTmp)
      this.pushData.dialogTitle = '增加模板/订阅消息'
      this.pushData.dialogFormVisible = true
      this.$nextTick(() => {
        this.$refs['addEditPopForm'].clearValidate()
      })
    },
    handleUpdate(id){
      infoData(id).then(res => {
        if (res.code != 0) {
          Message({
            message: res.msg,
            type: 'error',
            duration: 3 * 1000
          })
        } else {
          this.pushData = Object.assign({}, this.pushDataTmp, res.data)
          this.pushData.dialogTitle = '修改模板/订阅消息'
          this.pushData.dialogFormVisible = true
          this.$nextTick(() => {
            this.$refs['addEditPopForm'].clearValidate()
          })
        }
      }).catch(e=>{
        console.error(e);
      })
    },
    handleCreateSave(){
      this.$refs['addEditPopForm'].validate((valid) => {
        if (valid) {
          saveData(this.pushData).then((res) => {
            this.pushData.dialogFormVisible = false
            if (res.code == 0) {
              Message({
                message: '操作成功',
                type: 'success',
                duration: 1 * 1000
              })
              this.fetchData()
            } else {
              Message({
                message: res.msg,
                type: 'error',
                duration: 3 * 1000
              })
            }
          }).catch(e=>{
            console.error(e);
          })
        }
      })
    },
    statistics(){
      statistics().then(res => {
        // 弹框点击确定调整支付宝付款
        this.statisticsData = res.data
      })
    },
    delData(id){
      this.$confirm('删除无法恢复, 是否继续?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        delData(id).then(res => {
          Message({
            message: '删除成功',
            type: 'success',
            duration: 1 * 1000
          })
          this.fetchData()
        })
      }).catch(() => {});
    }
  }
}
</script>

<style rel="stylesheet/scss" lang="scss">
.filter-container {
  padding-bottom: 10px;
  .filter-item {
    display: inline-block;
    vertical-align: middle;
    margin-bottom: 10px;
  }
}

</style>
