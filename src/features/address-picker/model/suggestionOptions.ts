import type {
  AddressPickerSuggestion,
  AddressPickerSuggestionOption,
} from './types';

export function toAddressPickerSuggestionOptions(
  suggestions: AddressPickerSuggestion[]
): AddressPickerSuggestionOption[] {
  return suggestions.map((item, index) => ({
    ...item,
    key: `${item.name}|${item.title}|${index}`,
  }));
}

export function formatAddressPickerSuggestion(
  option: AddressPickerSuggestion
): string {
  return option.title.length ? `${option.name}, ${option.title}` : option.name;
}
