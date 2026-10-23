import TextAreaField from "@/app/components/TextAreaField";

export default function ListTextAreaField({label, items, onChange,}: { label: string; items: string[]; onChange: (items: string[]) => void; }) {
    return (
        <TextAreaField
            label={label}
            value={items.join("\n")}
            onChange={(value) =>
                onChange(
                    value === "" ? [] : value.split("\n")
                )
            }
            rows={Math.max(3, items.length)}
            hint="Enter one item per line."
        />
    );
}