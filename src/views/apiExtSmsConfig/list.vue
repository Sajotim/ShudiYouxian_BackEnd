<template>
  <div class="app-container">

    <div class="filter-container">
      <el-button size="small" type="primary" icon="el-icon-plus" @click="handleCreate('alidayu')">阿里大于</el-button>
      <el-button size="small" type="primary" icon="el-icon-plus" @click="handleCreate('aliyun')">阿里云</el-button>
      <el-button size="small" type="primary" icon="el-icon-plus" @click="handleCreate('18sms')">示远科技</el-button>
      <el-button size="small" type="primary" icon="el-icon-plus" @click="handleCreate('saiyou')">赛邮·云通讯</el-button>
      <el-button size="small" type="primary" icon="el-icon-plus" @click="handleCreate('cr6868')">创瑞</el-button>
      <el-button size="small" type="primary" icon="el-icon-plus" @click="handleCreate('yunzhixun')">云之讯</el-button>
      <el-button size="small" type="primary" icon="el-icon-plus" @click="handleCreate('tencentCloud')">腾讯云</el-button>
      <el-button size="small" type="primary" icon="el-icon-plus" @click="handleCreate('bamikeji')">八米科技</el-button>
      <el-button size="small" type="primary" icon="el-icon-plus" @click="handleCreate('zthysms')">上海助通</el-button>
    </div>

    <el-table :data="list" v-loading="listLoading" element-loading-text="Loading" fit highlight-current-row
              empty-text="暂无数据">
      <el-table-column label="编号/通道/类型" width="120" align="center">
        <template slot-scope="scope">
          {{scope.row.id}}<br>
          {{scope.row.typeStr}}<br>
          <el-tag type="success" v-if="scope.row.mod == 0">验证码</el-tag>
          <el-tag type="danger" v-if="scope.row.mod == 1">其他短信</el-tag>
        </template>
      </el-table-column>
      <el-table-column label="账号信息">
        <template slot-scope="scope">
          <p>{{scope.row.userName}}</p>
          <p>{{scope.row.pwd}}</p>
        </template>
      </el-table-column>
      <el-table-column prop="signName" label="签名"></el-table-column>
      <el-table-column prop="templateContent" label="短信内容"></el-table-column>      
      <el-table-column label="状态">
        <template slot-scope="scope" align="center">
          <el-tag type="success" v-if="scope.row.isUse">启用</el-tag>
          <el-tag type="danger" v-else>停用</el-tag>
          <el-tag type="danger" v-if="scope.row.isNeedPiccode">需要图形验证码</el-tag>
        </template>
      </el-table-column>
      <el-table-column prop="dateAdd" label="添加时间" width="160">
        <template slot-scope="scope">
          <p>{{scope.row.dateAdd}}</p>
          <p>{{scope.row.dateUpdate?scope.row.dateUpdate:"-"}}</p>
        </template>
      </el-table-column>
      <el-table-column label="操作" width="80px">
        <template slot-scope="scope">
          <el-button type="text" @click="handleUpdate(scope.row.id)">编辑</el-button>
          <br/>
          <el-button type="text" @click="delData(scope.row.id)" style="color:red">删除</el-button>
        </template>
      </el-table-column>
    </el-table>

  </div>
</template>

<script>
import { fetchDataList, delData } from "@/api/apiExtSmsConfig";
import { Message } from "element-ui";
import { mapGetters } from "vuex";

export default {
  computed: {
    ...mapGetters(["centerUserBase"])
  },
  data() {
    return {
      rules: {},

      list: null,
      listLoading: true
    };
  },
  activated() {
    this.fetchData();
  },
  methods: {
    fetchData() {
      this.list = null;
      this.listLoading = true;
      fetchDataList(this.searchData).then(response => {
        if (response.code === 0) {
          this.list = response.data;
          this.list.forEach(element => {
            if (element.type === "aliyun") {
              element.templateContent = element.templateData;
            }
          });
        }
        this.listLoading = false;
      });
    },
    handleCreate(val) {
      this.$router.push({
        path: "/user/apiExtSmsConfig/add",
        query: { type: val }
      });
    },
    handleUpdate(id) {
      this.$router.push({
        path: "/user/apiExtSmsConfig/add",
        query: { id: id }
      });
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
              duration: 1000
            });
            this.fetchData();
          });
        })
        .catch(() => {});
    }
  }
};
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

.el-range-editor.el-input__inner {
  padding: 7px 11px;
}
</style>
