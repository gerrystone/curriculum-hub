import TextAreaField from "@/app/components/TextAreaField";

type ListTextAreaFieldProps = {
    label: string;
    items: string[];
    onChange: (items: string[]) => void;
    disabled?: boolean;
};
export default function ListTextAreaField({label, items, onChange, disabled=false}:ListTextAreaFieldProps) {
    return (
        <TextAreaField
            label={label}
            value={items.join("\n")}
            onChange={(value) =>
                onChange(value === "" ? [] : value.split("\n"))
            }
            rows={Math.max(3, items.length)}
            hint="Enter one item per line."
            disabled={disabled}
        />
    );
}