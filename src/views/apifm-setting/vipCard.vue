<template>
  <div class="app-container">
    
    <div class="filter-container">
      <el-input clearable @keyup.enter.native="fetchData" style="width: 200px;" class="filter-item" placeholder="使用商户编号" v-model="searchData.userIdUse">
      </el-input>
      <el-input clearable @keyup.enter.native="fetchData" style="width: 200px;" class="filter-item" placeholder="卡密" v-model="searchData.number">
      </el-input>
      <el-select clearable style="width: 200px" class="filter-item" v-model="searchData.status" placeholder="状态">
        <el-option label="未使用" value="0"></el-option>
        <el-option label="已使用" value="1"></el-option>
        <el-option label="已作废" value="2"></el-option>
        <el-option label="已过期" value="3"></el-option>
      </el-select>
      <el-button class="filter-item" type="primary" icon="el-icon-search" @click="fetchData" size="medium">搜索</el-button>
    </div>
    
    <el-table :data="list" v-loading="listLoading" element-loading-text="Loading" fit highlight-current-row empty-text="暂无数据" @selection-change="handleSelectionChange">
      <el-table-column label="使用商户编号" prop="userIdUse" />
      <el-table-column label="卡密" prop="number" />
      <el-table-column label="增加时长" prop="years" >
        <template slot-scope="scope">
          <span v-if="scope.row.years > 0">{{scope.row.years}}年</span>
          <span v-if="scope.row.months > 0">{{scope.row.months}}月</span>
          <span v-if="scope.row.days > 0">{{scope.row.days}}天</span>
        </template>
      </el-table-column>
      <el-table-column label="状态/使用时间" align="center">
        <template slot-scope="scope">
          <el-tag type="info" v-if="scope.row.status == 0">未使用</el-tag>
          <el-tag type="success" v-if="scope.row.status == 1">已使用</el-tag>
          <el-tag type="danger" v-if="scope.row.status == 2">已作废</el-tag>
          <el-tag type="warning" v-if="scope.row.status == 3">已过期</el-tag>
          <div v-if="scope.row.status == 1">
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
import { fetchDataList } from "@/api/vipCard";
import { Message, MessageBox } from "element-ui";

export default {
  data() {
    return {
      page: 1,
      pageSize: 10,
      totalRow: 0,

      rules: {
        number: [{ required: true, message: "不能为空" }],
        scoreMin: [{ required: true, message: "不能为空" }],
        scoreMax: [{ required: true, message: "不能为空" }],
        days: [{ required: true, message: "不能为空" }]
      },

      searchData: {},

      pushData: {
        dialogTitle: undefined,
        dialogFormVisible: false,

        id: undefined,
        number: 1,
        scoreMin: 10,
        scoreMax: 10,
        days: 7
      },

      multipleSelection: [],
      list: null,
      listLoading: true,
      downloadLoading: false,
      statisticsData: {}
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
            this.totalRow = response.data.totalRow;
            this.list.forEach(ele => {
              if (ele.uid) {
                let userMap = userMap[ele.uid];
                if (userMap) {
                  ele.mobile = userMap.mobile;
                  ele.nick = userMap.nick;
                }
              }
            });
          }
          this.listLoading = false;
        }
      );
    },
    handleCreate() {
      this.pushData = Object.assign({}, this.pushDataTmp);
      this.pushData.dialogTitle = "批量创建积分券";
      this.pushData.dialogFormVisible = true;
      this.$nextTick(() => {
        this.$refs["addEditPopForm"].clearValidate();
      });
    },
    handleCreateSave() {
      this.$refs["addEditPopForm"].validate(valid => {
        if (valid) {
          createData(this.pushData)
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
    invalidData(id) {
      this.$confirm("作废无法恢复, 是否继续?", "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning"
      })
        .then(() => {
          invalidData(id).then(res => {
            Message({
              message: "作废成功",
              type: "success",
              duration: 1 * 1000
            });
            this.fetchData();
          });
        })
        .catch(() => {});
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
    },
    handleDownload() {
      this.downloadLoading = true;
      fetchDataList(1, 65535, this.searchData).then(response => {
        if (response.code == 0) {
          let curList = response.data.result;
          curList.forEach(ele => {
            if (ele.uid) {
              let userMap = userMap[ele.uid];
              if (userMap) {
                ele.mobile = userMap.mobile;
                ele.nick = userMap.nick;
              }
            }
          });
          import("@/vendor/Export2Excel").then(excel => {
            const tHeader = [
              "手机号码",
              "昵称",
              "券号",
              "积分数",
              "状态",
              "创建时间",
              "更新时间",
              "到期时间",
              "备注"
            ];
            const filterVal = [
              "mobile",
              "nick",
              "number",
              "score",
              "statusStr",
              "dateAdd",
              "dateUpdate",
              "dateEnd",
              "remark"
            ];
            const data = this.formatJson(filterVal, curList);
            excel.export_json_to_excel({
              header: tHeader,
              data,
              filename: "积分券",
              autoWidth: true
            });
            this.downloadLoading = false;
          });
        }
      });
    },
    formatJson(filterVal, jsonData) {
      return jsonData.map(v =>
        filterVal.map(j => {
          return v[j];
        })
      );
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
