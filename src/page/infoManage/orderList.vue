<template>
  <div class="fillcontain">
    <!-- 搜索筛选 -->
    <el-form :inline="true" :model="formInline" class="user-search">


      <el-form-item label="平台订单号：">
        <el-input size="small" v-model="formInline.orderSn" placeholder="输入平台订单号"></el-input>
      </el-form-item>



      <el-form-item label="商品名：">
        <el-input size="small" v-model="formInline.modelSku" placeholder="输入商品名"></el-input>
      </el-form-item>


      <!--      <el-form-item label="sku：">-->
      <!--        <el-input size="small" v-model="formInline.ec_item_name" placeholder="输入sku"></el-input>-->
      <!--      </el-form-item>-->

      <el-form-item label="认领人：">
        <el-select size="small" v-model="formInline.assignUserCode" placeholder="选择">
          <el-option label="全部" value="" key=""></el-option>
          <el-option v-for="db in staffList" :label="db.name" :value="db.code"
                     :key="db.code"></el-option>
        </el-select>
      </el-form-item>

      <el-form-item label="店铺：">
        <el-select size="small" v-model="formInline.shopId" @change="initHierarchy();initProject();"
                   placeholder="选择">
          <el-option label="全部" value="" key=""></el-option>
          <el-option v-for="db in DBList" :label="db.shopName" :value="db.shopId"
                     :key="db.shopId"></el-option>
        </el-select>
      </el-form-item>


      <el-form-item label="平台订单状态：">
        <el-select size="small" v-model="formInline.orderStatus">
          <el-option label="全部" value="" key=""></el-option>
          <el-option :label="'待支付'" :value="'UNPAID'" :key="'UNPAID'"></el-option>
          <el-option :label="'待出库'" :value="'READY_TO_SHIP'" :key="'READY_TO_SHIP'"></el-option>
          <el-option :label="'运输中'" :value="'PROCESSED'" :key="'PROCESSED'"></el-option>
          <el-option :label="'运输完成'" :value="'SHIPPED'" :key="'SHIPPED'"></el-option>
          <el-option :label="'已签收'" :value="'COMPLETED'" :key="'COMPLETED'"></el-option>
          <el-option :label="'取消中'" :value="'IN_CANCEL'" :key="'IN_CANCEL'"></el-option>
          <el-option :label="'已取消'" :value="'CANCELLED'" :key="'CANCELLED'"></el-option>
          <el-option :label="'发票获取中'" :value="'INVOICE_PENDING'"
                     :key="'INVOICE_PENDING'"></el-option>
        </el-select>
      </el-form-item>

      <el-form-item label="是否全部分配完成：">
        <el-select size="small" v-model="formInline.allSign">
          <el-option label="全部" value="" key=""></el-option>
          <el-option :label="'是'" :value="'1'" :key="'1'"></el-option>
          <el-option :label="'否'" :value="'0'" :key="'0'"></el-option>
        </el-select>
      </el-form-item>




      <el-form-item label="处理状态：">
        <el-select size="small" v-model="formInline.assignStatus">
          <el-option label="全部" value="" key=""></el-option>
          <el-option :label="'待采购'" :value="'1'" :key="'1'"></el-option>
          <el-option :label="'采购完成'" :value="'2'" :key="'2'"></el-option>
          <el-option :label="'已发货'" :value="'3'" :key="'3'"></el-option>
        </el-select>
      </el-form-item>

      <el-form-item label="订单时间：">

        <el-date-picker
            v-model="payTimeRange"
            type="datetimerange"
            start-placeholder="开始日期"
            end-placeholder="结束日期"
            :default-time="['00:00:00', '23:59:59']">
        </el-date-picker>
      </el-form-item>


      <el-col :span="24">
        <el-form-item>
          <el-button size="small" type="primary" icon="el-icon-search" @click="search">查询
          </el-button>
          <el-button size="small" type="success" icon="el-icon-refresh" @click="reset">重置
          </el-button>
          <el-button size="small" type="info" icon="el-icon-arrow-right" @click="doOrderTask">
            同步订单
          </el-button>
          <el-button size="small" style="    color: #FFF;
    background-color: #7a68b6;
    border-color: #7a68b6;" icon="el-icon-shopping-cart-2" @click="batchStockOut">
            全部发货
          </el-button>

        </el-form-item>
      </el-col>
    </el-form>
    <div class="table_container">
      <el-table

          highlight-current-row
          default-expand-all
          v-loading="loading"
          :data="tableData"
          :height="1050"
          :cell-style="cellStyle"
          :header-cell-style="{

            height: '70px',
        }"
          style="width: 100%">
        <el-table-column type="expand">
          <template slot-scope="scope">
            <el-form label-position="left" inline class="demo-table-expand">
              <el-table :data="scope.row.orderList" border stripe style="width: 100%">


                <el-table-column type="index"/>
                <!--                <el-table-column prop="skuDes" label="商品大类">-->
                <!--                  <el-switch-->
                <!--                    v-model="value1"-->
                <!--                    active-text="阻塞"-->
                <!--                    inactive-text="按年付费"-->
                <!--                    @change="scope.$index, scope.row">-->
                <!--                 </el-switch>-->
                <!--                </el-table-column>-->



                <el-table-column prop="skuDes" label="商品大类">
                  <template slot-scope="scope">
                    <span style="color: #587272">{{ scope.row.type }}</span>
                  </template>
                </el-table-column>

                <el-table-column prop="skuDes" label="sku名称">
                  <template slot-scope="scope">
                    <span style="color: #851939">{{ scope.row.modelSku }}</span>
                  </template>
                </el-table-column>

                <el-table-column prop="modelQuantityPurchased" label="数量" width="78">
                  <template slot-scope="scope">
                    <span class="emphasized-number">{{ scope.row.modelQuantityPurchased }}</span>
                  </template>
                </el-table-column>

                <el-table-column prop="imageUrl" label="sku名称">
                  <template slot-scope="scope">
                    <el-image :fit="scale-down" :preview-src-list="[scope.row.imageUrl]"
                              :src="scope.row.imageUrl" style="width: 100px; height: 100px">
                    </el-image>
                  </template>
                </el-table-column>


                <el-table-column prop="assignUser" label="商品认领人"/>
                <el-table-column prop="agencyPrice" label="登记金额"/>
                <el-table-column prop="suggestPrice" label="建议金额"/>

                <el-table-column prop="assignContent" label="sku备注"/>
                <!--                <el-table-column prop="assignStatus" label="认领状态" >-->
                <!--                  <template slot-scope="scope">-->

                <!--                    <i class="el-icon-success" v-show="scope.row.assignUser != null" style="color:#67c23A;font-size: 16px;"></i>-->

                <!--                    <i class="el-icon-error" v-show="scope.row.assignUser == null" style="font-size: 16px;"></i>-->

                <!--                  </template>-->
                <!--                </el-table-column>-->

                <el-table-column prop="assignStatus" label="处理状态">
                  <template slot-scope="scope">
                    <el-progress :percentage="scope.row.assignStatus === '0' ? 0 :
                    (scope.row.assignStatus === '1' ? 33 :
                    (scope.row.assignStatus === '2' ?  67 :
                    (scope.row.assignStatus === '3' ? 100 : 0)))" :color="scope.row.assignStatus === '0' ? '#f56c6c' :
                    (scope.row.assignStatus === '1' ? '#f56c6c' :
                    (scope.row.assignStatus === '2' ?  '#e6a23c' :
                    (scope.row.assignStatus === '3' ? '#5cb87a' : '#f56c6c')))" :show-text="false" ></el-progress>
                     <span class="icon-name">{{
                        scope.row.assignStatus === "0" ? "未认领" :
                            (scope.row.assignStatus === "1" ? "待采购" :
                                (scope.row.assignStatus === "2" ? "采购完成" :
                                    (scope.row.assignStatus === "3" ? "已发货" : "未认领")))
                       +  (scope.row.isBlock === 1 ? "_物流阻塞中" :"")
                      }}</span>


                  </template>
                </el-table-column>

                <el-table-column label="操作" style="background:#99a9bf" fixed width="100">

                  <template slot-scope="scope">
                    <el-button
                        size="mini"
                        style="    color: #FFF;
    background-color: #dcd320;
    border-color: #dcd320;
margin-left: 0px;margin-top: 8px"
                        @click="handleEdit(scope.$index, scope.row)">分配
                    </el-button>
                    <el-button
                        size="mini"
                        type="danger"
                        v-show="scope.row.assignUser != null"
                        style="margin-left: 0px;margin-top: 8px"
                        @click="handleEdit2(scope.$index, scope.row)">采购
                    </el-button>

                    <el-button
                        size="mini"
                        style="    color: #FFF;
             background-color: #b623b6;
             border-color:  #b623b6;
margin-left: 0px;margin-top: 8px"
                        v-show="scope.row.assignUser != null"
                        @click="handleEdit3(scope.$index, scope.row)">
                     {{scope.row.isBlock === 0? "阻塞":"释放"}}
                    </el-button>


                  </template>
                </el-table-column>
              </el-table>
            </el-form>
          </template>
        </el-table-column>
        <el-table-column
            label="站点"
            min-width="100px"
            prop="site">
          <template slot-scope="scope">
            <vue-country-flag :country=' scope.row.site ' size='normal'/>
            <span style="font-weight: bold;color: #CC0033;margin-bottom: 7px">{{
                scope.row.site
              }}</span>
          </template>
        </el-table-column>


        <el-table-column label="操作" style="background:#99a9bf" min-width="125px" >
          <template slot-scope="scope">
            <el-button
                size="mini"
                type="danger"

                style="    color: #FFF;
             background-color: rgb(52,52,52);
             border-color:  rgb(52,52,52);
margin-left: 0px;margin-top: 8px;margin-bottom: 8px"
                @click="getOrderStrInfo(scope.$index, scope.row)">信息复制
            </el-button>
            <el-button
                size="mini"
                type="danger"

                style="    color: #FFF;
             background-color: rgb(11,52,52);
             border-color:  rgb(11,52,52);
margin-left: 8px;margin-top: 8px;margin-bottom: 8px"
                @click="getPartOrderStrInfo(scope.$index, scope.row)">部分复制
            </el-button>
          </template>
        </el-table-column>

        <el-table-column
            label="订单号"
            min-width="100px"
            prop="orderSn">
        </el-table-column>
        <!--        <el-table-column-->
        <!--            label="买家用户ID"-->
        <!--            min-width="80px"-->
        <!--            prop="buyer_user_id">-->
        <!--        </el-table-column>-->

        <el-table-column
            label="订单状态"
            min-width="120PX"
            prop="status">
        </el-table-column>


        <el-table-column
            label="付款时间"
            min-width="120PX"
            prop="payTime">
        </el-table-column>

        <el-table-column
            label="订单支付总金额"
            min-width="120PX"
            prop="totalAmount">
          <template slot-scope="scope">
            <span>{{ scope.row.totalAmount + scope.row.currency }}</span>
          </template>
        </el-table-column>

        <el-table-column prop="skuDes" label="舵型">
          <template slot-scope="scope">
            <span class="emphasized-number">{{ scope.row.rudder }}</span>
          </template>
        </el-table-column>

        <el-table-column
            label="订单备注"
            min-width="160PX"
            prop="messageToSeller">
        </el-table-column>


      </el-table>
      <div class="Pagination">
        <el-pagination
            @size-change="handleSizeChange"
            @current-change="handleCurrentChange"
            :current-page="currentPage"
            :page-size="limit"
            :page-sizes="[ 10, 20,50]"
            layout="total, sizes, prev, pager, next, jumper"
            :total="count">
        </el-pagination>
      </div>
    </div>

    <el-dialog title="分配" :close-on-click-modal="false" :visible.sync="dialogFormVisible"
               width="35%" center>
      <el-form :model="tableInfo">
        <!--     @change="initHierarchy();initProject();"-->

        <el-form-item label="负责人" label-width="60px">
          <!--          <el-input v-model="tableInfo.owner" width="80%" auto-complete="off"></el-input>-->
          <el-col :span="15">
            <v-select v-model="selected" :options="options"></v-select>
            <el-select size="small" v-model="tableInfo.executorId" placeholder="选择">
              <el-option v-for="db in staffList" :label="db.name" :value="db.id"
                         :key="db.id"></el-option>
            </el-select>
          </el-col>
        </el-form-item>


        <el-form-item label-width="60px" label="金额" prop="agencyPrice">
          <el-col :span="8">
            <el-input v-model="tableInfo.agencyPrice" width="160px"
                      @input="limitInput($event, 'agencyPrice')"/>
          </el-col>
        </el-form-item>


        <el-form-item label="备注" label-width="60px">
          <el-col :span="20">
            <!--          <el-input v-model="tableInfo.owner" width="80%" auto-complete="off"></el-input>-->
            <el-input type="textarea" width="160px" v-model="tableInfo.assignContent"
                      placeholder="">
            </el-input>
          </el-col>
        </el-form-item>

      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="dialogFormVisible = false">取 消</el-button>
        <el-button type="primary" @click="orderSign">保 存</el-button>
      </div>
    </el-dialog>

    <el-dialog title="发货" :close-on-click-modal="false" :visible.sync="dialogFormVisible2"
               width="20%" center>


      <el-form :model="tableInfo2">
        <el-form-item label="金额" prop="agencyPrice">
          <el-col :span="14">
            <el-input v-model="tableInfo2.agencyPrice" @input="limitInput2($event, 'agencyPrice')"/>
          </el-col>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="dialogFormVisible2 = false">取 消</el-button>
        <el-button type="primary" @click="orderSign2">保 存</el-button>
      </div>
    </el-dialog>


  </div>
</template>

<script>

import {
  batchStockOut,
  doOrderTask,
  getColInfo,
  getLineage,
  getOrderList, getOrderStrInfo,getPartOrderStrInfo,
  getStaffList, markBlock, orderSign,
  syncShopList,
  updateColInfo,
  updateTbInfo
} from '@/api/order';
import {resolvingDate} from "@/utils/mUtils";
import {Message} from 'element-ui'
import dayjs from 'dayjs'
import * as echarts from 'echarts';
import AmountInput from '@/components/amount.vue'

export default {
  components: {
    AmountInput
  },
  data() {
    return {
      lineageInfo: "",
      loading: false,
      isDisable: false,
      expends: [],
      getRowKeys(row) {
        return row.id
      },
      payTimeRange: ["", ""],
      valuejy: false,
      option: {
        title: {
          text: '血缘图'
        },
        tooltip: {},
        legend: [{

          data: [
            "MYSQL", "HDFS", "THIVE"
          ]
        }],

        animationDurationUpdate: 1500,
        animationEasingUpdate: 'quinticInOut',
        series: [
          {

            type: 'graph',
            layout: 'force',
            symbolSize: 50,
            force: {
              gravity: 0,
              repulsion: 8888,
              initLayout: "circular"
            },
            label: {
              show: true,
              position: 'right',
              formatter: '{b}'
            },
            roam: true,
            edgeSymbol: ['circle', 'arrow'],
            edgeSymbolSize: [4, 10],
            edgeLabel: {
              fontSize: 20
            },
            emphasis: {
              focus: 'adjacency',
              lineStyle: {
                width: 10
              }
            },
            categories: [{"name": "MYSQL"}, {"name": "HDFS"}, {"name": "THIVE"}],
            data: [{
              name: '节点1'
            }, {
              name: '节点2'
            }, {
              name: '节点3'
            }, {
              name: '节点4',
              tooltip: "cccccccc"
            }],
            // links: [],
            links: [{
              source: '节点2',
              target: '节点1',
            }, {
              source: '节点1',
              target: '节点2',
            }, {
              source: '节点1',
              target: '节点3'
            }, {
              source: '节点2',
              target: '节点3'
            }, {
              source: '节点2',
              target: '节点4'
            }, {
              source: '节点1',
              target: '节点4'
            }],
            lineStyle: {
              opacity: 0.9,
              width: 2,
              curveness: 0
            }
          }
        ]
      },
      editFlag: false,
      editData: {
        deductionAmount: ''
      },

      city: {},
      currentRow: null,
      limit: 10,
      count: 0,  //总数
      currentPage: 1,
      colChangedRowIndex: [],
      colInfoDialogName: '',
      colInfoDialogName2: '',
      DBList: [],
      shopList: [],
      staffList: [],
      hierarchyList: [],
      projectList: [],
      tableData: [],
      formInline: {
        hierarchy: '',
        project: '',
        name: '',
        assignStatus: '',
        assignUserCode: '',
        assignUserCode2: '',
        orderSn: '',
        modelSku: '',
        shopId: '',
        orderStatus: '',
        allSign: '',
        isActive: '',
        token: localStorage.getItem('logintoken')
      },

      formInline2: {},
      tableInfo: {executorId: 7, assignContent: '', assignUser: '', agencyPrice: ''},
      tableInfo2: {agencyPrice: ''},
      columnsInfo: [],
      dialogFormVisible: false,
      dialogFormVisible2: false,
      dialogFormVisible3: false,
      categoryOptions: [],
      selectedCategory: [],
      address: {},
    }
  },
  created() {
    this.initData();
    this.initStaffList();
    //
    // this.initHierarchy();
    // this.initProject();
    //

    this.payTimeRange[1] = dayjs().format('YYYY-MM-DD HH:mm:ss')
    this.payTimeRange[0] = dayjs().subtract(7, 'day').format('YYYY-MM-DD HH:mm:ss')
    console.log(this.payTimeRange);
    this.search();

    // this.getExpends();
  },
  mounted() {

  },
  filters: {
    time: (value) => {
      return resolvingDate(value);
    }
  },
  methods: {

    //限制只能输入两位小数
    limitInput(value, name) {
      this.tableInfo.agencyPrice = ('' + value) // 第一步：转成字符串
      .replace(/[^\d^\.]+/g, '') // 第二步：把不是数字，不是小数点的过滤掉
      .replace(/^0+(\d)/, '$1') // 第三步：第一位0开头，0后面为数字，则过滤掉，取后面的数字
      .replace(/^\./, '0.') // 第四步：如果输入的第一位为小数点，则替换成 0. 实现自动补全
      .match(/^\d*(\.?\d{0,2})/g)[0] || '' // 第五步：最终匹配得到结果 以数字开头，只有一个小数点，而且小数点后面只能有0到2位小数
    },

    indexIcon(index) {
      return `&#${9311 + index};`
    },

    limitInput2(value, name) {
      this.tableInfo2.agencyPrice = ('' + value) // 第一步：转成字符串
      .replace(/[^\d^\.]+/g, '') // 第二步：把不是数字，不是小数点的过滤掉
      .replace(/^0+(\d)/, '$1') // 第三步：第一位0开头，0后面为数字，则过滤掉，取后面的数字
      .replace(/^\./, '0.') // 第四步：如果输入的第一位为小数点，则替换成 0. 实现自动补全
      .match(/^\d*(\.?\d{0,2})/g)[0] || '' // 第五步：最终匹配得到结果 以数字开头，只有一个小数点，而且小数点后面只能有0到2位小数
    },

    async assignStatusClass({row, rowIndex}) {
      if (row.status === "待出库") {
        return 'warning-row';
      } else {
        return 'success-row';
      }
    },

    format(percentage) {
      return `${percentage}%`;
    },

    cellStyle({row, column, rowIndex, columnIndex}) {
      let cellStyle;
      if (row.isAllSign) {
        cellStyle = 'color:#000000; background-color: #58A458FF';
      } else {
        cellStyle = 'color:#000000; background-color: #b3bb99';
        // cellStyle = 'color:#000000; background-color: #ded575';
      }

      return cellStyle
    },

    //查询tb列表
    async search() {
      this.currentPage = 1;
      await this.search2();
    },

    //查询tb列表
    async search2() {
      this.loading = true
      if (this.formInline.isActive === '') {
        this.formInline.isActive = '1'
      }

      const res = await getOrderList(Object.assign(this.formInline, {
        pageSize: this.limit,
        currentPage: this.currentPage,
        payTimeStart: this.dateFormat('yyyy-MM-dd HH:mm:ss', new Date(this.payTimeRange[0])),
        payTimeEnd: this.dateFormat('yyyy-MM-dd HH:mm:ss', new Date(this.payTimeRange[1]))
      }));
      this.tableData = res.data.data;
      this.count = parseInt(res.data.totalNum);
      console.log(this.tableData);
      this.loading = false
    },

    dateFormat(fmt, date) {
      let ret
      const opt = {
        'y+': date.getFullYear().toString(), // 年
        'M+': (date.getMonth() + 1).toString(), // 月
        'd+': date.getDate().toString(), // 日
        'H+': date.getHours().toString(), // 时
        'm+': date.getMinutes().toString(), // 分
        's+': date.getSeconds().toString(), // 秒
        // 有其他格式化字符需求可以继续添加，必须转化成字符串
      }
      for (let k in opt) {
        ret = new RegExp('(' + k + ')').exec(fmt)
        if (ret) {
          fmt = fmt.replace(
              ret[1],
              ret[1].length == 1 ? opt[k] : opt[k].padStart(ret[1].length, '0')
          )
        }
      }
      return fmt
    },

    /// 保留n位小数
    async doOrderTask() {
      await doOrderTask(Object.assign(this.formInline2, {}));
    },

    /// 保留n位小数
    async batchStockOut() {
      await batchStockOut(Object.assign(this.formInline2, {}));
    },

    //查询tb列表
    async search3(orderId) {

      if (this.formInline.isActive === '') {
        this.formInline.isActive = '1'
      }
      this.formInline2.orderSn = orderId;

      const res = await getOrderList(Object.assign(this.formInline2, {
        pageSize: this.limit,
        currentPage: 1,
        assignUserCode: this.formInline.assignUserCode,
        payTimeStart: this.dateFormat('yyyy-MM-dd HH:mm:ss', new Date(this.payTimeRange[0])),
        payTimeEnd: this.dateFormat('yyyy-MM-dd HH:mm:ss', new Date(this.payTimeRange[1]))
      }));

      for (let i = 0; i < this.tableData.length; ++i) {
        let orderItem = this.tableData[i];
        console.log(orderItem.orderSn);
        console.log(orderId);
        if (orderItem.orderSn === orderId) {
          this.$set(this.tableData, i, res.data.data[0])
          console.log(this.tableData)
          break
        }
      }

    },

    //查询colInfo
    async colInfo(tbId) {
      const res = await getColInfo({tbId: tbId});
      this.columnsInfo = res.data;
    },

    //查询colInfo
    async getOrderStrInfo(index, row) {
      const res = await getOrderStrInfo({orderSn: row.orderSn,
        pageSize: 1,
        currentPage: 1});
      console.log(res)

      if(document.execCommand('copy')) {
        // 创建textarea
        var textArea = document.createElement("textarea");
        textArea.value = res.data;
        // 使textarea不在viewport，同时设置不可见
        textArea.style.position = "fixed";
        textArea.style.opacity = 0;
        textArea.style.left = "-999999px";
        textArea.style.top = "-999999px";
        document.body.appendChild(textArea);
        textArea.focus();
        textArea.select();
        return new Promise((res, rej) => {
          // 执行复制命令并移除文本框
          document.execCommand('copy') ? res() : rej();
          textArea.remove();
          this.$message.success('复制成功')
        });
      } else if (navigator.clipboard && typeof navigator.clipboard.writeText === 'function') {
        // navigator clipboard 向剪贴板写文本
        return navigator.clipboard.writeText(res.data).then(() => {
          this.$message.success('复制成功')
        });
      }

    },


    //查询colInfo
    async getPartOrderStrInfo(index, row) {
      const res = await getPartOrderStrInfo({orderSn: row.orderSn,
        assignUserCode2: this.formInline.assignUserCode,
        pageSize: 1,
        currentPage: 1});
      console.log(res)

      if(document.execCommand('copy')) {
        // 创建textarea
        var textArea = document.createElement("textarea");
        textArea.value = res.data;
        // 使textarea不在viewport，同时设置不可见
        textArea.style.position = "fixed";
        textArea.style.opacity = 0;
        textArea.style.left = "-999999px";
        textArea.style.top = "-999999px";
        document.body.appendChild(textArea);
        textArea.focus();
        textArea.select();
        return new Promise((res, rej) => {
          // 执行复制命令并移除文本框
          document.execCommand('copy') ? res() : rej();
          textArea.remove();
          this.$message.success('复制成功')
        });
      } else if (navigator.clipboard && typeof navigator.clipboard.writeText === 'function') {
        // navigator clipboard 向剪贴板写文本
        return navigator.clipboard.writeText(res.data).then(() => {
          this.$message.success('复制成功')
        });
      }

    },



    //认领
    async orderSign() {
      this.dialogFormVisible = false;
      this.tableInfo.ecOrderNo = this.tableInfo.orderSn;
      this.tableInfo.ecItemId = this.tableInfo.itemId;
      this.tableInfo.content = this.tableInfo.assignContent;

      const res = await orderSign(Object.assign(this.tableInfo, {
        status: (this.tableInfo.agencyPrice === '' || this.tableInfo.agencyPrice == null) ? 1:2

      }))
      console.log(res)
      if (res.code === 200) {
        await this.search3(this.tableInfo.orderSn);
      }
      //使用promise(链式编程)

      // res.then(async () => {
      //   if (res.code === 200) {
      //     Message({
      //       message: '成功',
      //       type: 'success',
      //       duration: 5 * 1000
      //     })
      //     await this.search3(this.tableInfo.orderSn);
      //   }
      // });

    },

    //认领
    async orderSign2() {
      this.dialogFormVisible2 = false;
      this.tableInfo2.ecOrderNo = this.tableInfo2.orderSn;
      this.tableInfo2.ecItemId = this.tableInfo2.itemId;
      const res = await orderSign(Object.assign(this.tableInfo2, {
        status: 2
      }))
      //错误会在框架里抛出来
      console.log(res)
      if (res.code === 200) {
        await this.search3(this.tableInfo2.orderSn);
      }
      // res.then(async () => {
      //

      // });

    },

    recordEditRow(index) {
      this.colChangedRowIndex.push(index);
    },

    //更新表信息
    async updateColInfo() {
      this.dialogFormVisible2 = false;
      console.log(this.columnsInfo[0]);
      const request = [];

      for (let i = 0; i < this.columnsInfo.length; ++i) {
        const indexOf = this.colChangedRowIndex.indexOf(i);
        if (indexOf >= 0) {
          request.push(this.columnsInfo[i]);
        }
      }
      const res = await updateColInfo(request)
      //错误会在框架里抛出来
      if (res.code === 'Success') {
        Message({
          message: '成功',
          type: 'success',
          duration: 5 * 1000
        })
      }
      await this.search();
    },

    //重置查询
    reset() {
      this.currentPage = 1
      this.formInline = {
        owner: '',
        dbId: '',
        isActive: '1',
        token: localStorage.getItem('logintoken')
      };
      this.search();
    },

    check() {
      this.search();
      this.isDisable = true
      setTimeout(() => {
        this.isDisable = false
      }, 10000)
    },

    //初始化查询Selector
    async initData() {
      const res = await syncShopList();
      this.DBList = res.data;
      console.log("cos" + this.DBList);
    },

    async initStaffList() {
      const res = await getStaffList({});
      this.staffList = res.data;
    },

    //初始化层级Selector
    async initHierarchy() {

    },

    //初始化层级Selector
    async initProject() {
      // const res2= await getProjectList({dbId: this.formInline.dbId});
      // this.projectList = res2.data;
      // this.formInline.project = '';
    },

    handleSizeChange(val) {
      this.limit = val;
      this.search2();
      console.log(`每页 ${val} 条`);
    },

    handleCurrentChange(val) {
      this.currentPage = val;
      this.search2();
    },

    handleEdit(index, row) {

      this.tableInfo = Object.assign(this.tableInfo, row);

      if (this.tableInfo.executorId == null) {
        this.tableInfo.executorId = 7
      }

      this.dialogFormVisible = true;
    },

    handleEdit2(index, row) {

      this.tableInf2o = Object.assign(this.tableInfo2, row);
      this.dialogFormVisible2 = true;
    },



    async handleEdit3(index, row) {

      const res = await markBlock({
        assignId: row.assignId,
        isBlock:  row.isBlock === 0 ? 1 :0
      })
      //错误会在框架里抛出来
      console.log(res)
      if (res.code === 200) {
        await this.search3(row.orderSn);
      }

    },

    // sync handleEdit3(index, row) {
    //   const res = get getOrderList(Object.assign(this.formInline, {
    //     pageSize: this.limit,
    //     currentPage: this.currentPage,
    //     payTimeStart: this.dateFormat('yyyy-MM-dd HH:mm:ss', new Date(this.payTimeRange[0])),
    //     payTimeEnd: this.dateFormat('yyyy-MM-dd HH:mm:ss', new Date(this.payTimeRange[1]))
    //   }));
    // },
    stateChanged(row) {
      console.log(row)
      row.isActive = (row.isActive == '1' ? '0' : '1')
      updateTbInfo(row)

    },
    stateChanged2(row) {
      console.log(row)
      row.isMonitor = (row.isMonitor == '1' ? '0' : '1')
      updateTbInfo(row)
    },

    handleColInfo(index, row) {
      this.colInfo(row.id);
      //清空被修改rowList
      this.colChangedRowIndex = [];
      this.colInfoDialogName = "字段信息  " + row.name + "(" + row.description + ")";
      this.dialogFormVisible2 = true;

    },

  },
}
</script>


<style lang="less" scoped>
.demo-table-expand {
  font-size: 0;
}

.demo-table-expand label {
  width: 90px;
  color: #99a9bf;
}

.demo-table-expand .el-form-item {
  margin-right: 0;
  margin-bottom: 0;
  width: 50%;
}

.el-table .warning-row {
  color: darkred;
}

.el-table .success-row {
  color: darkgreen;
}

.table_container {
  padding: 20px;
}

.Pagination {
  display: flex;
  justify-content: flex-start;
  margin-top: 8px;
}

.avatar-uploader .el-upload {
  border: 1px dashed #d9d9d9;
  border-radius: 6px;
  cursor: pointer;
  position: relative;
  overflow: hidden;
}

/deep/ .el-dialog {
  border-radius: 15px;
}

.choose-row {
  background-color: #d3cb6f !important;
}

.avatar-uploader .el-upload:hover {
  border-color: #20a0ff;
}


.avatar-uploader-icon {
  font-size: 28px;
  color: #8c939d;
  width: 120px;
  height: 120px;
  line-height: 120px;
  text-align: center;
}


.avatar {
  width: 120px;
  height: 120px;
  display: block;
}
</style>
<style lang="less">
.message_box_alert {
  word-break: break-all !important;
}


.el-table .warning-row {
  background: darkred;
}

.el-table .success-row {
  background: #65ab65;
}

.emphasized-number {
  font-weight: bold;
  color: red;
  font-size: 30px;
  /* 添加其他样式以突出显示 */
}
</style>

