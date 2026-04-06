import TextInput from './fieldComponents/TextInput';
import TextAreaInput from './fieldComponents/TextAreaInput';
import ChipGroup from './fieldComponents/ChipGroup';
import SelectorGrid from './fieldComponents/SelectorGrid';
import TimelineSelector from './fieldComponents/TimelineSelector';
import Card3Options from './fieldComponents/Card3Options';

export default function FieldRenderer({ field, value, onChange, error }) {
  const commonProps = {
    field,
    value,
    onChange,
    error,
  };

  switch (field.tipo) {
    case 'texto':
      return <TextInput {...commonProps} />;

    case 'textarea':
      return <TextAreaInput {...commonProps} />;

    case 'chip-single':
      return <ChipGroup {...commonProps} multiple={false} />;

    case 'chip-multi':
      return <ChipGroup {...commonProps} multiple={true} />;

    case 'selector-grid':
      // Detectar si es multi-select por max_seleccion
      return <SelectorGrid {...commonProps} multiple={!!field.max_seleccion} />;

    case 'timeline':
      return <TimelineSelector {...commonProps} />;

    case 'card-3':
      return <Card3Options {...commonProps} />;

    default:
      return <TextInput {...commonProps} />;
  }
}
