<template>
  <div class="app-container">

    <div class="filter-container">
      <el-input clearable @keyup.enter.native="goSearch" style="width: 200px;" class="filter-item" placeholder="用户编号" v-model="searchData.id">
      </el-input>
      <el-select v-model="searchData.source" clearable style="width: 200px" class="filter-item" placeholder="来源">
        <el-option label="全部" value="" />
        <el-option label="小程序" value="0" />
        <el-option label="手机注册" value="1" />
        <el-option label="公众号" value="2" />
        <el-option label="支付宝小程序" value="3" />
        <el-option label="用户名注册" value="4" />
        <el-option label="邮箱注册" value="5" />
        <el-option label="QQ互联" value="6" />
        <el-option label="微信登录" value="7" />
        <el-option label="头条小程序" value="8" />
        <el-option label="后台录入" value="9" />
      </el-select>
      <el-input clearable @keyup.enter.native="goSearch" style="width: 200px;" class="filter-item" placeholder="手机号码" v-model="searchData.mobile">
      </el-input>
      <el-input clearable @keyup.enter.native="goSearch" style="width: 200px;" class="filter-item" placeholder="昵称" v-model="searchData.nickLike">
      </el-input>
      <el-input clearable @keyup.enter.native="goSearch" style="width: 200px;" class="filter-item" placeholder="省份" v-model="searchData.province">
      </el-input>
      <el-input clearable @keyup.enter.native="goSearch" style="width: 200px;" class="filter-item" placeholder="城市" v-model="searchData.city">
      </el-input>
      <el-input clearable @keyup.enter.native="goSearch" style="width: 200px;" class="filter-item" placeholder="注册IP" v-model="searchData.ipAdd">
      </el-input>
      <el-date-picker type="date" placeholder="注册时间起" v-model="searchData.dateAddBegin" style="width: 200px;" class="filter-item" value-format="yyyy-MM-dd"></el-date-picker>
      <el-date-picker type="date" placeholder="注册时间止" v-model="searchData.dateAddEnd" style="width: 200px;" class="filter-item" value-format="yyyy-MM-dd"></el-date-picker>
      <el-date-picker type="date" placeholder="登录时间起" v-model="searchData.dateLoginBegin" style="width: 200px;" class="filter-item" value-format="yyyy-MM-dd"></el-date-picker>
      <el-date-picker type="date" placeholder="登录时间止" v-model="searchData.dateLoginEnd" style="width: 200px;" class="filter-item" value-format="yyyy-MM-dd"></el-date-picker>
      <el-input clearable @keyup.enter.native="goSearch" style="width: 200px;" class="filter-item" placeholder="登录IP" v-model="searchData.ipLogin">
      </el-input>
      <el-select clearable style="width: 200px" class="filter-item" v-model="searchData.status" placeholder="状态">
        <el-option label="全部" value=""></el-option>
        <el-option label="默认" value="0"></el-option>
      </el-select>
      <el-select clearable style="width: 200px" class="filter-item" v-model="searchData.isIdcardCheck" placeholder="实名认证">
        <el-option label="是" value="true"></el-option>
        <el-option label="否" value="false"></el-option>
      </el-select>
      <el-select clearable style="width: 200px" class="filter-item" v-model="searchData.isSeller" placeholder="分销商">
        <el-option label="是" value="true"></el-option>
        <el-option label="否" value="false"></el-option>
      </el-select>
      <el-input clearable @keyup.enter.native="goSearch" style="width: 200px;" class="filter-item" placeholder="邀请人编号" v-model="searchData.referrer" />
      <el-input clearable @keyup.enter.native="fetchData" style="width: 200px;" class="filter-item" placeholder="扩展属性" v-model="searchData.extendKeywords" />
      <el-button size="medium" class="filter-item" type="primary" icon="el-icon-search" @click="goSearch">搜索</el-button>
      <el-button size="medium" class="filter-item" type="danger" icon="el-icon-coin" @click="importFromWX">批量导入微信服务号用户</el-button>
      <el-button size="medium" class="filter-item" type="success" icon="el-icon-plus" @click="addUser">添加用户</el-button>
    </div>

    <el-table :data="list" v-loading="listLoading" element-loading-text="Loading" fit highlight-current-row empty-text="暂无数据" @selection-change="handleSelectionChange">
      <el-table-column type="selection" align="center" width="55" row-key="id" />
      <el-table-column label="用户编号/渠道">
        <template slot-scope="scope">
          {{scope.row.id}}<br>
          {{scope.row.sourceStr}}
        </template>
      </el-table-column>
      <el-table-column label="手机/昵称">
        <template slot-scope="scope">
          <div v-if="scope.row.mobile && scope.row.username">
            {{ scope.row.username }} [{{ scope.row.mobile }}]
          </div>
          <div v-else-if="!scope.row.mobile && !scope.row.username">
            -
          </div>
          <div v-else>
            {{ scope.row.username }}{{ scope.row.mobile }}
          </div>
          <div>
          {{scope.row.nick ? scope.row.nick : '-'}}
          </div>
        </template>
      </el-table-column>
      <el-table-column label="所在地">
        <template slot-scope="scope">
          {{scope.row.province ? scope.row.province : '-'}}<br>
          {{scope.row.city ? scope.row.city : '-'}}
        </template>
      </el-table-column>
      <el-table-column label="头像" align="center">
        <template slot-scope="scope">
          <img v-if="scope.row.avatarUrl" :src="scope.row.avatarUrl" style="width:70px;" />
          <span v-else>-</span>
        </template>
      </el-table-column>
      <el-table-column label="注册时间/IP">
        <template slot-scope="scope">
          {{scope.row.dateAdd}}<br>
          {{scope.row.ipAdd}}
        </template>
      </el-table-column>
      <el-table-column label="最后登录">
        <template slot-scope="scope">
          {{scope.row.dateLogin ? scope.row.dateLogin : '-'}}<br>
          {{scope.row.ipLogin ? scope.row.ipLogin : '-'}}
        </template>
      </el-table-column>
      <el-table-column label="分销商" align="center">
        <template slot-scope="scope">
          <el-tag v-if="scope.row.isSeller" type="success">是</el-tag>
          <el-tag v-if="!scope.row.isSeller" type="danger">否</el-tag>
        </template>
      </el-table-column>
      <el-table-column prop="statusStr" label="状态" width="80px"></el-table-column>
      <el-table-column label="操作" width="100px">
        <template slot-scope="scope">
          <el-button type="text" @click="handleUpdate(scope.row.id)">编辑</el-button>
          <el-button type="text" @click="delData(scope.row.id)">删除</el-button>
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
import { fetchDataList, importFromWX, delData } from '@/api/apiExtUser'
import { Message } from 'element-ui'
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

      rules: {},

      pickerOptions: {
        shortcuts: [{
          text: '最近一周',
          onClick(picker) {
            const end = new Date();
            const start = new Date();
            start.setTime(start.getTime() - 3600 * 1000 * 24 * 7);
            picker.$emit('pick', [start, end]);
          }
        }, {
          text: '最近一个月',
          onClick(picker) {
            const end = new Date();
            const start = new Date();
            start.setTime(start.getTime() - 3600 * 1000 * 24 * 30);
            picker.$emit('pick', [start, end]);
          }
        }, {
          text: '最近三个月',
          onClick(picker) {
            const end = new Date();
            const start = new Date();
            start.setTime(start.getTime() - 3600 * 1000 * 24 * 90);
            picker.$emit('pick', [start, end]);
          }
        }]
      },
      dateAdd: '',
      dateLogin: '',
      searchData:{
        id:undefined,
        source:undefined,
        mobile:undefined,
        nick:undefined,
        province:undefined,
        city:undefined,
        ipAdd:undefined,
        ipLogin:undefined,
        status:undefined,
        isIdcardCheck:undefined,
        dateAddBegin:undefined,
        dateAddEnd:undefined,
        dateLoginBegin:undefined,
        dateLoginEnd:undefined,
      },

      pushData: {
        dialogTitle : undefined,
        dialogFormVisible:false,

        id:undefined,
        openid:undefined,
        mobile:undefined,
        nick:undefined,
        pwd:undefined,
        levelId:undefined,
      },

      multipleSelection: [],
      list: null,
      listLoading: true,
      userLevels:[]
    }
  },
  created() {
    this.pushDataTmp = Object.assign({}, this.pushData)
  },
  activated() {
    this.fetchData()
  },
  methods: {
    importFromWX(){
      this.$confirm('本次操作可能需要您耐心等待几分钟<strong></br></strong>本功能仅限服务号使用，非服务号无效！<strong></br></strong>请耐心等待！', '提示', {
        dangerouslyUseHTMLString: true,
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'info'
      }).then(() => {
        importFromWX().then(res=>{
          if (res.code === 0) {
            Message({
              message: '操作成功',
              type: 'success',
              duration: 1000
            })
            this.fetchData()
          } else {
            Message({
              message: res.msg,
              type: 'error',
              duration: 3 * 1000
            })
          }
        });
      }).catch(() => {

      });
    },
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
    goSearch () {
      this.page = 1
      this.fetchData()
    },
    fetchData() {
      this.list = null
      this.listLoading = true
      fetchDataList(this.page, this.pageSize, this.searchData).then(response => {
        if (response.code === 0) {
          this.list = response.data.result
          this.totalRow = response.data.totalRow
        } else if (response.code === 700) {
          this.totalRow = 0
        }
        this.listLoading = false
      })
    },
    addUser() {
      this.$router.push({ path: 'add' })
    },
    handleUpdate(id) {
      this.$router.push({ path: 'add', query: { id: id }})
    },
    delData(id) {
      this.$confirm('删除无法恢复, 是否继续?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        const loadingInstance = this.$loading({
          text: '正在删除用户...'
        })
        delData(id).then(() => {
          this.$message({
            message: '删除成功',
            type: 'success'
          })
          this.fetchData()
        }).finally(() => {
          loadingInstance.close()
        })
      }).catch(() => {})
    },
    delDataMore() { // 批量删除用户
      if (!this.multipleSelection.length) {
        this.$message.error('请先选择需要删除的数据')
        return
      }
      this.$confirm('删除无法恢复, 是否继续?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        this.delDataMoreDone()
      }).catch(() => {})
    },
    async delDataMoreDone() { // 批量删除用户
      const ids = []
      this.multipleSelection.forEach(ele => {
        ids.push(ele.id)
      })
      const loadingInstance = this.$loading({
        text: '正在删除用户...'
      })
      delData(ids.join()).then(() => {
        this.$message({
          message: '删除成功',
          type: 'success'
        })
        this.fetchData()
      }).finally(() => {
        loadingInstance.close()
      })
      this.fetchData()
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
