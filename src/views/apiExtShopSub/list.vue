<template>
  <div class="app-container">

    <div class="filter-container">
      <el-input clearable @keyup.enter.native="fetchData" style="width: 200px;" class="filter-item" placeholder="店铺编号"
                v-model="searchData.id">
      </el-input>
      <el-select clearable style="width: 200px" class="filter-item" v-model="searchData.status" placeholder="状态">
        <el-option label="禁用" value="-1"></el-option>
        <el-option label="待审核" value="0"></el-option>
        <el-option label="正常" value="1"></el-option>
        <el-option label="审核不通过" value="2"></el-option>
      </el-select>
      <el-input clearable @keyup.enter.native="fetchData" style="width: 200px;" class="filter-item" placeholder="店铺类型"
                v-model="searchData.type">
      </el-input>
      <el-input clearable @keyup.enter.native="fetchData" style="width: 200px;" class="filter-item" placeholder="店铺名称"
                v-model="searchData.nameLike">
      </el-input>
      <el-input clearable @keyup.enter.native="fetchData" style="width: 200px;" class="filter-item" placeholder="地址"
                v-model="searchData.addressLike">
      </el-input>
      <br/>
      <el-date-picker
        v-model="dateAdd"
        type="datetimerange"
        @change="handleDateAdd"
        align="center"
        start-placeholder="添加时间起"
        end-placeholder="添加时间止"
        :default-time="['00:00:00', '23:59:59']"
        :picker-options="pickerOptions">
      </el-date-picker>

      <el-date-picker
        v-model="dateUpdate"
        type="datetimerange"
        @change="handleDateUpdate"
        align="center"
        start-placeholder="更新时间起"
        end-placeholder="更新时间止"
        :default-time="['00:00:00', '23:59:59']"
        :picker-options="pickerOptions">
      </el-date-picker>
      <el-button size="medium" class="filter-item" type="primary" icon="el-icon-search" @click="fetchData">搜索</el-button>
      <el-button size="medium" class="filter-item" style="margin-left: 10px;" @click="handleCreate" type="success" icon="el-icon-plus">添加
      </el-button>
    </div>

    <el-table :data="list" v-loading="listLoading" element-loading-text="Loading" fit highlight-current-row
              empty-text="暂无数据" @selection-change="handleSelectionChange">
      <el-table-column label="编号/类型" width="100%">
        <template slot-scope="scope">
          {{ scope.row.id }}<br>
          {{ scope.row.type }}
        </template>
      </el-table-column>
      <el-table-column label="地址">
        <template slot-scope="scope">
          {{scope.row.provinceStr}}{{scope.row.cityStr}}{{scope.row.areaStr}}<br>
          {{ scope.row.address }}
        </template>
      </el-table-column>
      <el-table-column label="名称">
        <template slot-scope="scope">
          {{ scope.row.name }}<br>
          {{ scope.row.linkPhone }}
        </template>
      </el-table-column>
      <el-table-column width="100%" label="营销数据">
        <template slot-scope="scope">
          成交量:{{ scope.row.numberOrder }}<br>
          好评数:{{ scope.row.numberGoodReputation }}
        </template>
      </el-table-column>
      <el-table-column label="状态" width="100%">
        <template slot-scope="scope">
          <el-tag type="danger" v-if="scope.row.status == -1">禁用</el-tag>
          <el-tag type="info" v-if="scope.row.status == 0">待审核</el-tag>
          <el-tag type="success" v-if="scope.row.status == 1">正常</el-tag>
          <el-tag type="danger" v-if="scope.row.status == 2">审核未通过</el-tag>
        </template>
      </el-table-column>
      <el-table-column width="160" label="添加/修改时间">
        <template slot-scope="scope">
          {{ scope.row.dateAdd }}
          <br>
          {{ scope.row.dateUpdate ? scope.row.dateUpdate : '-' }}
        </template>
      </el-table-column>
      <el-table-column label="操作" width="100%">
        <template slot-scope="scope">
          <el-button type="text" @click="handleUpdate(scope.row.id)">编辑</el-button>
          <el-button type="text" @click="delData(scope.row.id)" style="color:red">删除</el-button>
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
  import {delData, fetchShopPageList, info} from '@/api/apiExtShopSub'
  import {Message} from 'element-ui'
  import {mapGetters} from 'vuex'

  export default {
    computed: {
      ...mapGetters([
        'centerUserBase'
      ])
    },
    data() {
      return {
        page:1,
        pageSize:20,
        totalRow:0,

        rules: {
          goodsId: [
            {required: true, message: '不能为空'},
            {type: 'integer', message: '必须为数字'}
          ],
          number: [
            {required: true, message: '不能为空'},
            {type: 'integer', message: '必须为数字'}
          ],
          originalPrice: [
            {required: true, message: '不能为空'},
            {type: 'number', message: '必须为数字'}
          ],
          minPrice: [
            {required: true, message: '不能为空'},
            {type: 'number', message: '必须为数字'}
          ],
          helpPriceMin: [
            {required: true, message: '不能为空'},
            {type: 'number', message: '必须为数字'}
          ],
          helpPriceMax: [
            {required: true, message: '不能为空'},
            {type: 'number', message: '必须为数字'}
          ],
          status: [
            {required: true, message: '不能为空'}
          ],
          dateAddStr: [
            {required: true, message: '不能为空'}
          ],
          dateEndStr: [
            {required: true, message: '不能为空'}
          ],
        },
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
        dateUpdate: '',

        searchData: {
          id: undefined,
          type: undefined,
          status: undefined,
          nameLike: undefined,
          addressLike: undefined,
          dateAddBegin: undefined,
          dateAddEnd: undefined,
          dateUpdateBegin: undefined,
          dateUpdateEnd: undefined,
        },

        pushData: {
          dialogTitle: undefined,
          dialogFormVisible: false,

          id: undefined,
          type: undefined,
          status: undefined,
          nameLike: undefined,
          addressLike: undefined,
          dateAddStr: undefined,
          dateEndStr: undefined
        },

        multipleSelection: [],
        list: null,
        listLoading: true,
        statisticsData: {}
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
        this.pageSize = val;
        this.fetchData();
      },
      handleCurrentChange(val) {
        this.page = val
        this.fetchData()
      },
      handleDateAdd(val) {
        this.searchData.dateAddBegin = val?val[0]:undefined;
        this.searchData.dateAddEnd = val?val[1]:undefined;
      },
      handleDateUpdate(val) {
        this.searchData.dateUpdateBegin = val?val[0]:undefined;
        this.searchData.dateUpdateEnd = val?val[1]:undefined;
      },
      handleSelectionChange(val) {
        this.multipleSelection = val
      },
      fetchData() {
        this.list = null;
        this.listLoading = true;
        fetchShopPageList(this.page, this.pageSize, this.searchData).then(response => {
          if (response.code === 0) {
            this.list = response.data.result;
            this.totalRow = response.data.totalRow
          } else {
            this.totalRow = 0
          }
          this.listLoading = false
        })
      },
      handleCreate() {
        this.$router.push({path: '/user/apiExtShopSub/add'});
      },
      handleUpdate(id) {
        this.$router.push({path: '/user/apiExtShopSub/add', query: {id: id}});
      },
      delData(id) {
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
        }).catch(() => {
        });
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


</style>
