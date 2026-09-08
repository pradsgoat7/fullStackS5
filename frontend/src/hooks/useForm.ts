import { useState } from 'react';

type FormErrors<T> = Partial<Record<keyof T, string>>;
type Validator<T> = (values: T) => FormErrors<T>;

export const useForm = <T extends Record<string, string>>(initialValues: T, validate: Validator<T>) => {
    const [values, setValues] = useState<T>(initialValues);
    const [errors, setErrors] = useState<FormErrors<T>>({});
    const [touched, setTouched] = useState<Partial<Record<keyof T, boolean>>>({});

    const handleChange = (field: keyof T, value: string) => {
        const nextValues = { ...values, [field]: value };
        setValues(nextValues);
        if (touched[field]) {
            setErrors(validate(nextValues));
        }
    };

    const handleBlur = (field: keyof T) => {
        setTouched((prev) => ({ ...prev, [field]: true }));
        setErrors(validate(values));
    };

    const handleSubmit = (onValid: (values: T) => void) => (e: React.FormEvent) => {
        e.preventDefault();
        const validationErrors = validate(values);
        setErrors(validationErrors);
        setTouched(
            (Object.keys(values) as Array<keyof T>).reduce((acc, key) => {
                acc[key] = true;
                return acc;
            }, {} as Partial<Record<keyof T, boolean>>)
        );

        if (Object.keys(validationErrors).length === 0) {
            onValid(values);
        }
    };

    const reset = () => {
        setValues(initialValues);
        setErrors({});
        setTouched({});
    };

    return { values, errors, touched, handleChange, handleBlur, handleSubmit, reset };
};
