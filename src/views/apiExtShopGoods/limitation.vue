<template>
  <div v-if="goodsData" class="app-container">
    <el-alert
      :title="goodsData.info.name"
      type="success"
      :closable="false"
      center
      effect="dark">
    </el-alert>
    <el-form v-if="goodsData && goodsData.priceExts && goodsData.priceExts.length > 0" style="margin-top:10px;" label-width="140px">
      <el-form-item label="请选择规格尺寸">
        <el-select style="width:95%" v-model="pushData.priceId" placeholder="请选择" @change="priceIdChange">
          <el-option v-for="item in goodsData.priceExts" :key="item.id" :label="item.propertyChildNames" :value="item.id" />
        </el-select>
      </el-form-item>
    </el-form>
    <el-divider>会员限购设置</el-divider>
    <div class="filter-container">
      <el-button type="primary" class="filter-item" @click="goback" size="medium" icon="el-icon-back">返回</el-button>
      <el-button class="filter-item" size="medium" style="margin-left: 10px;" @click="handleCreate" type="success" icon="el-icon-plus">添加设置</el-button>
    </div>
    <el-table :data="goodsLimitationList" v-loading="listLoading" element-loading-text="Loading" fit highlight-current-row empty-text="暂无数据">
      <el-table-column label="会员等级" prop="userLevelName" />
      <el-table-column label="条件">
        <template slot-scope="scope">
          {{ scope.row.duration }} {{ scope.row.unitStr }}
        </template>
      </el-table-column>
      <el-table-column label="限购数量" prop="buyNumbers" />
      <el-table-column label="操作" width="150">
        <template slot-scope="scope">
          <el-button type="text" @click="handleCreate(scope.row)">编辑</el-button>
          <el-button type="text" @click="delData(scope.row.id)" style="color:red">删除</el-button>
        </template>
      </el-table-column>
    </el-table>
    <div style="text-align:center;margin-top:20px;">
      
    </div>

    <el-dialog title="会员限购设置" :visible.sync="dialogFormVisible" :close-on-click-modal="false" :close-on-press-escape="false">
      <el-form :rules="rules" ref="addEditPopForm" :model="pushData" label-position="left" label-width="180px">
        <el-form-item label="会员等级">
          <el-select v-model="pushData.userLevelId" placeholder="请选择">
            <el-option label="无会员用户" :value="0" />
            <el-option v-for="item in userLevels" :key="item.id" :label="item.name" :value="item.id" />
          </el-select>
        </el-form-item>
        <el-form-item label="限购条件">
          <el-col :span="4">
            <el-form-item label="" prop="duration" >
              <el-input v-model="pushData.duration"></el-input>
            </el-form-item>
          </el-col>
          <el-col :span="1"> &nbsp;</el-col>
          <el-col :span="4">
            <el-select v-model="pushData.unit">
              <el-option label="自然日" :value="0"></el-option>
              <el-option label="自然月" :value="1"></el-option>
              <el-option label="自然年" :value="2"></el-option>
            </el-select>
          </el-col>
        </el-form-item>
        <el-form-item label="限购数量" prop="buyNumbers">
          <el-col :span="4">
            <el-input v-model="pushData.buyNumbers"></el-input>
          </el-col>
          <el-col :span="20" style="color:orange;">
            &nbsp;&nbsp;&nbsp;在上述限定条件内只能购买的数量
          </el-col>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="dialogFormVisible = false" size="small">取消</el-button>
        <el-button type="primary" @click="handleCreateSave" size="small">确定</el-button>
      </div>
    </el-dialog>

  </div>
</template>

<script>
import { info, fetchGoodsLimitationList, saveGoodsLimitation, delGoodsLimitationData } from "@/api/apiExtShopGoods";
import { fetchAllUserLevels } from '@/api/apiExtUserLevel'

export default {
  data() {
    return {
      
      rules: {
        userLevelId: [
          { required: true, message: '不能为空'}
        ],        
        duration: [
          { required: true, message: '不能为空'}
        ],        
        unit: [
          { required: true, message: '不能为空'}
        ],        
        buyNumbers: [
          { required: true, message: '不能为空'}
        ],        
      },

      listLoading: true,
      goodsLimitationList: [],
      goodsData: undefined,  // 接口读取的商品详情数据
      
      pushData: {
        id: undefined,
        goodsId: undefined, // 商品ID
        priceId: undefined, // 选择的规格尺寸的记录ID
        userLevelId:0,
        duration: 1,
        unit: 0,
        buyNumbers: 1
      },
      pushDataTmp: {},

      dialogTitle : undefined,
      dialogFormVisible:false,

    }
  },
  created() {
    this.pushDataTmp = Object.assign({}, this.pushData)
  },
  mounted() {
    if (this.$route.query.id) {
      this.pushData.goodsId = this.$route.query.id
      this.pushDataTmp.goodsId = this.$route.query.id
      info(this.$route.query.id).then(res => {
        if (res.code == 0) {
          this.goodsData = res.data
          if (res.data.priceExts && res.data.priceExts.length > 0) {
            this.pushData.priceId = res.data.priceExts[0].id
            this.pushDataTmp.priceId = res.data.priceExts[0].id
          }
          this.fetchGoodsLimitationList()
        }        
      })
    }
    fetchAllUserLevels(1, 10000, {status: 0}).then(res => {
      if (res.code == 0) {
        this.userLevels = res.data.result
      }
    })
  },
  methods: {
    priceIdChange(priceId){
      this.pushData.priceId = priceId
      this.pushDataTmp.priceId = priceId
      this.fetchGoodsLimitationList()
    },
    fetchGoodsLimitationList(){
      fetchGoodsLimitationList(this.pushData.goodsId, this.pushData.priceId).then(res => {
        this.listLoading = false
        if (res.code == 0) {
          this.goodsLimitationList = res.data
        } else {
          this.goodsLimitationList = undefined
        }
      })
    },
    handleCreate(data){      
      this.dialogFormVisible = true
      if (data) {
        this.pushData = Object.assign({}, this.pushDataTmp, data)
      } else {
        this.pushData = Object.assign({}, this.pushDataTmp)
      }
      this.$nextTick(() => {
        this.$refs['addEditPopForm'].clearValidate()
      })
    },
    handleCreateSave(){
      this.$refs['addEditPopForm'].validate((valid) => {
        if (valid) {
          saveGoodsLimitation(this.pushData).then((res) => {
            if (res.code == 0) {
              this.$message({
                message: '操作成功',
                type: 'success'
              });
              this.dialogFormVisible = false
              this.fetchGoodsLimitationList()
            } else {
              this.$message.error(res.msg);
            }
          }).catch(e=>{
            console.error(e);
          })
        }
      })
    },
    delData(ids){
      this.$confirm('删除无法恢复, 是否继续?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        delGoodsLimitationData(ids).then(res => {
          this.$message({
            message: '删除成功',
            type: 'success'
          })
          this.fetchGoodsLimitationList()
        })
      }).catch(() => {});
    },
    goback() {
      this.$router.back();
    }
  }
}
</script>