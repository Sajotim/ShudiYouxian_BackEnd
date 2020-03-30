<template>
  <div class="app-container">
    
    <div class="filter-container">
      <el-input clearable @keyup.enter.native="fetchData" style="width: 200px;" class="filter-item" placeholder="用户手机" v-model="searchData.mobile">
      </el-input>
      <el-input clearable @keyup.enter.native="fetchData" style="width: 200px;" class="filter-item" placeholder="用户编号" v-model="searchData.uid">
      </el-input>
      <el-input clearable @keyup.enter.native="fetchData" style="width: 200px;" class="filter-item" placeholder="用户昵称" v-model="searchData.nick">
      </el-input>
      <el-input clearable @keyup.enter.native="fetchData" style="width: 200px;" class="filter-item" placeholder="优惠券编号" v-model="searchData.couponRuleId">
      </el-input>
      <el-input clearable @keyup.enter.native="fetchData" style="width: 200px;" class="filter-item" placeholder="券号" v-model="searchData.number">
      </el-input>
      <el-input clearable @keyup.enter.native="fetchData" style="width: 200px;" class="filter-item" placeholder="密码" v-model="searchData.pwd">
      </el-input>
      <el-select clearable style="width: 200px" class="filter-item" v-model="searchData.status" placeholder="状态">
        <el-option label="未使用" value="0"></el-option>
        <el-option label="已使用" value="1"></el-option>
        <el-option label="作废" value="2"></el-option>
        <el-option label="过期" value="3"></el-option>
      </el-select>
      <el-input clearable @keyup.enter.native="fetchData" style="width: 200px;" class="filter-item" placeholder="扩展属性" v-model="searchData.extendKeywords">
      </el-input>
      <el-date-picker type="date" placeholder="创建时间起" v-model="searchData.dateAddBegin" style="width: 200px;" class="filter-item" value-format="yyyy-MM-dd"></el-date-picker>
      <el-date-picker type="date" placeholder="创建时间止" v-model="searchData.dateAddEnd" style="width: 200px;" class="filter-item" value-format="yyyy-MM-dd"></el-date-picker>
      <el-date-picker type="date" placeholder="更新时间起" v-model="searchData.dateUpdateBegin" style="width: 200px;" class="filter-item" value-format="yyyy-MM-dd"></el-date-picker>
      <el-date-picker type="date" placeholder="更新时间止" v-model="searchData.dateUpdateEnd" style="width: 200px;" class="filter-item" value-format="yyyy-MM-dd"></el-date-picker>
      <el-date-picker type="date" placeholder="到期时间起" v-model="searchData.dateEndBegin" style="width: 200px;" class="filter-item" value-format="yyyy-MM-dd"></el-date-picker>
      <el-date-picker type="date" placeholder="到期时间止" v-model="searchData.dateEndEnd" style="width: 200px;" class="filter-item" value-format="yyyy-MM-dd"></el-date-picker>      
      <el-button class="filter-item" type="primary" icon="el-icon-search" @click="fetchData" size="medium">搜索</el-button>
      <el-button class="filter-item" style="margin-left: 10px;" @click="handleCreate" type="success" icon="el-icon-edit" size="medium">添加</el-button>
      <el-button class="filter-item" style="margin-left: 10px;" @click="handleDownload" type="danger" icon="el-icon-download" size="medium" :loading="downloadLoading">导出Excel</el-button>
    </div>
    
    <el-table :data="list" v-loading="listLoading" element-loading-text="Loading" fit highlight-current-row empty-text="暂无数据" @selection-change="handleSelectionChange">
      <el-table-column label="兑换用户">
        <template slot-scope="scope">
          {{scope.row.mobile?scope.row.mobile:'-'}}<br>
          {{scope.row.nick?scope.row.nick:'-'}}
        </template>
      </el-table-column>
      <el-table-column label="券号/密码">
        <template slot-scope="scope">
          {{scope.row.number}}<br>{{scope.row.pwd}}
        </template>
      </el-table-column>
      <el-table-column label="优惠券编号">
        <template slot-scope="scope">
          {{ scope.row.couponRuleId }}
          <br>
          <i v-if="scope.row.remark" class="el-icon-warning-outline"></i> {{ scope.row.remark }}
        </template>
      </el-table-column>
      <el-table-column label="状态/使用时间" align="center">
        <template slot-scope="scope">
          <el-tag type="info" v-if="scope.row.status == 0">未使用</el-tag>
          <el-tag type="success" v-if="scope.row.status == 1">已使用</el-tag>
          <el-tag type="danger" v-if="scope.row.status == 2">已作废</el-tag>
          <el-tag type="warning" v-if="scope.row.status == 3">已过期</el-tag>
          <div v-if="scope.row.status == 1">
            <el-button type="text" @click="viewDetail(scope.row.id)">查看兑换详情</el-button>
            <br>
            {{scope.row.dateUpdate}}
          </div>
          <div v-else>-</div>
        </template>
      </el-table-column>
      <el-table-column label="创建/到期时间">
        <template slot-scope="scope">
          {{scope.row.dateAdd}}
          <br>
          {{scope.row.dateEnd}}
        </template>
      </el-table-column>
      <el-table-column label="操作" align="center">
        <template slot-scope="scope">
          <el-button v-if="scope.row.status == 0" type="text" @click="invalidData(scope.row.id)" style="color:red">作废</el-button>
          <el-button v-if="scope.row.status == 0 || scope.row.status == 2 || scope.row.status == 3" type="text" @click="delData(scope.row.id)" style="color:red">删除</el-button>
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

    <el-dialog :title="pushData.dialogTitle" :visible.sync="pushData.dialogFormVisible" :close-on-click-modal="false" :close-on-press-escape="false">
      <el-form :rules="rules" ref="addEditPopForm" :model="pushData" label-position="left" label-width="130px">
        <el-form-item label="创建规则" prop="type">
          <el-col :span="8">
            <el-select v-model="pushData.type">
              <el-option label="8位字母数字券号 + 8位字母数字密码" :value="0"></el-option>
              <el-option label="纯数字券号 + 5位纯数字密码" :value="1"></el-option>
              <el-option label="纯数字券号 + 8位字母数字密码" :value="2"></el-option>
            </el-select>
          </el-col>
        </el-form-item>
        <el-form-item label="创建数量" prop="number">
          <el-col :span="8">
            <el-input v-model="pushData.number" clearable></el-input>
          </el-col>
          <el-col :span="16" class="orange">&nbsp;&nbsp;&nbsp;批量创建多少张积分券</el-col>
        </el-form-item>
        <el-form-item label="优惠券规则编号" prop="couponRuleId">
          <el-col :span="8">
            <el-input v-model="pushData.couponRuleId" clearable></el-input>
          </el-col>
          <el-col :span="16" class="orange">&nbsp;&nbsp;&nbsp;生成的动态口令只能用于兑换该优惠券</el-col>
        </el-form-item>
        <el-form-item label="兑换规则" prop="rules">
          <el-col :span="8">
            <el-input v-model="pushData.rules" clearable></el-input>
          </el-col>
          <el-col :span="16" style="color:red">&nbsp;&nbsp;&nbsp;uni-mobile(绑定手机号码后才能兑换，一个手机号只能兑换一次)</el-col>
        </el-form-item>
        <el-form-item label="有效期(天)" prop="days">
          <el-col :span="8">
            <el-input v-model="pushData.days" clearable></el-input>
          </el-col>
          <el-col :span="16" class="orange">&nbsp;&nbsp;&nbsp;该动态口令多少天后会自动过期</el-col>
        </el-form-item>
        <el-form-item label="备注" prop="remark" >
          <el-input v-model="pushData.remark" type="textarea" :rows="4" clearable></el-input>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="pushData.dialogFormVisible = false">取消</el-button>
        <el-button type="primary" @click="handleCreateSave">确定</el-button>
      </div>
    </el-dialog>

    <el-dialog title="查看详情" :visible.sync="pushData.dialogFormVisible2" :close-on-click-modal="false" :close-on-press-escape="false">
      <el-form v-if="infoData" label-position="left" label-width="100px">
        <el-form-item label="用户编号">
          {{infoData.user.id}}
        </el-form-item>
        <el-form-item label="昵称">
          {{infoData.user.nick}}
        </el-form-item>
        <el-form-item v-for="kv in kvList" v-bind:key="kv.k" :label="kv.k">
          {{kv.v}}
        </el-form-item>
      </el-form>
    </el-dialog>

  </div>
</template>

<script>
import { fetchDataList, infoData, invalidData, delData, createData } from '@/api/discountsCouponPwd'
import { Message, MessageBox } from 'element-ui'

const extHeaders = ['收货地址', '省份', '城市', '市区', '详细地址', '姓名']

export default {
  data() {
    return {
      page:1,
      pageSize:10,
      totalRow:0,

      rules: {
        type: [
          { required: true, message: '不能为空'},
        ],
        number: [
          { required: true, message: '不能为空'},
        ],
        couponRuleId: [
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
        dialogFormVisible2:false,

        id:undefined,
        type: 0,
        number:1,
        couponRuleId:undefined,
        rules:undefined,
        scoreMax:10,
        days:7,

      },

      infoData: undefined,

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
          const userMap = response.data.userMap
          this.list.forEach(ele => {
            if (ele.uid) {
              const _userMap = userMap[ele.uid]
              if (_userMap) {
                ele.mobile = _userMap.mobile
                ele.nick = _userMap.nick
              }
            }
          })
        }
        this.listLoading = false
      })
    },
    handleCreate(){
      this.pushData = Object.assign({}, this.pushDataTmp)
      this.pushData.dialogTitle = '批量创建优惠券动态口令'
      this.pushData.dialogFormVisible = true
      this.$nextTick(() => {
        this.$refs['addEditPopForm'].clearValidate()
      })
    },
    handleCreateSave(){
      this.$refs['addEditPopForm'].validate((valid) => {
        if (valid) {
          createData(this.pushData).then((res) => {
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
    invalidData(id){
      this.$confirm('作废无法恢复, 是否继续?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        invalidData(id).then(res => {
          Message({
            message: '作废成功',
            type: 'success',
            duration: 1 * 1000
          })
          this.fetchData()
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
          this.fetchData()
        })
      }).catch(() => {});
    },
    handleDownload() {
      this.downloadLoading = true
      fetchDataList(1, 65535, this.searchData).then(response => {
        if (response.code == 0) {
          const tHeader = ['手机号码', '昵称', '号码', '密码', '状态', '创建时间', '更新时间', '到期时间', '备注']
          const filterVal = ['mobile', 'nick', 'number', 'pwd', 'statusStr', 'dateAdd', 'dateUpdate', 'dateEnd', 'remark']

          
          let curList = response.data.result
          const userMap = response.data.userMap
          curList.forEach(ele => {
            if (ele.uid) {
              let _userMap = userMap[ele.uid]
              if (_userMap) {
                ele.mobile = _userMap.mobile
                ele.nick = _userMap.nick
              }
            }
            extHeaders.forEach(_extHeader => {
              if (ele.extJson && ele.extJson[_extHeader] && !tHeader.includes(_extHeader)) {
                tHeader.push(_extHeader)
                filterVal.push('ext_' + _extHeader)
              }
            })
          })
          import('@/vendor/Export2Excel').then(excel => {
            
            const data = this.formatJson(filterVal, curList)
            excel.export_json_to_excel({
              header: tHeader,
              data,
              filename: '优惠券红包动态口令',
              autoWidth: true
            })
            this.downloadLoading = false
          })
        }
      })
    },
    formatJson(filterVal, jsonData) {
      return jsonData.map(v => filterVal.map(j => {
        for (let index = 0; index < extHeaders.length; index++) {
          const _extHeader = extHeaders[index];
          if (j == 'ext_' + _extHeader) {
            return v.extJson[_extHeader]
          }
        }
        return v[j]
      }))
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
        this.infoData = res.data
        this.pushData.dialogFormVisible2 = true
      })
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
