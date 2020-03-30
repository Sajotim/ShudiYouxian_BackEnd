<template>
  <div class="app-container">

    <el-form :rules="rules" ref="addEditPopForm" :model="pushData" :label-position="labelPosition" label-width="100px">
      <el-form-item label="所在地" prop="areaSelect">
        <el-cascader
          :props="props"
          :placeholder="cascaderPlaceholder"
          @change="handleAreaData"
          v-model="areaData"
          expand-trigger="hover">
        </el-cascader>
      </el-form-item>
      <el-form-item label="联系人" prop="linkMan">
        <el-input v-model="pushData.linkMan" clearable @keyup.enter.native="handleCreateSave"></el-input>
      </el-form-item>
      <el-form-item label="身份证号码" prop="idcard">
        <el-input v-model="pushData.idcard" clearable @keyup.enter.native="handleCreateSave"></el-input>
      </el-form-item>
      <el-form-item label="详细地址" prop="address">
        <el-input v-model="pushData.address" clearable @keyup.enter.native="handleCreateSave"></el-input>
      </el-form-item>
      <el-form-item label="手机号码" prop="mobile">
        <el-input v-model="pushData.mobile" clearable @keyup.enter.native="handleCreateSave"></el-input>
      </el-form-item>
      <el-form-item label="邮编" prop="code">
        <el-input v-model="pushData.code" clearable @keyup.enter.native="handleCreateSave"></el-input>
      </el-form-item>      
      <el-form-item label="扩展属性">
        <div v-for="kv in kvList" v-bind:key="kv.k" style="padding-bottom:10px;">
          <el-col :span="4">
            <el-form-item>
              <el-input v-model="kv.k" @keyup.enter.native="handleCreateSave"></el-input>
            </el-form-item>
          </el-col>
          <el-col :span="1" align="center">:</el-col>  
          <el-col :span="4">
            <el-form-item>
              <el-input v-model="kv.v" @keyup.enter.native="handleCreateSave"></el-input>
            </el-form-item>
          </el-col>
          <el-col :span="14"> &nbsp;&nbsp;&nbsp;
            <el-button type="success" @click="addKV()">添加</el-button>
            <el-button type="danger" @click="delKV(kv.k)">删除</el-button>
          </el-col>     
          <div style="clear:both;"></div>     
        </div>
      </el-form-item>
      <el-form-item label="状态" prop="status">
        <el-select v-model="pushData.status" placeholder="请选择">
          <el-option label="正常" value='0'></el-option>
          <el-option label="禁用" value='1'></el-option>
        </el-select>
      </el-form-item>
    </el-form>
    <div slot="footer" class="dialog-footer" style="text-align: center;">
      <el-button @click="goBack()">返回</el-button>
      <el-button type="primary" @click="handleCreateSave">确定</el-button>
    </div>

  </div>
</template>

<script>
  import {info, saveData} from '@/api/apiExtUserShippingAddress'
  import { fetchProvinceList, fetchChildList } from "@/api/city";
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
        labelPosition: 'right',
        //表单验证
        rules: {
          areaSelect: [
            {message: '请选择所在地', trigger: 'blur'},
            {validator: this.handleArea, trigger: 'change'}
          ],
          linkMan: [
            {required: true, message: '请输入联系人', trigger: 'blur'}
          ],
          address: [
            {required: true, message: '请输入详细地址', trigger: 'blur'}
          ],
          code: [
            {required: true, message: '请输入邮编', trigger: 'blur'}
          ],
          mobile: [
            {required: true,validator: this.validPhone, message: '请输入正确的11位手机号码', trigger: 'blur'}
          ]
        },

        kvList:[
          {k:"", v:""}
        ],

        pushData: {
          id: undefined,
          isDefault: undefined,
          provinceId: undefined,
          cityId: undefined,
          districtId: undefined,
          address: undefined,
          code: undefined,
          linkMan: undefined,
          mobile: undefined,
          idcard: undefined,
          status: undefined,
        },

        //所在省份参数
        areaStatus: false,
        options: [],
        props: {
          value: 'id',
          label: 'name',
          lazy: true,
          lazyLoad: (node, resolve) => {
            if (node.level == 0) {
              fetchProvinceList().then(res => {
                if (res.code == 0) {
                  resolve(res.data)
                } else {
                  resolve([])
                }
              })
            } else {
              fetchChildList(node.data.id).then(res => {
                if (res.code !== 0) {
                  resolve([])
                } else {
                  if (node.level == 2) { // 只显示到3级
                    res.data.forEach(ele => {
                      ele.leaf = true
                    })
                  }
                  resolve(res.data)
                }
              })
            }            
          }
        },
        //状态参数
        areaData: [],
        cascaderPlaceholder: '- 请选择 -',
      }
    },
    created() {
      //获取基本数据
      this.info();

      this.handleCreate();
    },
    mounted() {

    },
    methods: {
      info() {
        this.listLoading = true;
        this.pushData.id = this.$route.query.id ? this.$route.query.id : '';
        if (this.pushData.id > 0) {
          info(this.pushData.id).then(res => {
            if (res.code !== 0) {
              Message({
                message: res.msg,
                type: 'error',
                duration: 3 * 1000
              })
            } else {
              this.pushData = Object.assign({}, this.pushDataTmp, res.data.info, {
                status: '' + res.data.info.status,
                dateAddStr: res.data.info.dateAdd,
                dateEndStr: res.data.info.dateEnd
              });
              if (this.pushData.provinceId && this.pushData.provinceId.length === 6) {
                this.pushData.provinceId += '000000'
              }
              if (this.pushData.cityId && this.pushData.cityId.length === 6) {
                this.pushData.cityId += '000000'
              }
              if (this.pushData.districtId && this.pushData.districtId.length === 6) {
                this.pushData.districtId += '000000'
              }
              if (this.pushData.provinceId) {
                this.areaData.push(this.pushData.provinceId)
                this.cascaderPlaceholder = this.pushData.provinceStr
              }
              if (this.pushData.cityId) {
                this.areaData.push(this.pushData.cityId)
                this.cascaderPlaceholder += this.pushData.cityStr
              }
              if (this.pushData.districtId) {
                this.areaData.push(this.pushData.districtId)
                this.cascaderPlaceholder += this.pushData.areaStr
              }
              this.areaStatus = true;
              // 计算扩展属性
              let kvList = [];
              if (res.data.extJson) {
                Object.keys(res.data.extJson).forEach(k => {
                  let aaaa = '{"k":"'+ k +'", "v":"'+ res.data.extJson[k] +'"}'
                  kvList.push(JSON.parse(aaaa))
                })
              }
              if (kvList.length == 0) {
                kvList = [ {k:"", v:""} ];
              }
              this.kvList = kvList

              this.$nextTick(() => {
                this.$refs['addEditPopForm'].clearValidate()
              })
            }

          }).then(() => {
            this.listLoading = false;
          });
        }
      },
      validPhone(rule, value, callback) {
        let reg = /^1[3|4|5|7|8][0-9]\d{8}$/;
        if (!reg.test(value) || !value) {
          callback(new Error('请输入正确的11位手机号码'))
        } else {
          callback();
        }
      },
      handleArea(rule, value, callback) {
        if (!this.areaStatus) {
          callback(new Error('请选择所在地'));
        }
        callback();
      },
      //绑定所在地区
      handleAreaData(val) {
        this.pushData.provinceId = val[0].split(',')[0];
        this.pushData.cityId = val.length >= 2 ? val[1].split(',')[0] : '';
        this.pushData.districtId = val.length === 3 ? val[2].split(',')[0] : '';
        this.areaStatus = true;
      },
      addKV(){
        let kvMap = {k:"", v:""}
        this.kvList.push(kvMap)
      },
      delKV(k){
        let newArray = []
        this.kvList.forEach(ele => {
          if (ele.k != k) {
            newArray.push(ele)
          }
        })
        if (newArray.length == 0) {
          newArray.push({k:"", v:""})
        }
        this.kvList = newArray
      },
      //表单验证
      handleCreate() {
        this.$nextTick(() => {
          this.$refs['addEditPopForm'].clearValidate()
        })
      },
      //保存
      handleCreateSave() {
        let pushDataDetailsJsonStr = {}
        this.kvList.forEach(item => {
          // {k:"", v:""}
          if (item.k && item.v) {
            let aaaa = '{"'+ item.k +'":"'+ item.v +'"}'
            pushDataDetailsJsonStr = Object.assign({}, pushDataDetailsJsonStr, JSON.parse(aaaa))
          }        
        })
        this.pushData.extJsonStr = JSON.stringify(pushDataDetailsJsonStr)
        this.$refs['addEditPopForm'].validate((valid) => {
          if (!this.areaStatus) {
            Message({
              message: '操作失败,请选择所在地',
              type: 'error',
              duration: 3 * 1000
            });
            return false;
          }

          if (valid) {
            saveData(this.pushData).then((res) => {
              this.pushData.dialogFormVisible = false;
              if (res.code === 0) {
                Message({
                  message: '操作成功',
                  type: 'success',
                  duration: 1000
                })
                this.goBack();
              } else {
                Message({
                  message: res.msg,
                  type: 'error',
                  duration: 3 * 1000
                })
              }
            }).catch(e => {
              console.error(e);
            })
          } else {
            Message({
              message: '操作失败,请输入正确信息',
              type: 'error',
              duration: 3 * 1000
            });
          }
        });

      },
      goBack() {
        this.$router.push({path: '/user/apiExtUserShippingAddress/list'});
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

  #container {
    min-width: 600px;
    min-height: 400px;
  }
</style>
