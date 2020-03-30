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
        <el-select style="width:95%" v-model="priceId" placeholder="请选择" @change="priceIdChange">
          <el-option v-for="item in goodsData.priceExts" :key="item.id" :label="item.propertyChildNames" :value="item.id" />
        </el-select>
      </el-form-item>
    </el-form>
    <el-divider>设置每天价格</el-divider>
    <el-calendar v-model="selectDay">
      <template slot="dateCell" slot-scope="{date, data}">
        <!-- { type, isSelected, day} type 表示该日期的所属月份，可选值有 prev-month，current-month，next-month；isSelected 标明该日期是否被选中；day 是格式化的日期，格式为 yyyy-MM-dd -->
        <div style="text-align:center;margin-top:15px;" @click="openSetting(data)">
          <div>{{ data.day.split('-').slice(1).join('月') }}日</div>
          <div v-if="getPriceData(data.day)" style="display:flex;justify-content:center;margin-top:15px;font-size:12px;">
            <div style="color:red">￥ {{ getPriceData(data.day).price }}</div>
            <div style="margin-left:10px;color:green;">剩 {{ getPriceData(data.day).stores }}</div>
          </div>
          <div v-else style="color:gray;margin-top:15px;font-size:12px;">未设置</div>
        </div>
      </template>
    </el-calendar>
    <div style="text-align:center;">
      <el-button type="primary" @click="goback" size="medium">返回</el-button>
    </div>
    


    <el-dialog title="设置价格" :visible.sync="dialogFormVisible" :close-on-click-modal="false" :close-on-press-escape="false">
      <el-form :rules="rules" ref="addEditPopForm" :model="pushData" label-position="left" label-width="180px">
        <el-form-item label="当日价格" prop="price">
          <el-input v-model="pushData.price" clearable @keyup.enter.native="handleCreateSave" style="width: 30%;"></el-input>
        </el-form-item>
        <el-form-item label="当日库存数" prop="stores">
          <el-input v-model="pushData.stores" clearable @keyup.enter.native="handleCreateSave" style="width: 30%;"></el-input>
        </el-form-item>
        <el-form-item label="">
          <el-checkbox v-model="pushData.batchSetCurMonth">批量设置当月</el-checkbox>
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
import { info, getdayPrices, modifyDayPrice } from "@/api/apiExtShopGoods";

export default {
  data() {
    return {
      
      rules: {
        price: [
          { required: true, message: '不能为空'}
        ],        
        stores: [
          { required: true, message: '不能为空'}
        ],        
      },

      goodsId: undefined, // 商品ID
      goodsData: undefined,  // 接口读取的商品详情数据
      priceId: undefined, // 选择的规格尺寸的记录ID
      selectDay: new Date(), // 日历上选择的日期
      dayPrices: undefined, // 读取的按天价格设置记录
      selectDayStr: undefined, // 点击日历时候赋值

      pushData: {
        price:undefined,
        stores: undefined,
        batchSetCurMonth: false
      },

      dialogTitle : undefined,
      dialogFormVisible:false,

    }
  },
  mounted() {
    if (this.$route.query.id) {
      this.goodsId = this.$route.query.id
      info(this.$route.query.id).then(res => {
        if (res.code == 0) {
          this.goodsData = res.data
          if (res.data.priceExts && res.data.priceExts.length > 0) {
            this.priceId = res.data.priceExts[0].id
          }
          this.getdayPrices()
        }        
      })
    }
  },
  methods: {
    priceIdChange(priceId){
      this.priceId = priceId
      this.getdayPrices()
    },
    getdayPrices(){
      getdayPrices(this.goodsId, this.priceId).then(res => {
        if (res.code == 0) {
          this.dayPrices = res.data
          this.dayPrices.forEach(ele => {
            ele.day = ele.day.split(" ")[0]
          })
        } else {
          this.dayPrices = undefined
        }
      })
    },
    getPriceData(day){
      if (!this.dayPrices) {
        return null
      }
      return this.dayPrices.find(ele => {
        return ele.day == day
      })
    },
    openSetting(data){
      this.selectDayStr = data.day
      const o = this.getPriceData(data.day)
      this.pushData.batchSetCurMonth = false
      if (o) {
        this.pushData.price = o.price
        this.pushData.stores = o.stores
      }
      this.dialogFormVisible = true
      this.$nextTick(() => {
        this.$refs['addEditPopForm'].clearValidate()
      })
    },
    handleCreateSave(){
      this.$refs['addEditPopForm'].validate((valid) => {
        if (valid) {
          modifyDayPrice({
            goodsId: this.goodsId,
            priceId: this.priceId,
            day: this.selectDayStr,
            price: this.pushData.price,
            stores: this.pushData.stores,
            batchSetCurMonth: this.pushData.batchSetCurMonth
          }).then((res) => {
            if (res.code == 0) {
              this.$message({
                message: '操作成功',
                type: 'success'
              });
              this.dialogFormVisible = false
              this.getdayPrices()
            } else {
              this.$message.error(res.msg);
            }
          }).catch(e=>{
            console.error(e);
          })
        }
      })
    },
    goback() {
      this.$router.back();
    }
  }
}
</script>