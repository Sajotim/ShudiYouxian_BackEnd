<template>
  <div class="app-container">
    <el-table v-loading="listLoading" :data="list" element-loading-text="Loading" fit highlight-current-row empty-text="暂无数据" @selection-change="handleSelectionChange">
      <el-table-column prop="roomid" label="roomid" />
      <el-table-column prop="name" label="直播间" />
      <el-table-column prop="anchor_name" label="主播" />
      <el-table-column label="操作" width="100%">
        <template slot-scope="scope">
          <el-button type="text" @click="liveHisVedios(scope.row.roomid)">回放视频</el-button>
        </template>
      </el-table-column>
    </el-table>

    <el-dialog title="回放视频" :visible.sync="pushData.dialogFormVisible" :close-on-click-modal="false" :close-on-press-escape="false">
      <el-table v-loading="listLoading2" :data="list2" element-loading-text="Loading" fit highlight-current-row empty-text="暂无数据" @selection-change="handleSelectionChange">
        <el-table-column prop="create_time" label="创建时间" />
        <el-table-column prop="expire_time" label="到期时间" />
        <el-table-column prop="media_url" label="视频地址" />
      </el-table>
      <div slot="footer" class="dialog-footer">
        <el-button type="primary" @click="pushData.dialogFormVisible = false">确定</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
import { liveRooms, liveHisVedios } from '@/api/liveInfo'

export default {
  data() {
    return {
      rules: {
        type: [
          { required: true, message: '不能为空' }
        ],
        ask: [
          { required: true, message: '不能为空' }
        ],
        reply: [
          { required: true, message: '不能为空' }
        ],
        isUse: [
          { required: true, message: '不能为空' }
        ]
      },

      searchData: {},

      pushData: {
        dialogTitle: undefined,
        dialogFormVisible: false,

        id: undefined,
        type: undefined,
        ask: undefined,
        reply: undefined,
        isUse: 'true'
      },

      multipleSelection: [],
      list: null,
      list2: null,
      listLoading: true,
      listLoading2: true
    }
  },
  created() {
    this.fetchData()
  },
  mounted() {
  },
  methods: {
    handleSelectionChange(val) {
      this.multipleSelection = val
    },
    fetchData() {
      this.list = null
      this.listLoading = true
      liveRooms().then(response => {
        if (response.code === 0) {
          this.list = response.data
        }
        this.listLoading = false
      })
    },
    liveHisVedios(roomId) {
      this.pushData.dialogFormVisible = true
      this.list2 = null
      this.listLoading2 = true
      liveHisVedios(roomId).then(response => {
        if (response.code === 0) {
          this.list2 = response.data.liveReplay
        }
        this.listLoading2 = false
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

</style>
