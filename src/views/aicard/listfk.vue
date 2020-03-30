<template>
  <div class="app-container">

    <div class="filter-container">
      <el-input clearable @keyup.enter.native="fetchData" style="width: 200px;" class="filter-item" placeholder="用户编号" v-model="searchData.id">
      </el-input>
      <el-input clearable @keyup.enter.native="fetchData" style="width: 200px;" class="filter-item" placeholder="邀请名片编号" v-model="searchData.referrer">
      </el-input>
      <el-input clearable @keyup.enter.native="fetchData" style="width: 200px;" class="filter-item" placeholder="手机号码" v-model="searchData.mobile">
      </el-input>
      <el-input clearable @keyup.enter.native="fetchData" style="width: 200px;" class="filter-item" placeholder="昵称" v-model="searchData.nick">
      </el-input>
      <el-button size="medium" class="filter-item" type="primary" icon="el-icon-search" @click="fetchData">搜索</el-button>
    </div>

    <el-table :data="list" v-loading="listLoading" element-loading-text="Loading" fit highlight-current-row empty-text="暂无数据" @selection-change="handleSelectionChange">
      <el-table-column label="用户编号" prop="id" />
      <el-table-column label="邀请名片编号">
        <template slot-scope="scope">
          {{scope.row.referrer ? scope.row.referrer : '-'}}
        </template>
      </el-table-column>
      <el-table-column label="手机/姓名">
        <template slot-scope="scope">
          {{scope.row.mobile ? scope.row.mobile : '-'}}<br>
          {{scope.row.nick ? scope.row.nick : '-'}}
        </template>
      </el-table-column>
      <el-table-column label="头像" align="center">
        <template slot-scope="scope">
          <img v-if="scope.row.avatarUrl" :src="scope.row.avatarUrl" style="width:70px;" />
          <span v-else>-</span>
        </template>
      </el-table-column>
      <el-table-column label="操作" width="200px">
        <template slot-scope="scope">
          <el-button v-if="scope.row.levelId != userLevelId" type="text" @click="setToYG(scope.row.id)">分配名片</el-button>
          <el-button v-if="scope.row.levelId == userLevelId" type="text" style="color:orange" @click="handleUpdate(scope.row.id)">编辑</el-button>
          <el-button type="text" style="color:red" @click="delData(scope.row.id)">删除</el-button>
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
  </div>
</template>

<script>
import { fetchDataList, modifyUser, delData, delUserFriend } from '@/api/apiExtUser'
import { fetchAllUserLevels, saveUserLevelData } from '@/api/apiExtUserLevel'
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
      pageSize:50,
      totalRow:0,

      dateLogin: '',
      searchData: {
        levelId: 0
      },

      multipleSelection: [],
      list: null,
      listLoading: true,
      userLevelId:undefined
    }
  },
  activated() {
    let _this = this
    fetchAllUserLevels(1, 1, {
      name: 'aicard'
    }).then(res => {
      if (res.code == 700) {
        saveUserLevelData({
          name: 'aicard',
          rebate: 10
        }).then(level => {
          _this.userLevelId = level.data.id
        })
      } else {
        _this.userLevelId = res.data.result[0].id
      }
    }).catch(e => {
      console.error(e)
    })    
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
      let _searchData = Object.assign({}, this.searchData)
      // _searchData.levelId = this.userLevelId
      fetchDataList(this.page, this.pageSize, _searchData).then(response => {
        if (response.code === 0) {
          this.list = response.data.result
          this.totalRow = response.data.totalRow
        }else if(response.code === 700){
          this.totalRow = 0
        }
        this.listLoading = false
      })
    },
    handleUpdate(id){
      this.$router.push({ path: 'add', query:{id:id} })
    },
    delData(id){
      this.$confirm('删除无法恢复, 是否继续?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        delData(id).then(() => {
          Message({
            message: '删除成功',
            type: 'success',
            duration: 1000
          })
          this.fetchData()
        })
      }).catch(() => {});
    },
    setToFK(id){
      this.$confirm('取消员工身份，将会从所有访客名片夹移除当前名片，确定吗?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        modifyUser({
          id: id,
          levelId: 0
        }).then((res) => {
          if (res.code == 0) {
            delUserFriend(undefined, id)
          }
          Message({
            message: '操作成功',
            type: 'success',
            duration: 1000
          })
          this.fetchData()
        })
      }).catch(() => {});      
    },
    setToYG(id){
      modifyUser({
        id: id,
        levelId: this.userLevelId
      }).then((res) => {
        if (res.code == 30001) {
          this.$message({
            message: '您已设置其他名片，无法再添加更多名片',
            type: 'error',
            duration: 1000
          })
        } else if (res.code == 0) {
          Message({
            message: '设置成功',
            type: 'success',
            duration: 1000
          })
          this.fetchData()
        } else {
          this.$message({
            message: res.msg,
            type: 'error',
            duration: 1000
          })
        }
      })
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

  .but_gn{
    background-color: #629B58!important;
    border-color: #87B87F;
  }

.el-range-editor.el-input__inner {
  padding: 7px 11px;
}

.orange {
  color: #FF892A!important;
}

.el-card {
  border: 0px;
}
.el-dialog__body {
  padding: 20px 20px;
}
</style>
