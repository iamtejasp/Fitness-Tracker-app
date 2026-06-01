import { ComponentProps } from 'react';
import { Control, Controller, FieldValues, Path } from 'react-hook-form';
import { TextField } from './TextField';

interface FormTextFieldProps<TFieldValues extends FieldValues>
  extends Omit<ComponentProps<typeof TextField>, 'value' | 'onChangeText' | 'error'> {
  control: Control<TFieldValues>;
  name: Path<TFieldValues>;
}

export function FormTextField<TFieldValues extends FieldValues>({
  control,
  name,
  ...props
}: FormTextFieldProps<TFieldValues>) {
  return (
    <Controller
      control={control}
      name={name}
      render={({ field: { onBlur, onChange, value }, fieldState }) => (
        <TextField
          {...props}
          value={typeof value === 'string' ? value : ''}
          onBlur={onBlur}
          onChangeText={onChange}
          error={fieldState.error?.message}
        />
      )}
    />
  );
}
