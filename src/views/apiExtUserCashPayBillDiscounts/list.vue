<template>
  <div class="app-container">
    
    <div class="filter-container">
      <el-button class="filter-item" size="medium" @click="handleCreate()" type="success" icon="el-icon-plus">增加满减规则</el-button>
    </div>
    
    <el-table :data="list" v-loading="listLoading" element-loading-text="Loading" fit highlight-current-row empty-text="暂无数据" @selection-change="handleSelectionChange">
      <el-table-column prop="consume" label="满（元）"></el-table-column>
      <el-table-column prop="discounts" label="减（元）"></el-table-column>
      <el-table-column label="是否叠加">
        <template slot-scope="scope">
          <el-tag type="success" v-if="scope.row.loop">叠加</el-tag>
          <el-tag type="danger" v-if="!scope.row.loop">不叠加</el-tag>
        </template>
      </el-table-column>
      <el-table-column label="启用模块">
        <template slot-scope="scope">
          <el-tag type="success" v-if="scope.row.openScenePay">现场买单</el-tag>
          <el-tag type="warning" v-if="scope.row.openOrder">商城订单</el-tag>
        </template>
      </el-table-column>
      <el-table-column label="添加/修改时间" width="160">
        <template slot-scope="scope">
          {{scope.row.dateAdd}}
          <br>
          {{scope.row.dateUpdate ? scope.row.dateUpdate : '-'}}
        </template>
      </el-table-column>
      <el-table-column label="操作" width="100%">
        <template slot-scope="scope">
          <el-button type="text" @click="handleUpdate(scope.row.id)">编辑</el-button>
          <el-button type="text" @click="delData(scope.row.id)" style="color:red">删除</el-button>
        </template>
      </el-table-column>
    </el-table>

    <el-dialog :title="pushData.dialogTitle" :visible.sync="pushData.dialogFormVisible" :close-on-click-modal="false" :close-on-press-escape="false">
      <el-form :rules="rules" ref="addEditPopForm" :model="pushData" label-position="left" label-width="100px">
        <el-form-item label="满" prop="consume">
          <el-col :span="6">
            <el-input v-model="pushData.consume" clearable @keyup.enter.native="handleCreateSave"><template slot="append">元</template></el-input>
          </el-col>
        </el-form-item>
        <el-form-item label="减" prop="discounts">
          <el-col :span="6">
            <el-input v-model="pushData.discounts" clearable @keyup.enter.native="handleCreateSave"><template slot="append">元</template></el-input>
          </el-col>
        </el-form-item>
        <el-form-item label="是否叠加" prop="loop">
          <el-col :span="6">
            <el-select class="filter-item" v-model="pushData.loop" style="width:100%;">
              <el-option label="叠加" :value="true"></el-option>
              <el-option label="不叠加" :value="false"></el-option>
            </el-select>
          </el-col>
          <el-col :span="18" style="color:red;padding-left:20px;">假如满设置的100减10元，用户消费200元是否直接减20元</el-col>
        </el-form-item>
        <el-form-item label="现场买单" prop="openScenePay">
          <el-col :span="6">
            <el-select class="filter-item" v-model="pushData.openScenePay" style="width:100%;">
              <el-option label="启用" :value="true"></el-option>
              <el-option label="不启用" :value="false"></el-option>
            </el-select>
          </el-col>
          <el-col :span="18" style="color:red;padding-left:20px;">是否允许优惠买单接口使用本条满减规则</el-col>
        </el-form-item>
        <el-form-item label="商城订单" prop="openOrder">
          <el-col :span="6">
            <el-select class="filter-item" v-model="pushData.openOrder" style="width:100%;">
              <el-option label="启用" :value="true"></el-option>
              <el-option label="不启用" :value="false"></el-option>
            </el-select>
          </el-col>
          <el-col :span="18" style="color:red;padding-left:20px;">商城模块，下单接口是否允许使用本条满减规则</el-col>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="pushData.dialogFormVisible = false">取消</el-button>
        <el-button type="primary" @click="handleCreateSave">确定</el-button>
      </div>
    </el-dialog>

  </div>
</template>

<script>
import { fetchDataList, infoData, delData, saveData } from '@/api/apiExtUserCashPayBillDiscounts'
import { Message, MessageBox } from 'element-ui'
import { mapGetters } from 'vuex'
import { getToken } from '@/utils/auth'

export default {
  computed: {
    ...mapGetters([
      'centerUserBase'
    ])
  },
  data() {
    return {
      rules: {
        consume: [
          { required: true, message: '不能为空'},
        ],
        discounts: [
          { required: true, message: '不能为空'},
        ],
        loop: [
          { required: true, message: '不能为空'},
        ],
        openScenePay: [
          { required: true, message: '不能为空'},
        ],
        openOrder: [
          { required: true, message: '不能为空'},
        ],
      },

      searchData:{},

      pushData: {
        dialogTitle : undefined,
        dialogFormVisible:false,

        id:undefined,
        consume:100,
        discounts:10,
        loop: false,
        openScenePay: true,
        openOrder: false,
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
  methods: {
    handleSelectionChange(val) {
      this.multipleSelection = val
    },
    fetchData() {
      this.list = null
      this.listLoading = true
      fetchDataList(this.searchData).then(response => {
        if (response.code === 0) {
          this.list = response.data.result
        }
        this.listLoading = false
      })
    },
    handleCreate(){
      this.pushData = Object.assign({}, this.pushDataTmp)
      this.pushData.dialogTitle = '添加满减规则'
      this.pushData.dialogFormVisible = true
      this.$nextTick(() => {
        this.$refs['addEditPopForm'].clearValidate()
      })
    },
    handleUpdate(id){
      infoData(id).then(res => {
        if (res.code !== 0) {
          Message({
            message: res.msg,
            type: 'error',
            duration: 3 * 1000
          })
        } else {
          this.pushData = Object.assign({}, this.pushDataTmp, res.data, {dateType:'' + res.data.dateType, isPub:'' + res.data.isPub, content:res.data.value})
          this.pushData.dialogTitle = '修改满减规则'
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
