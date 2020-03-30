<template>
  <div class="app-container">
    <el-form :rules="rules" ref="addEditPopForm" :model="pushData" :label-position="labelPosition" label-width="100px">
      <el-form-item label="所属店铺" prop="shopId">
        <el-col :span="8">
          <el-select style="width: 100%" class="filter-item" v-model="pushData.shopId" placeholder="不选择店铺">
            <el-option v-for="item in shopData" :key="item.value" :label="item.label" :value="item.value">
            </el-option>
          </el-select>
        </el-col>
        <el-col :span="16" class="orange" style="padding-left:10px;">
          没有多店铺的不需要选择
        </el-col>
      </el-form-item>
      <el-form-item label="商品分类" prop="categoryId">
        <el-col :span="8">
          <el-select style="width: 100%" class="filter-item" v-model="pushData.categoryId" placeholder="商品分类">
            <el-option v-for="item in categoryData" :key="item.value" :label="item.label" :value="item.value">
            </el-option>
          </el-select>
        </el-col>
      </el-form-item>
      <el-form-item label="条码编号" prop="barCode">
        <el-col :span="8">
          <el-input v-model="pushData.barCode" clearable @keyup.enter.native="handleCreateSave"></el-input>
        </el-col>
        <el-col :span="16" class="orange">&nbsp;&nbsp;&nbsp;填写您的商品编码，建议使用扫码枪</el-col>
      </el-form-item>
      <el-form-item label="视频编号" prop="videoId">
        <el-col :span="8">
          <el-input v-model="pushData.videoId" clearable @keyup.enter.native="handleCreateSave"></el-input>
        </el-col>
        <el-col :span="16" class="orange">&nbsp;&nbsp;&nbsp;便于您展示商品视频</el-col>
      </el-form-item>
      <el-form-item label="商品名称" prop="name">
        <el-col :span="8">
          <el-input v-model="pushData.name" clearable @keyup.enter.native="handleCreateSave"></el-input>
        </el-col>
      </el-form-item>
      <el-form-item label="标签(关键词)" prop="tags">
        <el-col :span="8">
          <el-input v-model="pushData.tags" clearable @keyup.enter.native="handleCreateSave"></el-input>
        </el-col>
        <el-col :span="16" class="orange">&nbsp;&nbsp;&nbsp;多个标签用逗号或空格隔开</el-col>
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
      <el-form-item label="商品特色" prop="characteristic">
        <el-input v-model="pushData.characteristic" type="textarea" clearable rows="4"></el-input>
        <div class="orange">最多500个字符(250个汉字)</div>
      </el-form-item>
      <el-form-item label="选择物流模板" prop="logisticsId">
        <el-col :span="8">
          <el-select style="width: 100%" class="filter-item" v-model="pushData.logisticsId" placeholder="选择物流模板">
            <el-option v-for="item in logisticsIdData" :key="item.value" :label="item.label" :value="item.value">
            </el-option>
          </el-select>
        </el-col>
        <el-col :span="16" class="orange">&nbsp;&nbsp;&nbsp;虚拟物品等不需要快递（不需要用户填写收货地址）的商品请选择不需要物流</el-col>
      </el-form-item>
      <el-form-item label="排序" prop="paixu">
        <el-col :span="4">
          <el-input class="filter-item" v-model="pushData.paixu" />
        </el-col>
      </el-form-item>
      <el-form-item label="是否推荐" prop="recommendStatus">
        <el-col :span="8">
          <el-select style="width: 100%" class="filter-item" v-model="pushData.recommendStatus" placeholder="是否推荐">
            <el-option label="不推荐" :value="0" />
            <el-option label="推荐" :value="1" />
          </el-select>
        </el-col>
      </el-form-item>
      <el-form-item label="商品状态" prop="status">
        <el-col :span="8">
          <el-select style="width: 100%" class="filter-item" v-model="pushData.status" placeholder="商品状态">
            <el-option label="上架" :value="0" />
            <el-option label="下架" :value="1" />
          </el-select>
        </el-col>
      </el-form-item>
      <el-form-item label="商品图片" prop="photos">
        <el-alert title="第一张图片默认为商品封面图片，可拖动排序" type="warning">
        </el-alert>
        <editorImage class="editor-upload-btn" @successCBK="imageSuccessCBK"></editorImage>
        <ul class="el-upload-list el-upload-list--picture-card">
          <draggable :list="pushData.photos">
            <li v-for="(item, index) in pushData.photos" :key="index" tabindex="0" class="el-upload-list__item is-success"><img :src="item.pic" alt="" class="el-upload-list__item-thumbnail" draggable="false">
              <span class="el-upload-list__item-actions">
                <span class="el-upload-list__item-delete">
                  <i @click="deletePhotos(item,index)" class="el-icon-delete"></i>
                </span>
              </span>
            </li>
          </draggable>
        </ul>

      </el-form-item>
      <el-form-item label="详细介绍" prop="content">
        <Tinymce :height=500 ref="editor" v-model="pushData.content" />
      </el-form-item>
      <el-form-item label="原价" prop="originalPrice">
        <el-col :span="4">
          <el-input-number v-model="pushData.originalPrice" clearable @keyup.enter.native="handleCreateSave" :min="0" label="请输入原价" style="width: 100%"></el-input-number>
        </el-col>
      </el-form-item>
      <el-form-item label="现价" prop="minPrice">
        <el-col :span="4">
          <el-input-number v-model="pushData.minPrice" clearable @keyup.enter.native="handleCreateSave" :min="0" label="请输入现价" style="width: 100%"></el-input-number>
        </el-col>
      </el-form-item>
      <el-form-item label="拼团价" prop="pingtuanPrice">
        <el-col :span="4">
          <el-input-number v-model="pushData.pingtuanPrice" clearable @keyup.enter.native="handleCreateSave" :min="0" label="请输入拼团价" style="width: 100%"></el-input-number>
        </el-col>
      </el-form-item>
      <el-form-item label="砍价底价" prop="kanjiaPrice">
        <el-col :span="4">
          <el-input-number v-model="pushData.kanjiaPrice" clearable @keyup.enter.native="handleCreateSave" :min="0" label="请输入砍价底价" style="width: 100%"></el-input-number>
        </el-col>
      </el-form-item>
      <el-form-item label="需要积分" prop="minScore">
        <el-col :span="4">
          <el-input-number v-model="pushData.minScore" clearable @keyup.enter.native="handleCreateSave" :min="0" label="请输入需要积分" style="width: 100%"></el-input-number>
        </el-col>
        <el-col :span="20" class="orange">&nbsp;&nbsp;&nbsp;购买本商品需要扣除用户的积分数量</el-col>
      </el-form-item>
      <el-form-item label="赠送积分" prop="gotScore">
        <el-col :span="4">
          <el-input v-model="pushData.gotScore" clearable @keyup.enter.native="handleCreateSave" label="请输入赠送积分" style="width: 100%"></el-input>
        </el-col>
        <el-col :span="4" style="margin-left:10px">
          <el-select style="width: 100%" v-model="pushData.gotScoreType" placeholder="请选择">
            <el-option label="固定数量积分" :value='0' />
            <el-option label="金额的百分比(%)" :value='1' />
          </el-select>
        </el-col>
        <el-col :span="10" class="orange">&nbsp;&nbsp;&nbsp;购买本商品后用户可获得的积分数量</el-col>
      </el-form-item>
      <el-form-item label="库存" prop="stores">
        <el-col :span="4">
          <el-input type="number" v-model="pushData.stores" @keyup.enter.native="handleCreateSave" label="商品存数"></el-input>
        </el-col>
      </el-form-item>
      <el-form-item label="商品重量" prop="weight">
        <el-col :span="4">
          <el-input v-model="pushData.weight" clearable @keyup.enter.native="handleCreateSave" label="请输入商品重量">
            <template slot="append">kg</template>
          </el-input>
        </el-col>
      </el-form-item>
      <el-card class="box-card" style="margin:16px 0;">
        <div slot="header" class="clearfix">
          <span>分享有奖励</span>
          <small style="color:red">只要通过分享链接进来下单，不管新老客户，都将可以获得奖励，可与三级分销返佣叠加</small>
        </div>
        <el-form-item label="分享奖励" prop="commissionType">
          <el-col :span="4">
            <el-select v-model="pushData.commissionType" style="width: 100%" placeholder="请选择">
              <el-option label="关闭分享奖励" :value="0" />
              <el-option label="赠送右侧对应数量的积分" :value="1" />
              <el-option label="赠送右侧对应数量的现金" :value="2" />
              <el-option label="赠送右侧编号的优惠券" :value="3" />
            </el-select>
          </el-col>
          <el-col v-if="pushData.commissionType != 0" :span="4" style="margin-left:10px">
            <el-input v-model="pushData.commission" controls-position="right" :min="0" style="width: 100%;" />
          </el-col>
        </el-form-item>
      </el-card>
      <el-card class="box-card" style="margin:16px 0;">
        <div slot="header" class="clearfix">
          <span>三级分销设置</span>
          <small style="color:red">开通三级分销插件后该项配置才有效</small>
        </div>
        <el-form-item label="返佣方式" prop="fxType">
          <el-col :span="4">
            <el-select v-model="pushData.fxType" style="width: 100%" placeholder="请选择">
              <el-option label="单独设置成返现金" :value="0" />
              <el-option label="单独设置成返积分" :value="1" />
              <el-option label="按照全局分销设置返佣" :value="2" />
              <el-option label="该商品不参与分销" :value="3" />
            </el-select>
          </el-col>
        </el-form-item>
        <el-form-item v-if="pushData.fxType == 0 || pushData.fxType == 1" label="分销比例" prop="earningsPercent">
          <el-col :span="4">
            <el-input v-model="pushData.earningsPercent" clearable @keyup.enter.native="handleCreateSave">
              <template slot="append">%</template>
            </el-input>
          </el-col>
          <el-col :span="20" class="orange">&nbsp;&nbsp;&nbsp;商品销售额的指定比例用于佣金分配</el-col>
        </el-form-item>
      </el-card>
      <el-form-item label="拼团功能" prop="pingtuan">
        <el-col :span="4">
          <el-select style="width: 100%" v-model="pushData.pingtuan" placeholder="请选择">
            <el-option label="关闭" :value='false' />
            <el-option label="开启" :value='true' />
          </el-select>
        </el-col>
      </el-form-item>
      <el-form-item label="秒杀功能" prop="miaosha" v-if="centerUserBase.vipLevel > 0">
        <el-col :span="4">
          <el-select style="width: 100%" v-model="pushData.miaosha" placeholder="请选择">
            <el-option label="关闭" :value='false' />
            <el-option label="开启" :value='true' />
          </el-select>
        </el-col>
      </el-form-item>
      <el-form-item label="限购功能" prop="limitation" v-if="centerUserBase.vipLevel > 0">
        <el-col :span="4">
          <el-select style="width: 100%" v-model="pushData.limitation" placeholder="请选择">
            <el-option label="关闭" :value='false' />
            <el-option label="开启" :value='true' />
          </el-select>
        </el-col>
        <el-col :span="20" class="orange">&nbsp;&nbsp;&nbsp;开启后，本商品将只能被“商品限购设置”里面符合条件的用户购买</el-col>
      </el-form-item>
      <el-form-item label="起售时间" prop="dateStartStr" v-if="pushData.miaosha">
        <el-col :span="5">
          <el-date-picker v-model="pushData.dateStartStr" type="datetime" value-format="yyyy-MM-dd HH:mm:ss" placeholder="选择起售时间">
          </el-date-picker>
        </el-col>
        <el-col :span="13" class="orange">
          &nbsp;&nbsp;商品开始销售时间，填写格式为：2017-09-08 08:00:07 请务必按照格式填写，常规销售请不要填写
        </el-col>
      </el-form-item>
      <el-form-item label="停售时间" prop="dateEndStr" v-if="pushData.miaosha">
        <el-col :span="5">
          <el-date-picker v-model="pushData.dateEndStr" type="datetime" value-format="yyyy-MM-dd HH:mm:ss" placeholder="选择停售时间">
          </el-date-picker>
        </el-col>
        <el-col :span="13" class="orange">
          &nbsp;&nbsp;商品停止销售时间，填写格式为：2017-09-08 08:00:07 请务必按照格式填写，常规销售请不要填写
        </el-col>
      </el-form-item>
      <el-form-item label="规格尺寸">
        <div v-for="property in propertyList" :key="property.id">
          <el-divider content-position="left"><b>{{ property.name }}</b></el-divider>
          <el-checkbox-group v-model="radioPropertyIds">
            <el-checkbox v-for="propertyChild in property.propertyChildList" :key="propertyChild.id" :label="propertyChild.id" @change="createPropertyPrice()">
              {{propertyChild.name}}
            </el-checkbox>
          </el-checkbox-group>
        </div>
        <div v-if="firstOptionValules && firstOptionValules.length > 0" style="display:flex;flex-wrap:wrap;">
          <div v-for="item in firstOptionValules" :key="item.id" style="border:1px solid #EBEEF5;padding:5px;margin-top:10px;margin-right:10px;text-align:center;">
            <div>{{ item.name }}</div>
            <el-image
              style="width: 100px; height: 100px"
              :src="item.pic"
              fit="cover"
            />
            <editorImage class="editor-upload-btn" @successCBK="imageSuccessCBK2($event, item.id)" />
          </div>
        </div>
        <el-card v-for="(item,index) in detailsJsonStr" :key="index" class="box-card" style="margin-top:16px;">
          <div slot="header" class="clearfix">
            <span>{{ item.name }}</span>
            <el-button style="margin-left:20px;" type="warning" size="mini" round @click="copyDataDown(index)">向下填充</el-button>
            <el-button style="margin-left:20px;" type="danger" size="mini" round @click="deleteThisElement(index)">删除</el-button>
          </div>
          <div style="width:100%;">
            <el-row :gutter="20">
              <el-col :span="8">
                <el-select v-model="item.fxType" style="width: 100%" placeholder="请选择">
                  <el-option label="单独设置成返现金" :value="0" />
                  <el-option label="单独设置成返积分" :value="1" />
                  <el-option label="按照全局分销设置返佣" :value="2" />
                  <el-option label="当前规格商品不参与分销" :value="3" />
                </el-select>
              </el-col>
              <el-col v-if="item.fxType == 0 || item.fxType == 1" :span="8">
                <el-input v-model="item.earningsPercent" clearable>
                  <template slot="prepend">分销比例</template>
                  <template slot="append">%</template>
                </el-input>
              </el-col>
              <el-col v-if="item.fxType == 0 || item.fxType == 1" :span="8" class="orange">
                &nbsp;&nbsp;&nbsp;商品销售额的指定比例用于佣金分配
              </el-col>
            </el-row>
            <el-row :gutter="20" style="margin-top:8px;">
              <el-col :span="8">
                <el-input v-model="item.originalPrice" size="small"><template slot="prepend">原价</template></el-input>
              </el-col>
              <el-col :span="8">
                <el-input v-model="item.minPrice" size="small"><template slot="prepend">现价</template></el-input>
              </el-col>
              <el-col :span="8">
                <el-input v-model="item.pingtuanPrice" size="small"><template slot="prepend">拼团价</template></el-input>
              </el-col>
              <el-col :span="8">
                <el-input v-model="item.score" size="small"><template slot="prepend">扣除</template><template slot="append">积分</template></el-input>
              </el-col>
              <el-col :span="8">
                <el-input v-model="item.stores" size="small"><template slot="prepend">库存</template></el-input>
              </el-col>
            </el-row>
          </div>
        </el-card>
      </el-form-item>

    </el-form>
    <div slot="footer" class="dialog-footer" style="text-align: center;">
      <el-button @click="goBack();">返回</el-button>
      <el-button type="primary" @click="handleCreateSave">确定</el-button>
    </div>

  </div>
</template>

<script>
import { getFreightTemplate, getGoodsCategoryData, getProperty, getPropertyChild, info, saveData } from '@/api/apiExtShopGoods'
import { fetchShopPageList } from '@/api/apiExtShopSub'
import { batchConfigInfos } from '@/api/apiExtConfig' // 添加时候显示扩展属性第一步
import { Message } from 'element-ui'
import { mapGetters } from 'vuex'
import { getToken } from '@/utils/auth'
import draggable from 'vuedraggable'
import Tinymce from '@/components/Tinymce'
import editorImage from '@/components/Tinymce/components/editorImage' // 第一步

export default {
  components: {
    draggable,
    Tinymce,
    editorImage
  },
  data() {
    return {
      categoryData: [],
      shopData: [{ label: '不选择店铺', value: 0 }],
      logisticsIdData: [{ label: '不使用物流', value: 0 }],
      labelPosition: 'right',
      // 表单验证
      rules: {
        categoryId: [
          { required: true, message: '请选择商品分类', trigger: 'blur' }
        ],
        name: [{ required: true, message: '请输入商品名称', trigger: 'blur' }],
        photos: [
          { required: true, message: '请上传商品图片', trigger: 'blur' }
        ],
        content: [
          { required: true, message: '请输入详细介绍', trigger: 'blur' }
        ],
        status: [
          { required: true, message: '请选择商品状态', trigger: 'blur' }
        ],
        originalPrice: [
          { required: true, message: '请输入商品原价', trigger: 'blur' }
        ],
        minPrice: [
          { required: true, message: '请输入商品现价', trigger: 'blur' }
        ],
        minScore: [{ required: true, message: '不能为空', trigger: 'blur' }],
        gotScore: [{ required: true, message: '不能为空', trigger: 'blur' }],
        gotScoreType: [
          { required: true, message: '不能为空', trigger: 'blur' }
        ],
        stores: [{ required: true, message: '请输入总库存数', trigger: 'blur' }]
      },
      pushData: {
        id: undefined,
        shopId: 0,
        categoryId: undefined,
        barCode: undefined,
        videoId: undefined,
        name: undefined,
        characteristic: undefined,
        logisticsId: 0,
        paixu: 0,
        recommendStatus: 0,
        status: 0,
        originalPrice: 0,
        minPrice: 0,
        pingtuanPrice: 0,
        minScore: 0,
        gotScore: 0,
        gotScoreType: 0,
        stores: 0,
        weight: 0,
        commissionType: 0,
        fxType: 2,
        earningsPercent: undefined,
        commission: 0,
        pingtuan: false,
        pics: [],
        photos: [],
        content: undefined,
        detailsJsonStr: [],
        deleteOldPics: 'true',
        dateStartStr: undefined,
        dateEndStr: undefined,
        dateAddStr: undefined,
        miaosha: false,
        limitation: false
      },

      // 图片参数
      fileList: [],
      upLoadData: { upfile: null },
      fileHeaders: { 'X-Token': getToken() },
      // 规格与尺寸
      selectedPropertyIds: [], // 勾选中的大属性id列表
      radioPropertyIds: [], // 勾选中的子属性id列表
      propertyList: [],
      propertyChildList: [],
      firstOptionValules: [],
      curPropertyNumber: 0,
      propertyPrice: [],
      subPriceArrayStack: [],
      detailsJsonStr: [],
      priceExts: [],
      // 扩展属性
      kvList: [{ k: '', v: '' }]
    }
  },
  computed: {
    ...mapGetters(['centerUserBase'])
  },
  created() {
    this.pushDataTmp = Object.assign({}, this.pushData)
    this.tinymceUploadUrls = []
  },
  mounted() {
    this.getShopData()
    this.getGoodsCategoryData()
    this.getFreightTemplate()
    // 获取基本数据
    this.fetchData()
  },
  methods: {
    // 删除图片
    deletePhotos(item, index) {
      this.pushData.photos.splice(index, 1)
    },
    // 获取店铺列表数据
    getShopData() {
      fetchShopPageList(1, 10000, {}).then(response => {
        if (response.code == 0) {
          response.data.result.forEach(a => {
            let v = {};
            v.value = a.id;
            v.label = a.name;
            this.shopData.push(v);
          });
        }
      });
    },
    //获取商品分类列表
    getGoodsCategoryData() {
      getGoodsCategoryData().then(response => {
        const data = [];
        if (response.code == 700) {
          Message({
            message: "您当前还未设置商品分类，无法添加商品",
            type: "error",
            duration: 3 * 1000
          });
          return;
        }
        if (response.code == 0) {
          response.data.forEach((a, index) => {
            let v = {},
              s = "";
            v.value = a.id;
            if (a.level > 1) {
              for (let i = 2; i < a.level; i++) {
                s += "　　　　";
              }
              s += "╚═══";
            }
            v.label = s + a.name;
            data.push(v);
          });
        }
        this.categoryData = data
      })
    },
    // 运费模板列表
    getFreightTemplate() {
      getFreightTemplate().then(response => {
        if (response.code === 0) {
          response.data.forEach(a => {
            const v = {}
            v.value = a.id
            v.label = a.name
            this.logisticsIdData.push(v)
          })
        }
      })
    },
    // 规格与尺寸选择事件
    createPropertyPrice() {
      // 快速点击时候，会有并发问题导致变量脏写情况发生
      this.selectedPropertyIds = []
      this.detailsJsonStr = []
      this.propertyPrice = []
      this.curPropertyNumber = 0
      this.radioPropertyIds.forEach(propertyChildId => {
        const propertyChild = this.propertyChildList.find(o => {
          return o.id === propertyChildId
        })
        if (
          propertyChild &&
          !this.selectedPropertyIds.includes(propertyChild.propertyId)
        ) {
          this.selectedPropertyIds.push(propertyChild.propertyId)
        }
      })
      this.getPropertyArray(0, []) // 生成规格尺寸定价数组
      console.log('result:', this.detailsJsonStr)
      console.log('this.selectedPropertyIds:', this.selectedPropertyIds)
      // 计算选中的第一个规格尺寸
      if (this.selectedPropertyIds && this.selectedPropertyIds.length > 0) {
        const firstOptionId = this.selectedPropertyIds[0]
        const firstOptionValules = this.propertyChildList.filter(o => {
          return o.propertyId === firstOptionId
        }).filter(o => {
          return this.radioPropertyIds.includes(o.id)
        })
        if (this.subPics && this.subPics.length > 0) {
          firstOptionValules.forEach(ele => {
            const _subPics = this.subPics.find(o => {
              return o.optionValueId === ele.id
            })
            if (_subPics) {
              ele.pic = _subPics.pic
            }
          })
        }        
        this.firstOptionValules = firstOptionValules
      } else {
        this.firstOptionValules = null
      }
      console.log('firstOptionValules:', this.firstOptionValules)
    },
    // 生成规格尺寸定价数组
    getPropertyArray(index, pArray) {
      if (index === this.selectedPropertyIds.length) {
        if (index === 0) {
          return
        }
        const detailsStr = {
          name: '',
          properties: pArray
        }
        pArray.forEach(_pArray => {
          detailsStr.name += _pArray.cname + ' '
        })
        let goodsPriceDB = null // 数据库中当前规格的设置
        if (this.priceExts && this.priceExts.length > 0) {
          goodsPriceDB = this.priceExts.find(o => {
            let hasFound = true
            pArray.forEach(_pArray => {
              if (
                o.propertyChildIds.indexOf(_pArray.pid + ':' + _pArray.cid) ===
                -1
              ) {
                hasFound = false
              }
            })
            return hasFound
          })
        }
        if (goodsPriceDB) {
          detailsStr.originalPrice = goodsPriceDB.originalPrice
          detailsStr.minPrice = goodsPriceDB.price
          detailsStr.pingtuanPrice = goodsPriceDB.pingtuanPrice
          detailsStr.score = goodsPriceDB.score
          detailsStr.stores = goodsPriceDB.stores
          detailsStr.fxType = goodsPriceDB.fxType
          detailsStr.earningsPercent = goodsPriceDB.earningsPercent
        } else {
          detailsStr.originalPrice = 0
          detailsStr.minPrice = 0
          detailsStr.pingtuanPrice = 0
          detailsStr.score = 0
          detailsStr.stores = 0
          detailsStr.fxType = 2
          detailsStr.earningsPercent = null
        }
        this.detailsJsonStr.push(detailsStr)
        return
      }
      const pBean = this.propertyList.find(o => {
        return o.id === this.selectedPropertyIds[index]
      }) // 颜色
      for (let cIndex = 0; cIndex < this.radioPropertyIds.length; cIndex++) {
        const cBean = this.propertyChildList.find(o => {
          return o.id === this.radioPropertyIds[cIndex]
        }) // 红色
        if (cBean.propertyId !== pBean.id) {
          continue
        }
        const _pArray = Object.assign([], pArray)
        _pArray.push({
          pid: pBean.id,
          pname: pBean.name,
          cid: cBean.id,
          cname: cBean.name
        })
        this.getPropertyArray(index + 1, _pArray)
      }
    },
    // 删除规格尺寸
    deleteThisElement(index) {
      this.detailsJsonStr.splice(index, 1)
    },
    // 规格尺寸向下填充
    copyDataDown(index) {
      for (let i = index + 1, len = this.detailsJsonStr.length; i < len; i++) {
        this.detailsJsonStr[i].originalPrice = this.detailsJsonStr[
          index
        ].originalPrice
        this.detailsJsonStr[i].minPrice = this.detailsJsonStr[index].minPrice
        this.detailsJsonStr[i].pingtuanPrice = this.detailsJsonStr[
          index
        ].pingtuanPrice
        this.detailsJsonStr[i].score = this.detailsJsonStr[index].score
        this.detailsJsonStr[i].stores = this.detailsJsonStr[index].stores
        this.detailsJsonStr[i].fxType = this.detailsJsonStr[index].fxType
        this.detailsJsonStr[i].earningsPercent = this.detailsJsonStr[index].earningsPercent
      }
    },
    // 获取基本数据
    async fetchData() {
      this.pushData.id = this.$route.query.id
      // 获取规格尺寸子属性的列表
      await getPropertyChild().then(res => {
        if (res.code === 0) {
          this.propertyChildList = res.data
        }
      })
      // 获取规格尺寸大分类列表
      await getProperty().then(res => {
        if (res.code === 0) {
          res.data.forEach(ele => {
            ele.propertyChildList = this.propertyChildList.filter(child => {
              return child.propertyId === ele.id
            })
          })
          this.propertyList = res.data
        }
      })
      if (this.pushData.id) {
        // 修改
        const res = await info(this.pushData.id)
        if (res.code !== 0) {
          this.$message.error(res.msg)
          return
        }
        this.pushData = Object.assign({}, this.pushDataTmp, res.data.info,
          {
            dateStartStr: res.data.info.dateStart,
            dateEndStr: res.data.info.dateEnd,
            photos: res.data.pics,
            content: res.data.content.content
          }
        )
        this.subPics = res.data.subPics
        // 计算扩展属性
        let kvList = []
        if (res.data.extJson) {
          Object.keys(res.data.extJson).forEach(k => {
            const aaaa =
              '{"k":"' + k + '", "v":"' + res.data.extJson[k] + '"}'
            kvList.push(JSON.parse(aaaa))
          })
        }
        if (kvList.length === 0) {
          kvList = [{ k: '', v: '' }]
        }
        this.kvList = kvList
        // 编辑器
        this.$refs['editor'].setContent(
          res.data.content ? res.data.content.content : ''
        )
        this.priceExts = res.data.priceExts
        if (this.priceExts) {
          this.priceExts.forEach(_priceExts => {
            const propertyChildIds = _priceExts.propertyChildIds
            propertyChildIds.split(',').forEach(pcBean => {
              if (pcBean) {
                const pAndcId = pcBean.split(':')
                if (pAndcId && pAndcId.length === 2) {
                  const pid = parseInt(pAndcId[0])
                  const cid = parseInt(pAndcId[1])
                  if (!this.selectedPropertyIds.includes(pid)) {
                    this.selectedPropertyIds.push(pid)
                  }
                  if (!this.radioPropertyIds.includes(cid)) {
                    this.radioPropertyIds.push(cid)
                  }
                }
              }
            })
          })
        }

        this.$nextTick(() => {
          // 初始化规格与尺寸
          if (this.radioPropertyIds && this.radioPropertyIds.length > 0) {
            this.createPropertyPrice()
          }
          this.$refs['addEditPopForm'].clearValidate()
        })
      } else {
        // 添加
        // 默认扩展属性开始
        batchConfigInfos('goods.ext.fileds').then(res => {
          if (res.code === 0) {
            let kvList = []
            let _keys = res.data[0].value.replace(/，/g, ',')
            _keys = _keys.replace(/ /g, ',')
            _keys = _keys.replace(/,,/g, ',')
            _keys.split(',').forEach(k => {
              const aaaa = '{"k":"' + k + '", "v":""}'
              kvList.push(JSON.parse(aaaa))
            })
            if (kvList.length === 0) {
              kvList = [{ k: '', v: '' }]
            }
            this.kvList = kvList
          }
        })
        // 默认扩展属性结束
      }
      this.$nextTick(() => {
        this.$refs['addEditPopForm'].clearValidate()
      })
    },
    // 保存
    handleCreateSave() {
      let hasZeroStores = false
      if (!this.pushData.stores) {
        hasZeroStores = true
      }
      if (this.detailsJsonStr) {
        const _a = this.detailsJsonStr.find(ele => {
          return !ele.stores
        })
        if (_a) {
          hasZeroStores = true
        }
      }
      if (hasZeroStores) {
        this.$confirm('商品库存为0，确认要提交吗？', '确认信息', {
          confirmButtonText: '确认提交',
          cancelButtonText: '放弃修改'
        }).then(() => {
          this.handleCreateSaveDone()
        }).catch(action => {
          // 用户点了取消
        })
      } else {
        this.handleCreateSaveDone()
      }
    },
    handleCreateSaveDone() {
      this.$refs['addEditPopForm'].validate(valid => {
        if (!valid) {
          this.$message.error('数据未填写完整，请检查')
          return
        }
        this.pushData.detailsJsonStr = JSON.stringify(this.detailsJsonStr)
        const photos = []
        this.pushData.photos.forEach(a => {
          photos.push(a.pic)
        })
        this.pushData.pic = photos[0]
        this.pushData.pics = photos.toString()
        if (this.pushData.commissionType === 0) {
          this.pushData.commission = null
        }

        let pushDataDetailsJsonStr = {}
        this.kvList.forEach(item => {
          // {k:"", v:""}
          if (item.k && item.v) {
            const aaaa = '{"' + item.k + '":"' + item.v + '"}'
            pushDataDetailsJsonStr = Object.assign(
              {},
              pushDataDetailsJsonStr,
              JSON.parse(aaaa)
            )
          }
        })
        this.pushData.extJsonStr = JSON.stringify(pushDataDetailsJsonStr)

        const _pushData = Object.assign({}, this.pushData)
        if (!_pushData.dateStartStr) {
          _pushData.dateStartStr = '-1'
        }
        if (!_pushData.dateEndStr) {
          _pushData.dateEndStr = '-1'
        }
        // 装载规格图片
        if (this.firstOptionValules && this.firstOptionValules.length > 0) {
          const subPics = []
          this.firstOptionValules.forEach(ele => {
            if (ele.pic) {
              subPics.push({
                optionValuleId: ele.id,
                pic: ele.pic
              })
            }
          })
          _pushData.subPics = JSON.stringify(subPics)
        }
        saveData(_pushData)
          .then(res => {
            if (res.code === 0) {
              this.$message({
                message: "操作成功",
                type: "success"
              });
              this.goBack();
            } else {
              Message({
                message: res.msg,
                type: "error",
                duration: 3 * 1000
              });
            }
          })
          .catch(e => {
            console.error(e);
          });
      });
    },
    goBack() {
      this.$router.push({ path: '/user/apiExtShopGoods/list' })
    },
    addKV() {
      const kvMap = { k: '', v: '' }
      this.kvList.push(kvMap)
    },
    delKV(k) {
      const newArray = []
      this.kvList.forEach(ele => {
        if (ele.k !== k) {
          newArray.push(ele)
        }
      });
      if (newArray.length === 0) {
        newArray.push({ k:  '', v: '' })
      }
      this.kvList = newArray
    },
    imageSuccessCBK(arr) {
      if (arr && arr.length > 0) {
        arr.forEach(p => {
          this.pushData.photos.push({ pic: p.url })
        })
      }
    },
    imageSuccessCBK2(arr, optionValueId) {
      if (arr && arr.length > 0) {
        const optionIndex = this.firstOptionValules.findIndex(ele => {
          return ele.id === optionValueId
        })
        const optionValue = this.firstOptionValules[optionIndex]
        optionValue.pic = arr[0].url
        this.firstOptionValules.splice(optionIndex, 1, optionValue)
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

.orange {
  color: #ff892a !important;
}

.red {
  color: #dd5a43 !important;
}
</style>
