<template>
    <div class="app-container">
        <div class="filter-container">
            <el-input clearable @keyup.enter.native="fetchData" style="width: 200px;" class="filter-item" placeholder="类型" v-model="searchData.type"></el-input>
            <el-input clearable @keyup.enter.native="fetchData" style="width: 200px;" class="filter-item" placeholder="关联id" v-model="searchData.refId"></el-input>
            <el-date-picker
                v-model="dateAdd"
                type="datetimerange"
                @change="handleDateAdd"
                align="center"
                start-placeholder="添加时间起"
                end-placeholder="添加时间止"
                :default-time="['00:00:00', '23:59:59']"
                :picker-options="pickerOptions">
            </el-date-picker>
            <el-button class="filter-item" size="medium" type="primary" icon="el-icon-search" @click="fetchData">搜索</el-button>
            <el-button class="filter-item" size="medium" style="margin-left: 10px;" @click="addJson" type="success"
                        icon="el-icon-edit">添加
            </el-button>
        </div>

        <el-table :data="jsonList" v-loading="listLoading" element-loading-text="Loading" fit highlight-current-row empty-text="暂无数据" @selection-change="selectJsonChange">
            <el-table-column type="selection" align="center" width="55" row-key="id"></el-table-column>
            <el-table-column prop="uid" label="用户信息" width="150px">
                <template slot-scope="scope">
                    {{scope.row.mobile?scope.row.mobile:'-'}}<br>
                    {{scope.row.nick?scope.row.nick:'-'}}
                </template>
            </el-table-column>
            <el-table-column prop="type" label="类型" width="80px"></el-table-column>
            <el-table-column prop="refId" label="关联id" width="110px">
                <template slot-scope="scope">
                    <span v-if="!scope.row.refId">-</span>
                    <span v-else>{{scope.row.refId}}</span>
                </template>
            </el-table-column>
            <el-table-column prop="content" label="Json数据"></el-table-column>
            <el-table-column prop="dateAdd" label="时间日期" width="110px"></el-table-column>
            <el-table-column label="操作" width="100px">
                <template slot-scope="scope">
                    <el-button type="text" @click="setJsonData(scope.row)">编辑</el-button>
                    <el-button type="text" @click="delData(scope.row.id)">删除</el-button>
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




        <el-button style='margin-top:20px' type="danger" @click="delDataMore">批量删除</el-button>

        <el-dialog title="维护数据" :visible.sync="saveJsonData.isdlg">
            <el-form ref="form" :model="saveJsonData.formData" label-width="120px">
                <el-form-item label="类型">
                    <el-input v-model="saveJsonData.formData.type"></el-input>
                </el-form-item>
                <el-form-item label="关联id">
                    <el-input v-model="saveJsonData.formData.refId"></el-input>
                </el-form-item>
                <el-form-item label="Json数据">
                    <el-input type="textarea" v-model="saveJsonData.formData.content" :rows="10"></el-input>
                </el-form-item>
            </el-form>
            <div slot="footer" class="dialog-footer">
                <el-button type="primary" @click="saveJson(saveJsonData.formData)">保 存</el-button>
            </div>
        </el-dialog>

        <el-dialog title="添加Json数据" :visible.sync="addJsonData.isdlg">
            <el-form ref="addJson" :rules="addJsonData.change" :model="addJsonData.formData" label-width="120px">
                <el-form-item label="类型" prop="type">
                    <el-input v-model="addJsonData.formData.type" placeholder="自定义填写，最多32个字符，可不填"></el-input>
                </el-form-item>
                <el-form-item label="关联id" prop="refId">
                    <el-input v-model.number="addJsonData.formData.refId" placeholder="数字格式，关联的数字编号，可不填"></el-input>
                </el-form-item>
                <el-form-item label="Json数据" prop="content">
                    <el-input type="textarea" v-model="addJsonData.formData.content" :rows="10"></el-input>
                </el-form-item>
            </el-form>
            <div slot="footer" class="dialog-footer">
                <el-button type="primary" @click="addJsonFn(addJsonData.formData)">添 加</el-button>
            </div>
        </el-dialog>
    </div>
</template>

<script>
    import {fetchDataList,saveData,delData,infoData} from '@/api/apiExtJson';
    import { Message, MessageBox } from 'element-ui';
    export default{
        data(){
            return{
                //页数
                page:1,
                //每一页条数
                pageSize:10,
                //数据条数
                totalRow:0,
                //Json数据添加时间
                dateAdd:'',
                //最近时间选项
                pickerOptions: {
                    shortcuts: [{
                    text: '最近一周',
                    onClick(picker) {
                        const end = new Date();
                        const start = new Date();
                        start.setTime(start.getTime() - 3600 * 1000 * 24 * 7);
                        picker.$emit('pick', [start, end]);
                    }
                    }, {
                    text: '最近一个月',
                    onClick(picker) {
                        const end = new Date();
                        const start = new Date();
                        start.setTime(start.getTime() - 3600 * 1000 * 24 * 30);
                        picker.$emit('pick', [start, end]);
                    }
                    }, {
                    text: '最近三个月',
                    onClick(picker) {
                        const end = new Date();
                        const start = new Date();
                        start.setTime(start.getTime() - 3600 * 1000 * 24 * 90);
                        picker.$emit('pick', [start, end]);
                    }
                    }]
                },
                //需要查询的数据
                searchData:{
                    refId:undefined,
                    type:undefined,
                    dateAddBegin:undefined,
                    dateAddEnd:undefined,
                },
                //json数据列表
                jsonList:null,
                //动画
                listLoading:true,
                //编辑数据
                saveJsonData:{
                    //编辑框的显示隐藏
                    isdlg:false,
                    formData:{
                        id:undefined,
                        type:undefined,
                        refId:undefined,
                        content:undefined
                    }
                },
                //选择的表格数据
                selectJsonData:[],
                //添加的Json数据
                addJsonData:{
                    isdlg:false,
                    formData:{
                        type:undefined,
                        refId:undefined,
                        content:undefined
                    },
                    change:{
                        refId:[
                            { type: 'number', message: '年龄必须为数字值'}
                        ],
                        content: [
                            { required: true, message: '请填写Json数据', trigger: 'blur' }
                        ],
                    }
                }
            }
        },
        methods:{
            //改变要查询的数据
            handleDateAdd(val) {
                this.searchData.dateAddBegin = val?val[0]:undefined;
                this.searchData.dateAddEnd = val?val[1]:undefined;
            },
            handleSelectionChange(val) {
                this.multipleSelection = val
            },
            //获取列表数据
            fetchData() {
                this.list = null
                this.listLoading = true
                fetchDataList(this.page, this.pageSize, this.searchData).then(res => {
                    this.totalRow = 0
                    if (res.code === 0) {
                        this.totalRow = res.data.totalRow
                        this.jsonList = res.data.result
                        const userMap = res.data.userMap                        
                        this.jsonList.forEach(ele => {
                        if (ele.uid && ele.uid > 0) {
                            const _userMap = userMap[ele.uid]
                            if (_userMap) {
                                ele.mobile = _userMap.mobile
                                ele.nick = _userMap.nick
                            }
                        }
                    })
                        
                    }else if(res.code === 700){
                        this.jsonList = []
                    }
                    this.listLoading = false
                })
            },
            //添加数据按钮
            addJson(){
                this.addJsonData.isdlg = true;
                //重置添加表单
                if(this.$refs.addJson){
                    this.$refs.addJson.resetFields();
                }
                
            },
            //添加数据
            addJsonFn(_data){
                if(_data.content == '' || _data.content == undefined){
                    Message({
                        message: 'Json数据不能为空',
                        type: 'error',
                        duration: 1000,
                    })
                    return;
                }
                saveData({
                    type:_data.type,
                    refId:_data.refId,
                    content:_data.content
                }).then(res => {
                    if(res.code == 0){
                        Message({
                            message: '添加成功',
                            type: 'success',
                            duration: 1000
                        })
                        this.fetchData()
                        this.addJsonData.isdlg = false;
                    } else {
                        this.$message({
                            message: res.msg,
                            type: 'error',
                            duration: 1000
                        })
                    }
                })
            },
            //编辑数据
            setJsonData(row){
                this.saveJsonData.isdlg = true
                infoData(row.id).then(res =>{
                    this.saveJsonData.formData = res.data;
                })
            },
            //保存编辑数据
            saveJson(_data){
                saveData({
                    id:_data.id,
                    type:_data.type,
                    refId:_data.refId,
                    content:_data.content
                }).then(res => {
                    if(res.code == 0){
                        Message({
                            message: '操作成功',
                            type: 'success',
                            duration: 1000
                        })
                        this.fetchData()
                        this.saveJsonData.isdlg = false;
                    } else {
                        this.$message({
                            message: res.msg,
                            type: 'error',
                            duration: 1000
                        })
                    }
                })
            },
            //删除数据
            delData(id){
                this.$confirm('删除无法恢复, 是否继续?', '提示', {
                    confirmButtonText: '确定',
                    cancelButtonText: '取消',
                    type: 'warning'
                }).then(() => {
                    delData(id).then(res => {
                        if(res.code == 0){
                            Message({
                                type: 'success',
                                message: '删除成功!',
                                duration: 1000
                            });
                            this.fetchData()
                        }
                    })
                }).catch(() => {
                    Message({
                        type: 'info',
                        message: '已取消删除',
                        duration: 1000
                    });          
                });
            },
            //批量删除
            delDataMore(){
                if(!this.selectJsonData.length){
                    Message({
                        message: '请先选择需要删除的数据',
                        type: 'error',
                        duration:1000
                    })
                    return;
                }
                this.$confirm('删除无法恢复, 是否继续?', '提示', {
                    confirmButtonText: '确定',
                    cancelButtonText: '取消',
                    type: 'warning'
                }).then(() => {
                    this.selectJsonData.forEach(item => {
                        delData(item.id).then(res => {
                            if(res.code == 0){
                                Message({
                                    type: 'success',
                                    message: '删除成功!',
                                    duration: 1000
                                });
                                this.fetchData()
                            }
                        })
                    })
                }).catch(() => {
                    Message({
                        type: 'info',
                        message: '已取消删除',
                        duration: 1000
                    });          
                });
                
                
            },
            //批量选择
            selectJsonChange(selectData){
                this.selectJsonData = selectData;
            },
            //pageSize改变时
            handleSizeChange(val) {
                this.pageSize = val;
                this.fetchData();
            },
            //page改变时
            handleCurrentChange(val) {
                this.page = val
                this.fetchData()
            },
        },
        //生命周期
        created(){
            this.fetchData()
        }
    }
</script>

<style rel="stylesheet/scss" lang="scss">

</style>
