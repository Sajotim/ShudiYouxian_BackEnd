<template>
  <div class="app-container">
    
    <div class="filter-container">
      <editorImage class="editor-upload-btn" @successCBK="imageSuccessCBK"></editorImage>
    </div>
    
    <el-table :data="list" v-loading="listLoading" element-loading-text="Loading" fit highlight-current-row empty-text="暂无数据" @selection-change="handleSelectionChange">
      <el-table-column type="selection" align="center" width="55" row-key="media_id"></el-table-column>
      <el-table-column prop="media_id/文件名" label="media_id">
        <template slot-scope="scope">
          {{ scope.row.media_id }}<br>
          {{ scope.row.name }}
        </template>
      </el-table-column>
      <el-table-column label="图片地址">
        <template slot-scope="scope">
          {{ scope.row.url }}
        </template>
      </el-table-column>
      <el-table-column label="操作" width="100%">
        <template slot-scope="scope">
          <el-button type="text" class='delete' @click="delData(scope.row.media_id)" style="color:red">删除</el-button>
        </template>
      </el-table-column>
    </el-table>
    <el-button size="small" style='margin-top:20px' type="danger" @click="delDataMore">批量删除</el-button>
    <el-pagination
      @size-change="handleSizeChange"
      @current-change="handleCurrentChange"
      :current-page="page"
      :page-sizes="[10, 20, 50, 100]"
      :page-size="pageSize"
      layout="total, sizes, prev, pager, next, jumper"
      :total="totalRow" style="margin-top:20px;">
    </el-pagination>
  </div>
</template>

<script>
import { fetchMaterialImageList, uploadMaterialImage, delMaterialImage } from '@/api/wxMaterial'
import editorImage from "@/components/Tinymce/components/editorImage"; // 第一步

export default {
  data() {
    return {
      page:1,
      pageSize:20,
      totalRow:0,

      multipleSelection: [],
      list: null,
      listLoading: true
    }
  },
  components: {
    editorImage
  },
  created() {
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
    fetchData() {
      this.list = null
      this.listLoading = true
      fetchMaterialImageList(this.page, this.pageSize).then(response => {
        if (response.code == 0) {
          this.list = response.data.result
          this.totalRow = response.data.totalRow
        }
        this.listLoading = false
      })
    },
    delData(id){
      this.$confirm('删除无法恢复, 是否继续?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        delMaterialImage(id).then(res => {
          this.$message({
            message: '删除成功',
            type: 'success'
          });
          this.fetchData()
        })
      }).catch(() => {});
    },
    handleSelectionChange(val) {
      this.multipleSelection = val
    },
    delDataMore(){
      if (!this.multipleSelection.length) {
        this.$message.error('请先选择需要删除的数据');
        return
      }
      this.$confirm('删除无法恢复, 是否继续?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        this.delDataMoreDone()
      }).catch(() => {});
    },
    async delDataMoreDone(){
      for (let index = 0; index < this.multipleSelection.length; index++) {
        const obj = this.multipleSelection[index];
        await delMaterialImage(obj.media_id)
        this.fetchData()
      }
    },
    imageSuccessCBK(arr) {
      if (arr && arr.length > 0) {
        uploadMaterialImage(arr[0].url).then(res => {
          if (res.code != 0) {
            this.$message.error(res.msg);
          } else {
            this.fetchData()
          }
        })
      }
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
