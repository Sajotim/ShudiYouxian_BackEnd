<template>
  <div class="app-container">
    <div class="filter-container">
      <el-button size="medium" class="filter-item" @click="handleCreate" type="success" icon="el-icon-plus">添加</el-button>
      <el-button v-if="activeTabId > 0" size="medium" class="filter-item" @click="handleUpdate" type="danger" icon="el-icon-edit">编辑</el-button>
    </div>

    <el-tabs v-model="activeTabId" type="card" closable @tab-remove="removeTab" @tab-click="showAllChilds">
      <el-tab-pane
        v-for="item in list"
        :key="item.id"
        :label="item.name"
        :name="item.id + ''"
      >
        <el-alert
          v-if="item.remark"
          :title="item.remark"
          :closable="false"
          type="info"/>
        <el-table :data="childList" v-loading="listLoading" element-loading-text="Loading" fit highlight-current-row empty-text="暂未添加子属性">
          <el-table-column prop="name" label="名称"></el-table-column>
          <el-table-column prop="remark" label="备注"></el-table-column>
          <el-table-column label="操作">
            <template slot-scope="scope">
              <el-button type="text" @click="handleUpdateChild(scope.row.id, scope.row.name, scope.row.remark, scope.row.paixu)">编辑</el-button>
              <el-button type="text" @click="delDataChild(scope.row.id)" style="color:red">删除</el-button>
            </template>
          </el-table-column>
        </el-table>
      </el-tab-pane>
    </el-tabs>
    <div style="margin-top:10px;" v-if="activeTabId > 0">
      <el-button size="small" class="filter-item" @click="handleCreateChild" type="success" icon="el-icon-plus">添加子属性</el-button>
    </div>

    <el-dialog :title="pushData.dialogTitle" :visible.sync="pushData.dialogFormVisible" :close-on-click-modal="false" :close-on-press-escape="false">
      <el-form :rules="rules" ref="addEditPopForm" :model="pushData" label-position="left" label-width="100px">
        <el-form-item label="名称" prop="name" >
          <el-input v-model="pushData.name" clearable @keyup.enter.native="handleCreateSave"></el-input>
        </el-form-item>
        <el-form-item label="排序" prop="paixu" >
          <el-input v-model.number="pushData.paixu" clearable @keyup.enter.native="handleCreateSave"></el-input>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="pushData.dialogFormVisible = false">取消</el-button>
        <el-button type="primary" @click="handleCreateSave">确定</el-button>
      </div>
    </el-dialog>

    <el-dialog :title="pushDataChild.dialogTitle" :visible.sync="pushDataChild.dialogFormVisible" :close-on-click-modal="false" :close-on-press-escape="false">
      <el-form :rules="rules" ref="addEditPopFormChild" :model="pushDataChild" label-position="left" label-width="100px">
        <el-form-item label="名称" prop="name" >
          <el-input v-model="pushDataChild.name" clearable @keyup.enter.native="handleCreateSaveChild"></el-input>
        </el-form-item>
        <el-form-item label="备注" prop="remark" >
          <el-input v-model="pushDataChild.remark" clearable @keyup.enter.native="handleCreateSaveChild"></el-input>
        </el-form-item>
        <el-form-item label="排序" prop="paixu" >
          <el-input v-model.number="pushDataChild .paixu" clearable @keyup.enter.native="handleCreateSaveChild"></el-input>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="pushDataChild.dialogFormVisible = false">取消</el-button>
        <el-button type="primary" @click="handleCreateSaveChild">确定</el-button>
      </div>
    </el-dialog>

    <el-dialog title="子属性" :visible.sync="pushDataList.dialogFormVisible" :close-on-click-modal="false" :close-on-press-escape="false">
      <div class="filter-container">
        <el-button class="filter-item" @click="handleCreateChild" type="success" icon="el-icon-edit">添加属性</el-button>
      </div>
      <el-table :data="childList" v-loading="listLoading" element-loading-text="Loading" fit highlight-current-row empty-text="暂未添加子属性">
        <el-table-column prop="name" label="名称"></el-table-column>
        <el-table-column prop="remark" label="备注"></el-table-column>
        <el-table-column label="操作">
          <template slot-scope="scope">
            <el-button type="text" @click="handleUpdateChild(scope.row.id, scope.row.name, scope.row.remark, scope.row.paixu)">编辑</el-button>
            <el-button type="text" @click="delDataChild(scope.row.id)" style="color:red">删除</el-button>
          </template>
        </el-table-column>
      </el-table>
    </el-dialog>

  </div>
</template>

<script>
import { fetchDataList, fetchDataChilds, delData, delChildData, saveData, saveChildData } from '@/api/apiExtShopProperty'
import { Message, MessageBox } from 'element-ui'
import { mapGetters } from 'vuex'

let vm

export default {
  computed: {
    ...mapGetters([
      'centerUserBase'
    ])
  },
  data() {
    return {
      activeTabId: undefined,
      curPopPropertyId:undefined,

      rules: {
        name: [
          { required: true, message: '不能为空'}
        ],
        numberSucccess: [
          { required: true, message: '不能为空'},
          { type:'integer', message: '必须为数字'}
        ],
        numberPersion: [
          { required: true, message: '不能为空'},
          { type:'integer', message: '必须为数字'}
        ],
        timeoutHours: [
          { required: true, message: '不能为空'},
          { type:'integer', message: '必须为数字'}
        ],                
        status: [
          { required: true, message: '不能为空'}
        ],
        refundType: [
          { required: true, message: '不能为空'}
        ],
        dateAddStr: [
          { required: true, message: '不能为空'}
        ],
        dateEndStr: [
          { required: true, message: '不能为空'}
        ],
      },

      pushData: {
        dialogTitle : undefined,
        dialogFormVisible:false,

        id:undefined,
        name:undefined,
        paixu:0,
      },

      pushDataChild: {
        dialogTitle : undefined,
        dialogFormVisible:false,

        id:undefined,
        propertyId:undefined,
        name:undefined,
        remark:undefined,
        paixu:0,
      },

      pushDataList: {
        dialogTitle : undefined,
        dialogFormVisible:false,

        id:undefined,
        name:undefined,
        paixu:0,
      },

      multipleSelection: [],
      list: null,
      childList:null,
      listLoading: true,
      statisticsData:{}
    }
  },
  created() {
    this.pushDataTmp = Object.assign({}, this.pushData)
    this.pushDataTmpChild = Object.assign({}, this.pushDataChild)
    this.fetchData()
  },
  mounted() {
    vm = this
  },
  methods: {
    removeTab(id) {
      const that = this
      this.$confirm('确定要删除当前规格尺寸吗？子属性也将被全部删除，请谨慎操作！', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        delData(id).then(response => {
          if (response.code === 0) {
            this.$message({
              message: '已删除',
              type: 'success'
            })
            that.fetchData()
          } else {
            this.$message({
              message: response.msg,
              type: 'warning'
            })
          }
        })
      }).catch(() => {
        this.$message({
          type: 'info',
          message: '已取消'
        })
      })
    },
    fetchData(noChangeTag) {
      this.list = null
      this.listLoading = true
      fetchDataList(this.page, this.pageSize).then(response => {
        if (response.code == 0) {
          this.list = response.data
          if (!noChangeTag) {
            this.activeTabId = this.list[0].id + ''
          }
          this.showAllChilds()
        }
        this.listLoading = false
      })
    },
    handleCreate(){
      this.pushData = Object.assign({}, this.pushDataTmp)
      this.pushData.dialogTitle = '增加规格尺寸'
      this.pushData.dialogFormVisible = true
      this.$nextTick(() => {
        this.$refs['addEditPopForm'].clearValidate()
      })
    },
    handleCreateChild(){
      this.pushDataChild = Object.assign({}, this.pushDataTmpChild)
      this.pushDataChild.dialogTitle = '增加子属性'
      this.pushDataChild.dialogFormVisible = true
      this.pushDataChild.propertyId = this.activeTabId
      this.$nextTick(() => {
        this.$refs['addEditPopFormChild'].clearValidate()
      })
    },
    showAllChilds(){
      fetchDataChilds(this.activeTabId).then(res => {
        this.childList = res.data
      })
    },
    handleUpdate(id, name, paixu){
      let curParentPropertyBean = this.list.find(ele => {
        return ele.id == this.activeTabId
      })
      this.pushData = Object.assign({}, this.pushDataTmp, {id:curParentPropertyBean.id, name:curParentPropertyBean.name, paixu:curParentPropertyBean.paixu})
      this.pushData.dialogTitle = '修改规格尺寸'
      this.pushData.dialogFormVisible = true
      this.$nextTick(() => {
        this.$refs['addEditPopForm'].clearValidate()
      })
    },
    handleUpdateChild(id, name, remark, paixu){
      this.pushDataChild = Object.assign({}, this.pushDataTmpChild, {id:id, name:name, remark:remark, paixu:paixu})
      this.pushDataChild.dialogTitle = '修改子属性'
      this.pushDataChild.dialogFormVisible = true
      this.pushDataChild.propertyId = vm.curPopPropertyId
      this.$nextTick(() => {
        this.$refs['addEditPopFormChild'].clearValidate()
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
              this.fetchData(this.pushData.id)
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
    handleCreateSaveChild(){
      this.$refs['addEditPopFormChild'].validate((valid) => {
        if (valid) {
          saveChildData(this.pushDataChild).then((res) => {
            this.pushDataChild.dialogFormVisible = false
            if (res.code == 0) {
              Message({
                message: '操作成功',
                type: 'success',
                duration: 1 * 1000
              })
              this.showAllChilds(vm.curPopPropertyId)
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
    delDataChild(id){
      this.$confirm('删除无法恢复, 是否继续?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        delChildData(id).then(res => {
          Message({
            message: '删除成功',
            type: 'success',
            duration: 1 * 1000
          })
          vm.showAllChilds(vm.curPopPropertyId)
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
