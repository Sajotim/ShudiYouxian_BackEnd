<template>
  <div class="app-container">

    <el-form :rules="rules" ref="addEditPopForm" :model="pushData" :label-position="labelPosition" label-width="100px">
      <el-form-item label="店铺类型" prop="type">
        <el-col :span="12">
          <el-input v-model="pushData.type" clearable @keyup.enter.native="handleCreateSave"></el-input>
        </el-col>
        <el-col :span="10">&nbsp;&nbsp;&nbsp;自定义店铺类型，32个字符以内</el-col>
      </el-form-item>
      <el-form-item label="门店编号" prop="number">
        <el-col :span="12">
          <el-input v-model="pushData.number" clearable @keyup.enter.native="handleCreateSave"></el-input>
        </el-col>
        <el-col :span="10">&nbsp;&nbsp;&nbsp;达达、美团配送的时候需要填写</el-col>
      </el-form-item>
      <el-form-item label="生鲜配送" prop="expressType">
        <el-col :span="12">
          <el-input v-model="pushData.expressType" clearable @keyup.enter.native="handleCreateSave"></el-input>
        </el-col>
        <el-col :span="10">&nbsp;&nbsp;&nbsp;达达配送填 dada ,其他留空不要填写</el-col>
      </el-form-item>
      <el-form-item label="所在地" prop="areaSelect">
        <el-cascader :placeholder="cascaderPlaceholder" @change="handleAreaData" :props="props" v-model="areaData" expand-trigger="hover">
        </el-cascader>
      </el-form-item>
      <el-form-item label="店铺名称" prop="name">
        <el-input v-model="pushData.name" clearable @keyup.enter.native="handleCreateSave"></el-input>
      </el-form-item>
      <el-form-item label="营业时间" prop="openingHours">
        <el-input v-model="pushData.openingHours" clearable @keyup.enter.native="handleCreateSave"></el-input>
      </el-form-item>
      <el-form-item label="地址" prop="address">
        <el-input v-model="pushData.address" clearable @keyup.enter.native="handleCreateSave"></el-input>
      </el-form-item>
      <el-form-item label="联系电话" prop="linkPhone">
        <el-input v-model="pushData.linkPhone" clearable @keyup.enter.native="handleCreateSave"></el-input>
      </el-form-item>
      <el-form-item label="打印机编号" prop="printerSn">
        <el-col :span="6">
          <el-input v-model="pushData.printerSn" clearable @keyup.enter.native="handleCreateSave"></el-input>
        </el-col>
        <el-col :span="18" style="color:orange;padding-left:10px;">
          该店铺订单将从该打印机出单
        </el-col>
      </el-form-item>
      <el-form-item v-checkBuyedPlugin="[9]" label="店长" prop="bossUid">
        <el-col :span="6">
          <el-input v-model="pushData.bossUid" clearable @keyup.enter.native="handleCreateSave"></el-input>
        </el-col>
        <el-col :span="18" style="color:orange;padding-left:10px;">
          填写用户编号,门店货款将存入该用户资金账户
        </el-col>
      </el-form-item>
      <el-form-item v-checkBuyedPlugin="[9]" label="业务员" prop="salesmanUid">
        <el-col :span="6">
          <el-input v-model="pushData.salesmanUid" clearable @keyup.enter.native="handleCreateSave"></el-input>
        </el-col>
        <el-col :span="18" style="color:orange;padding-left:10px;">
          填写用户编号,业务员提点将存入该用户资金账户
        </el-col>
      </el-form-item>
      <el-form-item label="店铺介绍" prop="introduce">
        <el-input v-model="pushData.introduce" type="textarea" clearable :rows="5"></el-input>
      </el-form-item>
      <el-form-item label="店铺特色" prop="characteristic">
        <el-input v-model="pushData.characteristic" type="textarea" clearable :rows="5"></el-input>
      </el-form-item>
      <el-form-item label="地图位置" prop="mapAddressSearch">
        <el-input v-model="pushData.mapAddressSearch" clearable
                  @keyup.native="codeAddress" placeholder="输入关键词搜索地图坐标"></el-input>
        <el-col :span="24">
          <div id="container">
          </div>
        </el-col>
      </el-form-item>
      <el-form-item label="地图经度" prop="longitude">
        <el-col :span="4">
          <el-input v-model="pushData.longitude" clearable @keyup.enter.native="handleCreateSave"></el-input>
        </el-col>
      </el-form-item>
      <el-form-item label="地图纬度" prop="latitude">
        <el-col :span="4">
          <el-input v-model="pushData.latitude" clearable @keyup.enter.native="handleCreateSave"></el-input>
        </el-col>
      </el-form-item>
      <el-form-item label="排序" prop="paixu">
        <el-col :span="4">
          <el-input v-model.number="pushData.paixu" clearable @keyup.enter.native="handleCreateSave"></el-input>
        </el-col>
      </el-form-item>
      <el-form-item label="状态" prop="status">
        <el-select v-model="pushData.status" placeholder="请选择">
          <el-option label="禁用" value='-1'></el-option>
          <el-option label="待审核" value='0'></el-option>
          <el-option label="正常" value='1'></el-option>
          <el-option label="审核不通过" value='2'></el-option>
        </el-select>
      </el-form-item>
      <el-form-item label="图片" prop="pic">
        <img v-if="pushData.pic" :src="pushData.pic" class="avatar">
        <editorImage class="editor-upload-btn" @successCBK="imageSuccessCBK"></editorImage>
      </el-form-item>
      <el-form-item label="打折优惠信息" prop="activity">
        <el-input v-model="pushData.activity" type="textarea" clearable :rows="5"></el-input>
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
    </el-form>
    <div slot="footer" class="dialog-footer" style="text-align: center;">
      <el-button @click="goBack()">返回</el-button>
      <el-button type="primary" @click="handleCreateSave">确定</el-button>
    </div>

  </div>
</template>

<script>
  import {info, saveData} from '@/api/apiExtShopSubAdd'
  import { fetchProvinceList, fetchChildList } from "@/api/city";
  import {getToken} from '@/utils/auth' // 验权
  import {Message} from 'element-ui'
  import {mapGetters} from 'vuex'
  import {TMap} from '@/utils/TMap'
  import editorImage from "@/components/Tinymce/components/editorImage"; // 第一步

  export default {
    computed: {
      ...mapGetters([
        'centerUserBase'
      ])
    },
    data() {
      return {
        labelPosition: 'right',

        kvList:[
          {k:"", v:""}
        ],

        //表单验证
        rules: {
          type: [
            {min: 0, max: 32, message: '长度在32个字符以内', trigger: 'blur'}
          ],
          areaSelect: [
            {message: '请选择所在地', trigger: 'blur'},
            {validator: this.handleArea, trigger: 'change'}
          ],
          name: [
            {required: true, message: '请输入店铺名称', trigger: 'blur'}
          ],
          linkPhone: [
            {required: true, message: '请输入联系电话', trigger: 'blur'}
          ]
        },

        pushData: {
          dialogFormVisible: false,

          id: undefined,
          type: undefined,
          number: undefined,
          expressType: undefined,
          provinceId: undefined,
          cityId: undefined,
          districtId: undefined,
          name: undefined,
          pic: undefined,
          address: undefined,
          linkPhone: undefined,
          introduce: undefined,
          characteristic: undefined,
          latitude: undefined,
          longitude: undefined,
          paixu: undefined,
          bossUid: undefined,
          salesmanUid: undefined,
          status: '1'
        },

        listLoading: true,
        //腾讯地图参数
        geocoder: null,
        map: null,
        marker: null,
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
        //图片参数
        fileList: [],
        upLoadData: {upfile: null},
        fileHeaders: {'X-Token': getToken()}

      }
    },
    components: {
      editorImage
    },
    created() {
      //获取基本数据
      this.fetchData();
    },
    mounted() {
      setTimeout(() => {
        TMap().then(qq => {
          //纬度值
          this.pushData.latitude = this.pushData.latitude ? this.pushData.latitude : '39.916527';
          //经度值
          this.pushData.longitude = this.pushData.longitude ? this.pushData.longitude : '116.397128';
          let center = new qq.maps.LatLng(this.pushData.latitude, this.pushData.longitude);
          let map = new qq.maps.Map(document.getElementById('container'), {
            center: center,
            zoom: 13
          });
          // 地图的中心地理坐标。
          this.marker = new qq.maps.Marker({
            position: center,
            draggable: true,
            map: map
          });
          //搜索 调用地址解析类
          this.geocoder = new qq.maps.Geocoder({
            complete: (result) => {
              //清空标注
              this.marker.setMap(null);
              //赋值
              this.setLatLng(result.detail.location);
              map.setCenter(result.detail.location);
              this.marker = new qq.maps.Marker({
                map: map,
                draggable: true,
                position: result.detail.location
              });
              //拖动标注
              qq.maps.event.addListener(this.marker, 'dragend', () => {
                this.setLatLng(this.marker.getPosition());
              });
            }
          });
          //拖动标注
          qq.maps.event.addListener(this.marker, 'dragend', () => {
            this.setLatLng(this.marker.getPosition());
          });

        });
      }, 500);

    },
    methods: {
      fetchData() {
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

              if (this.pushData.pic) {
                this.fileList = [{name: '店铺图片', url: this.pushData.pic}];
              }
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
      handleArea(rule, value, callback) {
        if (!this.areaStatus) {
          callback(new Error('请选择所在地'));
        }
        callback();
      },
      //赋值
      setLatLng(val) {
        this.pushData.latitude = val.lat;
        this.pushData.longitude = val.lng;
      },
      codeAddress() {
        let mapAddressSearch = this.pushData.mapAddressSearch;
        //通过getLocation();方法获取位置信息值
        this.geocoder.getLocation(mapAddressSearch);
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
        this.$router.push({path: '/user/apiExtShopSub/list'});
      },
      imageSuccessCBK(arr) {
        if (arr && arr.length > 0) {
          this.pushData.pic = arr[0].url
        }
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
