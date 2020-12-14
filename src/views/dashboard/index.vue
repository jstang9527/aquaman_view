<template>
  <div class="dashboard-editor-container">
    <panel-group :data="panelGroupData" />
    <el-row :gutter="32">
      <el-col :xs="24" :sm="24" :lg="16">
        <div class="chart-wrapper">
          <line-chart :chart-data="lineChartData" />
        </div>
      </el-col>
      <el-col :xs="24" :sm="24" :lg="8">
        <div class="chart-wrapper">
          <pie-chart :chart-data="pieChartData" />
        </div>
      </el-col>
    </el-row>
  </div>
</template>

<script>
import PanelGroup from './components/PanelGroup'
import LineChart from './components/LineChart'
import PieChart from './components/PieChart'
import { DashboardData } from '@/api/dashboard'

export default {
  name: 'DashboardAdmin',
  components: {
    PanelGroup,
    LineChart,
    PieChart
  },
  data() {
    return {
      panelGroupData: {
        'serviceNum': 23, // 漏洞威胁
        'todayRequestNum': 1200, //插件数量
        'currentQps': 200, //弱口令
        'appNum': 5 //资产统计
      },
      lineChartData: {
        'title': '今日流量统计',
        'today': [],
        'yesterday': []
      },
      pieChartData: {
        'title': '弱口令',
        'legend': ['ssh','rdp','es'],
        'series': [
            { value: 320, name: 'ssh' },
            { value: 240, name: 'rdp' },
            { value: 149, name: 'es' },
        ]
      }
    }
  },
  created() {
    this.fetchData()
    // this.fetchPanelGroupData()
    // this.fetchFlowStat()
    // this.fetchServiceStat()
  },
  methods: {
    fetchData(){
      DashboardData().then((response)=>{
        let data = response.data
        this.panelGroupData = {
          'serviceNum': data.vul_count,
          'todayRequestNum': data.plugin_count,
          'currentQps': data.asset_count,
          'appNum': data.task_count
        }
        this.lineChartData = {
          'title': '任务统计',
          'today': data.tasks_now,
          'yesterday': data.tasks_old
        }
        this.pieChartData = {
          'title': '漏洞类型',
          'legend': data.legend,
          'series': data.series
        }
      })
    },
    fetchPanelGroupData() {
      // panelGroupData({ }).then(response => {
      //   this.panelGroupData = response.data
      // }).catch(() => {
      // })
    },
    fetchFlowStat() {
      // flowStat({ }).then(response => {
      //   this.lineChartData.today = response.data.today
      //   this.lineChartData.yesterday = response.data.yesterday
      // }).catch(() => {
      // })
    },
    fetchServiceStat() {
      // serviceStat({ }).then(response => {
      //   this.pieChartData.legend = response.data.legend
      //   this.pieChartData.series = response.data.data
      // }).catch(() => {
      // })
    },
    handleSetLineChartData() {
      // this.lineChartData = lineChartData[type]
    }
  }
}
</script>

<style lang="scss" scoped>
.dashboard-editor-container {
  padding: 32px;
  background-color: rgb(240, 242, 245);
  position: relative;

  .github-corner {
    position: absolute;
    top: 0px;
    border: 0;
    right: 0;
  }

  .chart-wrapper {
    background: #fff;
    padding: 16px 16px 0;
    margin-bottom: 32px;
  }
}

@media (max-width:1024px) {
  .chart-wrapper {
    padding: 8px;
  }
}
</style>

