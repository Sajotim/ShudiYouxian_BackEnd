<template>
  <div class="app-container">
    <el-form :rules="rules" ref="addEditPopForm" :model="pushData" label-width="120px">
      <el-form-item label="名称" prop="name">
        <el-input v-model="pushData.name" clearable></el-input>
      </el-form-item>
      <el-form-item label="角色说明" prop="profile">
        <el-input v-model="pushData.profile" type="textarea" :rows="4" clearable @keyup.enter.native="handleCreateSave"></el-input>
      </el-form-item>
      <el-form-item label="权限：">
        <el-tree
          ref="tree"
          :data="roles"
          :default-checked-keys="defArr"
          show-checkbox
          node-key="id"
          default-expand-all
          highlight-current
          @keyup.enter.native="submitForm('form')"/>
      </el-form-item>
      <el-form-item>
        <el-button type="primary" @click="onSubmit">提交</el-button>
        <el-button @click="onCancel">取消</el-button>
      </el-form-item>
    </el-form>

  </div>
</template>

<script>
import { saveData, infoData, fetchAllActions } from '@/api/roles'
import { Message, MessageBox } from 'element-ui'

export default {
  data() {
    return {
      actions: [],
      roles: [],
      defArr: [],
      actionsIds: [],

      rules: {
        name: [
          { required: true, message: '不能为空'}
        ],
        profile: [
          { required: true, message: '不能为空'},
        ],
      },

      pushData: {
        id:undefined,
      },

      dialogTitle : undefined,
      dialogFormVisible:false,

    }
  },
  mounted() {
    // 获取所有的权限
    fetchAllActions().then(res => {
      if (res.code == 0) {
        const newArry = []
        res.data.forEach(a => {
          this.actions.push(a)
        })
        this.roles = this.doneTreeData(res.data, newArry, 0)

        if (this.$route.query.id) {
          infoData(this.$route.query.id).then(res => {
            if (res.code != 0) {
              Message({
                message: res.msg,
                type: 'error',
                duration: 3 * 1000
              })
              this.$router.push({ path: '/user/roles/list' })
            } else {
              this.pushData = Object.assign({}, res.data.info)
              if (res.data.myActions && res.data.myActions.length > 0) {
                const defArr = []
                res.data.myActions.forEach(ele => {
                  defArr.push(ele.aid)
                })
                Object.assign([], defArr).forEach(ele => {
                  this.removeParentActions(defArr, ele)
                })
                this.defArr = defArr
              }
            }
          }).catch(e=>{
            console.error(e);
          })
        }
      }
    })
  },
  methods: {
    onSubmit() {
      this.$refs['addEditPopForm'].validate((valid) => {
        if (valid) {
          this.actionsIds = this.$refs.tree.getCheckedKeys() // 获取被选中的id集合
          this.actionsIds.forEach(ele => {
            this.addParentActions(ele)
          })
          this.pushData.actionsIds = this.actionsIds.toString()
          saveData(this.pushData).then((res) => {
            this.pushData.dialogFormVisible = false
            if (res.code == 0) {
              Message({
                message: '操作成功',
                type: 'success',
                duration: 1 * 1000
              })
              this.$router.push({ path: '/user/roles/list' })
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
    onCancel() {
      this.$router.back();
    },
    // 生成属性结构
    doneTreeData(apiArry, newArry, pid){
      const that = this
      apiArry.forEach(function(e) {
        if (e.pid !== pid) {
          return
        }
        let json = { id: e.id, label: e.name, url: e.url, isMenu: e.isMenu, icon: e.icon }
        json = that.processChildren(apiArry, json)
        newArry.push(json)
      })
      return newArry
    },
    processChildren(apiArry, jsonObj){
      const that = this
      let children = []
      children = that.doneTreeData(apiArry, children, jsonObj.id)
      if (children.length > 0) {
        jsonObj.children = children
      }
      return jsonObj
    },
    // 删除父亲
    removeParentActions(defArr, aid) {
      const curObj = this.actions.find(ele => {
        return ele.id === aid
      })
      if (curObj) {
        defArr.forEach((ele, index) => {
          if (ele === curObj.pid) {
            defArr.splice(index, 1)
          }
        })
        this.removeParentActions(defArr, curObj.pid)
      }
    },
    // 增加父亲
    addParentActions(aid) {
      const curObj = this.actions.find(ele => {
        return ele.id === aid
      })
      if (curObj) {
        const pid = curObj.pid
        if (pid === 0) {
          return
        }
        const idx = this.actionsIds.findIndex(ele => {
          return ele === pid
        })
        if (idx === -1) {
          this.actionsIds.push(pid)
          this.addParentActions(pid)
        }
      }
    },
  }
}
</script>

<style scoped>
.line{
  text-align: center;
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

