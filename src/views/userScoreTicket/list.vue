<template>
  <div class="app-container">
    
    <div class="filter-container">
      <el-input clearable @keyup.enter.native="fetchData" style="width: 200px;" class="filter-item" placeholder="用户手机" v-model="searchData.mobile">
      </el-input>
      <el-input clearable @keyup.enter.native="fetchData" style="width: 200px;" class="filter-item" placeholder="用户编号" v-model="searchData.uid">
      </el-input>
      <el-input clearable @keyup.enter.native="fetchData" style="width: 200px;" class="filter-item" placeholder="用户昵称" v-model="searchData.nick">
      </el-input>
      <el-input clearable @keyup.enter.native="fetchData" style="width: 200px;" class="filter-item" placeholder="券号" v-model="searchData.number">
      </el-input>
      <el-select clearable style="width: 200px" class="filter-item" v-model="searchData.status" placeholder="状态">
        <el-option label="未使用" value="0"></el-option>
        <el-option label="已使用" value="1"></el-option>
        <el-option label="作废" value="2"></el-option>
        <el-option label="过期" value="3"></el-option>
      </el-select>
      <el-button class="filter-item" type="primary" icon="el-icon-search" @click="fetchData" size="medium">搜索</el-button>
      <el-button class="filter-item" style="margin-left: 10px;" @click="handleCreate" type="success" icon="el-icon-plus" size="medium">添加</el-button>
      <el-button class="filter-item" style="margin-left: 10px;" @click="handleDownload" type="danger" icon="el-icon-download" size="medium" :loading="downloadLoading">导出Excel</el-button>
    </div>
    
    <el-table :data="list" v-loading="listLoading" element-loading-text="Loading" fit highlight-current-row empty-text="暂无数据" @selection-change="handleSelectionChange">
      <el-table-column type="selection" align="center" width="55" row-key="id" />
      <el-table-column label="用户信息">
        <template slot-scope="scope">
          {{scope.row.mobile?scope.row.mobile:'-'}}<br>
          {{scope.row.nick?scope.row.nick:'-'}}
        </template>
      </el-table-column>
      <el-table-column label="券号">
        <template slot-scope="scope">
          {{scope.row.number}}
          <el-popover
            v-if="scope.row.remark"
            placement="top-start"
            title="备注"
            width="200"
            trigger="hover"
            :content="scope.row.remark">
            <i slot="reference" class="el-icon-info"></i>
          </el-popover>
        </template>
      </el-table-column>
      <el-table-column prop="score" label="积分" align="center"></el-table-column>
      <el-table-column label="状态/使用时间" align="center">
        <template slot-scope="scope">
          <el-tag type="info" v-if="scope.row.status == 0">未使用</el-tag>
          <el-tag type="success" v-if="scope.row.status == 1">已使用</el-tag>
          <el-tag type="danger" v-if="scope.row.status == 2">已作废</el-tag>
          <el-tag type="warning" v-if="scope.row.status == 3">已过期</el-tag>
          <div v-if="scope.row.status == 1">
            <br>
            {{scope.row.dateUpdate}}
          </div>
          <div v-else>-</div>
        </template>
      </el-table-column>
      <el-table-column label="创建/到期时间" width="160">
        <template slot-scope="scope">
          {{scope.row.dateAdd}}
          <br>
          {{scope.row.dateEnd}}
        </template>
      </el-table-column>
      <el-table-column label="操作" align="center" width="160">
        <template slot-scope="scope">
          <el-button v-if="scope.row.status == 0" type="text" @click="invalidData(scope.row.id)" style="color:red">作废</el-button>
          <el-button type="text" @click="delData(scope.row.id)" style="color:red">删除</el-button>
        </template>
      </el-table-column>
    </el-table>
    <el-button style='margin-top:20px' type="danger" size="mini" @click="delDataBatch()">批量删除</el-button>
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
        <el-form-item label="创建数量" prop="number">
          <el-col :span="8">
            <el-input v-model="pushData.number" clearable @keyup.enter.native="handleCreateSave"></el-input>
          </el-col>
          <el-col :span="16" class="orange">&nbsp;&nbsp;&nbsp;批量创建多少张积分券</el-col>
        </el-form-item>
        <el-form-item label="有效期(天)" prop="days">
          <el-col :span="8">
            <el-input v-model="pushData.days" clearable @keyup.enter.native="handleCreateSave"></el-input>
          </el-col>
          <el-col :span="16" class="orange">&nbsp;&nbsp;&nbsp;该积分券多少天后会自动过期</el-col>
        </el-form-item>
        <el-form-item label="积分" required>
          <el-col :span="3">
            <el-form-item prop="scoreMin">
              <el-input v-model="pushData.scoreMin" clearable @keyup.enter.native="handleCreateSave"></el-input>
            </el-form-item>
          </el-col>
          <el-col :span="1" align="center">~</el-col>  
          <el-col :span="3">
            <el-form-item prop="scoreMax">
              <el-input v-model="pushData.scoreMax" clearable @keyup.enter.native="handleCreateSave"></el-input>
            </el-form-item>
          </el-col>
          <el-col :span="17" class="orange">&nbsp;&nbsp;&nbsp;填写积分范围，两个值一样默认为固定数量积分券，否则为随机</el-col>
        </el-form-item>
        <el-form-item label="备注" prop="remark" >
          <el-input v-model="pushData.remark" type="textarea" :rows="4" clearable @keyup.enter.native="handleCreateSave"></el-input>
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
import { fetchDataList, invalidData, delData, createData } from '@/api/userScoreTicket'
import { Message, MessageBox } from 'element-ui'

export default {
  data() {
    return {
      page:1,
      pageSize:10,
      totalRow:0,

      rules: {
        number: [
          { required: true, message: '不能为空'},
        ],
        scoreMin: [
          { required: true, message: '不能为空'},
        ],
        scoreMax: [
          { required: true, message: '不能为空'},
        ],
        days: [
          { required: true, message: '不能为空'},
        ],
      },

      searchData:{},

      pushData: {
        dialogTitle : undefined,
        dialogFormVisible:false,

        id:undefined,
        number:1,
        scoreMin:10,
        scoreMax:10,
        days:7,

      },

      multipleSelection: [],
      list: null,
      listLoading: true,
      downloadLoading: false
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
      this.pageSize = val
      this.fetchData()
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
        if (response.code === 0) {
          this.list = response.data.result
          this.totalRow = response.data.totalRow
          this.list.forEach(ele => {
            if (ele.uid && response.data.userMap) {
              const userMap = response.data.userMap[ele.uid]
              if (userMap) {
                ele.mobile = userMap.mobile
                ele.nick = userMap.nick
              }
            }
          })
        }
        this.listLoading = false
      })
    },
    handleCreate() {
      this.pushData = Object.assign({}, this.pushDataTmp)
      this.pushData.dialogTitle = '批量创建积分券'
      this.pushData.dialogFormVisible = true
      this.$nextTick(() => {
        this.$refs['addEditPopForm'].clearValidate()
      })
    },
    handleCreateSave() {
      this.$refs['addEditPopForm'].validate((valid) => {
        if (valid) {
          const loadingInstance = this.$loading({
            text: '正在创建...'
          })
          createData(this.pushData).then((res) => {
            this.pushData.dialogFormVisible = false
            if (res.code === 0) {
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
          }).catch(e => {
            console.error(e)
          }).finally(() => {
            loadingInstance.close()
          })
        }
      })
    },
    invalidData(id) {
      this.$confirm('作废无法恢复, 是否继续?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        invalidData(id).then(res => {
          this.$message({
            message: '作废成功',
            type: 'success'
          })
          this.fetchData()
        })
      }).catch(() => {})
    },
    delData(id) {
      this.$confirm('删除无法恢复, 是否继续?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        delData(id).then(res => {
          this.$message({
            message: '删除成功',
            type: 'success'
          })
          this.fetchData()
        })
      }).catch(() => {})
    },
    delDataBatch() {
      if (!this.multipleSelection.length) {
        this.$message.error('请先选择需要删除的数据')
        return
      }
      this.$confirm('删除无法恢复, 是否继续?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        this.delDataBatchDone()
      }).catch(() => {})
    },
    async delDataBatchDone() { // 批量删除商品
      const ids = []
      this.multipleSelection.forEach(obj => {
        ids.push(obj.id)
      })
      const loadingInstance = this.$loading({
        text: '正在删除数据...'
      })
      const res = await delData(ids.join())
      loadingInstance.close()
      if (res.code === 0) {
        this.fetchData(true)
      }
    },
    handleDownload() {
      this.downloadLoading = true
      fetchDataList(1, 65535, this.searchData).then(response => {
        if (response.code === 0) {
          const curList = response.data.result
          curList.forEach(ele => {
            if (ele.uid && response.data.userMap) {
              const userMap = response.data.userMap[ele.uid]
              if (userMap) {
                ele.mobile = userMap.mobile
                ele.nick = userMap.nick
              }
            }
          })
          import('@/vendor/Export2Excel').then(excel => {
            const tHeader = ['手机号码', '昵称', '券号', '积分数', '状态', '创建时间', '更新时间', '到期时间', '备注']
            const filterVal = ['mobile', 'nick', 'number', 'score', 'statusStr', 'dateAdd', 'dateUpdate', 'dateEnd', 'remark']
            const data = this.formatJson(filterVal, curList)
            excel.export_json_to_excel({
              header: tHeader,
              data,
              filename: '积分券',
              autoWidth: true
            })
            this.downloadLoading = false
          })
        }
      })
    },
    formatJson(filterVal, jsonData) {
      return jsonData.map(v => filterVal.map(j => {
        return v[j]
      }))
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
