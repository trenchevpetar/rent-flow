<template>
  <div class="expense-dashboard">
    <!-- Tab Navigation -->
    <div
      class="tabs tabs-lift"
      role="tablist"
    >
      <button
        v-for="tab in tabs"
        :key="tab.id"
        role="tab"
        :class="['tab', { 'tab-active': activeTab === tab.id }]"
        @click="activeTab = tab.id"
      >
        {{ tab.label }}
      </button>
    </div>

    <!-- Chart Container -->
    <div class="chart-container">
      <v-chart
        class="chart"
        :option="currentChartOption"
        autoresize
      />
    </div>

    <!-- Summary Stats -->
    <div class="stats shadow w-full">
      <div class="stat">
        <div class="stat-title">
          Total Expenses
        </div>
        <div class="stat-value">
          {{ format(totalExpenses) }}
        </div>
      </div>
      <div class="stat">
        <div class="stat-title">
          Avg Monthly
        </div>
        <div class="stat-value">
          {{ format(avgMonthly) }}
        </div>
      </div>
      <div class="stat">
        <div class="stat-title">
          Paid
        </div>
        <div class="stat-value">
          {{ paidCount }}/{{ totalCount }}
        </div>
      </div>
      <div class="stat">
        <div class="stat-title">
          Unpaid
        </div>
        <div class="stat-value">
          {{ format(unpaidAmount) }}
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { BarChart, PieChart } from 'echarts/charts'
import {
  TitleComponent,
  TooltipComponent,
  GridComponent,
  LegendComponent
} from 'echarts/components'
import { use } from 'echarts/core'
import { CanvasRenderer } from 'echarts/renderers'
import { computed, ref, provide } from 'vue'
import VChart, { THEME_KEY } from 'vue-echarts'

import type { Expense } from '@/features/Property/AddProperty/types/expense.types.ts'
import type { Category } from '@/features/Property/Categories/types/category.type.ts';
import { useFormatAmount } from '@/shared/composables/useFormatAmount.ts'

const { format } = useFormatAmount()
const props = defineProps<{ expenses: Expense[], resolvedCategories: Category[] }>()

provide(THEME_KEY, 'dark')

use([
  TitleComponent,
  CanvasRenderer,
  BarChart,
  PieChart,
  TooltipComponent,
  GridComponent,
  LegendComponent
])

const activeTab = ref('monthly')

const tabs = [
  { id: 'monthly', label: 'Monthly Trend' },
  { id: 'category', label: 'By Category' },
  { id: 'payment', label: 'Payment Status' }
]

const processedData = computed(() => {
  const monthlyData: Record<string, { total: number; paid: number; unpaid: number }> = {}
  const categoryData: Record<string, { total: number; paid: number; unpaid: number; count: number }> = {}
  let totalExpenses = 0
  let paidCount = 0
  let unpaidAmount = 0

  for (const expense of props.expenses) {
    const date = new Date(expense.date)
    const monthKey = `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}`
    const categoryName = props.resolvedCategories?.find(({ id }) => id === expense.category)?.label || ''

    if (!monthlyData[monthKey]) {
      monthlyData[monthKey] = { total: 0, paid: 0, unpaid: 0 }
    }
    monthlyData[monthKey].total += expense.amount
    if (expense.isPaid) {
      monthlyData[monthKey].paid += expense.amount
      paidCount++
    } else {
      monthlyData[monthKey].unpaid += expense.amount
      unpaidAmount += expense.amount
    }

    if (!categoryData[categoryName]) {
      categoryData[categoryName] = { total: 0, paid: 0, unpaid: 0, count: 0 }
    }
    categoryData[categoryName].total += expense.amount
    categoryData[categoryName].count++
    if (expense.isPaid) {
      categoryData[categoryName].paid += expense.amount
    } else {
      categoryData[categoryName].unpaid += expense.amount
    }

    totalExpenses += expense.amount
  }

  return {
    monthlyData,
    categoryData,
    totalExpenses,
    paidCount,
    unpaidAmount,
    totalCount: props.expenses.length,
    avgMonthly: Object.keys(monthlyData).length > 0
        ? Math.round(totalExpenses / Object.keys(monthlyData).length)
        : 0
  }
})

const { monthlyData, categoryData, totalExpenses, paidCount, unpaidAmount, totalCount, avgMonthly } = processedData.value

const monthlyChartOption = computed(() => {
  const allMonths = Object.keys(monthlyData).sort()
  const shortLabels = allMonths.map(m => {
    const month = new Date(`${m}-01`).toLocaleString('default', { month: 'short' })
    return `${month} ${m.slice(2, 4)}`
  })
  const paid = allMonths.map(month => monthlyData[month]?.paid || 0)
  const unpaid = allMonths.map(month => monthlyData[month]?.unpaid || 0)

  return {
    title: {
      text: 'Monthly Expense Breakdown',
      left: 'center',
      textStyle: { color: '#fff', fontSize: 18 }
    },
    tooltip: {
      trigger: 'axis',
      backgroundColor: 'rgba(0, 0, 0, 0.8)',
      textStyle: { color: '#fff' },
      formatter: function (params: Array<{ axisValue: string; seriesName: string; value: number }>) {
        const label = params[0].axisValue
        let tooltip = `<strong>${label}</strong><br/>`
        params.forEach(param => {
          tooltip += `${param.seriesName}: ${format(Number(param.value))}<br/>`
        })
        return tooltip
      }
    },
    legend: {
      top: 'bottom',
      textStyle: { color: '#fff' }
    },
    grid: {
      left: '3%',
      right: '4%',
      bottom: '15%',
      top: '15%',
      containLabel: true
    },
    xAxis: {
      type: 'category',
      data: shortLabels,
      axisLabel: { color: '#ccc' },
      axisLine: { lineStyle: { color: '#666' } }
    },
    yAxis: {
      type: 'value',
      axisLabel: { color: '#ccc', formatter: 'MKD {value}' },
      axisLine: { lineStyle: { color: '#666' } },
      splitLine: { lineStyle: { color: '#333' } }
    },
    series: [
      {
        name: 'Paid',
        type: 'bar',
        stack: 'total',
        data: paid,
        itemStyle: { color: '#27ae60' }
      },
      {
        name: 'Unpaid',
        type: 'bar',
        stack: 'total',
        data: unpaid,
        itemStyle: { color: '#e74c3c' }
      }
    ]
  }
})

const categoryChartOption = computed(() => {
  const categories = Object.keys(categoryData)
  const values = categories.map(cat => ({ name: cat, value: categoryData[cat].total }))

  return {
    title: {
      text: 'Expenses by Category',
      left: 'center',
      textStyle: { color: '#fff', fontSize: 18 }
    },
    tooltip: {
      trigger: 'item',
      backgroundColor: 'rgba(0, 0, 0, 0.8)',
      textStyle: { color: '#fff' },
      formatter: function (params: { axisValue: string; seriesName: string; value: number, name: string, percent: number }) {
        return `${params.seriesName} <br/>${params.name}: ${format(Number(params.value))} (${params.percent}%)`
      }
    },
    legend: {
      orient: 'vertical',
      right: '10%',
      top: 'center',
      textStyle: { color: '#fff' }
    },
    series: [
      {
        name: 'Category',
        type: 'pie',
        radius: ['40%', '70%'],
        center: ['40%', '50%'],
        data: values,
        emphasis: {
          itemStyle: {
            shadowBlur: 10,
            shadowOffsetX: 0,
            shadowColor: 'rgba(0, 0, 0, 0.5)'
          }
        },
        itemStyle: {
          borderRadius: 8,
          borderColor: '#fff',
          borderWidth: 2
        },
        label: { show: false }
      }
    ]
  }
})

const paymentStatusOption = computed(() => {
  const categories = Object.keys(categoryData)
  const paid = categories.map(cat => categoryData[cat].paid)
  const unpaid = categories.map(cat => categoryData[cat].unpaid)

  return {
    title: {
      text: 'Payment Status by Category',
      left: 'center',
      textStyle: { color: '#fff', fontSize: 18 }
    },
    tooltip: {
      trigger: 'axis',
      backgroundColor: 'rgba(0, 0, 0, 0.8)',
      textStyle: { color: '#fff' },
      formatter: function (params: Array<{ axisValue: string; seriesName: string; value: number }>) {
        const category = params[0].axisValue
        let tooltip = `<strong>${category}</strong><br/>`
        params.forEach(param => {
          tooltip += `${param.seriesName}: ${format(Number(param.value))}<br/>`
        })
        return tooltip
      }
    },
    legend: {
      top: 'bottom',
      textStyle: { color: '#fff' }
    },
    grid: {
      left: '3%',
      right: '4%',
      bottom: '15%',
      top: '15%',
      containLabel: true
    },
    xAxis: {
      type: 'category',
      data: categories,
      axisLabel: { color: '#ccc', rotate: 45 },
      axisLine: { lineStyle: { color: '#666' } }
    },
    yAxis: {
      type: 'value',
      axisLabel: { color: '#ccc', formatter: 'MKD {value}' },
      axisLine: { lineStyle: { color: '#666' } },
      splitLine: { lineStyle: { color: '#333' } }
    },
    series: [
      {
        name: 'Paid',
        type: 'bar',
        data: paid,
        itemStyle: { color: '#27ae60' }
      },
      {
        name: 'Unpaid',
        type: 'bar',
        data: unpaid,
        itemStyle: { color: '#e74c3c' }
      }
    ]
  }
})

const currentChartOption = computed(() => {
  switch (activeTab.value) {
    case 'monthly': return monthlyChartOption.value
    case 'category': return categoryChartOption.value
    case 'payment': return paymentStatusOption.value
    default: return monthlyChartOption.value
  }
})
</script>

<style scoped>
.expense-dashboard {
  background: #1a1a1a;
  border-radius: 12px;
  padding: 20px;
  color: #fff;
}
.tab-navigation {
  display: flex;
  gap: 8px;
  margin-bottom: 20px;
  border-bottom: 2px solid #333;
  padding-bottom: 10px;
}
.tab-button {
  background: #2d3748;
  color: #a0aec0;
  border: none;
  padding: 10px 20px;
  border-radius: 8px;
  cursor: pointer;
  transition: all 0.3s ease;
  font-weight: 500;
}
.tab-button:hover {
  background: #4a5568;
  color: #fff;
}
.tab-button.active {
  background: #3182ce;
  color: #fff;
}
.chart-container {
  margin-bottom: 20px;
}
.chart {
  height: 400px;
}
</style>
