<template>
  <div class="app-container">
    <div class="filter-container">
      <el-button class="filter-item" size="medium" type="success" icon="el-icon-plus" @click="handleCreate()">添加</el-button>
    </div>
    <el-table v-loading="listLoading" :data="list" element-loading-text="Loading" fit highlight-current-row empty-text="暂无数据" @selection-change="handleSelectionChange">
      <el-table-column type="selection" align="center" width="55" row-key="id" />
      <el-table-column label="编号/类型">
        <template slot-scope="scope">
          {{ scope.row.id }}<br>
          {{ scope.row.type }}
        </template>
      </el-table-column>
      <el-table-column label="业务编号/链接地址">
        <template slot-scope="scope">
          {{ scope.row.businessId }}<br>
          {{ scope.row.linkUrl }}
        </template>
      </el-table-column>
      <el-table-column label="名称">
        <template slot-scope="scope">
          {{ scope.row.title }}
          <el-popover
            v-if="scope.row.remark"
            placement="top-start"
            title="备注"
            width="200"
            trigger="hover"
            :content="scope.row.remark">
            <i slot="reference" class="el-icon-info" />
          </el-popover>
        </template>
      </el-table-column>
      <el-table-column label="图标" align="center">
        <template slot-scope="scope">
          <img v-if="scope.row.picUrl" :src="scope.row.picUrl" style="width:70px;">
          <span v-if="!scope.row.picUrl">-</span>
        </template>
      </el-table-column>
      <el-table-column label="状态">
        <template slot-scope="scope">
          <el-tag v-if="scope.row.status == 0" type="success">启用</el-tag>
          <el-tag v-if="scope.row.status == 1" type="danger">禁用</el-tag>
        </template>
      </el-table-column>
      <el-table-column label="操作">
        <template slot-scope="scope">
          <el-button type="text" @click="handleUpdate(scope.row.id)">编辑</el-button>
          <el-button type="text" style="color:red" @click="delData(scope.row.id)">删除</el-button>
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
        <el-form-item label="自定义类型" prop="type" >
          <el-input v-model="pushData.type" clearable @keyup.enter.native="handleCreateSave"></el-input>
        </el-form-item>
        <el-form-item label="业务编号" prop="businessId" >
          <el-input v-model.trim.number="pushData.businessId" clearable @keyup.enter.native="handleCreateSave"></el-input>
        </el-form-item>
        <el-form-item label="名称" prop="title" >
          <el-input v-model="pushData.title" clearable @keyup.enter.native="handleCreateSave"></el-input>
        </el-form-item>
        <el-form-item label="上传图片" >
          <img v-if="pushData.picUrl" :src="pushData.picUrl" class="avatar">
          <editorImage class="editor-upload-btn" @successCBK="imageSuccessCBK"></editorImage>
        </el-form-item>
        <el-form-item label="链接地址" prop="linkUrl" >
          <el-input v-model="pushData.linkUrl" clearable @keyup.enter.native="handleCreateSave"></el-input>
        </el-form-item>
        <el-form-item label="备注" prop="remark" >
          <el-input v-model="pushData.remark" type="textarea" :rows="4" clearable @keyup.enter.native="handleCreateSave"></el-input>
        </el-form-item>
        <el-form-item label="状态" prop="status" >
          <el-select v-model="pushData.status" placeholder="请选择">
            <el-option label="显示" value="0"></el-option>
            <el-option label="隐藏" value="1"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="排序" prop="paixu" >
          <el-input v-model="pushData.paixu" clearable @keyup.enter.native="handleCreateSave"></el-input>
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
import { fetchDataList, infoData, delData, saveData } from '@/api/apiExtBanner'
import { Message, MessageBox } from 'element-ui'
import { mapGetters } from 'vuex'
import { getToken } from '@/utils/auth'

import editorImage from '@/components/Tinymce/components/editorImage' // 第一步

export default {
  components: { editorImage }, // 第二步; 上面引用 editorImage 是第三步; 下面增加 imageSuccessCBK 方法是第四步, pushData.picUrl 要给默认值 undefined
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
        businessId: [
          { required: true, message: '不能为空'},
          { type:'number', message: '必须为数字'}
        ],
        title: [
          { required: true, message: '不能为空'},
        ],
        picUrl: [
          { required: true, message: '不能为空'},
        ],
        status: [
          { required: true, message: '不能为空'},
        ],
        paixu: [
          { required: true, message: '不能为空'},
        ],
      },

      searchData:{},

      pushData: {
        dialogTitle : undefined,
        dialogFormVisible:false,

        id:undefined,
        picUrl:undefined,
        status:'0',
        paixu:0,
      },

      multipleSelection: [],
      list: null,
      listLoading: true
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
      this.pushData.dialogTitle = '添加Banner'
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
          this.pushData = Object.assign({}, this.pushDataTmp, res.data, {status:'' + res.data.status})          
          this.pushData.dialogTitle = '修改Banner'
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
                type: 'success'
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
    delData(id) {
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
    imageSuccessCBK(arr) {
      if (arr && arr.length > 0) {
        this.pushData.picUrl = arr[0].url
      }
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
.avatar {
  width: 178px;
}
</style>
