<template>
  <div class="app-container">
    
    <div class="filter-container">
      <el-input clearable @keyup.enter.native="fetchData" style="width: 200px;" class="filter-item" placeholder="手机号码" v-model="searchData.mobileUser">
      </el-input>
      <el-input clearable @keyup.enter.native="fetchData" style="width: 200px;" class="filter-item" placeholder="用户ID" v-model="searchData.uid">
      </el-input>
      <el-input clearable @keyup.enter.native="fetchData" style="width: 200px;" class="filter-item" placeholder="昵称" v-model="searchData.nick">
      </el-input>
      <el-input clearable @keyup.enter.native="fetchData" style="width: 200px;" class="filter-item" placeholder="业务编号" v-model="searchData.refCode">
      </el-input>
      <el-input clearable @keyup.enter.native="fetchData" style="width: 200px;" class="filter-item" placeholder="押金编号" v-model="searchData.number">
      </el-input>
      <el-select clearable style="width: 200px" class="filter-item" v-model="searchData.status" placeholder="状态">
        <el-option label="申请退回待处理" value="0"></el-option>
        <el-option label="在押" value="1"></el-option>
        <el-option label="已退还" value="2"></el-option>
      </el-select>
      <el-date-picker type="date" placeholder="支付时间起" v-model="searchData.dateAddBegin" style="width: 200px;" class="filter-item" value-format="yyyy-MM-dd"></el-date-picker>
      <el-date-picker type="date" placeholder="支付时间止" v-model="searchData.dateAddEnd" style="width: 200px;" class="filter-item" value-format="yyyy-MM-dd"></el-date-picker>
      <el-date-picker type="date" placeholder="更新时间起" v-model="searchData.dateUpdateBegin" style="width: 200px;" class="filter-item" value-format="yyyy-MM-dd"></el-date-picker>
      <el-date-picker type="date" placeholder="更新时间止" v-model="searchData.dateUpdateEnd" style="width: 200px;" class="filter-item" value-format="yyyy-MM-dd"></el-date-picker>
      <el-button class="filter-item" type="primary" icon="el-icon-search" @click="fetchData">搜索</el-button>
      <el-button class="filter-item" @click="handleCreate()" type="danger" icon="el-icon-plus">收押金</el-button>
    </div>
    
    <el-table :data="list" v-loading="listLoading" element-loading-text="Loading" fit highlight-current-row empty-text="暂无数据" @selection-change="handleSelectionChange">
      <el-table-column label="手机/昵称">
        <template slot-scope="scope">
          {{scope.row.mobile ? scope.row.mobile : '-'}}
          <br>
          {{scope.row.nick ? scope.row.nick : '-'}}
        </template>
      </el-table-column>
      <el-table-column label="业务/押金编号">
        <template slot-scope="scope">
          {{scope.row.refCode ? scope.row.refCode : '-'}}
          <br>
          {{scope.row.number }}
        </template>
      </el-table-column>
      <el-table-column label="金额/状态" align="center">
        <template slot-scope="scope">
          {{scope.row.money}}<br>
          <el-tag type="danger" v-if="scope.row.status == 0">申请退回待处理</el-tag>
          <el-tag type="success" v-if="scope.row.status == 1">在押</el-tag>
          <el-tag type="info" v-if="scope.row.status == 2">已退还</el-tag>
        </template>
      </el-table-column> 
      <el-table-column label="支付/更新时间" width="160">
        <template slot-scope="scope">
         {{scope.row.dateAdd}}<br>
         {{scope.row.dateUpdate?scope.row.dateUpdate:'-'}}
        </template>
      </el-table-column>
      <el-table-column label="退还时间" width="160">
        <template slot-scope="scope">
         {{scope.row.dateBack ? scope.row.dateBack : (scope.row.dateAutoBack?scope.row.dateAutoBack:'-') }}
        </template>
      </el-table-column>
      <el-table-column label="操作">
        <template slot-scope="scope">
          <el-button type="text" @click="depositDetail(scope.row.id)">查看</el-button>
          <el-button v-if="scope.row.status == 0 || scope.row.status == 1" type="text" style="color:red" @click="backData(scope.row.id)">退回</el-button>
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
      <el-form :rules="rules" ref="addEditPopForm" :model="pushData" label-position="left" label-width="100px">
        <el-form-item label="用户编号" prop="uid">
          <el-input v-model="pushData.uid" clearable @keyup.enter.native="handleCreateSave"></el-input>
        </el-form-item>
        <el-form-item label="手机号码" prop="mobile">
          <el-input v-model="pushData.mobile" clearable @keyup.enter.native="handleCreateSave"></el-input>
        </el-form-item>
        <el-form-item label="业务编号" prop="refCode">
          <el-input v-model="pushData.refCode" clearable @keyup.enter.native="handleCreateSave"></el-input>
        </el-form-item>
        <el-form-item label="押金金额" prop="amount">
          <el-input v-model="pushData.amount" clearable @keyup.enter.native="handleCreateSave"></el-input>
        </el-form-item>
        <el-form-item label="自动退还" prop="dateAutoBack">
          <el-col :span="8">
            <el-date-picker
              v-model="pushData.dateAutoBack"
              type="datetime"
              value-format="yyyy-MM-dd HH:mm:ss"
              placeholder="点击选择">
            </el-date-picker>
          </el-col>
          <el-col :span="16" style="color:orange;">
            &nbsp;&nbsp;如果选择了时间，押金将会该时间自动退还押金
          </el-col>
        </el-form-item>
        <el-form-item label="扩展属性">
          <div v-for="kv in kvList" v-bind:key="kv.k" style="padding-bottom:10px;">
            <el-col :span="4">
              <el-form-item>
                <el-input v-model="kv.k" @keyup.enter.native="handleCreateSave"></el-input>
              </el-form-item>
            </el-col>
            <el-col :span="1" align="center">:</el-col>  
            <el-col :span="4">
              <el-form-item>
                <el-input v-model="kv.v" @keyup.enter.native="handleCreateSave"></el-input>
              </el-form-item>
            </el-col>
            <el-col :span="14"> &nbsp;&nbsp;&nbsp;
              <el-button type="success" @click="addKV()">添加</el-button>
              <el-button type="danger" @click="delKV(kv.k)">删除</el-button>
            </el-col>     
            <div style="clear:both;"></div>     
          </div>
        </el-form-item>
        <el-form-item label="备注" prop="remark">
          <el-input v-model="pushData.remark" type="textarea" clearable rows="4"
                  @keyup.enter.native="handleCreateSave"></el-input>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="pushData.dialogFormVisible = false">取消</el-button>
        <el-button type="primary" @click="handleCreateSave">确定</el-button>
      </div>
    </el-dialog>

    <el-dialog v-if="depositDetailMap" title="押金详情" :visible.sync="pushData.dialogFormVisible2" :close-on-click-modal="false" :close-on-press-escape="false">
      <el-form :rules="rules" ref="addEditPopForm" :model="pushData" label-position="left" label-width="100px">
        <el-form-item label="用户编号">
          {{ depositDetailMap.deposit.uid }}
        </el-form-item>
        <el-form-item label="手机号码">
          {{ depositDetailMap.userInfo.mobile ? depositDetailMap.userInfo.mobile : '-' }}
        </el-form-item>
        <el-form-item label="昵称">
          {{ depositDetailMap.userInfo.nick ? depositDetailMap.userInfo.nick : '-' }}
        </el-form-item>
        <el-form-item label="业务编号">
          {{ depositDetailMap.deposit.refCode ? depositDetailMap.deposit.refCode : '-' }}
        </el-form-item>
        <el-form-item label="押金金额">
          ￥ {{ depositDetailMap.deposit.amount }}
        </el-form-item>
        <el-form-item label="自动退还时间" v-if="depositDetailMap.deposit.dateAutoBack">
          {{ depositDetailMap.deposit.dateAutoBack }}
        </el-form-item>
        <el-form-item label="退还时间" v-if="depositDetailMap.deposit.dateBack">
          {{ depositDetailMap.deposit.dateBack }}
        </el-form-item>
        <el-form-item label="扩展属性" v-if="depositDetailMap.extJson">
          <div v-for="kv in depositDetailMap.extJson" v-bind:key="kv.k" style="padding-bottom:10px;">
            <b>{{ kv.k }} : </b>{{ kv.v }}
          </div>
        </el-form-item>
        <el-form-item label="备注">
          {{ depositDetailMap.deposit.remark ? depositDetailMap.deposit.remark : '-' }}
        </el-form-item>
      </el-form>
    </el-dialog>

  </div>
</template>

<script>
import { fetchDataList, infoData, payData, backData } from "@/api/deposit";
import { Message, MessageBox } from "element-ui";
import { mapGetters } from "vuex";

export default {
  computed: {
    ...mapGetters(["centerUserBase"])
  },
  data() {
    return {
      page: 1,
      pageSize: 10,
      totalRow: 0,

      rules: {
        amount: [{ required: true, message: "不能为空" }],
        goodReputationRemark: [{ required: true, message: "不能为空" }]
      },

      kvList:[
        {k:"", v:""}
      ],

      searchData: {
        mobile: undefined,
        nick: undefined,
        orderId: undefined,
        orderNumber: undefined,
        goodReputation: undefined
      },

      pushData: {
        dialogTitle: undefined,
        dialogFormVisible: false,
        dialogFormVisible2: false,

        id: undefined,
        goodReputation: undefined,
        goodReputationRemark: undefined
      },

      depositDetailMap: undefined,

      multipleSelection: [],
      list: null,
      listLoading: true,
      apiExtUserMap: undefined
    };
  },
  created() {
    this.pushDataTmp = Object.assign({}, this.pushData);
    this.fetchData();
  },
  mounted() {},
  methods: {
    handleSizeChange(val) {
      this.pageSize = val;
      this.fetchData();
    },
    handleCurrentChange(val) {
      this.page = val;
      this.fetchData();
    },
    handleSelectionChange(val) {
      this.multipleSelection = val;
    },
    fetchData() {
      this.list = null;
      this.listLoading = true;
      fetchDataList(this.page, this.pageSize, this.searchData).then(
        response => {
          if (response.code == 0) {
            this.list = response.data.result;
            this.list.forEach(ele => {
              if (ele.uid) {
                let UserMap = response.data.userMap[ele.uid];
                if (UserMap) {
                  ele.mobile = UserMap.mobile;
                  ele.nick = UserMap.nick;
                }
              }
            });
            this.apiExtUserMap = response.data.apiExtUserMap;
            this.totalRow = response.data.totalRow;
          }
          this.listLoading = false;
        }
      );
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
    handleCreate() {
      this.pushData = Object.assign({}, this.pushDataTmp);
      this.pushData.dialogTitle = "收押金";
      this.pushData.dialogFormVisible = true;
      this.$nextTick(() => {
        this.$refs["addEditPopForm"].clearValidate();
      });
    },
    depositDetail(id) {
      infoData(id).then(res => {
        if (res.code != 0) {
          Message({
            message: res.msg,
            type: "error",
            duration: 3 * 1000
          });
          return
        }
        this.depositDetailMap = res.data
        if (res.data.extJson) {
          let kvList = [];
          Object.keys(res.data.extJson).forEach(k => {
            let aaaa = '{"k":"'+ k +'", "v":"'+ res.data.extJson[k] +'"}'
            kvList.push(JSON.parse(aaaa))
          })
          this.depositDetailMap.extJson = kvList
        }
        this.pushData.dialogFormVisible2 = true;
      })
    },
    handleCreateSave() {
      let pushDataDetailsJsonStr = {}
      this.kvList.forEach(item => {
        // {k:"", v:""}
        if (item.k && item.v) {
          let aaaa = '{"'+ item.k +'":"'+ item.v +'"}'
          pushDataDetailsJsonStr = Object.assign({}, pushDataDetailsJsonStr, JSON.parse(aaaa))
        }        
      })
      this.pushData.extJsonStr = JSON.stringify(pushDataDetailsJsonStr)
      this.$refs["addEditPopForm"].validate(valid => {
        if (valid) {
          payData(this.pushData)
            .then(res => {
              this.pushData.dialogFormVisible = false;
              if (res.code == 0) {
                Message({
                  message: "操作成功",
                  type: "success",
                  duration: 1 * 1000
                });
                this.fetchData();
              } else {
                Message({
                  message: res.msg,
                  type: "error",
                  duration: 3 * 1000
                });
              }
            })
            .catch(e => {
              console.error(e);
            });
        }
      });
    },
    backData(id) {
      this.$confirm(
        "确定要退回这笔押金吗？",
        "提示",
        {
          confirmButtonText: "确定",
          cancelButtonText: "取消",
          type: "warning"
        }
      )
        .then(() => {
          backData(id).then(res => {
            if (res.code != 0) {
              Message({
                message: res.msg,
                type: "error",
                duration: 3 * 1000
              });
              return;
            }
            Message({
              message: "押金已退回！",
              type: "success",
              duration: 1 * 1000
            });
            this.fetchData();
          });
        })
        .catch(() => {});
    }
  }
};
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
