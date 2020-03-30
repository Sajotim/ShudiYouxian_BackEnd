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
    <el-divider>优惠券 / 卡密自动发货设置</el-divider>
    <div class="filter-container">
      <el-button type="primary" class="filter-item" @click="goback" size="small" icon="el-icon-back">返回</el-button>
      <el-button class="filter-item" size="small" style="margin-left: 10px;" @click="handleCreate" type="success" icon="el-icon-plus">批量添加卡密</el-button>
      <el-upload
        class="upload-demo"
        :action="uploadUrl"
        :headers="fileHeaders"
        name="upfile"
        multiple
        :show-file-list="false"
        :on-success="handleSuccess"
        :file-list="fileLists">
        <el-button icon="el-icon-upload" size="small" type="success">批量上传图片</el-button>
      </el-upload>
    </div>
    <el-table :data="goodsLimitationList" v-loading="listLoading" element-loading-text="Loading" fit highlight-current-row empty-text="暂无数据">
      <el-table-column label="优惠券/卡密">
        <template slot-scope="scope">
          <div v-if="scope.row.type == 0">
            兑换码: &nbsp;&nbsp;&nbsp;
            <el-tag v-if="scope.row.orderId" type="info">{{ scope.row.coupon }}</el-tag>
            <el-tag v-else type="success">{{ scope.row.coupon }}</el-tag>
            <el-tag v-if="scope.row.orderId" type="danger">已发货至订单ID: {{ scope.row.orderId }}</el-tag>
          </div>
          <div v-else-if="scope.row.type == 1">
            <el-image 
              style="width: 150px"
              :src="scope.row.coupon" 
              :preview-src-list="previewSrcList">
            </el-image>
            <div v-if="scope.row.orderId">
              <el-tag type="danger">已发货至订单ID: {{ scope.row.orderId }}</el-tag>
            </div>
          </div>
        </template>
      </el-table-column>
      <el-table-column label="操作" width="100">
        <template slot-scope="scope">
          <el-button type="text" @click="delData(scope.row.id)" style="color:red">删除</el-button>
        </template>
      </el-table-column>
    </el-table>
    <div style="text-align:center;margin-top:20px;">
      
    </div>

    <el-dialog title="批量添加优惠券/卡密" :visible.sync="dialogFormVisible" :close-on-click-modal="false" :close-on-press-escape="false">
      <el-form :rules="rules" ref="addEditPopForm" :model="pushData" label-position="left">
        <el-form-item>
          <el-input v-model="pushData.coupon" type="textarea" clearable rows="12"></el-input>
          <div style="color:orange;">一行代表一份优惠券/卡密数据，多张优惠券/卡密请输入多行数据</div>
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
import {getToken} from '@/utils/auth'
import { info, fetchGoodsCouponList, saveGoodsCoupon, delGoodsCoupon } from "@/api/apiExtShopGoods";

export default {
  data() {
    return {
      uploadUrl:process.env.VUE_APP_BASE_API + '/fileUpload',
      fileHeaders: {'X-Token': getToken()},
      fileLists: [],

      rules: {
        type: [
          { required: true, message: '不能为空'}
        ],        
        coupon: [
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
        type:0,
        coupon: undefined
      },
      pushDataTmp: {},

      dialogTitle : undefined,
      dialogFormVisible:false,

      previewSrcList: []
    }
  },
  created() {
    this.pushDataTmp = Object.assign({}, this.pushData)
  },
  mounted() {
    if (this.$route.query.id) {
      this.pushData.goodsId = this.$route.query.id
      this.pushDataTmp.goodsId = this.$route.query.id
      this.fetchGoodsInfo()
    }
  },
  methods: {
    fetchGoodsInfo(){
      info(this.pushData.goodsId).then(res => {
        if (res.code == 0) {
          this.goodsData = res.data
          if (res.data.priceExts && res.data.priceExts.length > 0) {
            this.pushData.priceId = res.data.priceExts[0].id
            this.pushDataTmp.priceId = res.data.priceExts[0].id
          }
          this.fetchGoodsLimitationList()
        }        
      })
    },
    priceIdChange(priceId){
      this.pushData.priceId = priceId
      this.pushDataTmp.priceId = priceId
      this.fetchGoodsLimitationList()
    },
    fetchGoodsLimitationList(){
      fetchGoodsCouponList(this.pushData.goodsId, this.pushData.priceId).then(res => {
        this.listLoading = false
        if (res.code == 0) {
          this.goodsLimitationList = res.data
          this.previewSrcList = []
          res.data.forEach(ele => {
            if (ele.type == 1) {
              this.previewSrcList.push(ele.coupon)
            }
          })
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
          this.pushData.type = 0
          saveGoodsCoupon(this.pushData).then((res) => {
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
        delGoodsCoupon(ids).then(res => {
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
    },
    handleSuccess(response, file) {
      if (response.code == 0) {
        this.pushData.type = 1
        this.pushData.coupon = response.data.url
        saveGoodsCoupon(this.pushData).then((res) => {
          if (res.code == 0) {
            this.fetchGoodsLimitationList()
          } else {
            this.$message.error(res.msg);
          }
        }).catch(e=>{
          console.error(e);
        })
      }
    },
  }
}
</script>
<style lang="scss">
.upload-demo {
  display: inline-block;
}
</style>