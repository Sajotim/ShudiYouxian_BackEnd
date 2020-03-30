<template>
  <div class="app-container">
    
    <div class="filter-container">
      <el-input clearable @keyup.enter.native="fetchData" style="width: 200px;" class="filter-item" placeholder="订单ID" v-model="searchData.orderId">
      </el-input>
      <el-input clearable @keyup.enter.native="fetchData" style="width: 200px;" class="filter-item" placeholder="公司名称" v-model="searchData.comNameLike">
      </el-input>
      <el-input clearable @keyup.enter.native="fetchData" style="width: 200px;" class="filter-item" placeholder="税号" v-model="searchData.tfnLike">
      </el-input>
      <el-input clearable @keyup.enter.native="fetchData" style="width: 200px;" class="filter-item" placeholder="收费项目" v-model="searchData.consumptionLike">
      </el-input>
      <el-input clearable @keyup.enter.native="fetchData" style="width: 200px;" class="filter-item" placeholder="备注" v-model="searchData.remarkLike">
      </el-input>
      <el-input clearable @keyup.enter.native="fetchData" style="width: 200px;" class="filter-item" placeholder="用户编号" v-model="searchData.uid">
      </el-input>
      <el-select clearable style="width: 200px" class="filter-item" v-model="searchData.status" placeholder="状态">
        <el-option label="待处理" value="0"></el-option>
        <el-option label="不通过" value="1"></el-option>
        <el-option label="开票中" value="2"></el-option>
        <el-option label="开票完成" value="3"></el-option>
      </el-select>
      <el-date-picker type="date" placeholder="申请时间起" v-model="searchData.dateAddBegin" style="width: 200px;" class="filter-item" value-format="yyyy-MM-dd"></el-date-picker>
      <el-date-picker type="date" placeholder="申请时间止" v-model="searchData.dateAddEnd" style="width: 200px;" class="filter-item" value-format="yyyy-MM-dd"></el-date-picker>
      <el-button size="medium" class="filter-item" type="primary" icon="el-icon-search" @click="fetchData">搜索</el-button>
    </div>
    
    <el-table :data="list" v-loading="listLoading" element-loading-text="Loading" fit highlight-current-row empty-text="暂无数据" @selection-change="handleSelectionChange">
      <el-table-column label="用户/订单编号">
        <template slot-scope="scope">
          {{ scope.row.uid }}
          <br>
          {{ scope.row.orderId }}
        </template>
      </el-table-column>
      <el-table-column label="公司/税号">
        <template slot-scope="scope">
          {{ scope.row.comName }}
          <br>
          {{ scope.row.tfn }}
        </template>
      </el-table-column>
      <el-table-column label="项目/金额">
        <template slot-scope="scope">
          {{ scope.row.consumption }}
          <br>
          {{ scope.row.amount }}
        </template>
      </el-table-column>
      <el-table-column label="状态" width="200">
        <template slot-scope="scope">
          <el-tag type="info" v-if="scope.row.status == 0">待处理</el-tag>
          <el-tag type="danger" v-if="scope.row.status == 1">不通过</el-tag>
          <el-tag type="warning" v-if="scope.row.status ==2">开票中</el-tag>
          <el-tag type="success" v-if="scope.row.status ==3">开票完成</el-tag>
          <el-popover
            v-if="scope.row.remark"
            placement="top-start"
            title="备注"
            width="200"
            trigger="hover"
            :content="scope.row.remark">
            <i slot="reference" class="el-icon-info"></i>
          </el-popover>
        </template>
      </el-table-column>
      <el-table-column label="申请/更新时间" width="160">
        <template slot-scope="scope">
          {{scope.row.dateAdd}}
          <br>
          {{scope.row.dateUpdate?scope.row.dateUpdate:'-'}}
        </template>
      </el-table-column>
      <el-table-column label="操作">
        <template slot-scope="scope">
          <el-button type="text" @click="handleUpdate(scope.row.id)">编辑</el-button>
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

    <el-dialog :title="pushData.dialogTitle" :visible.sync="pushData.dialogFormVisible" :close-on-click-modal="false" :close-on-press-escape="false">
      <el-form :rules="rules" ref="addEditPopForm" :model="pushData" label-position="left" label-width="100px">
        <!-- <el-form-item label="商品编号" prop="goodsId">
          <el-col :span="6">
            <el-input v-model="pushData.goodsId" clearable @keyup.enter.native="handleCreateSave"></el-input>
          </el-col>
          <el-col :span="18" style="color:red;padding-left:10px;">
            该字段为预留字段，现阶段请留空不要填写
          </el-col>
        </el-form-item> -->
        <el-form-item label="订单ID" prop="orderId">
          <el-input v-model="pushData.orderId" clearable @keyup.enter.native="handleCreateSave"></el-input>
        </el-form-item>
        <el-form-item label="公司名称" prop="comName">
          <el-input v-model="pushData.comName" clearable @keyup.enter.native="handleCreateSave"></el-input>
        </el-form-item>
        <el-form-item label="税号" prop="tfn">
          <el-input v-model="pushData.tfn" clearable @keyup.enter.native="handleCreateSave"></el-input>
        </el-form-item>
        <el-form-item label="发票内容" prop="consumption">
          <el-input v-model="pushData.consumption" clearable @keyup.enter.native="handleCreateSave"></el-input>
        </el-form-item>
        <el-form-item label="开票金额" prop="amount">
          <el-input v-model="pushData.amount" clearable @keyup.enter.native="handleCreateSave"></el-input>
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
          <el-input v-model="pushData.remark" type="textarea" :rows="4" clearable></el-input>
        </el-form-item>
        <el-form-item label="状态" prop="status">
          <el-col :span="8">
            <el-select  class="filter-item" v-model="pushData.status">
              <el-option label="待处理" :value="0"></el-option>
              <el-option label="不通过" :value="1"></el-option>
              <el-option label="开票中" :value="2"></el-option>
              <el-option label="开票完成" :value="3"></el-option>
            </el-select>
          </el-col>
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
import { fetchDataList, infoData, modifyData, delData } from '@/api/invoiceApply'
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
      pageSize:10,
      totalRow:0,

      kvList:[
        {k:"", v:""}
      ],

      rules: {
        comName: [
          { required: true, message: '不能为空'},
        ],
        tfn: [
          { required: true, message: '不能为空'},
        ],
        consumption: [
          { required: true, message: '不能为空'},
        ],
        amount: [
          { required: true, message: '不能为空'},
        ],
      },

      searchData:{
        mobile:undefined,
        nick:undefined,
        orderId:undefined,
        orderNumber:undefined,
        goodReputation:undefined,
      },

      pushData: {
        dialogTitle : undefined,
        dialogFormVisible: false,

        id:undefined,
        goodReputation:undefined,
        goodReputationRemark:undefined,
      },

      multipleSelection: [],
      list: null,
      listLoading: true
    }
  },
  created() {
    this.pushDataTmp = Object.assign({}, this.pushData)    
  },
  activated() {
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
      fetchDataList(this.page, this.pageSize, this.searchData).then(response => {
        if (response.code == 0) {
          this.list = response.data.result
          this.totalRow = response.data.totalRow
        }
        this.listLoading = false
      })
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
    handleUpdate(id) {
      infoData(id)
        .then(res => {
          if (res.code !== 0) {
            Message({
              message: res.msg,
              type: "error",
              duration: 3 * 1000
            });
          } else {
            this.pushData = Object.assign({}, this.pushDataTmp, res.data.info);
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
            this.pushData.dialogTitle = "修改开票信息";
            this.pushData.dialogFormVisible = true;
            this.$nextTick(() => {
              this.$refs["addEditPopForm"].clearValidate();
            });
          }
        })
        .catch(e => {
          console.error(e);
        });
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
          modifyData(this.pushData)
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
    delData(id){
      this.$confirm('确定要删除吗？', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        delData(id).then(res => {
          if (res.code != 0) {
            Message({
              message: res.msg,
              type: 'error',
              duration: 3 * 1000
            })
            return
          }
          Message({
            message: '操作成功',
            type: 'success',
            duration: 1 * 1000
          })
          this.fetchData()
        })
      }).catch(() => {});
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
