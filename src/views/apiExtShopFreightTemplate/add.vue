<template>
  <div class="app-container">
    <el-form :rules="rules" ref="addEditPopForm" :model="pushData" label-width="120px">
      <el-form-item label="名称" prop="name">
        <el-input v-model.number="pushData.name" clearable></el-input>
      </el-form-item>
      <el-form-item label="是否包邮" prop="isFree" >
        <el-select v-model="pushData.isFree" placeholder="请选择">
          <el-option label="包邮" value="true"></el-option>
          <el-option label="不包邮" value="false"></el-option>
        </el-select>
      </el-form-item>
      <el-form-item label="计价方式" prop="feeType" >
        <el-select clearable v-model="pushData.feeType" placeholder="请选择">
          <el-option label="按件数" value="0"></el-option>
          <el-option label="按重量" value="1"></el-option>
          <!-- <el-option label="按体积" value="2"></el-option> -->
        </el-select>
      </el-form-item>
      <el-form-item label="运费设置">
        <div v-for="feeType in feeTypes" v-bind:key="feeType.type">
          <el-checkbox v-model="feeType.isChecked"> {{feeType.name}} </el-checkbox>
          <div v-if="feeType.isChecked">
            <el-form-item v-for="(detail, index) in feeType.details" v-bind:key="detail.name" style="margin-top:10px;">
              <div style="width: 150px;overflow: hidden;white-space: nowrap;text-overflow: ellipsis;float: left;">{{detail.names.join()}}</div>&nbsp;
              <el-input v-model.number="detail.firstNumber" style="width:80px;"></el-input>&nbsp;
              <font>{{ pushData.feeType == 0 ? '件' : 'KG' }}内</font>&nbsp;
              <el-input v-model="detail.firstAmount" style="width:80px;"></el-input>&nbsp;
              <font>元，每增加</font>&nbsp;
              <el-input v-model.number="detail.addNumber" style="width:80px;"></el-input>&nbsp;
              <font>{{ pushData.feeType == 0 ? '件' : 'KG' }}，增加运费</font>&nbsp;
              <el-input v-model="detail.addAmount" style="width:80px;"></el-input>&nbsp;
              <font>元</font>&nbsp;&nbsp;&nbsp;
              <el-button v-if="detail.editable" type="text" @click="addCityException(feeType.type, index)">修改</el-button>
              <el-button v-if="detail.editable" type="text" style="color:red" @click="deleteCityNode(feeType.type, index)">删除</el-button>
            </el-form-item>
            <el-button type="text" @click="addCityException(feeType.type, 0)">为指定地区城市设置运费</el-button>
          </div>
        </div>
      </el-form-item>
      <el-form-item>
        <el-button type="primary" @click="onSubmit">提交</el-button>
        <el-button @click="onCancel">取消</el-button>
      </el-form-item>
    </el-form>

    <el-dialog :title="dialogTitle" :visible.sync="dialogFormVisible" :close-on-click-modal="false" :close-on-press-escape="false">
      <el-tree
        ref="cityTree"
        :props="cityTreeProps"
        :load="loadCityData"
        node-key="id"
        lazy
        show-checkbox>
      </el-tree>
      <div slot="footer" class="dialog-footer">
        <el-button @click="dialogFormVisible = false">取消</el-button>
        <el-button type="primary" @click="handleCreateSave">确定</el-button>
      </div>
    </el-dialog>

  </div>
</template>

<script>
import { saveData, infoData } from "@/api/apiExtShopFreightTemplate";
import { fetchProvinceList, fetchChildList } from "@/api/city";
import { Message, MessageBox } from "element-ui";

let vm;

export default {
  data() {
    return {
      cityTreeProps: {
        label: "name"
      },
      feeTypes: [
        {
          type: 0,
          name: "快递",
          isChecked: false,
          details: [
            {
              names: ["默认运费"],
              cityIds: ["0"],
              firstNumber: 1,
              firstAmount: 5,
              addNumber: 1,
              addAmount: 5
            }
          ]
        },
        {
          type: 1,
          name: "EMS",
          isChecked: false,
          details: [
            {
              names: ["默认运费"],
              cityIds: ["0"],
              firstNumber: 1,
              firstAmount: 5,
              addNumber: 1,
              addAmount: 5
            }
          ]
        },
        {
          type: 2,
          name: "平邮",
          isChecked: false,
          details: [
            {
              names: ["默认运费"],
              cityIds: ["0"],
              firstNumber: 1,
              firstAmount: 5,
              addNumber: 1,
              addAmount: 5
            }
          ]
        }
      ],

      rules: {
        name: [{ required: true, message: "不能为空" }],
        isFree: [{ required: true, message: "不能为空" }],
        feeType: [{ required: true, message: "不能为空" }]
      },

      pushData: {
        id: undefined,
        name: undefined,
        isFree: "true",
        feeType: "0"
      },

      dialogTitle: undefined,
      dialogFormVisible: false,

      curAddCityExceptionIndex: undefined,
      cityExceptionEditIndex: undefined
    };
  },
  mounted() {
    vm = this;
    if (this.$route.query.id) {
      infoData(this.$route.query.id)
        .then(res => {
          if (res.code != 0) {
            Message({
              message: res.msg,
              type: "error",
              duration: 3 * 1000
            });
            this.$router.push({ path: "/user/apiExtShopFreightTemplate/list" });
          } else {
            this.pushData = Object.assign({}, res.data.info, {
              isFree: "" + res.data.info.isFree,
              feeType: "" + res.data.info.feeType
            });
            res.data.details.forEach(detail => {
              vm.feeTypes[detail.type].isChecked = true;
              const detailDefaultObj = {
                names: ["默认运费"],
                cityIds: ["0"],
                firstNumber: detail.firstNumber,
                firstAmount: detail.firstAmount,
                addNumber: detail.addNumber,
                addAmount: detail.addAmount
              };
              vm.feeTypes[detail.type].details = [];
              vm.feeTypes[detail.type].details.push(detailDefaultObj);
              let last_number_amount = "";
              res.data.exceptions.forEach(exception => {
                if (detail.id == exception.detailId) {
                  const _last_number_amount =
                    exception.firstNumber +
                    "-" +
                    exception.firstAmount +
                    "-" +
                    exception.addNumber +
                    "-" +
                    exception.addAmount;
                  if (last_number_amount != _last_number_amount) {
                    const tempObj = {
                      editable: true,
                      names: [exception.regionStr],
                      cityIds: [exception.regionId],
                      firstNumber: exception.firstNumber,
                      firstAmount: exception.firstAmount,
                      addNumber: exception.addNumber,
                      addAmount: exception.addAmount
                    };
                    vm.feeTypes[detail.type].details.push(tempObj);
                    last_number_amount = _last_number_amount;
                  } else {
                    const _len = vm.feeTypes[detail.type].details.length;
                    vm.feeTypes[detail.type].details[_len - 1].names.push(
                      exception.regionStr
                    );
                    vm.feeTypes[detail.type].details[_len - 1].cityIds.push(
                      exception.regionId
                    );
                  }
                }
              });
            });
          }
        })
        .catch(e => {
          console.error(e);
        });
    }
  },
  methods: {
    onSubmit() {
      let pushDataDetailsJsonStr = [];
      this.feeTypes.forEach(item => {
        if (item.isChecked) {
          item.details.forEach(detail => {
            detail.cityIds.forEach(cityId => {
              let tmpObj = Object.assign({}, detail, {
                type: item.type,
                cityId: cityId
              });
              pushDataDetailsJsonStr.push(tmpObj);
            });
          });
        }
      });
      this.pushData.detailsJsonStr = JSON.stringify(pushDataDetailsJsonStr);
      this.$refs["addEditPopForm"].validate(valid => {
        if (valid) {
          saveData(this.pushData)
            .then(res => {
              this.pushData.dialogFormVisible = false;
              if (res.code == 0) {
                Message({
                  message: "操作成功",
                  type: "success",
                  duration: 1 * 1000
                });
                this.$router.push({
                  path: "/user/apiExtShopFreightTemplate/list"
                });
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
        }
      });
    },
    onCancel() {
      this.$router.back();
    },
    addCityException(feeType, index) {
      this.curAddCityExceptionIndex = feeType;
      this.dialogTitle = "请选择地区";
      this.dialogFormVisible = true;
      if (index == 0) {
        // 添加
        this.cityExceptionEditIndex = undefined;
        this.$nextTick(() => {
          this.$refs.cityTree.setCheckedKeys([]);
        });
      } else {
        // 修改
        this.cityExceptionEditIndex = index;
        this.$nextTick(() => {
          this.$refs.cityTree.setCheckedKeys(
            this.feeTypes[feeType].details[index].cityIds
          );
        });
      }
    },
    handleCreateSave() {
      // console.log(this.$refs.cityTree.getCheckedKeys());
      // console.log(this.$refs.cityTree.getCheckedNodes());
      const checkedNodes = this.$refs.cityTree.getCheckedNodes();
      if (!checkedNodes || checkedNodes.length == 0) {
        this.$message({
          message: "请至少选择一个地区",
          type: "error"
        });
        return;
      }
      const addExceptionObj = {
        editable: true,
        names: [],
        cityIds: [],
        firstNumber: 1,
        firstAmount: 5,
        addNumber: 1,
        addAmount: 5
      };
      checkedNodes.forEach(node => {
        addExceptionObj.cityIds.push(node.id);
        addExceptionObj.names.push(node.name);
      });
      if (this.cityExceptionEditIndex == undefined) {
        this.feeTypes[this.curAddCityExceptionIndex].details.push(
          addExceptionObj
        );
      } else {
        this.feeTypes[this.curAddCityExceptionIndex].details.splice(
          this.cityExceptionEditIndex,
          1,
          addExceptionObj
        )
      }
      this.dialogFormVisible = false
    },
    loadCityData(node, resolve) {
      if (node.level >= 3) {
        resolve([])
        return
      }
      if (node.level === 0) {
        fetchProvinceList().then(res => {
          resolve(res.data)
        })
      } else {
        fetchChildList(node.data.id).then(res => {
          if (res.code === 0) {
            resolve(res.data)
          } else {
            resolve([])
          }
        })
      }
    },
    deleteCityNode(feeType, index) {
      this.feeTypes[feeType].details.splice(index, 1);
    }
  }
};
</script>

<style scoped>
.line {
  text-align: center;
}
</style>

