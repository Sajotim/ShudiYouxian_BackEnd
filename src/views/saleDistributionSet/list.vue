<template>
  <div class="app-container">
    <div class="filter-container">
      <el-button size="medium" class="filter-item" style="margin-bottom: 10px;" type="success" icon="el-icon-setting" @click="handleCreate">设置</el-button>
      <el-button size="medium" class="filter-item" style="margin-bottom: 10px;" type="danger" icon="el-icon-delete" @click="delData">删除当前设置</el-button>
    </div>
    <el-table v-loading="listLoading" :data="list" element-loading-text="Loading" :show-header="false" fit highlight-current-row empty-text="暂无数据">
      <el-table-column prop="name" />
      <el-table-column prop="val" />
      <el-table-column prop="remark" />
    </el-table>

    <el-alert
      title="什么是商品返佣比例?"
      type="error"
      effect="dark"
      :closable="false"
      style="margin-top:10px;"
    />
    <div class="profile">拿出销售额的一定比例用来进行佣金分配，比如设置的 50% ，就是说，拿出销售额的50%出来，再根据3级返佣比例计算佣金;</div>
    <div class="profile">比如设置的返佣比例是 10% ， 100元销售额，分配到佣金就是 100 * 50% * 10% = 5元;</div>
    <el-alert
      title="到账类型的区别"
      type="error"
      effect="dark"
      :closable="false"
      style="margin-top:10px;"
    />
    <div class="profile">支付订单返：只要买家完成付款，立即分配佣金，生成佣金记录，佣金实时结算;</div>
    <div class="profile">交易成功返：买家完成付款，实时生成返佣记录，只是佣金状态是“待结算”，需要等到买家确认收货或者商家设置为交易成功后，该笔佣金才进行结算，分销商的收入才能到账;</div>
    <el-alert
      title="分销V 1.0 和 2.0 的区别 :"
      type="error"
      effect="dark"
      :closable="false"
      style="margin-top:10px;"
    />
    <div class="profile"><b>商品返佣比例的区别：</b></div>
    <div class="profile">1.0 版本，只有订单中只包含一种商品，且该商品设置了单独返佣比例，才按照商品的返佣比例计算，否则都按照全局的商品返佣比例计算可分配总佣金；</div>
    <div class="profile">2.0 版本，取消了和订单的关系，只是根据商品的返佣比例计算，完全按照商品设置的返佣比例来进行返佣，也就是说，允许支持同一个订单中不同商品按照不同的返佣比例计算可分配总佣金；</div>
    <div class="profile"><b>返佣类型的区别：</b></div>
    <div class="profile">1.0 版本，只能设置一种返佣类型，全局设置的现金返佣，商品无法单独设置成积分返佣；同理全局设置的积分返佣，商品无法设置成现金返佣；结算都是根据全局类型结算，商品设置返佣类型无效；</div>
    <div class="profile">2.0 版本，可灵活对每种商品、甚至是同一个商品的不同规格尺寸设定不同的返佣类型，比如这种规格返现金，那种规格返积分；</div>
    <div class="profile"><b>返佣记录的区别：</b></div>
    <div class="profile">1.0 版本，一笔订单只生成一条返佣记录，是以订单为单位的；</div>
    <div class="profile">2.0 版本，是以商品为单位进行返佣，同一笔订单，有可能会生成多条返佣记录；</div>

    <el-dialog title="分销设置" :visible.sync="pushData.dialogFormVisible" :close-on-click-modal="false" :close-on-press-escape="false">
      <el-form ref="addEditPopForm" :rules="rules" :model="pushData" label-position="left" label-width="160px">
        <el-form-item label="插件版本" prop="version">
          <el-radio v-model="pushData.version" :label="1">1.0</el-radio>
          <el-radio v-model="pushData.version" :label="2">2.0</el-radio>
        </el-form-item>
        <el-form-item label="返佣开关" prop="isOpen">
          <el-radio v-model="pushData.isOpen" :label="true">开启</el-radio>
          <el-radio v-model="pushData.isOpen" :label="false">关闭</el-radio>
        </el-form-item>
        <el-form-item label="返佣类型" prop="type">
          <el-radio v-model="pushData.type" :label="0">现金返佣</el-radio>
          <el-radio v-model="pushData.type" :label="1">积分返佣</el-radio>
        </el-form-item>        
        <el-form-item label="商品返佣比例" prop="earningsPercent">
          <el-col :span="6">
            <el-input v-model="pushData.earningsPercent" clearable @keyup.enter.native="handleCreateSave" />
          </el-col>          
          <el-col :span="1"> &nbsp;%</el-col>
          <el-col :span="17">&nbsp;&nbsp;&nbsp;商品销售金额的一定比例作为返佣金额</el-col>
        </el-form-item>
        <el-form-item label="到账类型" prop="triggerType">
          <el-radio v-model="pushData.triggerType" :label="0">支付订单返</el-radio>
          <el-radio v-model="pushData.triggerType" :label="1">交易成功返</el-radio>
        </el-form-item>
        <el-form-item label="提现方式" prop="widthdrawType">
          <el-radio v-model="pushData.widthdrawType" :label="0">人工提现</el-radio>
          <el-radio v-model="pushData.widthdrawType" disabled :label="1">微信打款(暂不支持)</el-radio>
        </el-form-item>
        <el-form-item label="一级返佣" prop="p1">
          <el-col :span="6">
            <el-input v-model="pushData.p1" clearable @keyup.enter.native="handleCreateSave" />
          </el-col>          
          <el-col :span="1">&nbsp;%</el-col>
          <el-col :span="17" style="color:red;">&nbsp;&nbsp;&nbsp;此处设置为0，相当于关闭分销功能，全部不返佣</el-col>
        </el-form-item>
        <el-form-item label="二级返佣" prop="p2">
          <el-col :span="6">
            <el-input v-model="pushData.p2" clearable @keyup.enter.native="handleCreateSave" />
          </el-col>          
          <el-col :span="1">&nbsp;%</el-col>
          <el-col :span="17" style="color:red;">&nbsp;&nbsp;&nbsp;此处设置为0，相当于只开启1级分销，2、3级佣金全为0</el-col>
        </el-form-item>
        <el-form-item label="三级返佣" prop="p3">
          <el-col :span="6">
            <el-input v-model="pushData.p3" clearable @keyup.enter.native="handleCreateSave" />
          </el-col>          
          <el-col :span="1">&nbsp;%</el-col>
          <el-col :span="17" style="color:red;">&nbsp;&nbsp;&nbsp;此处设置为0，相当于只开启2级分销，3级佣金全为0</el-col>
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
import { info, saveData, delData } from '@/api/saleDistributionSet'
import { Message } from 'element-ui'

export default {
  data() {
    return {

      rules: {
        version: [
          { required: true, message: '不能为空' }
        ],
        isOpen: [
          { required: true, message: '不能为空' }
        ],
        type: [
          { required: true, message: '不能为空' }
        ],
        earningsPercent: [
          { required: true, message: '不能为空' }
        ],
        triggerType: [
          { required: true, message: '不能为空' }
        ],
        widthdrawType: [
          { required: true, message: '不能为空' }
        ],
        p1: [
          { required: true, message: '不能为空' }
        ],
        p2: [
          { required: true, message: '不能为空' }
        ],
        p3: [
          { required: true, message: '不能为空' }
        ]
      },

      multipleSelection: [],
      listLoading: true,

      list: [
        { prop: 'version', name: '插件版本', val: '1', remark: '-' },
        { prop: 'isOpen', name: '返佣开关', val: '未设置', remark: '-' },
        { prop: 'type', name: '返佣类型', val: '未设置', remark: '-' },
        { prop: 'earningsPercent', name: '商品返佣比例', val: '未设置', remark: '商品销售金额的一定比例作为返佣金额（%）' },
        { prop: 'triggerType', name: '到账类型', val: '未设置', remark: '-' },
        { prop: 'widthdrawType', name: '提现方式', val: '未设置', remark: '-' },
        { prop: 'p1', name: '一级返佣', val: '未设置', remark: '单位（%）' },
        { prop: 'p2', name: '二级返佣', val: '未设置', remark: '单位（%）' },
        { prop: 'p3', name: '三级返佣', val: '未设置', remark: '单位（%）' }
      ],
      pushData: {
        dialogFormVisible: false,

        id: undefined,
        version: 2,
        isOpen: true,
        type: 0,
        earningsPercent: 50,
        triggerType: 0,
        widthdrawType: 0,
        p1: 28,
        p2: 13,
        p3: 9
      }
    }
  },
  created() {
    this.fetchData()
  },
  methods: {
    fetchData() {
      this.listLoading = true
      info().then(response => {
        if (response.code == 0) {
          this.pushData = Object.assign({}, this.pushData, response.data)
          Object.keys(this.pushData).forEach(k => {
            let _e = this.list.find(ele => {
              return ele.prop == k
            })
            if (_e) {
              if (k == 'type') {
                _e.val = this.pushData.typeStr
              } else if (k == 'triggerType') {
                _e.val = this.pushData.triggerTypeStr
              } else if (k == 'widthdrawType') {
                _e.val = this.pushData.widthdrawTypeStr
              } else if (k == 'isOpen') {
                _e.val = this.pushData.isOpen ? '开启' : '关闭'
              } else {
                _e.val = this.pushData[k]
              }              
            }
          })
        }
        this.listLoading = false
      })
    },
    handleCreate() {
      this.pushData.dialogFormVisible = true
      this.$nextTick(() => {
        this.$refs['addEditPopForm'].clearValidate()
      })
    },
    delData() {
      this.$confirm('删除无法恢复, 是否继续?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        delData().then(res => {
          Message({
            message: '删除成功',
            type: 'success',
            duration: 1 * 1000
          })
          this.list.forEach(ele => {
            ele.val = '未设置'
          })
        })
      }).catch(() => {})
    },
    handleCreateSave() {
      this.$refs['addEditPopForm'].validate((valid) => {
        if (valid) {
          saveData(this.pushData).then((res) => {
            this.pushData.dialogFormVisible = false
            if (res.code == 0) {
              Message({
                message: '操作成功',
                type: 'success',
                duration: 1 * 1000
              })
              this.fetchData()
            } else {
              Message({
                message: res.msg,
                type: 'error',
                duration: 3 * 1000
              })
            }
          }).catch(e => {
            console.error(e)
          })
        }
      })
    }
  }
}
</script>
<style scope rel="stylesheet/scss" lang="scss">
.filter-container {
  padding-bottom: 10px;
  .filter-item {
    display: inline-block;
    vertical-align: middle;
    margin-bottom: 10px;
  }
}
.profile {
  line-height: 35px;
  margin-left: 32px;
}
</style>
