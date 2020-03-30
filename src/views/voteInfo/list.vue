<template>
  <div class="app-container">
    
    <div class="filter-container">
      <el-input clearable @keyup.enter.native="fetchData" style="width: 200px;" class="filter-item" placeholder="编号" v-model="searchData.id">
      </el-input>
      <el-input clearable @keyup.enter.native="fetchData" style="width: 200px;" class="filter-item" placeholder="标题" v-model="searchData.titleLike">
      </el-input>
      <el-select clearable style="width: 200px" class="filter-item" v-model="searchData.type" placeholder="类型">
        <el-option label="自定义投票" value="0"></el-option>
        <el-option label="来自报名模块" value="1"></el-option>
      </el-select>
      <el-input clearable @keyup.enter.native="fetchData" style="width: 200px;" class="filter-item" placeholder="业务ID" v-model="searchData.refId" />
      <el-select clearable style="width: 200px" class="filter-item" v-model="searchData.status" placeholder="状态">
        <el-option label="开启" value="0"></el-option>
        <el-option label="关闭" value="1"></el-option>
      </el-select>
      <el-select clearable style="width: 200px" class="filter-item" v-model="searchData.rule" placeholder="投票类型">
        <el-option label="单选" value="0"></el-option>
        <el-option label="多选" value="1"></el-option>
      </el-select>
      <el-select clearable style="width: 200px" class="filter-item" v-model="searchData.isPublic" placeholder="投票信息是否公开">
        <el-option label="公开" value="true"></el-option>
        <el-option label="不公开" value="false"></el-option>
      </el-select>
      <el-button size="medium" class="filter-item" type="primary" icon="el-icon-search" @click="fetchData">搜索</el-button>
      <el-button size="medium" class="filter-item" style="margin-left: 10px;" @click="handleCreate" type="success" icon="el-icon-plus">添加</el-button>
      <el-button size="medium" class="filter-item" style="margin-left: 10px;" @click="importFromYuyue" type="danger" icon="el-icon-download">从报名模块导入</el-button>
    </div>
    
    <el-table :data="list" v-loading="listLoading" element-loading-text="Loading" fit highlight-current-row empty-text="暂无数据" @selection-change="handleSelectionChange" @expand-change="handleExpandChange">
      <el-table-column type="expand">
        <template slot-scope="scope">
          <el-button class="filter-item" size="mini" @click="handleCreateExpand(scope.row)" type="danger" icon="el-icon-plus">添加投票选项</el-button>
          <el-table :data="listExpand" v-if="listExpand" element-loading-text="Loading" 
            fit highlight-current-row empty-text="暂无设定投票选项">
            <el-table-column prop="id" label="选项编号" width="100%"></el-table-column>
            <el-table-column label="投票选项">
              <template slot-scope="scope">
                {{ scope.row.title }}
                <el-tooltip v-if="scope.row.descript" class="item" effect="dark" :content="scope.row.descript" placement="top-start">
                  <i class="el-icon-info"></i>
                </el-tooltip>
              </template>
            </el-table-column>
            <el-table-column prop="voteNum" align="center" label="得票数" width="100%"></el-table-column>
            <el-table-column label="状态" align="center" width="100%">
              <template slot-scope="scope">
                <el-tag type="success" v-if="scope.row.status == 0">启用</el-tag>
                <el-tag type="danger" v-if="scope.row.status == 1">禁用</el-tag>
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
      <el-table-column prop="id" label="编号" width="100%"></el-table-column>
      <el-table-column label="标题">
        <template slot-scope="scope">
          {{scope.row.title}}<br>
          <el-tag size="mini" type="success" v-if="scope.row.type == 1">从报名模块导入</el-tag>
          <el-tag size="mini" type="success" v-if="scope.row.isPublic">投票信息公开</el-tag>
          <el-tag size="mini" type="info" v-if="scope.row.rule == 0">单选</el-tag>
          <el-tag size="mini" type="warning" v-if="scope.row.rule == 1">多选</el-tag>
        </template>
      </el-table-column>
      <el-table-column label="开始/截止时间" width="160">
        <template slot-scope="scope">
          {{scope.row.dateBegin ? scope.row.dateBegin : '立即开始'}}
          <br>
          {{scope.row.dateEnd ? scope.row.dateEnd : '永久有效'}}
        </template>
      </el-table-column>
      <el-table-column label="状态" align="center" width="100%">
        <template slot-scope="scope">
          <el-tag type="success" v-if="scope.row.status == 0">开启</el-tag>
          <el-tag type="danger" v-if="scope.row.status == 1">关闭</el-tag>
        </template>
      </el-table-column>   
      <el-table-column label="参与人数" width="100%">
        <template slot-scope="scope">
          {{scope.row.joinNum}}
        </template>
      </el-table-column>   
      <el-table-column label="发布/修改时间" width="160">
        <template slot-scope="scope">
          {{scope.row.dateAdd}}
          <br>
          {{scope.row.dateUpdate ? scope.row.dateUpdate : '-'}}
        </template>
      </el-table-column>
      <el-table-column label="操作" width="110">
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

    <el-dialog :title="pushDataExpand.dialogTitle" :visible.sync="pushDataExpand.dialogFormVisible" :close-on-click-modal="false" :close-on-press-escape="false">
      <el-form :rules="rulesExpand" ref="addEditPopFormExpand" :model="pushDataExpand" label-position="left" label-width="100px">
        <el-form-item label="选项名称" prop="title">
          <el-input v-model="pushDataExpand.title" clearable></el-input>
        </el-form-item>
        <el-form-item label="选项描述" prop="descript">
          <el-input v-model="pushDataExpand.descript" type="textarea" :rows="4" clearable></el-input>
        </el-form-item>
        <el-form-item label="状态" prop="status" >
          <el-select v-model="pushDataExpand.status" placeholder="请选择">
            <el-option label="启用" :value="0"></el-option>
            <el-option label="禁用" :value="1"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="排序" prop="paixu">
          <el-col :span="4">
            <el-input v-model="pushDataExpand.paixu" clearable></el-input>
          </el-col>   
          <el-col :span="10" class="orange">&nbsp;&nbsp;&nbsp;数字越小越靠前</el-col>     
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
import { fetchDataList, infoData, delData, importFromYuyue, saveItemsData, delItemsData } from '@/api/voteInfo'
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

      rulesExpand: {
        title: [
          { required: true, message: '不能为空'}
        ],
        paixu: [
          { required: true, message: '不能为空'}
        ],
        status: [
          { required: true, message: '不能为空'}
        ]
      },

      searchData:{
        id:undefined,
        goodsId:undefined,
        status:undefined,
        dateAddBegin:undefined,
        dateAddEnd:undefined,
        dateEndBegin:undefined,
        dateEndEnd:undefined,
      },

      pushData: {
        dialogTitle : undefined,
        dialogFormVisible:false,

        id:undefined,
        goodsId:undefined,
        numberSucccess:0,
        numberPersion:undefined,
        timeoutHours:24,
        status:undefined,
        refundType:undefined,
        dateAddStr:undefined,
        dateEndStr:undefined
      },

      pushDataExpand: {
        dialogTitle : undefined,
        dialogFormVisible:false,

        id:undefined,
        voteId:undefined,
        title:undefined,
        descript:undefined,
        status:0,
        paixu:0
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
      fetchDataList(this.page, this.pageSize, this.searchData).then(response => {
        if (response.code == 0) {
          this.list = response.data.result
          this.totalRow = response.data.totalRow
        }
        this.listLoading = false
      })
    },
    handleCreate(){
      this.$router.push({ path: 'add' })
    },
    handleCreateExpand(row){
      this.pushDataExpand = Object.assign({}, this.pushDataTmpExpand)
      this.pushDataExpand.dialogTitle = '增加投票选项'
      this.pushDataExpand.dialogFormVisible = true
      this.pushDataExpand.voteId = row.id
      this.$nextTick(() => {
        this.$refs['addEditPopFormExpand'].clearValidate()
      })
    },
    importFromYuyue(){
      this.$prompt('请输入报名项目ID', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        inputPattern: /\d+/,
        inputErrorMessage: '报名项目ID是数字'
      }).then(({ value }) => {
        importFromYuyue(value).then(res => {
          if (res.code == 0) {
            this.$message({
              type: 'success',
              message: '导入成功'
            });
            this.fetchData()
          } else {
            this.$message.error(res.msg);
          }
        })
      })      
    },
    handleUpdate(id){
      this.$router.push({ path: 'add', query:{id:id} })
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
    },
    handleExpandChange(row, expanded){
      if (expanded) {
        const _a = expanded.find(ele => {
          return ele.id === row.id
        })
        if (!_a) {
          return
        }
      }      
      this.listExpand = undefined
      infoData(row.id).then(res => {
        if (res.code === 0) {
          this.listExpand = res.data.voteItems
        }
      })
    },
    handleCreateSaveExpand(){
      this.$refs['addEditPopFormExpand'].validate((valid) => {
        if (valid) {
          saveItemsData(this.pushDataExpand).then((res) => {
            this.pushDataExpand.dialogFormVisible = false
            if (res.code == 0) {
              Message({
                message: '操作成功',
                type: 'success',
                duration: 1 * 1000
              })
              this.handleExpandChange({id: this.pushDataExpand.voteId})
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
    handleUpdateExpand(row){
      this.pushDataExpand = Object.assign({}, this.pushDataTmpExpand, row)
      this.pushDataExpand.dialogFormVisible = true
      this.$nextTick(() => {
        this.$refs['addEditPopFormExpand'].clearValidate()
      })
    },
    delDataExpand(row){
      this.$confirm('删除无法恢复, 是否继续?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        delItemsData(row.id).then(res => {
          Message({
            message: '删除成功',
            type: 'success',
            duration: 1 * 1000
          })
          this.handleExpandChange({id: row.voteId})
        })
      }).catch(() => {});
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
