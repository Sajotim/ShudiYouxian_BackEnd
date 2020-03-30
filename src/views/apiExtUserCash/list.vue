<template>
  <div class="app-container">
    
    <div class="filter-container">
      <el-input clearable @keyup.enter.native="fetchData" style="width: 200px;" class="filter-item" placeholder="用户编号" v-model="searchData.uid">
      </el-input>
      <el-input clearable @keyup.enter.native="fetchData" style="width: 200px;" class="filter-item" placeholder="手机号码" v-model="searchData.mobile">
      </el-input>
      <el-input clearable @keyup.enter.native="fetchData" style="width: 200px;" class="filter-item" placeholder="昵称" v-model="searchData.nick">
      </el-input>
      <el-select clearable style="width: 200px" class="filter-item" v-model="searchData.orderBy" placeholder="排序方式">
        <el-option label="余额从小到大" value="balanceUp"></el-option>        
        <el-option label="余额从大到小" value="balanceDown"></el-option>        
        <el-option label="冻结从小到大" value="freezeUp"></el-option>        
        <el-option label="冻结从大到小" value="freezeDown"></el-option>        
        <el-option label="积分从小到大" value="scoreUp"></el-option>        
        <el-option label="积分从大到小" value="scoreDown"></el-option>        
        <el-option label="累计消费从小到大" value="totleConsumedUp"></el-option>        
        <el-option label="累计消费从大到小" value="totleConsumedDown"></el-option>        
      </el-select>
      <el-button size="medium" class="filter-item" type="primary" icon="el-icon-search" @click="fetchData">搜索</el-button>
      <el-button size="medium" class="filter-item" @click="modifyAmount()" type="danger" icon="el-icon-bank-card">调整余额</el-button>
      <el-button size="medium" class="filter-item" @click="modifyScore()" type="warning" icon="el-icon-coin">调整积分</el-button>
      <el-button size="medium" class="filter-item" @click="modifyGrowth()" type="warning" icon="el-icon-coin">调整成长值</el-button>
    </div>
    
    <el-table :data="list" v-loading="listLoading" element-loading-text="Loading" fit highlight-current-row empty-text="暂无数据" @selection-change="handleSelectionChange">
      <el-table-column prop="uid" label="用户编号"></el-table-column>
      <el-table-column label="手机号码/昵称">
        <template slot-scope="scope">
          {{ scope.row.mobile ? scope.row.mobile : '-' }}<br>
          {{ scope.row.nick ? scope.row.nick : '-' }}
        </template>
      </el-table-column>
      <el-table-column label="可用/冻结（元）">
        <template slot-scope="scope">
          {{ scope.row.balance }}<br>
          {{ scope.row.freeze }}
        </template>
      </el-table-column>
      <el-table-column label="积分/成长值">
        <template slot-scope="scope">
          {{ scope.row.score }}<br>
          {{ scope.row.growth }}
        </template>
      </el-table-column>
      <el-table-column prop="totleConsumed" label="累计消费（元）" />
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

    <el-dialog title="调整余额" :visible.sync="dialogModifyAmountVisible" :close-on-click-modal="false" :close-on-press-escape="false">
      <el-form :rules="rules" ref="addEditPopFormAmount" :model="pushData" label-position="left" label-width="100px">
        <el-form-item label="用户编号" prop="uid">
          <el-col :span="6">
            <el-input v-model="pushData.uid" clearable></el-input>
          </el-col>
          <el-col :span="18" style="color:orange">&nbsp;&nbsp;&nbsp;用户编号和手机号码任填一项即可</el-col>
        </el-form-item>
        <el-form-item label="手机号码" prop="mobile">
          <el-col :span="6">
            <el-input v-model="pushData.mobile" clearable></el-input>
          </el-col>
          <el-col :span="18" style="color:orange">&nbsp;&nbsp;&nbsp;用户编号和手机号码任填一项即可</el-col>
        </el-form-item>
        <el-form-item label="金额" prop="money">
          <el-col :span="6">
            <el-input v-model="pushData.money" clearable></el-input>
          </el-col>
          <el-col :span="18" style="color:orange">&nbsp;&nbsp;&nbsp;例: 填 10 表示给用户增加10元；填 -10 表示从用户余额扣除10元</el-col>
        </el-form-item>
        <el-form-item label="备注" prop="remark">
          <el-input v-model="pushData.remark" type="textarea" clearable rows="4"></el-input>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="dialogModifyAmountVisible = false">取消</el-button>
        <el-button type="primary" @click="modifyAmountSave">确定</el-button>
      </div>
    </el-dialog>
    <el-dialog title="调整积分" :visible.sync="dialogModifyScoreVisible" :close-on-click-modal="false" :close-on-press-escape="false">
      <el-form :rules="rules" ref="addEditPopFormScore" :model="pushData" label-position="left" label-width="100px">
        <el-form-item label="用户编号" prop="uid">
          <el-col :span="6">
            <el-input v-model="pushData.uid" clearable></el-input>
          </el-col>
          <el-col :span="18" style="color:orange">&nbsp;&nbsp;&nbsp;用户编号和手机号码任填一项即可</el-col>
        </el-form-item>
        <el-form-item label="手机号码" prop="mobile">
          <el-col :span="6">
            <el-input v-model="pushData.mobile" clearable></el-input>
          </el-col>
          <el-col :span="18" style="color:orange">&nbsp;&nbsp;&nbsp;用户编号和手机号码任填一项即可</el-col>
        </el-form-item>
        <el-form-item label="积分" prop="score">
          <el-col :span="6">
            <el-input v-model="pushData.score" clearable></el-input>
          </el-col>
          <el-col :span="18" style="color:orange">&nbsp;&nbsp;&nbsp;例: 填 10 表示给用户增加10积分；填 -10 表示扣除10积分</el-col>
        </el-form-item>
        <el-form-item label="备注" prop="remark">
          <el-input v-model="pushData.remark" type="textarea" clearable rows="4"></el-input>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="dialogModifyScoreVisible = false">取消</el-button>
        <el-button type="primary" @click="modifyScoreSave">确定</el-button>
      </div>
    </el-dialog>
    <el-dialog title="调整成长值" :visible.sync="dialogModifyGrowthVisible" :close-on-click-modal="false" :close-on-press-escape="false">
      <el-form :rules="rules" ref="addEditPopFormGrowth" :model="pushData" label-position="left" label-width="100px">
        <el-form-item label="用户编号" prop="uid">
          <el-col :span="6">
            <el-input v-model="pushData.uid" clearable></el-input>
          </el-col>
          <el-col :span="18" style="color:orange">&nbsp;&nbsp;&nbsp;用户编号和手机号码任填一项即可</el-col>
        </el-form-item>
        <el-form-item label="手机号码" prop="mobile">
          <el-col :span="6">
            <el-input v-model="pushData.mobile" clearable></el-input>
          </el-col>
          <el-col :span="18" style="color:orange">&nbsp;&nbsp;&nbsp;用户编号和手机号码任填一项即可</el-col>
        </el-form-item>
        <el-form-item label="成长值" prop="growth">
          <el-col :span="6">
            <el-input v-model="pushData.growth" clearable></el-input>
          </el-col>
          <el-col :span="18" style="color:orange">&nbsp;&nbsp;&nbsp;例: 填 10 表示给用户增加10；填 -10 表示扣除10</el-col>
        </el-form-item>
        <el-form-item label="备注" prop="remark">
          <el-input v-model="pushData.remark" type="textarea" clearable rows="4"></el-input>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="dialogModifyGrowthVisible = false">取消</el-button>
        <el-button type="primary" @click="modifyGrowthSave">确定</el-button>
      </div>
    </el-dialog>

  </div>
</template>

<script>
import { fetchDataList, modifyUserGrowth } from "@/api/apiExtUserCash";
import { modifyUserAmount } from "@/api/apiExtUserPay";
import { modifyUserScore } from "@/api/apiExtUserScoreLog";
import { Message } from "element-ui";
import { mapGetters } from "vuex";

export default {
  computed: {
    ...mapGetters(["centerUserBase"])
  },
  data() {
    return {
      page: 1,
      pageSize: 20,
      totalRow: 0,

      rules: {
        money: [{ required: true, message: '不能为空' }],
        score: [{ required: true, message: '不能为空' }],
        growth: [{ required: true, message: '不能为空' }]
      },

      searchData: {},

      pushData: {},

      multipleSelection: [],
      list: null,
      listLoading: true,

      dialogModifyAmountVisible: false,
      dialogModifyScoreVisible: false,
      dialogModifyGrowthVisible: false
    }
  },
  created() {
    this.pushDataTmp = Object.assign({}, this.pushData);
  },
  activated() {
    this.fetchData()
  },
  methods: {
    handleSizeChange(val) {
      this.pageSize = val
      this.fetchData()
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
      fetchDataList(this.page, this.pageSize, this.searchData).then(
        response => {
          if (response.code === 0) {
            this.list = response.data.result
            this.totalRow = response.data.totalRow
            this.list.forEach(ele => {
              if (ele.uid) {
                const UserMap = response.data.userMap[ele.uid]
                if (UserMap) {
                  ele.mobile = UserMap.mobile
                  ele.nick = UserMap.nick
                }
              }
            })
          } else {
            this.list = []
            this.totalRow = 0
          }
          this.listLoading = false
        }
      )
    },
    modifyAmount() {
      this.pushData = Object.assign({}, this.pushDataTmp)
      this.dialogModifyAmountVisible = true
      this.$nextTick(() => {
        this.$refs['addEditPopFormAmount'].clearValidate()
      })
    },
    modifyScore() {
      this.pushData = Object.assign({}, this.pushDataTmp)
      this.dialogModifyScoreVisible = true
      this.$nextTick(() => {
        this.$refs['addEditPopFormScore'].clearValidate()
      })
    },
    modifyGrowth() {
      this.pushData = Object.assign({}, this.pushDataTmp)
      this.dialogModifyGrowthVisible = true
      this.$nextTick(() => {
        this.$refs['addEditPopFormGrowth'].clearValidate()
      })
    },
    modifyAmountSave() {
      this.$refs['addEditPopFormAmount'].validate(valid => {
        if (valid) {
          modifyUserAmount(this.pushData)
            .then(res => {
              if (res.code === 0) {
                this.dialogModifyAmountVisible = false
                this.$message({
                  message: '操作成功',
                  type: 'success'
                })
                this.fetchData()
              } else {
                this.$message.error(res.msg)
              }
            })
            .catch(e => {
              console.error(e)
            })
        }
      })
    },
    modifyScoreSave() {
      this.$refs['addEditPopFormScore'].validate(valid => {
        if (valid) {
          modifyUserScore(this.pushData)
            .then(res => {
              if (res.code === 0) {
                this.dialogModifyScoreVisible = false
                this.$message({
                  message: '操作成功',
                  type: 'success'
                })
                this.fetchData()
              } else {
                this.$message.error(res.msg)
              }
            })
            .catch(e => {
              console.error(e)
            })
        }
      })
    },
    modifyGrowthSave() {
      this.$refs['addEditPopFormGrowth'].validate(valid => {
        if (valid) {
          modifyUserGrowth(this.pushData)
            .then(res => {
              if (res.code === 0) {
                this.dialogModifyGrowthVisible = false
                this.$message({
                  message: '操作成功',
                  type: 'success'
                })
                this.fetchData()
              } else {
                this.$message.error(res.msg)
              }
            })
            .catch(e => {
              console.error(e)
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
</style>
