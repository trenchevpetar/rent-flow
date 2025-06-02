<template>
  <v-chart
    class="chart"
    :option="chartOption"
    autoresize
  />
</template>

<script setup lang="ts">
import { graphic } from 'echarts';
import { PictorialBarChart } from 'echarts/charts'
import {
  TitleComponent,
  TooltipComponent,
  GridComponent,
  LegendComponent,
} from 'echarts/components'
import { use } from 'echarts/core'
import { CanvasRenderer } from 'echarts/renderers'
import { computed, toRef } from 'vue'
import VChart from 'vue-echarts'

import type { Expenses } from '@/features/AddProperty/types/expenses.ts';
import { useGroupedExpenses } from '@/features/ListProperties/composables/useGroupedExpenses.ts';

use([
  TitleComponent,
  CanvasRenderer,
  PictorialBarChart,
  TooltipComponent,
  GridComponent,
  LegendComponent,
])

// Props and your groupedByMonth
const props = defineProps<{ expenses: Expenses[] }>()
const { groupedByMonth } = useGroupedExpenses(toRef(props, 'expenses'))

const chartOption = computed(() => {
  const grouped = groupedByMonth.value || {}

  const fullYear = 2025
  const months = Array.from({ length: 12 }, (_, i) =>
      `${fullYear}-${String(i + 1).padStart(2, '0')}`
  )

  // Collect categories
  const categories = new Set<string>()
  Object.values(grouped).forEach(monthData => {
    const expenses = monthData.expenses
    Object.values(expenses).forEach(exp => {
      if (exp.category) categories.add(exp.category)
    })
  })

  // Get category-based data
  const categorySeries = Array.from(categories).map(category => ({
    name: `${category}`,
    type: 'pictorialBar',
    symbol: 'rect',
    symbolRepeat: true,
    symbolSize: [10, 4],
    symbolMargin: 2,
    label: {
      show: false,
    },
    data: months.map(month => {
      const expenses = grouped[month]?.expenses || {}
      return Object.values(expenses)
          .filter(e => e.category === category)
          .reduce((sum, e) => sum + e.amount, 0)
    }),
  }))

  // Gradient bar data (e.g., total per month)
  const barData = months.map(month => grouped[month]?.totalAmount || 0)

  // Line data example: maybe average or static projection
  const lineData = barData.map(v => v > 0 ? Math.round(v * 1.1) : 0)

  const barSeries = {
    name: 'Total',
    type: 'bar',
    barWidth: 10,
    itemStyle: {
      borderRadius: 5,
      color: new graphic.LinearGradient(0, 0, 0, 1, [
        { offset: 0, color: '#14c8d4' },
        { offset: 1, color: '#43eec6' },
      ]),
    },
    data: barData,
  }

  const lineSeries = {
    name: 'Projected',
    type: 'line',
    smooth: true,
    showAllSymbol: true,
    symbol: 'emptyCircle',
    symbolSize: 15,
    lineStyle: {
      width: 3,
    },
    data: lineData,
  }

  return {
    title: {
      text: '2025 Expenses Overview',
      left: 'center',
    },
    tooltip: {
      trigger: 'axis',
    },
    legend: {
      top: 'bottom',
    },
    grid: {
      left: '3%',
      right: '4%',
      bottom: '10%',
      containLabel: true,
    },
    xAxis: {
      type: 'category',
      data: months,
    },
    yAxis: {
      type: 'value',
    },
    series: [
      ...categorySeries,
      barSeries,
      // lineSeries
    ],
  }
})


</script>

<style scoped>
.chart {
  height: 400px;
}
</style>
