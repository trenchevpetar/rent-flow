import dayjs from 'dayjs';
import { useI18n } from 'vue-i18n';
import 'dayjs/locale/mk';
import 'dayjs/locale/en';

export function useFormattedDate (date: Date | string): string {
  const { locale } = useI18n();

  return dayjs(date)
    .locale(locale.value)
    .format('D MMMM YYYY, dddd');
}
