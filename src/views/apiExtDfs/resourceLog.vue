<template>
  <div class="app-container">

    <div class="filter-container">
      <el-select clearable style="width: 200px" class="filter-item" v-model="searchData.type" placeholder="使用方式">
        <el-option label="全部" value=""></el-option>
        <el-option label="在线购买" value="0"></el-option>
        <el-option label="系统赠送" value="1"></el-option>
        <el-option label="图片存储" value="2"></el-option>
        <el-option label="视频点播" value="3"></el-option>
      </el-select>
      <el-date-picker type="date" placeholder="使用时间起" v-model="searchData.dateAddBegin" style="width: 200px;" class="filter-item" value-format="yyyy-MM-dd"></el-date-picker>
      <el-date-picker type="date" placeholder="使用时间止" v-model="searchData.dateAddEnd" style="width: 200px;" class="filter-item" value-format="yyyy-MM-dd"></el-date-picker>
      <el-button class="filter-item" type="primary" size="medium" icon="el-icon-search" @click="fetchData">
        搜索
      </el-button>
    </div>

    <el-table :data="list" v-loading="listLoading" element-loading-text="Loading" fit highlight-current-row
              empty-text="暂无数据">
      <el-table-column prop="typeStr" label="类型"></el-table-column>
      <el-table-column label="操作容量">
        <template slot-scope="scope">
          <el-tag type="success" v-if="scope.row.type == 0 || scope.row.type == 1">+ {{ scope.row.capacityStr }}</el-tag>
          <el-tag type="danger" v-else>- {{ scope.row.capacityStr }}</el-tag>
          <el-popover
            v-if="scope.row.remark"
            placement="top-start"
            title="备注："
            width="200"
            trigger="hover"
            :content="scope.row.remark">
            <i slot="reference" class="el-icon-info"></i>
          </el-popover>
        </template>
      </el-table-column>
      <el-table-column prop="capacityLeftStr" label="剩余容量"></el-table-column>
      <el-table-column prop="dateAdd" label="操作时间" width="160px"></el-table-column>
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
import { resourceLogs } from "@/api/apiExtDfs";

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
      resourceLogs(this.page, this.pageSize, this.searchData).then(
        response => {
          if (response.code === 0) {
            this.list = response.data.result;
            this.totalRow = response.data.totalRow
          }
          this.listLoading = false;
        }
      );
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
