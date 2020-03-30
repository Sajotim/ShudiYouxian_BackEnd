<template>
  <div class="app-container">
    
    <div class="filter-container">
      <el-select clearable style="width: 200px" class="filter-item" v-model="searchData.status" placeholder="是否启用">
        <el-option label="启用" value="0"></el-option>
        <el-option label="禁用" value="1"></el-option>
      </el-select>
      <el-button class="filter-item" type="primary" size="medium" icon="el-icon-search" @click="fetchData">搜索</el-button>
      <el-button class="filter-item" size="medium" style="margin-left: 10px;" @click="handleCreate" type="success" icon="el-icon-plus">添加会员等级</el-button>
    </div>
    
    <el-table ref="singleTable" :data="list" v-loading="listLoading" element-loading-text="Loading" fit highlight-current-row empty-text="暂无数据" @selection-change="handleSelectionChange" @expand-change="handleExpandChange">
      <el-table-column type="expand">
        <template slot-scope="scope">
          <el-button class="filter-item" size="mini" @click="handleCreateExpand(scope.row)" type="danger" icon="el-icon-plus">添加收费项目</el-button>
          <el-table :data="listExpand" v-if="listExpand" element-loading-text="Loading" 
            fit highlight-current-row empty-text="暂无设定收费项目">
            <el-table-column label="会员时长">
              <template slot-scope="scope">
                {{ scope.row.duration }} {{ scope.row.unitStr }}
              </template>
            </el-table-column>
            <el-table-column label="收费">
              <template slot-scope="scope">
                <div v-if="scope.row.price > 0">￥ {{ scope.row.price }}</div>
                <div v-else> 免费试用 </div>
              </template>
            </el-table-column>
            <el-table-column label="操作">
              <template slot-scope="scope">
                <el-button type="text" @click="handleUpdateExpand(scope.row)"><i class="el-icon-edit"></i></el-button>
                <el-button type="text" @click="delDataExpand(scope.row)" style="color:red"><i class="el-icon-delete"></i></el-button>
              </template>
            </el-table-column>
          </el-table>
        </template>
      </el-table-column>
      <el-table-column prop="id" label="编号"></el-table-column>
      <el-table-column prop="name" label="名称"></el-table-column>
      <el-table-column prop="rebate" label="折扣"></el-table-column>
      <el-table-column prop="upgradeAmount" label="消费满升级"></el-table-column>
      <el-table-column label="状态" width="100%">
        <template slot-scope="scope">
          <el-tag type="success" v-if="scope.row.status == 0">启用</el-tag>
          <el-tag type="danger" v-if="scope.row.status == 1">禁用</el-tag>
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

    <el-dialog title="设置会员等级" :visible.sync="pushData.dialogFormVisible" :close-on-click-modal="false" :close-on-press-escape="false">
      <el-form :rules="rules" ref="addEditPopForm" :model="pushData" label-position="left" label-width="100px">
        <el-form-item label="等级名称" prop="name">
          <el-input v-model="pushData.name" clearable @keyup.enter.native="handleCreateSave"></el-input>
        </el-form-item>
        <el-form-item label="排序" prop="paixu">
          <el-col :span="4">
            <el-input v-model="pushData.paixu" clearable @keyup.enter.native="handleCreateSave"></el-input>
          </el-col>
          <el-col :span="20"> &nbsp;&nbsp;数字越小越靠前</el-col>
        </el-form-item>
        <el-form-item label="折扣" prop="rebate">
          <el-col :span="4">
            <el-input v-model="pushData.rebate" clearable @keyup.enter.native="handleCreateSave"></el-input>
          </el-col>
          <el-col :span="20"> &nbsp;&nbsp;折 <font style="color:red;"> (这里是折扣，不是比例，常说的九八折要填 9.8)</font></el-col>
        </el-form-item>
        <el-form-item label="自动升级" prop="upgradeAmount">
          <el-col :span="4">
            <el-input v-model="pushData.upgradeAmount" clearable @keyup.enter.native="handleCreateSave"></el-input>
          </el-col>
          <el-col :span="20"> &nbsp;&nbsp;用户累计下单消费满多少金额自动升到该会员 <font style="color:red;"> (交易成功后有效)</font></el-col>
        </el-form-item>
        <el-form-item label="状态" prop="status">
          <el-select v-model="pushData.status" placeholder="请选择">
            <el-option label="启用" :value="0"></el-option>
            <el-option label="禁用" :value="1"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="扩展属性">
          <div v-for="kv in kvList" v-bind:key="kv.k" style="padding-bottom:10px;">
            <el-col :span="4">
              <el-form-item>
                <el-input v-model="kv.k" @keyup.enter.native="handleCreateSave"></el-input>
              </el-form-item>
            </el-col>
            <el-col :span="1" align="center">:</el-col>  
            <el-col :span="4">
              <el-form-item>
                <el-input v-model="kv.v" @keyup.enter.native="handleCreateSave"></el-input>
              </el-form-item>
            </el-col>
            <el-col :span="14"> &nbsp;&nbsp;&nbsp;
              <el-button type="success" @click="addKV()">添加</el-button>
              <el-button type="danger" @click="delKV(kv.k)">删除</el-button>
            </el-col>     
            <div style="clear:both;"></div>     
          </div>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="pushData.dialogFormVisible = false">取消</el-button>
        <el-button type="primary" @click="handleCreateSave">确定</el-button>
      </div>
    </el-dialog>

    <el-dialog :title="pushDataExpand.dialogTitle" :visible.sync="pushDataExpand.dialogFormVisible" :close-on-click-modal="false" :close-on-press-escape="false">
      <el-form :rules="rulesExpand" ref="addEditPopFormExpand" :model="pushDataExpand" label-position="left" label-width="100px">
        <el-form-item label="会员时长">
          <el-col :span="4">
            <el-form-item label="" prop="duration" >
              <el-input v-model="pushDataExpand.duration" clearable @keyup.enter.native="handleCreateSaveExpand"></el-input>
            </el-form-item>
          </el-col>
          <el-col :span="1"> &nbsp;</el-col>
          <el-col :span="4">
            <el-select v-model="pushDataExpand.unit">
              <el-option label="天" :value="0"></el-option>
              <el-option label="月" :value="1"></el-option>
              <el-option label="年" :value="2"></el-option>
            </el-select>
          </el-col>
        </el-form-item>
        <el-form-item label="价格(元)" prop="price" >
          <el-col :span="4">
            <el-input v-model="pushDataExpand.price" clearable @keyup.enter.native="handleCreateSaveExpand"></el-input>
          </el-col>
          <el-col :span="20" style="color:red;"> &nbsp;填0代表免费试用；每个会员每个用户只能试用一次</el-col>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="pushDataExpand.dialogFormVisible = false">取消</el-button>
        <el-button type="primary" @click="handleCreateSaveExpand">确定</el-button>
      </div>
    </el-dialog>

  </div>
</template>

<script>
import { fetchAllUserLevels, infoData, delData, saveUserLevelData, getUserLevelPrices, saveUserLevelPriceData, delUserLevelPrice } from '@/api/apiExtUserLevel'
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

      kvList:[
        {k:"", v:""}
      ],

      rules: {
        name: [
          { required: true, message: '不能为空'},
        ],
        paixu: [
          { required: true, message: '不能为空'},
        ],
      },
      rulesExpand: {
        duration: [
          { required: true, message: '不能为空'},
        ],
        price: [
          { required: true, message: '不能为空'},
        ],
      },

      searchData:{},

      pushData: {
        dialogFormVisible:false,

        id:undefined,
        paixu:0,
        rebate:10,
        name:undefined,
        upgradeAmount:undefined,
        status:0,
      },
      pushDataExpand: {
        dialogTitle : undefined,
        dialogFormVisible:false,

        id:undefined,
        levelId:undefined,
        duration:undefined,
        unit:0,
        price:undefined
      },

      multipleSelection: [],
      list: null,
      listLoading: true,

      listExpand: undefined
    }
  },
  created() {
    this.pushDataTmp = Object.assign({}, this.pushData)    
    this.pushDataTmpExpand = Object.assign({}, this.pushDataExpand)    
  },
  activated() {
    this.fetchData()
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
      fetchAllUserLevels(this.page, this.pageSize, this.searchData).then(response => {
        if (response.code == 0) {
          this.list = response.data.result
          this.totalRow = response.data.totalRow
        }
        this.listLoading = false
      })
    },
    addKV(){
      let kvMap = {k:"", v:""}
      this.kvList.push(kvMap)
    },
    delKV(k){
      let newArray = []
      this.kvList.forEach(ele => {
        if (ele.k != k) {
          newArray.push(ele)
        }
      })
      if (newArray.length == 0) {
        newArray.push({k:"", v:""})
      }
      this.kvList = newArray
    },
    handleCreate(){
      this.pushData = Object.assign({}, this.pushDataTmp)
      this.pushData.dialogFormVisible = true
      this.$nextTick(() => {
        this.$refs['addEditPopForm'].clearValidate()
      })
    },
    handleUpdate(id) {
      infoData(id).then(res => {
        if (res.code != 0) {
          Message({
            message: res.msg,
            type: 'error',
            duration: 3 * 1000
          })
        } else {
          this.pushData = Object.assign({}, this.pushDataTmp, res.data.info)
          // 计算扩展属性
          let kvList = [];
          if (res.data.extJson) {
            Object.keys(res.data.extJson).forEach(k => {
              let aaaa = '{"k":"'+ k +'", "v":"'+ res.data.extJson[k] +'"}'
              kvList.push(JSON.parse(aaaa))
            })
          }
          if (kvList.length == 0) {
            kvList = [ {k:"", v:""} ];
          }
          this.kvList = kvList
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
      let pushDataDetailsJsonStr = {}
      this.kvList.forEach(item => {
        // {k:"", v:""}
        if (item.k && item.v) {
          let aaaa = '{"'+ item.k +'":"'+ item.v +'"}'
          pushDataDetailsJsonStr = Object.assign({}, pushDataDetailsJsonStr, JSON.parse(aaaa))
        }        
      })
      this.pushData.extJsonStr = JSON.stringify(pushDataDetailsJsonStr)
      this.$refs['addEditPopForm'].validate((valid) => {
        if (valid) {
          saveUserLevelData(this.pushData).then((res) => {
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
    handleCreateExpand(row){
      this.pushDataExpand = Object.assign({}, this.pushDataTmpExpand)
      this.pushDataExpand.dialogTitle = '增加'+ row.name +'收费项目'
      this.pushDataExpand.dialogFormVisible = true
      this.pushDataExpand.levelId = row.id
      this.$nextTick(() => {
        this.$refs['addEditPopFormExpand'].clearValidate()
      })
    },
    handleUpdateExpand(row){
      this.pushDataExpand = Object.assign({}, this.pushDataTmpExpand, row)
      this.pushDataExpand.dialogTitle = '修改收费项目'
      this.pushDataExpand.dialogFormVisible = true
      this.$nextTick(() => {
        this.$refs['addEditPopFormExpand'].clearValidate()
      })
    },
    handleCreateSaveExpand(){
      this.$refs['addEditPopFormExpand'].validate((valid) => {
        if (valid) {
          saveUserLevelPriceData(this.pushDataExpand).then((res) => {
            this.pushDataExpand.dialogFormVisible = false
            if (res.code == 0) {
              Message({
                message: '操作成功',
                type: 'success',
                duration: 1 * 1000
              })
              this._getUserLevelPrices(this.pushDataExpand.levelId)
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
    },
    delDataExpand(row){
      this.$confirm('删除无法恢复, 是否继续?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        delUserLevelPrice(row.id).then(res => {
          Message({
            message: '删除成功',
            type: 'success',
            duration: 1 * 1000
          })
          this._getUserLevelPrices(row.levelId)
        })
      }).catch(() => {});
    },
    handleExpandChange(row, expandedRows){
      expandedRows.forEach(ele => {
        if (ele.id != row.id) {
          this.$refs.singleTable.toggleRowExpansion(ele, false);
        } else {
          // console.log(row, expandedRows)
          this.$refs.singleTable.toggleRowExpansion(ele, true);
          if (expandedRows.length > 1) {
            return
          }
          this._getUserLevelPrices(row.id)
        }
      })
    },
    _getUserLevelPrices(rowsId){
      this.listExpand = null
      getUserLevelPrices(rowsId).then(res => {
        if (res.code === 0) {
          this.listExpand = res.data
        }
      })
    },
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
