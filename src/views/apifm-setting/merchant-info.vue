<template>
  <div class="app-container">
    <el-card class="box-card">
      <div slot="header" class="clearfix">
        <span>基本信息</span>
      </div>
      <div class="text item">
        <table class="baseInfoTable">
          <tr>
            <th width="100px" align="left">商户ID</th>
            <td>{{centerUserBase.id}}</td>
          </tr>
          <tr>
            <th width="100px" align="left">商户号</th>
            <td>{{centerUserBase.merchantNo}}</td>
          </tr>
          <tr>
            <th width="100px" align="left">商户秘钥</th>
            <td>
              {{centerUserBase.merchantKey}} &nbsp;&nbsp;&nbsp;&nbsp;
              <el-button type="text" @click="resetKey">「 重置 」</el-button>
            </td>
          </tr>
        </table>
      </div>
    </el-card>
  </div>
</template>

<script>
import { mapGetters } from 'vuex'
import { resetKey } from '@/api/centerUser'

export default {
  computed: {
    ...mapGetters([
      'centerUserBase'
    ])
  },
  data() {
    return {
      
    };
  },
  methods: {
    resetKey(){
      this.$confirm('确定要重置商户秘钥吗?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        resetKey().then(res => {
          this.$message({
            type: 'success',
            message: '重置成功',
            onClose:()=>{
              location.reload()
            }
          })
        })
      }).catch(() => {});
    },
  }
};
</script>
<style lang="scss" scoped>
.baseInfoTable {
  width: 100%;
  line-height:40px;
}
.baseInfoTable th {
  border-bottom: 1px solid #ebeef5;
}
.baseInfoTable td {
  border-bottom: 1px solid #ebeef5;
  color:green;
}
</style>