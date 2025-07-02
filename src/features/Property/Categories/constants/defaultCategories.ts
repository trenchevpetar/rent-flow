import type { Category } from '@/features/Property/Categories/types/category.type.ts';

export const defaultCategories: Category[] = [
  { id: 'utilities', label: 'Utilities', isCustom: false, icon: 'AdjustmentsHorizontalIcon' },
  { id: 'maintenance', label: 'Maintenance', isCustom: false, icon: 'ExclamationCircleIcon' },
  { id: 'mortgage', label: 'Mortgage', isCustom: false, icon: 'CreditCardIcon' },
  { id: 'insurance', label: 'Insurance', isCustom: false, icon: 'BuildingLibraryIcon' },
  { id: 'taxes', label: 'Taxes', isCustom: false, icon: 'BanknotesIcon' },
  { id: 'cleaning', label: 'Cleaning', isCustom: false, icon: 'TrashIcon' },
  { id: 'internet', label: 'Internet', isCustom: false, icon: 'CursorArrowRaysIcon' },
  { id: 'security', label: 'Security', isCustom: false, icon: 'LockClosedIcon' },
  { id: 'landscaping', label: 'Landscaping', isCustom: false, icon: 'BuildingOfficeIcon' },
  { id: 'loan', label: 'Loan', isCustom: false, icon: 'ClipboardDocumentListIcon' },
  { id: 'default', label: 'Default', isCustom: false, icon: 'DocumentIcon' },
]
