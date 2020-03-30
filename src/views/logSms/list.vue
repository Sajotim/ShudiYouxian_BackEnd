<template>
  <div class="app-container">

    <div class="filter-container">
      <el-input clearable @keyup.enter.native="fetchData" style="width: 200px;" class="filter-item" placeholder="手机号码"
                v-model="searchData.mobile">
      </el-input>
      <el-select clearable style="width: 200px" class="filter-item" v-model="searchData.isSuccess" placeholder="发送状态">
        <el-option label="全部" value=""></el-option>
        <el-option label="成功" value="true"></el-option>
        <el-option label="未成功" value="false"></el-option>
      </el-select>
      <el-input clearable @keyup.enter.native="fetchData" style="width: 200px;" class="filter-item" placeholder="短信内容"
                v-model="searchData.contentLike">
      </el-input>
      <el-input clearable @keyup.enter.native="fetchData" style="width: 200px;" class="filter-item" placeholder="结果"
                v-model="searchData.resultLike">
      </el-input>
      <el-date-picker type="date" placeholder="发布时间起" v-model="searchData.dateAddBegin" style="width: 200px;" class="filter-item" value-format="yyyy-MM-dd"></el-date-picker>
      <el-date-picker type="date" placeholder="发布时间止" v-model="searchData.dateAddEnd" style="width: 200px;" class="filter-item" value-format="yyyy-MM-dd"></el-date-picker>
      <el-input clearable @keyup.enter.native="fetchData" style="width: 200px;" class="filter-item"
                placeholder="短信通道" v-model="searchData.type"></el-input>
      <el-button class="filter-item" type="primary" size="medium" icon="el-icon-search" @click="fetchData">
        搜索
      </el-button>
      <el-button size="medium" class="filter-item" type="danger" icon="el-icon-delete" @click="truncateLogSms">清空数据</el-button>
    </div>

    <el-table :data="list" v-loading="listLoading" element-loading-text="Loading" fit highlight-current-row
              empty-text="暂无数据">
      <el-table-column prop="type" label="通道" width="140px;"></el-table-column>
      <el-table-column prop="dateAdd" label="发送时间" width="160px"></el-table-column>
      <el-table-column prop="mobile" label="手机号" width="150px;"></el-table-column>
      <el-table-column label="状态" width="80px;" align="center">
        <template slot-scope="scope">
          <el-tag type="success" v-if="scope.row.isSuccess">成功</el-tag>
          <el-tag type="danger" v-else>失败</el-tag>
        </template>
      </el-table-column>
      <el-table-column prop="content" label="短信内容"></el-table-column>
      <el-table-column prop="result" label="返回结果"></el-table-column>      
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
import { fetchDataList, truncateLogSms } from "@/api/logSms";

export default {
  data() {
    return {
      page: 1,
      pageSize: 10,
      totalRow: 0,      

      searchData: { },

      list: null,
      listLoading: true
    };
  },
  activated() {
    this.fetchData();
  },
  methods: {
    handleSizeChange(val) {
      this.pageSize = val;
      this.fetchData();
    },
    handleCurrentChange(val) {
      this.page = val;
      this.fetchData();
    },
    fetchData() {
      this.list = null;
      this.listLoading = true;
      fetchDataList(this.page, this.pageSize, this.searchData).then(
        response => {
          if (response.code === 0) {
            this.list = response.data.result;
            this.totalRow = response.data.totalRow
          }
          this.listLoading = false;
        }
      );
    },
    truncateLogSms(){
      this.$confirm('该操作会删除全部数据而且无法恢复，您确定要操作吗?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        truncateLogSms().then(res => {
          this.$message({
            message: '操作成功',
            type: 'success',
            duration: 1 * 1000
          })
          this.fetchData()
        })
      }).catch(() => {});
    },
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

.el-range-editor.el-input__inner {
  padding: 7px 11px;
}
</style>
