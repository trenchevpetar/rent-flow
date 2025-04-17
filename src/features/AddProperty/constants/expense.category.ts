export type expenseCategory = {
  abbr: string;
  label: string;
  value: string;
  imageUrl: string;
}

export const expenseCategories = {
  EVN: <expenseCategory> {
    abbr: 'EVN',
    label: 'EVN Group Macedonia',
    value: 'EVN',
    imageUrl: 'https://www.evn.mk/EVN/media/img/EVN-Logo.svg?ext=.svg'
  },
  VODOVOD: <expenseCategory> {
    abbr: 'VODOVOD',
    label: 'JP Vodovod',
    value: 'VODOVOD',
    imageUrl: 'https://vodovod-skopje.com.mk/images/logo_voda.png'
  }
}

export const expenseCategoriesForSelect = () => {
  return Object.keys(expenseCategories).map((key) => {
    const categoryKey = key as keyof typeof expenseCategories;

    return {
      label: expenseCategories[categoryKey].label,
      value: expenseCategories[categoryKey].value
    }
  });
}
