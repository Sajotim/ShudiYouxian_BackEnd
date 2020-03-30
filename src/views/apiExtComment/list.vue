<template>
  <div class="app-container">
    
    <div class="filter-container">
      <el-select clearable style="width: 200px" class="filter-item" v-model="searchData.type" placeholder="类型">
        <el-option label="网站留言" value="0"></el-option>
        <el-option label="意见反馈" value="1"></el-option>
        <el-option label="投诉建议" value="2"></el-option>
        <el-option label="文章评论" value="3"></el-option>
        <el-option label="接口申请" value="4"></el-option>
      </el-select>
      <el-input v-if="searchData.type == 3" clearable @keyup.enter.native="fetchData" style="width: 200px;" class="filter-item" placeholder="文章编号"
                v-model="searchData.refId">
      </el-input>
      <el-input v-if="searchData.type == 3" clearable @keyup.enter.native="fetchData" style="width: 200px;" class="filter-item" placeholder="文章标题"
                v-model="searchData.titleLike">
      </el-input>
      <el-select clearable style="width: 200px" class="filter-item" v-model="searchData.status" placeholder="状态">
        <el-option label="待审核" value="0"></el-option>
        <el-option label="已审核" value="1"></el-option>
        <el-option label="已回复" value="2"></el-option>
      </el-select>
      <el-date-picker type="date" placeholder="发布时间起" v-model="searchData.dateAddBegin" style="width: 200px;" class="filter-item"></el-date-picker>
      <el-date-picker type="date" placeholder="发布时间止" v-model="searchData.dateAddEnd" style="width: 200px;" class="filter-item"></el-date-picker>
      <el-date-picker type="date" placeholder="回复时间起" v-model="searchData.dateReplyBegin" style="width: 200px;" class="filter-item"></el-date-picker>
      <el-date-picker type="date" placeholder="回复时间止" v-model="searchData.dateReplyEnd" style="width: 200px;" class="filter-item"></el-date-picker>
      <el-button class="filter-item" type="primary" size="medium" icon="el-icon-search" @click="fetchData">搜索</el-button>
    </div>
    
    <el-table :data="list" v-loading="listLoading" element-loading-text="Loading" fit highlight-current-row empty-text="暂无数据" @selection-change="handleSelectionChange">
      <el-table-column prop="typeStr" label="类型" width="100%"></el-table-column>
      <el-table-column label="状态" width="100%">
        <template slot-scope="scope">
          <el-tag type="warning" v-if="scope.row.status == 0">待审核</el-tag>
          <el-tag type="info" v-if="scope.row.status == 1">已审核</el-tag>
          <el-tag type="success" v-if="scope.row.status == 2">已回复</el-tag>
        </template>
      </el-table-column>
      <el-table-column label="留言人">
        <template slot-scope="scope">
          {{scope.row.mobile ? scope.row.mobile : '-'}}
          <br>
          {{scope.row.nick ? scope.row.nick : '-'}}
        </template>
      </el-table-column>      
      <el-table-column prop="content" label="留言内容" show-overflow-tooltip></el-table-column>
      <el-table-column label="留言/回复时间" width="160">
        <template slot-scope="scope">
          {{scope.row.dateAdd}}
          <br>
          {{scope.row.dateReply ? scope.row.dateReply : '-'}}
        </template>
      </el-table-column>
      <el-table-column label="操作" width="80">
        <template slot-scope="scope">
          <el-button type="text" @click="viewDetail(scope.row.id)">查看</el-button>
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

    <el-dialog title="查看详情" :visible.sync="pushData.dialogFormVisible" :close-on-click-modal="false" :close-on-press-escape="false">
      <el-form v-if="pushData.apiResObj" label-position="left" label-width="100px">
        <el-form-item v-if="pushData.apiResObj.info.type == 3 && pushData.apiResObj.articleDetail" label="评论文章">
          {{pushData.apiResObj.articleDetail.title}}
        </el-form-item>
        <el-form-item v-for="kv in kvList" v-bind:key="kv.k" :label="kv.k">
          {{kv.v}}
        </el-form-item>
        <el-form-item label="留言内容">
          {{pushData.apiResObj.info.content}}
        </el-form-item>
        <el-form-item v-if="pushData.apiResObj.info.reply" label="回复信息">
          {{pushData.apiResObj.info.reply}}
        </el-form-item>
      </el-form>
      <div v-if="pushData.apiResObj" slot="footer" class="dialog-footer">        
        <el-button type="warning" size="small" v-if="pushData.apiResObj.info.status == 0" @click="vetData(pushData.apiResObj.info.id)">审核通过</el-button>
        <el-button type="success" size="small" v-if="pushData.apiResObj.info.status != 0" @click="replyData(pushData.apiResObj.info.id)">回复</el-button>
        <el-button type="danger" size="small" @click="delData(pushData.apiResObj.info.id)">删除</el-button>
        <el-button type="info" size="small" @click="pushData.dialogFormVisible = false">[关闭窗口]</el-button>
      </div>
    </el-dialog>

  </div>
</template>

<script>
import { fetchDataList, infoData, delData, vetData, replyData } from '@/api/apiExtComment'
import { Message, MessageBox } from 'element-ui'

export default {
  data() {
    return {
      page:1,
      pageSize:10,
      totalRow:0,

      searchData: {
        id: undefined,
        nameLike: undefined,
        status: undefined,
        dateAddBegin: undefined,
        dateAddEnd: undefined,
      },

      pushData: {
        dialogFormVisible: false,
        apiResObj: undefined
      },

      kvList:[],

      multipleSelection: [],
      list: null,
      listLoading: true,
      statisticsData:{}
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
          this.list.forEach(ele => {
            if (ele.uid != 0) {
              let userMap = response.data.userMap[ele.uid]
              if(userMap){
                ele.mobile = userMap.mobile
                ele.nick = userMap.nick
              }
            }                  
          })
        }
        this.listLoading = false
      })
    },
    viewDetail(id){
      infoData(id).then(res => {
        if (res.code != 0) {
          this.$message.error(res.msg)
          return
        }
        // 计算扩展属性
        const kvList = [];
        if (res.data.extJson) {
          Object.keys(res.data.extJson).forEach(k => {
            let aaaa = '{"k":"'+ k +'", "v":"'+ res.data.extJson[k] +'"}'
            kvList.push(JSON.parse(aaaa))
          })
        }
        this.kvList = kvList
        this.pushData.id = id
        this.pushData.apiResObj = res.data
        this.pushData.dialogFormVisible = true
      })
    }, 
    vetData(id){
      this.$confirm('确定要审核通过吗?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        vetData(id).then(res => {
          Message({
            message: '审核成功',
            type: 'success',
            duration: 1 * 1000
          })
          this.pushData.dialogFormVisible = false
          this.fetchData()
        })
      }).catch(() => {});
    },
    replyData(id){
      this.$prompt('请输入回复内容', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消'
      }).then(({ value }) => {
        replyData({id:id, reply:value}).then(res => {
          if (res.code == 0) {
            Message({
              message: '回复成功',
              type: 'success',
              duration: 1 * 1000
            })
            this.pushData.dialogFormVisible = false
            this.fetchData()
          } else {
            Message({
              message: res.msg,
              type: 'error',
              duration: 1 * 1000
            })
          }          
        })
      }).catch(() => {});
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
          this.pushData.dialogFormVisible = false
          this.fetchData()
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
