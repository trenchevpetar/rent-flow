<template>
  <v-chart
    class="chart"
    :option="chartOption"
    autoresize
  />
</template>

<script setup lang="ts">
import { LineChart } from 'echarts/charts'
import {
  TitleComponent,
  TooltipComponent,
  GridComponent,
  LegendComponent,
} from 'echarts/components'
import { use } from 'echarts/core'
import { CanvasRenderer } from 'echarts/renderers'
import { computed, toRef, provide } from 'vue'
import VChart, { THEME_KEY } from 'vue-echarts'

import type { Expense } from '@/features/Property/AddProperty/types/expense.types.ts';
import { useGroupedExpenses } from '@/features/Property/ListProperties/composables/useGroupedExpenses.ts'

provide(THEME_KEY, 'dark')

use([
  TitleComponent,
  CanvasRenderer,
  LineChart,
  TooltipComponent,
  GridComponent,
  LegendComponent,
])

const props = defineProps<{ expenses: Expense[] }>()
const { groupedByMonth } = useGroupedExpenses(toRef(props, 'expenses'))

const chartOption = computed(() => {
  const grouped = groupedByMonth.value || {}
  const fullYear = 2025

  const months = Array.from({ length: 12 }, (_, i) =>
      `${fullYear}-${String(i + 1).padStart(2, '0')}`
  )
  const xLabels = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec']
  const actualValues = months.map(month => grouped[month]?.totalAmount || 0)

  const trendValues = actualValues.map((_, i, arr) => {
    const prev = arr[i - 1] ?? arr[i]
    const next = arr[i + 1] ?? arr[i]
    return Math.round((prev + arr[i] + next) / 3)
  })

  return {
    title: {
      text: '2025 Monthly Expense Trend',
      left: 'center',
      textStyle: { color: '#fff' }
    },
    tooltip: {
      trigger: 'axis'
    },
    legend: {
      top: 'bottom',
      textStyle: { color: '#fff' }
    },
    grid: {
      left: '3%',
      right: '4%',
      bottom: '10%',
      containLabel: true,
    },
    xAxis: {
      type: 'category',
      data: xLabels,
      axisLabel: { color: '#ccc' },
      axisLine: { lineStyle: { color: '#666' } }
    },
    yAxis: {
      type: 'value',
      axisLabel: { color: '#ccc' },
      axisLine: { lineStyle: { color: '#666' } },
      splitLine: { lineStyle: { color: '#333' } }
    },
    series: [
      {
        name: 'Actual',
        type: 'line',
        symbol: 'circle',
        symbolSize: 8,
        lineStyle: {
          color: '#f39c12',
          width: 2,
        },
        itemStyle: {
          color: '#f39c12',
        },
        data: actualValues,
      },
      {
        name: 'Trend',
        type: 'line',
        smooth: true,
        symbol: 'circle',
        symbolSize: 8,
        lineStyle: {
          color: '#42b883',
          width: 3,
        },
        itemStyle: {
          color: '#42b883',
        },
        data: trendValues,
      },
    ],
  }
})
</script>

<style scoped>
.chart {
  height: 400px;
}
</style>
