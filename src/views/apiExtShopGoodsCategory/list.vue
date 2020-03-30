<template>
  <div class="app-container">
    <div class="filter-container">
      <el-button class="filter-item" @click="handleCreate" type="success" icon="el-icon-plus">添加</el-button>
    </div>
    <el-table v-loading="listLoading" :data="list" element-loading-text="Loading" fit highlight-current-row empty-text="暂无数据" @selection-change="handleSelectionChange">
      <el-table-column label="编号/名称">
        <template slot-scope="scope">
          <font v-for="lv in scope.row.level-1" :key="lv">&#8195;&#8195;&#8195;&#8195;&#8195;</font>
          <font v-if="scope.row.level > 1">╚═══</font>
          <font>{{ scope.row.id }} {{ scope.row.name }}</font>
        </template>
      </el-table-column>
      <el-table-column prop="key" label="编号/类型">
        <template slot-scope="scope">
          {{ scope.row.key }}<br>{{ scope.row.type }}
        </template>
      </el-table-column>
      <el-table-column label="图标" align="center">
        <template slot-scope="scope">
          <img v-if="scope.row.icon" :src="scope.row.icon" style="width:70px;">
          <span v-if="!scope.row.icon">-</span>
        </template>
      </el-table-column>
      <el-table-column label="状态" align="center">
        <template slot-scope="scope">
          <el-tag type="success" v-if="scope.row.isUse">启用</el-tag>
          <el-tag type="danger" v-if="!scope.row.isUse">禁用</el-tag>
        </template>
			</el-table-column>
      <el-table-column label="添加/修改时间">
        <template slot-scope="scope">
          {{scope.row.dateAdd}} <br/> {{scope.row.dateUpdate}}
        </template>
      </el-table-column>
      <el-table-column label="操作">
        <template slot-scope="scope">
          <el-button type="text" @click="handleUpdate(scope.row.id)">编辑</el-button>
          <el-button type="text" @click="delData(scope.row.id)" style="color:red">删除</el-button>
        </template>
      </el-table-column>
    </el-table>

    <el-dialog :title="pushData.dialogTitle" :visible.sync="pushData.dialogFormVisible" :close-on-click-modal="false" :close-on-press-escape="false">
      <el-form :rules="rules" ref="addEditPopForm" :model="pushData" label-position="left" label-width="100px">
        <el-form-item label="名称" prop="name">
          <el-input v-model="pushData.name" clearable @keyup.enter.native="handleCreateSave"></el-input>
        </el-form-item>
        <el-form-item label="类型">
          <el-col :span="4">
            <el-form-item prop="type">
              <el-input v-model="pushData.type" clearable @keyup.enter.native="handleCreateSave"></el-input>
            </el-form-item>
          </el-col>
          <el-col :span="20">&nbsp;&nbsp;&nbsp;自定义类型，32个字符以内</el-col>
        </el-form-item>
        <el-form-item label="上级分类" prop="pid" >
          <el-select clearable v-model="pushData.pid" placeholder="请选择">
            <el-option label="顶级分类 " value="0">
              <span>顶级分类</span>
            </el-option>
            <el-option v-for="item in list" :key="item.value" :label="item.name" :value="item.id">
              <span>
                <span v-for="lv in item.level-1" :key="lv">&#8195;&#8195;&#8195;&#8195;&#8195;</span>
                <span v-if="item.level > 1">╚═══</span>
                {{item.name}}
              </span>
            </el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="编号">
          <el-col :span="4">
            <el-form-item prop="key">
              <el-input v-model="pushData.key" clearable @keyup.enter.native="handleCreateSave"></el-input>
            </el-form-item>
          </el-col>
          <el-col :span="20">&nbsp;&nbsp;&nbsp;自定义编号，32个字符以内</el-col>
        </el-form-item>
        <el-form-item label="上传图片" >
          <img v-if="pushData.icon" :src="pushData.icon" class="avatar">
          <editorImage class="editor-upload-btn" @successCBK="imageSuccessCBK"></editorImage>
        </el-form-item>
        <el-form-item label="排序" prop="paixu">
          <el-input v-model="pushData.paixu" clearable @keyup.enter.native="handleCreateSave"></el-input>
        </el-form-item>
        <el-form-item label="状态" prop="isUse" >
          <el-select v-model="pushData.isUse" placeholder="请选择">
            <el-option label="启用" :value="true"></el-option>
            <el-option label="禁用" :value="false"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="扩展属性">
          <div v-for="kv in kvList" v-bind:key="kv.k" style="padding-bottom:10px;">
            <el-col :span="4">
              <el-form-item>
                <el-input v-model="kv.k"></el-input>
              </el-form-item>
            </el-col>
            <el-col :span="1" align="center">:</el-col>  
            <el-col :span="4">
              <el-form-item>
                <el-input v-model="kv.v"></el-input>
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

  </div>
</template>

<script>
import { fetchDataList, infoData, delData, saveData } from '@/api/apiExtShopGoodsCategory'
import { Message } from 'element-ui'
import { getToken } from '@/utils/auth'

import editorImage from '@/components/Tinymce/components/editorImage' // 第一步

export default {
  components: { editorImage }, // 第二步; 上面引用 editorImage 是第三步; 下面增加 imageSuccessCBK 方法是第四步, pushData.picUrl 要给默认值 undefined
  data() {
    return {
      imageUrl:undefined,

      kvList:[
        {k:"", v:""}
      ],

      rules: {
        name: [
          { required: true, message: '不能为空'}
        ],
        isUse: [
          { required: true, message: '不能为空'}
        ],
        paixu: [
          { required: true, message: '不能为空'}
        ],
      },

      pushData: {
        dialogTitle : undefined,
        dialogFormVisible:false,

        id:undefined,
        name:undefined,
        type:undefined,
        pid:undefined,
        key:undefined,
        icon:undefined,
        isUse:true,
        paixu:0
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
    handleAvatarSuccess(res, file) {
      this.imageUrl = URL.createObjectURL(file.raw);
      this.pushData.icon = res.data.url;
    },
    beforeAvatarUpload(file) {
      const isJPG = (file.type.indexOf('image/') != -1);
      const isLt1M = file.size / 1024 / 1024 < 1;

      if (!isJPG) {
        this.$message.error('上传头像图片只能是图片格式!');
      }
      if (!isLt1M) {
        this.$message.error('上传头像图片大小不能超过 1MB!');
      }
      return isJPG && isLt1M;
    },

    handleSelectionChange(val) {
      this.multipleSelection = val
    },
    fetchData() {
      this.list = null
      this.listLoading = true
      fetchDataList().then(response => {
        if (response.code == 0) {
          this.list = response.data
        }
        this.listLoading = false
      })
    },
    handleCreate(){
      this.pushData = Object.assign({}, this.pushDataTmp)
      this.pushData.dialogTitle = '增加分类'
      this.pushData.dialogFormVisible = true
      this.imageUrl = undefined
      this.$nextTick(() => {
        this.$refs['addEditPopForm'].clearValidate()
      })
    },
    handleUpdate(id){
      infoData(id).then(res => {
        if (res.code != 0) {
          this.$message({
            message: res.msg,
            type: 'error'
          })
          return;
        } else {
          this.pushData = Object.assign({}, this.pushDataTmp, res.data.info)
          this.imageUrl = undefined
          if (res.data.info.icon) {
            this.imageUrl = new URL(res.data.info.icon);
          }
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
          this.pushData.dialogTitle = '修改分类'
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
    imageSuccessCBK(arr) {
      if (arr && arr.length > 0) {
        this.pushData.icon = arr[0].url
      }      
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
.avatar-uploader .el-upload {
    border: 1px dashed #d9d9d9;
    border-radius: 6px;
    cursor: pointer;
    position: relative;
    overflow: hidden;
  }
  .avatar-uploader .el-upload:hover {
    border-color: #409EFF;
  }
  .avatar-uploader-icon {
    font-size: 28px;
    color: #8c939d;
    width: 178px;
    height: 178px;
    line-height: 178px;
    text-align: center;
  }
  .avatar {
    width: 178px;
    height: 178px;
    display: block;
  }
</style>
