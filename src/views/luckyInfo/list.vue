<template>
  <div class="app-container">
    
    <div class="filter-container">
      <el-select clearable style="width: 200px" class="filter-item" v-model="searchData.type" placeholder="抽奖类型">
        <el-option label="到期开奖" value="0"></el-option>
        <el-option label="实时开奖" value="1"></el-option>
      </el-select>
      <el-input clearable @keyup.enter.native="fetchData" style="width: 200px;" class="filter-item" placeholder="抽奖ID" v-model="searchData.id">
      </el-input>
      <el-input clearable @keyup.enter.native="fetchData" style="width: 200px;" class="filter-item" placeholder="标题" v-model="searchData.nameLike">
      </el-input>
      <el-select clearable style="width: 200px" class="filter-item" v-model="searchData.status" placeholder="状态">
        <el-option label="进行中" value="0"></el-option>
        <el-option label="等待开奖" value="1"></el-option>
        <el-option label="已结束" value="2"></el-option>
      </el-select>
      <el-date-picker type="date" placeholder="发布时间起" v-model="searchData.dateAddBegin" style="width: 200px;" class="filter-item"></el-date-picker>
      <el-date-picker type="date" placeholder="发布时间止" v-model="searchData.dateAddEnd" style="width: 200px;" class="filter-item"></el-date-picker>
      <el-button size="medium" class="filter-item" type="primary" icon="el-icon-search" @click="fetchData">搜索</el-button>
      <el-button size="medium" class="filter-item" style="margin-left: 10px;" @click="handleCreate" type="success" icon="el-icon-plus">添加</el-button>
    </div>
    
    <el-table :data="list" v-loading="listLoading" element-loading-text="Loading" fit highlight-current-row empty-text="暂无数据" @selection-change="handleSelectionChange">
      <el-table-column label="项目ID/标题">
        <template slot-scope="scope">
           {{ scope.row.id }} <br> {{ scope.row.title }}
        </template>
      </el-table-column>
      <el-table-column prop="joinNumber" label="参与人数"></el-table-column>
      <el-table-column label="开奖设置">
        <template slot-scope="scope">
          <div v-if="scope.row.type == 0">
            第 {{ scope.row.awardIdx }} 期 <br> {{ scope.row.awardTime }} 开奖
          </div>          
          <div v-if="scope.row.type == 1">
            万分之{{ scope.row.awardIdx }}中奖概率 <br> {{ scope.row.awardTime }} 截止
          </div>          
        </template>
      </el-table-column>
      <el-table-column prop="awardUid" label="中奖用户编号"></el-table-column>
      <el-table-column label="中奖信息">
        <template slot-scope="scope">
          <div v-if="scope.row.awardCode">开奖号码 {{ scope.row.awardCode }}</div>
          <div v-if="scope.row.awardNumber">中奖号码 {{ scope.row.awardNumber }}</div>
        </template>
      </el-table-column>
      <el-table-column label="状态" align="center">
        <template slot-scope="scope">
          <p>
            <el-tag v-if="scope.row.isUse" type="success">启用</el-tag>
            <el-tag v-else type="danger">停用</el-tag>
          </p>
          <p>
            <el-tag v-if="scope.row.status == 0" type="success">进行中</el-tag>
            <el-tag v-if="scope.row.status == 1" type="warning">等待开奖</el-tag>
            <el-tag v-if="scope.row.status == 2" type="danger">已结束</el-tag>
          </p>
        </template>
      </el-table-column>
      <el-table-column label="添加/更新时间" width="160">
        <template slot-scope="scope">
          {{scope.row.dateAdd}}<br>{{scope.row.dateUpdate?scope.row.dateUpdate:'-'}}
        </template>
      </el-table-column>
      <el-table-column label="操作">
        <template slot-scope="scope">
          <el-button type="text" @click="handleUpdate(scope.row.id)">编辑</el-button>
          <el-button v-if="scope.row.status == 0" type="text" @click="stopData(scope.row.id)" style="color:orange">截止</el-button>
          <el-button v-if="scope.row.status == 1" type="text" @click="award(scope.row.id)" style="color:orange">开奖</el-button>
          <el-button type="text" @click="delData(scope.row.id)" style="color:red">删除</el-button>
        </template>
      </el-table-column>
    </el-table>
    <el-pagination
      @size-change="handleSizeChange"
      @current-change="handleCurrentChange"
      :current-page="page"
      :page-sizes="[10, 20, 50, 100]"
      :page-size="pageSize"
      layout="total, sizes, prev, pager, next, jumper"
      :total="totalRow" style="margin-top:20px;">
    </el-pagination>

    <el-dialog :title="pushData.dialogTitle" :visible.sync="pushData.dialogFormVisible" :close-on-click-modal="false" :close-on-press-escape="false">
      <el-form :rules="rules" ref="addEditPopForm" :model="pushData" label-position="left" label-width="140px">
        <el-form-item label="标题" prop="title" >
          <el-input v-model="pushData.title" clearable @keyup.enter.native="handleCreateSave"></el-input>
        </el-form-item>
        <el-form-item label="状态" prop="isUse" >
          <el-col :span="6">
            <el-radio v-model="pushData.isUse" :label="true">启用</el-radio>
            <el-radio v-model="pushData.isUse" :label="false">停用</el-radio>
          </el-col>
          <el-col :span="18">&nbsp;&nbsp;&nbsp;为抽奖客观公正，开奖号码使用国彩-重庆时时彩的开奖号码加成</el-col>
        </el-form-item>
        <el-form-item label="开奖方式" prop="type" >
          <el-col :span="6">
            <el-select v-model="pushData.type">
              <el-option label="到期开奖" :value="0"></el-option>
              <el-option label="实时开奖" :value="1"></el-option>
            </el-select>
          </el-col>
          <el-col :span="18">&nbsp;&nbsp;&nbsp;为抽奖客观公正，开奖号码使用国彩-重庆时时彩的开奖号码加成</el-col>
        </el-form-item>
        <el-form-item label="抽奖介绍文案ID" prop="newsId">
          <el-col :span="6">
            <el-input v-model.number="pushData.newsId" clearable @keyup.enter.native="handleCreateSave"></el-input>
          </el-col>
          <el-col :span="18">&nbsp;&nbsp;&nbsp;抽奖介绍文案，填写CMS模块中的文章编号</el-col>
        </el-form-item>
        <el-form-item label="中奖文案ID" prop="virtualTraderId">
          <el-col :span="6">
            <el-input v-model.number="pushData.virtualTraderId" clearable @keyup.enter.native="handleCreateSave"></el-input>
          </el-col>
          <el-col :span="18">&nbsp;&nbsp;&nbsp;中奖用户可查看的文案内容，填写知识交易的项目id</el-col>
        </el-form-item>
        <el-form-item label="开奖日期" v-if="pushData.type == 0">
          <el-col :span="6">
            <el-date-picker v-model="pushData.awardTime" clearable type="date" placeholder="点击选择" value-format="yyyy-MM-dd" />
          </el-col>
        </el-form-item>
        <el-form-item label="截止日期" v-if="pushData.type == 1">
          <el-col :span="6">
            <el-date-picker v-model="pushData.awardTime" clearable type="datetime" placeholder="点击选择" value-format="yyyy-MM-dd HH:mm:ss" />
          </el-col>
        </el-form-item>
        <el-form-item label="开奖时间" prop="awardIdx" v-if="pushData.type == 0">
          <el-col :span="6">
            <el-select v-model="pushData.awardIdx" placeholder="请选择">
              <el-option v-for="(item, index) in awardTimeList" :key="index" :label="'第 '+ (index+24) +' 期 ' + item" :value="index+24"></el-option>
            </el-select>
          </el-col>
          <el-col :span="18">&nbsp;&nbsp;&nbsp;为抽奖客观公正，开奖号码使用国彩-重庆时时彩的开奖号码加成</el-col>
        </el-form-item>
        <el-form-item label="中奖概率" prop="awardIdx" v-if="pushData.type == 1">
          <el-col :span="6">
            <el-input v-model="pushData.awardIdx" @keyup.enter.native="handleCreateSave"></el-input>
          </el-col>
          <el-col :span="18">&nbsp;&nbsp;&nbsp;比如，万分之一中奖概率，这里就填写 1 </el-col>
        </el-form-item>
        <el-form-item label="扩展属性">
          <div v-for="kv in kvList" v-bind:key="kv.k" style="padding-bottom:10px;">
            <el-col :span="4">
              <el-form-item>
                <el-input v-model="kv.k"></el-input>
              </el-form-item>
            </el-col>
            <el-col :span="1" align="center">:</el-col>  
            <el-col :span="4">
              <el-form-item>
                <el-input v-model="kv.v"></el-input>
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
      <div slot="footer" class="dialog-footer">
        <el-button @click="pushData.dialogFormVisible = false">取消</el-button>
        <el-button type="primary" @click="handleCreateSave">确定</el-button>
      </div>
    </el-dialog>

  </div>
</template>

<script>
import {
  fetchDataList,
  infoData,
  delData,
  saveData,
  stopData,
  award
} from "@/api/luckyInfo";
import { Message } from "element-ui";

export default {
  data() {
    return {

      kvList: [
        { k: '', v: '' }
      ],

      page: 1,
      pageSize: 10,
      totalRow: 0,

      rules: {
        title: [{ required: true, message: "不能为空" }],
        newsId: [
          { required: true, message: "不能为空" },
          { type: "integer", message: "必须为数字" }
        ],
        virtualTraderId: [
          { required: true, message: "不能为空" },
          { type: "integer", message: "必须为数字" }
        ],
        awardIdx: [{ required: true, message: "不能为空" }],
        minPrice: [
          { required: true, message: "不能为空" },
          { type: "number", message: "必须为数字" }
        ],
        helpPriceMin: [
          { required: true, message: "不能为空" },
          { type: "number", message: "必须为数字" }
        ],
        helpPriceMax: [
          { required: true, message: "不能为空" },
          { type: "number", message: "必须为数字" }
        ],
        isUse: [{ required: true, message: '不能为空' }],
        status: [{ required: true, message: "不能为空" }],
        dateAddStr: [{ required: true, message: "不能为空" }],
        dateEndStr: [{ required: true, message: "不能为空" }]
      },

      searchData: {
        id: undefined,
        goodsId: undefined,
        status: undefined,
        dateAddBegin: undefined,
        dateAddEnd: undefined,
        dateEndBegin: undefined,
        dateEndEnd: undefined
      },

      pushData: {
        dialogTitle: undefined,
        dialogFormVisible: false,

        id: undefined,
        type: 1,
        isUse: true,
        awardTime: new Date()
      },

      multipleSelection: [],
      list: null,
      listLoading: true,
      awardTimeList: []
    };
  },
  created() {
    this.pushDataTmp = Object.assign({}, this.pushData);
    this.fetchData();
    // 时时彩开奖时间设置
    for (let h = 10; h <= 22; h++) {
      for (let m = 0; m <= 50; m = m + 10) {
        if (h == 22 && m > 0) {
        } else {
          this.awardTimeList.push(h + ":" + (m == 0 ? "0" : "") + m);
        }
      }
    }
  },
  mounted() {},
  methods: {
    handleSizeChange(val) {
      this.pageSize = val;
      this.fetchData();
    },
    handleCurrentChange(val) {
      this.page = val;
      this.fetchData();
    },
    handleSelectionChange(val) {
      this.multipleSelection = val;
    },
    fetchData() {
      this.list = null;
      this.listLoading = true;
      fetchDataList(this.page, this.pageSize, this.searchData).then(
        response => {
          if (response.code == 0) {
            this.list = response.data.result;
            this.totalRow = response.data.totalRow;
          }
          this.listLoading = false;
        }
      );
    },
    handleCreate() {
      this.pushData = Object.assign({}, this.pushDataTmp);
      this.pushData.dialogTitle = "增加抽奖设置";
      this.pushData.dialogFormVisible = true;
      this.$nextTick(() => {
        this.$refs["addEditPopForm"].clearValidate();
      });
    },
    handleUpdate(id) {
      infoData(id).then(res => {
        if (res.code !== 0) {
          this.$message.error(res.msg)
        } else {
          this.pushData = Object.assign({}, this.pushDataTmp, res.data.info, {
            dateAddStr: res.data.info.dateAdd,
            dateEndStr: res.data.info.dateEnd
          })
          // 计算扩展属性
          let kvList = []
          if (res.data.extJson) {
            Object.keys(res.data.extJson).forEach(k => {
              const aaaa = '{"k":"' + k + '", "v":"' + res.data.extJson[k] + '"}'
              kvList.push(JSON.parse(aaaa))
            })
          }
          if (kvList.length === 0) {
            kvList = [{ k: '', v: '' }]
          }
          this.kvList = kvList
          this.pushData.dialogTitle = '修改抽奖设置'
          this.pushData.dialogFormVisible = true
          this.$nextTick(() => {
            this.$refs['addEditPopForm'].clearValidate()
          })
        }
      }).catch(e => {
        console.error(e)
      })
    },
    handleCreateSave() {
      let pushDataDetailsJsonStr = {}
      this.kvList.forEach(item => {
        if (item.k && item.v) {
          const aaaa = '{"' + item.k + '":"' + item.v + '"}'
          pushDataDetailsJsonStr = Object.assign({}, pushDataDetailsJsonStr, JSON.parse(aaaa))
        }
      })
      this.pushData.extJsonStr = JSON.stringify(pushDataDetailsJsonStr)
      this.$refs['addEditPopForm'].validate(valid => {
        if (valid) {
          this.pushData.dateEnd = this.pushData.awardTime
          saveData(this.pushData)
            .then(res => {
              this.pushData.dialogFormVisible = false
              if (res.code === 0) {
                this.$message({
                  message: '操作成功',
                  type: 'success'
                })
                this.fetchData()
              } else {
                this.$message.error(res.msg)
              }
            })
            .catch(e => {
              console.error(e)
            })
        }
      })
    },
    delData(id) {
      this.$confirm("删除无法恢复, 是否继续?", "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning"
      })
        .then(() => {
          delData(id).then(res => {
            Message({
              message: "删除成功",
              type: "success",
              duration: 1 * 1000
            });
            this.fetchData();
          });
        })
        .catch(() => {});
    },
    stopData(id) {
      this.$confirm("截止无法恢复, 是否继续?", "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning"
      })
        .then(() => {
          stopData(id).then(res => {
            Message({
              message: "操作成功",
              type: "success",
              duration: 1 * 1000
            });
            this.fetchData();
          });
        })
        .catch(() => {});
    },
    award(id) {
      this.$prompt("请输入5位数的时时彩开奖号码", "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消"
      })
        .then(({ value }) => {
          award(id, value).then(response => {
            if (response.code === 0) {
              this.$message({
                type: "success",
                message: "开奖成功"
              });
            } else {
              this.$message({
                type: "error",
                message: response.msg
              });
            }
          });
        })
        .catch(e => {
          console.error(e);
        });
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
      })
      if (newArray.length === 0) {
        newArray.push({ k: '', v: '' })
      }
      this.kvList = newArray
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
</style>
