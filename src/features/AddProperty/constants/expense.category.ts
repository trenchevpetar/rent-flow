export type expenseCategory = {
  abbr: string;
  label: string;
  value: string;
  imageUrl: string;
}

export const expenseCategories = {
  DEFAULT: <expenseCategory> {
    abbr: 'RENT',
    label: 'Rent',
    value: 'RENT',
    imageUrl: ''
  },
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
  },
  ESM: <expenseCategory> {
    abbr: 'ESM',
    label: 'ESM Snabduvanje so toplina',
    value: 'ESM',
    imageUrl: 'https://esm-snabduvanje.mk/wp-content/uploads/2022/12/logo_esm_privremeno.png'
  },
  URBAN: <expenseCategory> {
    abbr: 'URBAN',
    label: 'Urban Komfort',
    value: 'URBAN',
    imageUrl: '',
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
