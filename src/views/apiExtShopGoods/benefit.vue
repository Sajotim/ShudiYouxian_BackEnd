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
    <el-divider>商品分润设置</el-divider>
    <div class="filter-container">
      <el-button type="primary" class="filter-item" @click="goback" size="small" icon="el-icon-back">返回</el-button>
      <el-button class="filter-item" size="small" style="margin-left: 10px;" @click="handleCreate" type="success" icon="el-icon-plus">添加设置</el-button>
      <el-button class="filter-item" size="small" style="margin-left: 10px;" v-if="goodsData.info.vetStatus == 0" @click="vetGoods(1)" type="success" icon="el-icon-coordinate">审核通过</el-button>
      <el-button class="filter-item" size="small" style="margin-left: 10px;" v-if="goodsData.info.vetStatus == 0" @click="vetGoods(2)" type="danger" icon="el-icon-coordinate">审核不通过</el-button>
    </div>
    <el-table :data="goodsLimitationList" v-loading="listLoading" element-loading-text="Loading" fit highlight-current-row empty-text="暂无数据">
      <el-table-column label="项目名称">
        <template slot-scope="scope">
          <el-tag v-if="scope.row.type == 0" type="info">进货价格</el-tag>
          <el-tag v-if="scope.row.type == 1" type="success">服务费</el-tag>
          <el-tag v-if="scope.row.type == 2">业务员提点</el-tag>
          <el-tag v-if="scope.row.type == 3" type="danger">{{ scope.row.name }}</el-tag>
        </template>
      </el-table-column>
      <el-table-column label="费用">
        <template slot-scope="scope">
          <font v-if="scope.row.type == 0">{{ scope.row.number }}元</font>
          <font v-else>{{ scope.row.number }}%</font>
        </template>
      </el-table-column>
      <el-table-column label="操作" width="150">
        <template slot-scope="scope">
          <el-button type="text" @click="handleCreate(scope.row)">编辑</el-button>
          <el-button type="text" @click="delData(scope.row.id)" style="color:red">删除</el-button>
        </template>
      </el-table-column>
    </el-table>
    <div style="text-align:center;margin-top:20px;">
      
    </div>

    <el-dialog title="商品分润设置" :visible.sync="dialogFormVisible" :close-on-click-modal="false" :close-on-press-escape="false">
      <el-form :rules="rules" ref="addEditPopForm" :model="pushData" label-position="left" label-width="180px">
        <el-form-item label="项目类型">
          <el-select v-model="pushData.type" placeholder="请选择">
            <el-option label="进货价格" :value="0" />
            <el-option label="平台服务费" :value="1" />
            <el-option label="业务员提点" :value="2" />
            <el-option label="其他分润" :value="3" />
          </el-select>
        </el-form-item>
        <el-form-item v-if="pushData.type == 3" label="分润名称" prop="name">
          <el-col :span="4">
            <el-input v-model="pushData.name"></el-input>
          </el-col>
          <el-col :span="20" style="color:orange;">
            &nbsp;&nbsp;&nbsp;比如: 供应商
          </el-col>
        </el-form-item>
        <el-form-item v-if="pushData.type == 3" label="收益用户编号" prop="uid">
          <el-col :span="4">
            <el-input v-model="pushData.uid"></el-input>
          </el-col>
          <el-col :span="20" style="color:orange;">
            &nbsp;&nbsp;&nbsp;该分润将发放给哪个用户
          </el-col>
        </el-form-item>
        <el-form-item v-if="pushData.type == 0" label="进货价格" prop="number">
          <el-col :span="6">
            <el-input v-model="pushData.number"><template slot="append">元</template></el-input>
          </el-col>
          <el-col :span="18" style="color:orange;">
            &nbsp;&nbsp;&nbsp;
          </el-col>
        </el-form-item>
        <el-form-item v-if="pushData.type == 1" label="服务费比例" prop="number">
          <el-col :span="6">
            <el-input v-model="pushData.number"><template slot="append">%</template></el-input>
          </el-col>
          <el-col :span="18" style="color:orange;">
            &nbsp;&nbsp;&nbsp;
          </el-col>
        </el-form-item>
        <el-form-item v-if="pushData.type == 2" label="提点比例" prop="number">
          <el-col :span="6">
            <el-input v-model="pushData.number"><template slot="append">%</template></el-input>
          </el-col>
          <el-col :span="18" style="color:orange;">
            &nbsp;&nbsp;&nbsp;
          </el-col>
        </el-form-item>
        <el-form-item v-if="pushData.type == 3" label="分润比例" prop="number">
          <el-col :span="6">
            <el-input v-model="pushData.number"><template slot="append">%</template></el-input>
          </el-col>
          <el-col :span="18" style="color:orange;">
            &nbsp;&nbsp;&nbsp;
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
import { info, vetGoods, fetchGoodsBenefitList, saveGoodsBenefit, delGoodsBenefit } from "@/api/apiExtShopGoods";

export default {
  data() {
    return {
      
      rules: {
        type: [
          { required: true, message: '不能为空'}
        ],        
        number: [
          { required: true, message: '不能为空'}
        ],        
        name: [
          { required: true, message: '不能为空'}
        ],        
        uid: [
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
        number:0,
        name: '供应商',
        uid: undefined
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
      fetchGoodsBenefitList(this.pushData.goodsId, this.pushData.priceId).then(res => {
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
          saveGoodsBenefit(this.pushData).then((res) => {
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
        delGoodsBenefit(ids).then(res => {
          this.$message({
            message: '删除成功',
            type: 'success'
          })
          this.fetchGoodsLimitationList()
        })
      }).catch(() => {});
    },
    vetGoods(vetStatus){
      this.$confirm('确定要执行本次审核操作吗？', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        vetGoods(this.goodsData.info.id, vetStatus).then(res => {
          this.$message({
            message: '操作成功',
            type: 'success'
          })
          this.fetchGoodsInfo()
        })
      }).catch(() => {});
    },
    goback() {
      this.$router.back();
    }
  }
}
</script>