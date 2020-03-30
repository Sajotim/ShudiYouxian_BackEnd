<template>
  <div class="app-container">    
    <div class="filter-container">
      <el-input clearable style="width: 200px;" class="filter-item" placeholder="团号" v-model="searchData.id" @keyup.enter.native="fetchData"/>
      <el-input clearable style="width: 200px;" class="filter-item" placeholder="拼团ID" v-model="searchData.pingtuanId" @keyup.enter.native="fetchData"/>
      <el-input clearable style="width: 200px;" class="filter-item" placeholder="商品ID" v-model="searchData.goodsId" @keyup.enter.native="fetchData"/>
      <el-input clearable style="width: 200px;" class="filter-item" placeholder="手机号码" v-model="searchData.mobileUser" @keyup.enter.native="fetchData"/>
      <el-input clearable style="width: 200px;" class="filter-item" placeholder="用户昵称" v-model="searchData.nick" @keyup.enter.native="fetchData"/>
      <el-select clearable style="width: 200px" class="filter-item" v-model="searchData.status" placeholder="状态">
        <el-option label="进行中" value="0"></el-option>
        <el-option label="无效" value="1"></el-option>
        <el-option label="完成" value="2"></el-option>
      </el-select>
      <el-date-picker class="filter-item" type="date" placeholder="开团时间起" v-model="searchData.dateAddBegin" style="width: 200px;"></el-date-picker>
      <el-date-picker class="filter-item" type="date" placeholder="开团时间止" v-model="searchData.dateAddEnd" style="width: 200px;"></el-date-picker>
      <el-date-picker class="filter-item" type="date" placeholder="更新时间起" v-model="searchData.dateUpdateBegin" style="width: 200px;"></el-date-picker>
      <el-date-picker class="filter-item" type="date" placeholder="更新时间止" v-model="searchData.dateUpdateEnd" style="width: 200px;"></el-date-picker>
      <el-date-picker class="filter-item" type="date" placeholder="到期时间起" v-model="searchData.dateEndBegin" style="width: 200px;"></el-date-picker>
      <el-date-picker class="filter-item" type="date" placeholder="到期时间止" v-model="searchData.dateEndEnd" style="width: 200px;"></el-date-picker>
      <el-button class="filter-item" type="primary" icon="el-icon-search" @click="fetchData">搜索</el-button>
    </div>
    
    <el-table :data="list" v-loading="listLoading" element-loading-text="Loading" fit highlight-current-row empty-text="暂无数据" @selection-change="handleSelectionChange">
      <el-table-column type="selection" align="center" width="55" row-key="id"></el-table-column>
      <el-table-column label="拼团ID/团号">
        <template slot-scope="scope">
         {{scope.row.pingtuanId}}<br>{{scope.row.id}}
        </template>
      </el-table-column>
      <el-table-column prop="goodsId" label="商品ID"></el-table-column>
      <el-table-column label="手机/昵称">
        <template slot-scope="scope">
         {{scope.row.mobile ? scope.row.mobile : '-'}}<br>{{scope.row.nick ? scope.row.nick : '-'}}
        </template>
      </el-table-column>
      <el-table-column label="人数/状态" align="center">
        <template slot-scope="scope">
         {{scope.row.helpNumber}}<br>
         <el-tag v-if="scope.row.status == 0" type="info">进行中</el-tag>
         <el-tag v-if="scope.row.status == 1" type="danger">无效</el-tag>
         <el-tag v-if="scope.row.status == 2" type="success">完成</el-tag>
        </template>
      </el-table-column>
      <el-table-column label="开团/截止时间">
        <template slot-scope="scope">
         {{scope.row.dateAdd}}<br>{{scope.row.dateEnd ? scope.row.dateEnd : '-'}}
        </template>
      </el-table-column>
      <el-table-column label="操作">
        <template slot-scope="scope">
          <el-button v-if="scope.row.status == 0" type="text" @click="saveStatus(scope.row.id, 2)" style="color:green">完成</el-button>
          <el-button v-if="scope.row.status == 0" type="text" @click="saveStatus(scope.row.id, 1)" style="color:red">无效</el-button>          
          <el-button v-if="scope.row.status != 0" type="text" @click="deletePingtuanOpen(scope.row.id)" style="color:red">删除</el-button>          
        </template>
      </el-table-column>
    </el-table>
    <el-button style='margin-top:20px' type="danger" size="mini" @click="delDataBatch()">批量删除</el-button>
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
import { fetchDataList, saveStatus, deletePingtuanOpen } from '@/api/pingtuanOpener'
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

      rules: {
        goodsId: [
          { required: true, message: '不能为空'},
          { type:'integer', message: '必须为数字'}
        ],
        number: [
          { required: true, message: '不能为空'},
          { type:'integer', message: '必须为数字'}
        ],
        originalPrice: [
          { required: true, message: '不能为空'},
          { type:'number', message: '必须为数字'}
        ],
        minPrice: [
          { required: true, message: '不能为空'},
          { type:'number', message: '必须为数字'}
        ],
        helpPriceMin: [
          { required: true, message: '不能为空'},
          { type:'number', message: '必须为数字'}
        ],
        helpPriceMax: [
          { required: true, message: '不能为空'},
          { type:'number', message: '必须为数字'}
        ],
        status: [
          { required: true, message: '不能为空'}
        ],
        dateAddStr: [
          { required: true, message: '不能为空'}
        ],
        dateEndStr: [
          { required: true, message: '不能为空'}
        ],
      },

      searchData:{
        id:undefined,
        pingtuanId:undefined,
        goodsId:undefined,
        mobileUser:undefined,
        nick:undefined,
        status:undefined,
        dateAddBegin:undefined,
        dateAddEnd:undefined,
        dateUpdateBegin:undefined,
        dateUpdateEnd:undefined,
        dateEndBegin:undefined,
        dateEndEnd:undefined,
      },

      pushData: {
        dialogTitle : undefined,
        dialogFormVisible:false,

        id:undefined,
        goodsId:undefined,
        number:undefined,
        originalPrice:undefined,
        minPrice:undefined,
        helpPriceMin:undefined,
        helpPriceMax:undefined,
        status:undefined,
        dateAddStr:undefined,
        dateEndStr:undefined
      },

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
            let userMap = response.data.userMap[ele.uid]
            if (userMap) {
              ele.mobile = userMap.mobile
              ele.nick = userMap.nick
            }
          })
        }
        this.listLoading = false
      })
    },
    saveStatus(id, status) {
      this.$confirm('确认本次操作?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        saveStatus(id, status).then(res => {
          Message({
            message: '操作成功',
            type: 'success',
            duration: 1 * 1000
          })
          this.fetchData()
        })
      }).catch(() => {});
    },
    deletePingtuanOpen(id) {
      this.$confirm('确认要删除吗？删除后无法恢复！', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        deletePingtuanOpen(id).then(res => {
          Message({
            message: '删除成功',
            type: 'success',
            duration: 1 * 1000
          })
          this.fetchData()
        })
      }).catch(() => {});
    },
    delDataBatch(){
      if (!this.multipleSelection.length) {
        this.$message.error('请先选择需要删除的数据')
        return
      }
      this.$confirm('删除无法恢复, 是否继续?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        this.delDataBatchDone();
      }).catch(() => {});
    },
    async delDataBatchDone(){ // 批量删除商品
      let _index = 1;
      let loadingInstance = this.$loading({
        text: '正在删除 '+ _index +'/'+ this.multipleSelection.length +'条数据...'
      });
      for (let index = 0; index < this.multipleSelection.length; index++) {
        const obj = this.multipleSelection[index];
        await deletePingtuanOpen(obj.id);
        _index++;
        loadingInstance.close();
        loadingInstance = this.$loading({
          text: '正在删除 '+ _index +'/'+ this.multipleSelection.length +'条数据...'
        });
      }
      this.$nextTick(() => {
        loadingInstance.close();
      });
      this.fetchData(true);
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
