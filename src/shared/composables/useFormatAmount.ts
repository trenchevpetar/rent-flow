import { useI18n } from 'vue-i18n';

export function useFormatAmount () {
  const { locale } = useI18n()

  const format = (amount: number) => {
    return new Intl.NumberFormat(locale.value, {
      style: 'currency',
      currency: 'MKD',
      currencyDisplay: 'symbol',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(amount)
  }

  return { format }
}