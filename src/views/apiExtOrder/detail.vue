<template>
  <div class="app-container" v-loading="loading">
    <el-row> 
     <el-button type="success" icon="el-icon-arrow-left" size="small" @click="backClick">返回</el-button>
     <el-button type="warning" size="small" icon="el-icon-printer" @click="rePrint">补打小票</el-button>
     <el-button v-if="orderInfo.status == 0" type="danger" size="small" @click="changePrice">修改订单金额</el-button>
     <el-button v-if="orderInfo.status == 0" type="danger" size="small" @click="payOrder">余额支付</el-button>
     <el-button v-if="orderInfo.status == 0" type="danger" size="small" @click="payOrderOff">设为已支付</el-button>
     <el-button v-if="orderInfo.status == 0 || orderInfo.status == 1" type="info" size="small" @click="closeOrder">关闭订单</el-button>
     <el-button v-if="(orderInfo.status == 1 || orderInfo.status == 2) && orderInfo.isNeedLogistics" type="warning" size="small" @click="fahuo">发货</el-button>
     <el-button v-if="orderInfo.status == 1 || orderInfo.status == 2 || orderInfo.status == 3 || orderInfo.status == 4" type="danger" size="small" @click="tuikuan" icon="el-icon-refresh-left">退款</el-button>
     <el-button v-if="orderInfo.status == 1" type="success" size="small" @click="successOrder">设置交易成功</el-button>
    </el-row> 
    <div class="order-title">订单信息：</div>
    <div style="clear:both;margin-top:20px;">
      <el-row :gutter="20">
        <el-col :span="6">
          <el-form size="mini" label-width="120">
            <el-form-item label="用户编号:">
                <span>{{ userBean.id }}</span>
            </el-form-item>
            <el-form-item label="用户昵称:">
                <span>{{ userBean.nick }}</span>
            </el-form-item>
            <el-form-item label="用户手机:">
                <span>{{userBean.mobile?userBean.mobile:'-'}}</span>
            </el-form-item>
            <el-form-item label="下单时间:">
                <span>{{orderInfo.dateAdd}}</span>
            </el-form-item>
            <el-form-item v-if="orderInfo.pingtuanOpenId" label="拼团团号:">
              <span>{{orderInfo.pingtuanOpenId}}</span>
            </el-form-item>         
            <el-form-item v-if="orderInfo.pingtuanOpenId" label="拼团状态:">
              <font style="color:green;" v-if="orderInfo.isSuccessPingtuan">成团 </font>
              <font style="color:red;" v-if="!orderInfo.isSuccessPingtuan">未成团</font>
            </el-form-item>         
          </el-form>
        </el-col>
        <el-col :span="6">
          <el-form size="mini" label-width="120">
            <el-form-item label="订单号:">
                <span>{{ orderInfo.orderNumber }}</span>
            </el-form-item>
            <el-form-item label="支付单号:">
                <span>{{ orderInfo.payNumber?orderInfo.payNumber:'-' }}</span>
            </el-form-item>
            <el-form-item label="商品数量:">
                <span>{{orderInfo.goodsNumber}}</span>
            </el-form-item>
            <el-form-item label="状态:">
                <span>{{ orderInfo.statusStr }}</span>
            </el-form-item>
            <el-form-item v-if="orderInfo.isDelUser">
              <font style="color:red;">用户已删除该订单</font>
            </el-form-item>
            <el-form-item v-if="orderInfo.isCanHx" label="核销码:">
                <span>{{ orderInfo.hxNumber }}</span>
            </el-form-item>
          </el-form>
        </el-col>
        <el-col :span="6">
          <el-form size="mini" label-width="120">
            <el-form-item label="是否支付:">
              <font style="color:green;" v-if="orderInfo.isPay">已支付</font>
              <font style="color:red;" v-if="!orderInfo.isPay">未支付</font>
            </el-form-item>
            <el-form-item label="是否快递:">
              <font style="color:green;" v-if="orderInfo.isNeedLogistics">需要</font>
              <font style="color:red;" v-if="!orderInfo.isNeedLogistics">不需要</font>
            </el-form-item>
            <el-form-item label="有无退款:">
              <font style="color:red;" v-if="orderInfo.hasRefund">有</font>
              <font style="color:green;" v-if="!orderInfo.hasRefund">无</font>
            </el-form-item>
            <el-form-item label="备注:">
                <span>{{orderInfo.remark?orderInfo.remark:'-'}}</span>
            </el-form-item>
            <el-form-item label="更新时间:">
                <span>{{orderInfo.dateUpdate?orderInfo.dateUpdate:'-'}}</span>
            </el-form-item>
          </el-form>
        </el-col>
        <el-col :span="6">
          <el-form size="mini" label-width="120">
            <el-form-item label="商品总价:">
                <span>{{orderInfo.amount}}</span>
            </el-form-item>
            <el-form-item label="快递费用:">
                <span>{{orderInfo.amountLogistics}}</span>
            </el-form-item>
            <el-form-item label="订单金额:">
                <span>{{orderInfo.amountReal}}</span>
            </el-form-item>
            <el-form-item label="消费积分:">
                <span>{{orderInfo.score}}</span>
            </el-form-item>
            <el-form-item label="关闭时间:">
                <span>{{orderInfo.dateClose?orderInfo.dateClose:'-'}}</span>
            </el-form-item>
          </el-form>
        </el-col>
      </el-row>
    </div>
    <div v-if="kvList" class="order-title">其他信息：</div>
    <div v-if="kvList" style="clear:both;margin-top:20px;">
      <el-row :gutter="20">
        <el-col :span="6" v-for="kv in kvList" v-bind:key="kv.k">
          <el-form size="mini" label-width="120">
            <el-form-item :label="kv.k">
                <span>{{ kv.v }}</span>
            </el-form-item>
          </el-form>
        </el-col> 
      </el-row>
    </div>
    <div v-if="discountsCoupon" class="order-title">使用优惠券信息：</div>
    <div v-if="discountsCoupon" style="clear:both;margin-top:20px;">
      <el-row :gutter="20">
        <el-form size="mini">
          <el-col :span="8">            
            <el-form-item label="类型:">
              <span>{{ discountsCoupon.type ? discountsCoupon.type : '-' }}</span>
            </el-form-item>                        
          </el-col>
          <el-col :span="8">            
            <el-form-item label="口令:">
              <span>{{ discountsCoupon.pwd ? discountsCoupon.pwd : '-' }}</span>
            </el-form-item>                        
          </el-col>
          <el-col :span="8">            
            <el-form-item label="名称:">
              <span>{{ discountsCoupon.name ? discountsCoupon.name : '-' }}</span>
            </el-form-item>                        
          </el-col>
          <el-col :span="8">            
            <el-form-item label="金额:">
              <span>{{ discountsCoupon.money ? discountsCoupon.money : '-' }}</span>
            </el-form-item>                        
          </el-col>
          <el-col :span="8">            
            <el-form-item label="领取时间:">
              <span>{{ discountsCoupon.dateAdd }}</span>
            </el-form-item>                        
          </el-col>          
        </el-form>
      </el-row>      
    </div>
    <div class="order-title">商品信息：</div>
    <div style="clear:both;margin-top:20px;">
      <el-table :data="goodsList"  fit highlight-current-row empty-text="暂无数据">
        <el-table-column label="图标">
          <template slot-scope="scope">
            <img :src="scope.row.pic" style="width:70px;" />
          </template>
        </el-table-column>
        <el-table-column label="名称" prop="goodsName"></el-table-column>
        <el-table-column label="规格" prop="property"></el-table-column>
        <el-table-column label="数量" prop="number"></el-table-column>
        <el-table-column label="总价" prop="amount"></el-table-column>
        <el-table-column label="扣除积分" prop="score"></el-table-column>
        <el-table-column label="评价">
          <template slot-scope="scope">
            <div v-if="scope.row.dateReputation">
              <font>{{scope.row.goodReputationStr}}</font><br>
              <font>{{scope.row.goodReputationRemark}}</font>
            </div>
            <div v-else>-</div>
          </template>
        </el-table-column>
      </el-table>
    </div>
    <div v-if="goodsStoresList" class="order-title">库房备注：</div>
    <div v-if="goodsStoresList" style="clear:both;margin-top:20px;">
      <el-alert
        style="margin-top:10px;"
        v-for="store in goodsStoresList" v-bind:key="store.id"
        :title="store.remark + '\u00a0\u00a0\u00a0\u00a0\u00a0\u00a0\u00a0\u00a0\u00a0' + store.day + '\u00a0\u00a0\u00a0\u00a0\u00a0\u00a0\u00a0\u00a0\u00a0' + 'x' + store.stores"
        type="success"
        :closable="false"
        effect="dark">
      </el-alert>
    </div>
    <div v-if="goodsCoupons" class="order-title">优惠券/卡密自动发货：</div>
    <div v-if="goodsCoupons" style="clear:both;margin-top:20px;">
      <div v-for="goodsCoupon in goodsCoupons" v-bind:key="goodsCoupon.id">
        <el-alert
          v-if="goodsCoupon.type == 0"
          style="margin-top:10px;"
          :title="'兑换码: ' + goodsCoupon.coupon"
          type="success"
          :closable="false"
          effect="dark">
        </el-alert>
        <el-image
        v-if="goodsCoupon.type == 1"
        style="width: 100px;"
        :src="goodsCoupon.coupon"
        fit="cover"
        :lazy="true"
        :preview-src-list="goodsCouponsPics"></el-image>
      </div>
    </div>
    <div v-if="reputationPics" class="order-title">评价图片：</div>
    <div v-if="reputationPics" style="clear:both;margin-top:20px;">
      <div v-for="reputationPic in reputationPics" :key="reputationPic.id"
        style="width: 100px; height: 130px;margin-right:10px;float: left; margin-bottom:10px;">
        <el-image
        style="width: 100px; height: 100px;"
        :src="reputationPic.pic"
        fit="cover"
        :lazy="true"
        :preview-src-list="previewSrcList"></el-image>
        <div style="text-align:center;"><el-button type="text" size="medium" icon="el-icon-delete" @click="delReputationPic(reputationPic.id)"></el-button></div>
      </div>
      <div style="clear:both;"></div>
    </div>
    <div v-if="orderInfo.isNeedLogistics" class="order-title">快递信息：</div>
    <div v-if="orderInfo.isNeedLogistics" style="clear:both;margin-top:20px;">
      <el-row :gutter="20">
        <el-col :span="12">
          <el-form size="mini">
            <el-form-item label="收货地址:">
                <span>
                  {{apiExtOrderLogistics.provinceStr}}
                  {{apiExtOrderLogistics.cityStr}}
                  {{apiExtOrderLogistics.areaStr}}
                  {{apiExtOrderLogistics.address}}
                </span>
            </el-form-item>
            <el-form-item label="收件人:">
                <span>{{apiExtOrderLogistics.linkMan}}</span>
            </el-form-item>
            <el-form-item label="手机:">
                <span>{{apiExtOrderLogistics.mobile}}</span>
            </el-form-item>
            <el-form-item label="邮编:">
                <span>{{apiExtOrderLogistics.code}}</span>
            </el-form-item>
            <el-form-item v-if="apiExtOrderLogistics.idcard" label="身份证号码:">
                <span>{{apiExtOrderLogistics.idcard}}</span>
            </el-form-item>
            <el-form-item v-if="apiExtOrderLogistics.type == 1 && (orderInfo.status == 1 || orderInfo.status == 2)" label="达达配送信息:">
                <span>{{apiExtOrderLogistics.shipperCode}}</span> &nbsp;&nbsp;&nbsp;
                <span>{{apiExtOrderLogistics.shipperName}}</span> &nbsp;&nbsp;&nbsp;
                <el-button type="success" icon="el-icon-arrow-left" size="small" @click="reSendToDada">重发达达订单</el-button>
            </el-form-item>
          </el-form>
        </el-col>
        <el-col v-if="apiExtOrderLogistics" :span="12">
          <el-form size="mini" v-if="apiExtOrderLogistics">
            <el-form-item v-if="apiExtOrderLogistics.shipperName" label="快递公司">
                {{apiExtOrderLogistics.shipperName}}
            </el-form-item>
            <el-form-item v-if="apiExtOrderLogistics.trackingNumber" label="快递单号">
                {{apiExtOrderLogistics.trackingNumber}}
                <span v-if="apiExtOrderLogistics.type == 3">
                  <el-button type="success" size="mini" @click="keloopOrderLogs">更新状态</el-button>
                  <el-button type="danger" size="mini" @click="closeKeloop">取消配送</el-button>
                </span>
            </el-form-item>
            <el-form-item v-else-if="apiExtOrderLogistics.type == 3" label="快递单号">
                <font style="color:red;">未提交至快跑者外送平台</font>
                <span>
                  <el-button type="danger" size="mini" @click="fahuoKeloop">重新提交至快跑者</el-button>
                </span>
            </el-form-item>
          </el-form>
          <el-form size="mini" v-if="apiExtOrderLogistics.type != 3 && tracesArray">
            <el-form-item v-for="item in tracesArray" v-bind:key="item.AcceptTime" style="margin-bottom:0px;">
              <font style="color:#CC6600;">{{item.AcceptTime}}</font> &nbsp;&nbsp;&nbsp;
              <font style="color:#CC9900;">{{item.AcceptStation}}</font>
            </el-form-item>
          </el-form>
          <el-form size="mini" v-if="apiExtOrderLogistics.type == 3">
            <el-form-item v-for="item in keloopOrderLogsData" v-bind:key="item.id" style="margin-bottom:0px;">
              <font style="color:#CC6600;">{{item.name}} ({{item.tel}})</font> &nbsp;&nbsp;&nbsp;
              <font style="color:#CC9900;">{{item.title}}</font>
            </el-form-item>
          </el-form>
        </el-col>
      </el-row>      
    </div>
    <div v-if="refundApplies && refundApplies.length > 0" class="order-title">用户申请售后记录：</div>
    <div v-if="refundApplies && refundApplies.length > 0" style="clear:both;margin-top:20px;">
      <el-table :data="refundApplies"  fit highlight-current-row empty-text="暂无数据">
        <el-table-column label="类型" prop="baseInfo.typeStr"></el-table-column>
        <el-table-column label="物流情况" prop="baseInfo.logisticsStatusStr"></el-table-column>
        <el-table-column label="原因">
          <template slot-scope="scope">
            <el-tooltip class="item" effect="dark" :content="scope.row.baseInfo.remark? scope.row.baseInfo.remark : '-'" placement="right-start">
              <el-tag type="danger">{{scope.row.baseInfo.reason}}</el-tag>
            </el-tooltip>
            <p v-if="scope.row.pics && scope.row.pics.length > 0">
              <a v-for="(ppp,index) in scope.row.pics" :key="ppp.id" :href="ppp.pic" target="_blank"> &nbsp;图{{index+1}}&nbsp;</a>
            </p>
          </template>
        </el-table-column>
        <el-table-column label="退款金额" prop="baseInfo.amount" width="100%"></el-table-column>
        <el-table-column label="状态">
          <template slot-scope="scope">
            <el-tag v-if="scope.row.baseInfo.status == 0" type="danger">{{scope.row.baseInfo.statusStr}}</el-tag>
            <el-tag v-else-if="scope.row.baseInfo.status == 1" type="info">{{scope.row.baseInfo.statusStr}}</el-tag>
            <el-tag v-else-if="scope.row.baseInfo.status == 2" type="warning">{{scope.row.baseInfo.statusStr}}</el-tag>
            <el-tag v-else-if="scope.row.baseInfo.status == 3">{{scope.row.baseInfo.statusStr}}</el-tag>
            <el-tag v-else-if="scope.row.baseInfo.status == 4" type="success">{{scope.row.baseInfo.statusStr}}</el-tag>
            <el-tag v-else type="info">-</el-tag>
          </template>
        </el-table-column>
        <el-table-column label="发起/更新时间">
          <template slot-scope="scope">
            {{scope.row.baseInfo.dateAdd}}
            <br>
            {{scope.row.baseInfo.dateUpdate?scope.row.baseInfo.dateUpdate:'-'}}
          </template>
        </el-table-column>
        <el-table-column label="操作" width="100%">
          <template slot-scope="scope">
            <el-button type="text" v-if="scope.row.baseInfo.status == 0" @click="refundAppliesRefuseing(scope.row.baseInfo.id)" style="color:red">设为处理中</el-button>
            <el-button type="text" v-if="scope.row.baseInfo.status == 0 || scope.row.baseInfo.status == 3" @click="refundAppliesRefuse(scope.row.baseInfo.id)" style="color:red">拒绝</el-button>
            <el-button type="text" v-if="scope.row.baseInfo.status == 3" @click="refundAppliesRefuseSuccess(scope.row.baseInfo.id)" style="color:green">设为成功</el-button>
          </template>
        </el-table-column>
      </el-table>     
    </div>
    <div v-if="refunds && refunds.length > 0" class="order-title">退款信息：</div>
    <div v-if="refunds && refunds.length > 0" style="clear:both;margin-top:20px;">
      <el-table :data="refunds"  fit highlight-current-row empty-text="暂无数据">
        <el-table-column label="退款单号" prop="refundNo"></el-table-column>
        <el-table-column label="退款金额" prop="moneyRefund" width="100%"></el-table-column>
        <el-table-column label="状态" width="100%">
          <template slot-scope="scope">
            <font v-if="scope.row.status == 1" style="color:gray;">待提交处理</font>
            <font v-else-if="scope.row.status == 2" style="color:orange;">银行处理中</font>
            <font v-else-if="scope.row.status == 3" style="color:green;">成功</font>
            <font v-else-if="scope.row.status == 4" style="color:red;">失败</font>
            <font v-else style="color:gray;">-</font>
          </template>
        </el-table-column>
        <el-table-column label="备注" prop="remark" show-overflow-tooltip></el-table-column>
        <el-table-column label="发起时间" prop="dateAdd"></el-table-column>
        <el-table-column label="成功时间">
          <template slot-scope="scope">
            {{scope.row.dateUpdate?scope.row.dateUpdate:'-'}}
          </template>
        </el-table-column>
      </el-table>     
    </div>
    <div class="order-title">订单记录：</div>
    <div style="clear:both;margin-top:20px;">
      <el-table :data="logs"  fit highlight-current-row empty-text="暂无数据">
        <el-table-column label="操作时间" prop="dateAdd"></el-table-column>
        <el-table-column label="操作事件" prop="typeStr"></el-table-column>
      </el-table>     
    </div>
    
    <el-dialog title="退款" :visible.sync="dialogTuikuanVisible" :close-on-click-modal="false" :close-on-press-escape="false">
      <el-form :rules="rulesTuikan" ref="tuikuanPopForm" :model="tuikuanPushData" label-position="left" label-width="100px">
        <el-form-item label="退款至" prop="toWhere" >
          <el-col :span="8">
            <el-select style="width:100%;" v-model="tuikuanPushData.toWhere" placeholder="请选择">
              <el-option label="用户余额" value="0" />
              <el-option label="原路退回(微信支付)" value="1" />
              <el-option label="智百威退款" value="2" />
            </el-select>
          </el-col>
          <el-col v-if="tuikuanPushData.toWhere == 1" :span="16" style="color:orange">&nbsp;&nbsp;&nbsp;“微信设置”中上传微信支付api证书后才能使用</el-col>
        </el-form-item>
        <el-form-item label="退款金额" prop="money">
          <el-col :span="8">
            <el-input v-model="tuikuanPushData.money" clearable></el-input>
          </el-col>
          <el-col :span="16" style="color:orange">&nbsp;&nbsp;&nbsp;退款金额不能超过订单总支付金额</el-col>
        </el-form-item>
        <el-form-item label="订单操作" prop="orderStatus" >
          <el-col :span="8">
            <el-select style="width:100%;" v-model="tuikuanPushData.orderStatus" placeholder="请选择">
              <el-option label="不改变订单状态" value="" />
              <el-option label="关闭订单" value="-1" />
              <el-option label="设置为交易成功" value="3" />
            </el-select>
          </el-col>
          <el-col v-if="tuikuanPushData.toWhere == 1" :span="16" style="color:orange">&nbsp;&nbsp;&nbsp;“微信设置”中上传微信支付api证书后才能使用</el-col>
        </el-form-item>
        <el-form-item label="备注" prop="remark" >
          <el-input v-model="tuikuanPushData.remark" type="textarea" :rows="4" clearable></el-input>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="dialogTuikuanVisible = false">取消</el-button>
        <el-button type="primary" @click="tuikuanSave">确定</el-button>
      </div>
    </el-dialog>
    <el-dialog title="修改订单金额" :visible.sync="dialogXGJEVisible" :close-on-click-modal="false" :close-on-press-escape="false">
      <el-form :rules="rulesXGJE" ref="xhjePopForm" :model="xgjePushData" label-position="left" label-width="100px">
        <el-form-item label="金额" prop="price" >
          <el-input v-model="xgjePushData.price" clearable @keyup.enter.native="changePriceSave"></el-input>
        </el-form-item>
        <el-form-item label="积分" prop="score" >
          <el-input v-model.number="xgjePushData.score" clearable @keyup.enter.native="changePriceSave"></el-input>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="dialogXGJEVisible = false">取消</el-button>
        <el-button type="primary" @click="changePriceSave">确定</el-button>
      </div>
    </el-dialog>
    <el-dialog title="填写发货信息" :visible.sync="dialogFAHUOVisible" :close-on-click-modal="false" :close-on-press-escape="false">
      <el-form :rules="rulesFAHUO" ref="fahuoPopForm" :model="fahuoPushData" label-position="left" label-width="100px">
        <el-form-item label="快递公司" prop="expressCompanyId" >
          <el-col :span="7">
            <el-select filterable v-model="fahuoPushData.expressCompanyId" placeholder="请选择" style="width:100%">
              <el-option v-if="item.type==0" v-for="item in expressCompanies" v-bind:key="item.id" :label="item.name" :value="item.id" />
            </el-select>
          </el-col>
        </el-form-item>
        <el-form-item label="快递单号" prop="number" >
          <el-col :span="7">
            <el-input v-model="fahuoPushData.number" clearable @keyup.enter.native="fahuoSave"></el-input>
          </el-col>
          <el-col :span="16" :offset="1" style="color:orange;">
            商家配送或无物流单号，请选择“其他快递公司”
          </el-col>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="dialogFAHUOVisible = false">取消</el-button>
        <el-button type="primary" @click="fahuoSave">确定</el-button>
      </div>
    </el-dialog>
    <Remark type="order" :refId="1*id"/> <!-- 添加本标签、import组件、components里面加入声明 -->
  </div>
</template>

<script>
import Remark from '@/components/Remark'
import { fetchExpressCompanies, traces, orderDetails, closeOrder, closeKeloop, changePrice, payOrder, payOrderOff, fahuo, fahuoDada, successOrder, orderRefund, refuse, refuseing, refuseSuccess, delReputationPic, keloopOrderLogs, fahuoKeloop, rePrint } from '@/api/apiExtOrder'
import { Message, MessageBox } from 'element-ui'
import { mapGetters } from 'vuex'

export default {  
  data() {
    return {

      kvList:[
        {k:"", v:""}
      ],


      id:undefined,
      loading:true,
      orderInfo:{},
      discountsCoupon:undefined,
      userBean:{},
      apiExtOrderLogistics:{},
      goodsList:[],
      goodsStoresList:[],
      tracesArray:[],
      keloopOrderLogsData: [],
      refunds:[],
      refundApplies:[],
      logs:[],
      reputationPics:[],
      previewSrcList: [], //评价预览大图列表
      expressCompanies:[],
      goodsCoupons:[],
      goodsCouponsPics:[],

      dialogTuikuanVisible:false,
      rulesTuikan: {
        toWhere: [
          { required: true, message: '不能为空'},
        ],        
        money: [
          { required: true, message: '不能为空'}
        ],        
      },
      tuikuanPushData:{
        id:undefined,
        toWhere:undefined,
        orderStatus: undefined,
        money:undefined,
        remark:undefined
      },

      dialogXGJEVisible:false,
      rulesXGJE: {
        price: [
          { required: true, message: '不能为空'}
        ],        
        score: [
          { required: true, message: '不能为空'},
          { type:'integer', message: '必须为数字'}
        ],        
      },
      xgjePushData:{
        id:undefined,
        price:undefined,
        score:undefined
      },

      dialogFAHUOVisible:false,
      rulesFAHUO: {
        number: [
          { required: true, message: '不能为空'},
        ],        
        expressCompanyId: [
          { required: true, message: '不能为空'},
        ],        
      },
      fahuoPushData:{
        id:undefined,
        number:undefined,
        expressCompanyId:undefined
      },

    }
  },
  components: {
    Remark
  },
  computed: {
    ...mapGetters([
      'centerUserBase'
    ])
  },
  mounted() {
    this.id = this.$route.query.id
    this.tuikuanPushData.id = this.id
    this.tuikuanPushDataTmp = Object.assign({}, this.tuikuanPushData)
    this.xgjePushData.id = this.id
    this.xgjePushDataTmp = Object.assign({}, this.xgjePushData)
    this.fahuoPushData.id = this.id
    this.fahuoPushDataTmp = Object.assign({}, this.fahuoPushData)
    this.fetchData()
    this.keloopOrderLogs()
  },
  methods: {
    fetchData() {
      orderDetails(this.id).then(response => {
        this.loading = false
        if (response.code != 0) {
          this.$message.error(response.msg);
          return
        }
        if (response.code == 0) {
          this.orderInfo = response.data.order
          this.discountsCoupon = response.data.discountsCoupon
          this.userBean = Object.assign({}, this.userBean, response.data.userBean)
          this.goodsList = response.data.goodsList
          this.goodsStoresList = response.data.orderStores
          if (this.goodsStoresList) {
            this.goodsStoresList.forEach(ele => {
              if (!ele.remark) {
                ele.remark = ''
              }
              if (!ele.day) {
                ele.day = ''
              } else {
                ele.day = ele.day.split(' ')[0]
              }
            })
          }          
          this.apiExtOrderLogistics = response.data.apiExtOrderLogistics
          this.tracesArray = response.data.tracesArray
          this.refunds = response.data.refunds
          this.refundApplies = response.data.refundApplies
          this.logs = response.data.logs
          this.reputationPics = response.data.reputationPics
          if (this.reputationPics) {
            this.previewSrcList = []
            this.reputationPics.forEach(ele => {
              this.previewSrcList.push(ele.pic)
            })
          }
          this.goodsCoupons = response.data.goodsCoupons
          this.goodsCouponsPics = []
          if (this.goodsCoupons) {
            this.goodsCoupons.forEach(ele => {
              if (ele.type == 1) {
                this.goodsCouponsPics.push(ele.coupon)
              }
            })
          }
          // 计算扩展属性
          let kvList = [];
          if (response.data.extJson) {
            Object.keys(response.data.extJson).forEach(k => {
              let aaaa = '{"k":"'+ k +'", "v":"'+ response.data.extJson[k] +'"}'
              kvList.push(JSON.parse(aaaa))
            })
          }
          if (kvList.length == 0) {
            kvList = undefined;
          }
          this.kvList = kvList
        }
      }).catch(e => {
        console.log(e);
      })
    },
    backClick() {
      this.$router.go(-1)
    },
    reSendToDada(){
      fahuoDada(this.id).then(res => {
        if (res.code == 0) {
          Message({
            message: '重发成功',
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
        console.log(e);
      })
    },
    tuikuan(){
      this.tuikuanPushData = Object.assign({}, this.tuikuanPushDataTmp)
      this.dialogTuikuanVisible = true
      this.$nextTick(() => {
        this.$refs['tuikuanPopForm'].clearValidate()
      })
    },
    tuikuanSave(){
      this.$refs['tuikuanPopForm'].validate((valid) => {
        if (valid) {
          orderRefund(this.tuikuanPushData).then((res) => {
            this.dialogTuikuanVisible = false
            if (res.code == 0) {
              Message({
                message: '退款申请成功',
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
          }).catch(e=>{
            console.error(e);
          })
        }
      })
    },
    changePrice(){
      this.xgjePushData = Object.assign({}, this.xgjePushDataTmp, {price:this.orderInfo.amountReal, score: this.orderInfo.score})
      this.dialogXGJEVisible = true
      this.$nextTick(() => {
        this.$refs['xhjePopForm'].clearValidate()
      })
    },
    changePriceSave(){
      this.$refs['xhjePopForm'].validate((valid) => {
        if (valid) {
          changePrice(this.xgjePushData).then((res) => {
            this.dialogXGJEVisible = false
            if (res.code == 0) {
              Message({
                message: '修改成功',
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
          }).catch(e=>{
            console.error(e);
          })
        }
      })
    },
    payOrder(){
      this.$confirm('即将使用用户的余额支付该笔订单, 是否继续?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        payOrder({id:this.id}).then(res => {
          if (res.code == 0) {
            Message({
              message: '支付成功',
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
        })
      }).catch((e) => {
        console.log(e);
      });
    },
    payOrderOff(){
      this.$confirm('即将修改该笔订单状态为已付款，请确保您已经线下收款, 是否继续?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        payOrderOff({id:this.id}).then(res => {
          if (res.code == 0) {
            Message({
              message: '支付成功',
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
        })
      }).catch((e) => {
        console.log(e);
      });
    },
    delReputationPic(id){
      this.$confirm('确定要删除该图片吗?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        delReputationPic(id).then(res => {
          this.fetchData()     
        })
      }).catch((e) => {
        console.log(e);
      });      
    },
    closeOrder(){
      this.$confirm('确定要关闭订单吗?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        closeOrder({id:this.id}).then(res => {
          if (res.code == 0) {
            Message({
              message: '关闭成功',
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
        })
      }).catch((e) => {
        console.log(e);
      });
    },
    rePrint(){
      this.$confirm('确定要补打小票吗?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        rePrint(this.id).then(res => {
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
        })
      }).catch((e) => {
        console.log(e);
      });
    },
    closeKeloop(){
      this.$confirm('确定要取消配送吗?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        closeKeloop(this.id).then(res => {
          if (res.code == 0) {
            Message({
              message: '取消成功',
              type: 'success',
              duration: 1 * 1000
            })
            this.keloopOrderLogs()
          } else {
            Message({
              message: res.msg,
              type: 'error',
              duration: 3 * 1000
            })
          }          
        })
      }).catch((e) => {
        console.log(e);
      });
    },
    fahuo(){
      this.fahuoPushData = Object.assign({}, this.fahuoPushDataTmp)      
      // 初始化发货信息回显 TODO
      fetchExpressCompanies().then(res => {
        if (res.code == 0) {
          this.expressCompanies = res.data
          this.expressCompanies.unshift({"code":"-1","id":-1,"name":"其他快递公司","type":0,"typeStr":"国内"})
          if (this.apiExtOrderLogistics) {
            this.fahuoPushData.number = this.apiExtOrderLogistics.trackingNumber
            this.expressCompanies.forEach(item => {
              if (item.name == this.apiExtOrderLogistics.shipperName) {
                this.fahuoPushData.expressCompanyId = item.id
              }
            })
          }
          this.dialogFAHUOVisible = true
          this.$nextTick(() => {
            this.$refs['fahuoPopForm'].clearValidate()
          })
        }
      })      
    },
    fahuoSave(){
      this.$refs['fahuoPopForm'].validate((valid) => {
        if (valid) {
          fahuo(this.fahuoPushData).then((res) => {
            this.dialogFAHUOVisible = false
            if (res.code == 0) {
              Message({
                message: '发货成功',
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
          }).catch(e=>{
            console.error(e);
          })
        }
      })
    },
    successOrder(){
      this.$confirm('确定要将该笔订单设置为交易成功吗?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        successOrder({id:this.id}).then(res => {
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
        })
      }).catch((e) => {
        console.log(e);
      });
    },
    refundAppliesRefuse(applyId){
      this.$confirm('是否驳回用户的本次售后申请?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        refuse(this.id, applyId).then(res => {
          Message({
            message: '操作成功',
            type: 'success',
            duration: 1 * 1000
          })
          this.fetchData()
        })
      }).catch(() => {});
    },
    refundAppliesRefuseing(applyId){
      this.$confirm('是否将本次售后申请设为处理中?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        refuseing(this.id, applyId).then(res => {
          Message({
            message: '操作成功',
            type: 'success',
            duration: 1 * 1000
          })
          this.fetchData()
        })
      }).catch(() => {});
    },
    refundAppliesRefuseSuccess(applyId){
      this.$confirm('是否将本次售后申请设为成功?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        refuseSuccess(this.id, applyId).then(res => {
          Message({
            message: '操作成功',
            type: 'success',
            duration: 1 * 1000
          })
          this.fetchData()
        })
      }).catch(() => {});
    },
    keloopOrderLogs() {
      keloopOrderLogs(this.id).then(res => {
        if (res.code == 0) {
          this.keloopOrderLogsData = res.data
        }
      })
    },
    fahuoKeloop() {
      fahuoKeloop(this.id).then(res => {
        if (res.code == 0) {
          this.$alert("已提交，请稍等几秒后重新查看订单详情")
        }
      })
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
.order-title {
  margin-top: 18px;
  font-size: 16px;
  border-bottom: 1px solid #ccc;
  padding-bottom: 5px;
}
</style>
