import {NextRouter} from "next/router";

declare interface IFormActionProps {
    setErrors: any;
    resetForm?: any;
}

declare interface IFormModalProps {
    id?: number;
    isOpen: boolean;
    onClose: () => unknown;
}

interface IFormThunkPayload {
    id?: string;
    values: ILoginRequest;
    setErrors: (_: unknown) => unknown;
    router: NextRouter;
}

declare interface IFormInputOption {
    index?: number;
    label: string;
    value: any;
}

declare interface IFormInputValue {
    field: any;
    value?: any;
}

declare interface IFormProps {
    errors: Record<string, string>;
    isSubmitting: boolean;
}

declare interface IFormInputProps {
    component?: any;
    templateComponent?: any;
    type: 'text' | 'date' | 'datetime' | 'time' | 'year' | 'month' | 'month_year' | 'year_or_month' |
      'select' | 'tel' | 'email' | 'color' | 'checkbox' | 'file' | 'image' | 'number' | 'password'
      | 'radio' | 'range' | 'url' | 'textarea' | 'button_group' | 'autocomplete' | 'datetext' | "number_format" | undefined;
    name: string;
    value?: string | number;
    defaultValue?: string | number;
    label?: string;
    placeholder?: string;
    onChange?: any;
    shouldUseState?:boolean;
    onBlur?: any;
    onKeyPress?: any;
    required?: boolean;
    // Select
    labelField?: string;
    valueField?: string;
    items?: any[],
    orientation?: 'vertical' | 'horizontal',
    isMultiselect?: boolean;
    margin?: 'dense' | 'none';
    ivariant?: 'filled' | 'outlined' | 'standard' | undefined;
    size?: 'small' | 'medium';
    // Other
    hint?: string;
    rows?: number;
    onCustomChange?: any;
    format?: string;
    classes?: any;
    autoFocus?: boolean;
    // Autocomplete
    disableClearable?: boolean;
    disablePast?: boolean;
    freeSolo?: boolean;
    // SelectDate decide between year or year/month
    addMonth?: boolean;
    validate?: any;
    disabled?:boolean;
    emptyOptionValue?:any;
    onChange?: any;
    accept?: any;
}

declare interface IFormInputFormikProps {
    field: {
        name: string | undefined;
        value?: string | number | any | undefined;
        defaultValue?: string | number | any | undefined;
        onChange?: any;
        onBlur?: any;
        onKeyPress?: any;
    },
    accept?:any;
    checked? :boolean;
    disabled?: boolean;
    component?: any;
    templateComponent?: any;
    type: 'text' | 'date' | 'datetime' | 'time' | 'year' | 'month' | 'month_year' |
      'select' | 'tel' | 'email' | 'color' | 'checkbox' | 'file' | 'image' | 'number' | 'password'
      | 'radio' | 'range' | 'url' | 'textarea' | 'button_group' | 'autocomplete' | 'datetext' | "number_format" | undefined;
    label?: string;
    placeholder?: string;
    // Select
    labelField?: string;
    valueField?: string;
    items?: any[];
    orientation?: 'vertical' | 'horizontal';
    isMultiselect?: boolean;
    // Other
    required?: boolean;
    hint?: string;
    rows?: number;
    onCustomChange?: any;
    format?: string;
    classes?: any;
    margin?: 'dense' | 'none';
    ivariant?: 'filled' | 'outlined' | 'standard' | undefined;
    size?: 'small' | 'medium';
    autoFocus?: boolean;
    // Form
    form?: {
        props?: any;
        setFieldError?: any;
        setFieldValue?: any;
        setFieldTouched?: any;
        setErrors?: any;
        setStatus?: any;
        setSubmitting?: any;
        setTouched?: any;
        setValues?: any;
        resetForm?: any;
    },
    // Metadata
    meta?: {
        error?: string;
        initialError?: string;
        initialTouched?: boolean;
        initialValue?: any;
        touched?: boolean;
        value?: any;
    },
    // Helpers
    helpers?: {
        setValue?: (value: any, shouldValidate?: boolean) => void;
        setTouched?: (value: any, shouldValidate?: boolean) => void;
        setError?: (value: any) => void;
    }
}

declare interface IFormInputRemoteSource {
    url: string;
}
