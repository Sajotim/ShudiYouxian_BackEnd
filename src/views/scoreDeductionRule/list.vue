<template>
  <div class="app-container">
    
    <div class="filter-container">
      <el-button class="filter-item" size="medium" @click="handleCreate()" type="success" icon="el-icon-plus">新建规则</el-button>
    </div>
    
    <el-table :data="list" v-loading="listLoading" element-loading-text="Loading" fit highlight-current-row empty-text="暂无数据" @selection-change="handleSelectionChange">
      <el-table-column prop="score" label="消耗积分"></el-table-column>
      <el-table-column prop="money" label="兑换类型">
        <template slot-scope="scope">
          <el-tag v-if="scope.row.type == 0" type="success">下单时抵扣 {{ scope.row.money }} 金额</el-tag>
          <el-tag v-if="scope.row.type == 1" type="warning">兑换 {{ scope.row.money }} 成长值</el-tag>
          <el-tag v-if="scope.row.type == 2" type="danger">兑换 {{ scope.row.money }} 金额</el-tag>
        </template>
      </el-table-column>
      <el-table-column label="是否叠加">
        <template slot-scope="scope">
          <el-tag type="success" v-if="scope.row.loop">叠加</el-tag>
          <el-tag type="danger" v-if="!scope.row.loop">不叠加</el-tag>
        </template>
      </el-table-column>
      <el-table-column label="添加/修改时间" width="160">
        <template slot-scope="scope">
          {{scope.row.dateAdd}}
          <br>
          {{scope.row.dateUpdate ? scope.row.dateUpdate : '-'}}
        </template>
      </el-table-column>
      <el-table-column label="操作" width="100%">
        <template slot-scope="scope">
          <el-button type="text" @click="handleUpdate(scope.row.id)">编辑</el-button>
          <el-button type="text" @click="delData(scope.row.id)" style="color:red">删除</el-button>
        </template>
      </el-table-column>
    </el-table>

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
        <el-form-item label="积分数" prop="score">
          <el-col :span="6">
            <el-input v-model="pushData.score" clearable @keyup.enter.native="handleCreateSave"></el-input>
          </el-col>
        </el-form-item>        
        <el-form-item label="抵扣类型" prop="type">
          <el-radio v-model="pushData.type" :label="0">下单时抵扣金额</el-radio>
          <el-radio v-model="pushData.type" :label="1">兑换成长值</el-radio>
          <el-radio v-model="pushData.type" :label="2">兑换成金额</el-radio>
        </el-form-item>
        <el-form-item v-if="pushData.type == 0" label="可抵扣" prop="money">
          <el-col :span="6">
            <el-input v-model="pushData.money" clearable @keyup.enter.native="handleCreateSave"></el-input>
          </el-col>
          <el-col :span="18" style="color:red;padding-left:10px;">
            元
          </el-col>
        </el-form-item>
        <el-form-item v-if="pushData.type == 1" label="兑换" prop="money">
          <el-col :span="6">
            <el-input v-model="pushData.money" clearable @keyup.enter.native="handleCreateSave"></el-input>
          </el-col>
          <el-col :span="18" style="color:red;padding-left:10px;">
            成长值
          </el-col>
        </el-form-item>
        <el-form-item v-if="pushData.type == 2" label="兑换" prop="money">
          <el-col :span="6">
            <el-input v-model="pushData.money" clearable @keyup.enter.native="handleCreateSave"></el-input>
          </el-col>
          <el-col :span="18" style="color:red;padding-left:10px;">
            元
          </el-col>
        </el-form-item>
        <el-form-item label="是否叠加" prop="loop">
          <el-col :span="8">
            <el-select  class="filter-item" v-model="pushData.loop" placeholder="商品状态">
              <el-option label="叠加" :value="true"></el-option>
              <el-option label="不叠加" :value="false"></el-option>
            </el-select>
          </el-col>
        </el-form-item>
        <el-form-item style="color:red;">
          假如设置100积分抵1，开启叠加的话，用户可选择500积分可抵扣5。
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
import {
  fetchDataList,
  infoData,
  delData,
  saveData
} from '@/api/scoreDeductionRule'
import { Message } from 'element-ui'

export default {
  data() {
    return {
      rules: {
        score: [{ required: true, message: '不能为空' }],
        type: [{ required: true, message: '不能为空' }],
        money: [{ required: true, message: '不能为空' }],
        loop: [{ required: true, message: '不能为空' }]
      },

      searchData: {},

      pushData: {
        dialogTitle: undefined,
        dialogFormVisible: false,

        id: undefined,
        type: 0,
        loop: true
      },

      multipleSelection: [],
      list: null,
      listLoading: true,
      statisticsData: {}
    }
  },
  created() {
    this.pushDataTmp = Object.assign({}, this.pushData);
    this.fetchData();
  },
  mounted() {},
  methods: {
    handleSelectionChange(val) {
      this.multipleSelection = val;
    },
    fetchData() {
      this.list = null;
      this.listLoading = true;
      fetchDataList(this.searchData).then(response => {
        if (response.code === 0) {
          this.list = response.data.result;
        }
        this.listLoading = false;
      });
    },
    handleCreate() {
      this.pushData = Object.assign({}, this.pushDataTmp);
      this.pushData.dialogTitle = "添加积分抵扣规则";
      this.pushData.dialogFormVisible = true;
      this.$nextTick(() => {
        this.$refs["addEditPopForm"].clearValidate();
      });
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
            this.pushData = Object.assign({}, this.pushDataTmp, res.data, {
              dateType: "" + res.data.dateType,
              isPub: "" + res.data.isPub,
              content: res.data.value
            });
            this.pushData.dialogTitle = "修改积分抵扣规则";
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
      this.$refs["addEditPopForm"].validate(valid => {
        if (valid) {
          saveData(this.pushData)
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
    delData(id) {
      this.$confirm("删除无法恢复, 是否继续?", "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning"
      })
        .then(() => {
          delData(id).then(res => {
            Message({
              message: "删除成功",
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
