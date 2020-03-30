<template>
  <div class="upload-container">
    <el-button icon='el-icon-picture' size="mini" @click="showServerPics" type="warning" :loading="dialogVisibleSelectLoading">插入图库图片
    </el-button>
    <el-button icon='el-icon-upload' size="mini" @click="dialogVisible=true" type="warning">上传本地图片
    </el-button>
    <el-dialog append-to-body :visible.sync="dialogVisible">
      <el-upload class="editor-slide-upload" :data="upLoadData" :headers="fileHeaders"
                 :action="uploadUrl" :multiple="true" :file-list="fileLists"
                 :show-file-list="true"
                 list-type="picture-card" :on-remove="handleRemove"
                 accept="image/jpeg,.jpg,image/gif,.gif,image/png,.png,image/bmp,.bmp,.jpeg,.JPG,.JPEG,.PBG,.GIF,.BMP,.JPEG"
                 :on-success="handleSuccess" :before-upload="beforeUpload">
        <el-button size="small" type="primary">点击上传</el-button>
      </el-upload>
      <el-button @click="dialogVisible = false">取 消</el-button>
      <el-button type="primary" @click="handleSubmit">确 定</el-button>
    </el-dialog>

    <el-dialog append-to-body :visible.sync="dialogVisibleSelect" title="选择现有图片插入">
      <el-row :gutter="20">
        <el-checkbox-group v-model="serverPicsSelectIds">
          <el-col :span="6" v-for="item in serverPics" :key="item.id" align="center" style="margin-bottom:15px;">
            
            <img :src="item.urlFull" style="width:100%;" @click="handleSubmitSelect(item.urlFull)" />
            <el-checkbox :label="item.urlFull">使用 ({{item.sizeStr}})</el-checkbox>
            
          </el-col>
        </el-checkbox-group>
      </el-row>
      <div style="text-align:center">
        <el-pagination
          @size-change="handleSizeChange"
          @current-change="handleCurrentChange"
          :current-page="page"
          :page-sizes="[20, 40, 100, 200, 400]"
          :page-size="pageSize"
          layout="total, sizes, prev, pager, next, jumper"
          :total="totalRow" style="margin-top:20px;">
        </el-pagination>
      </div>
      <div style="text-align:center;margin-top:30px;">
        <el-button size="medium" @click="dialogVisibleSelect = false">取 消</el-button>
        <el-button size="medium" type="primary" @click="handleSubmitSelect('')">插 入</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
import { getToken } from '@/utils/auth'
import { fetchDataList } from '@/api/apiExtDfs'

export default {
  name: 'EditorSlideUpload',
  data() {
    return {
      page: 1,
      pageSize: 20,
      totalRow: 0,

      uploadUrl: process.env.VUE_APP_BASE_API + '/fileUpload',
      dialogVisible: false,
      dialogVisibleSelect: false,
      dialogVisibleSelectLoading: false,
      listObj: {},
      fileLists: [],
      upLoadData: { upfile: null },
      fileHeaders: { 'X-Token': getToken() },

      serverPics: [],
      serverPicsSelectIds: []
    }
  },
  methods: {
    handleSizeChange(val) {
      this.pageSize = val
      this.showServerPics()
    },
    handleCurrentChange(val) {
      this.page = val
      this.showServerPics()
    },
    checkAllSuccess() {
      return Object.keys(this.listObj).every(item => this.listObj[item].hasSuccess)
    },
    handleSubmit() {
      const arr = Object.keys(this.listObj).map(v => this.listObj[v])
      if (!this.checkAllSuccess()) {
        this.$message('请等待所有图片上传成功 或 出现了网络问题，请刷新页面重新上传！')
        return
      }
      this.$emit('successCBK', arr)
      this.listObj = {}
      this.fileLists = []
      this.dialogVisible = false
    },
    handleSubmitSelect(_url) {
      const selectPics = []
      if (_url) {
        selectPics.push({ url: _url })
      } else {
        if (!this.serverPicsSelectIds) {
          this.dialogVisibleSelect = false
          return
        }
        this.serverPicsSelectIds.forEach(url => {
          selectPics.push({ url: url })
        })
      }
      console.log(selectPics)
      this.$emit('successCBK', selectPics)
      this.dialogVisibleSelect = false
    },
    handleSuccess(response, file) {
      if (response.code !== 0) {
        this.$message({
          message: response.msg,
          type: 'error',
          duration: 3 * 1000
        })
      } else {
        tinymceUploadUrls.push(response.data.url)
        const uid = file.uid
        const objKeyArr = Object.keys(this.listObj)
        for (let i = 0, len = objKeyArr.length; i < len; i++) {
          if (this.listObj[objKeyArr[i]].uid === uid) {
            this.listObj[objKeyArr[i]].url = response.data.url
            this.listObj[objKeyArr[i]].hasSuccess = true
            return
          }
        }
      }
    },
    handleRemove(file) {
      const uid = file.uid;
      const objKeyArr = Object.keys(this.listObj);
      for (let i = 0, len = objKeyArr.length; i < len; i++) {
        if (this.listObj[objKeyArr[i]].uid === uid) {
          delete this.listObj[objKeyArr[i]];
          return
        }
      }
    },
    beforeUpload(file) {
      const _self = this;
      const fileName = file.uid;
      this.upLoadData.upfile = file;
      _self.listObj[fileName] = {hasSuccess: false, uid: file.uid}
    },
    showServerPics(){        
      this.dialogVisibleSelectLoading = true
      fetchDataList(this.page, this.pageSize, {fileType:0}).then(response => {
        if (response.code == 0) {
          this.serverPics = response.data.result
          this.totalRow = response.data.totalRow
          this.dialogVisibleSelect = true
        } else {
          this.$message({
            message: '图库为空，您可以上传本地图片',
            type: 'error',
            duration: 3 * 1000
          })
        }
        this.dialogVisibleSelectLoading = false
      })
    }
  }
}
</script>

<style rel="stylesheet/scss" lang="scss" scoped>
  .editor-slide-upload {
    margin-bottom: 20px;
    /deep/ .el-upload--picture-card {
      width: 100%;
    }
  }
</style>
