
type TextareaFieldProps = {
    label: string;
    value: string;
    onChange: (value: string) => void;
    rows?: number;
    hint?: string;
};
export default function TextAreaField({label, value, onChange, rows = 2, hint,}: TextareaFieldProps) {
    return (
        <div className="space-y-2">
            <label className="block text-sm font-medium text-gray-700">
                {label}
            </label>

            <textarea
                value={value}
                rows={rows}
                onChange={(event) => onChange(event.target.value)}
                className="block w-full resize-y rounded-lg border border-gray-300 bg-white px-3 py-2.5 text-sm text-gray-900 shadow-sm outline-none transition placeholder:text-gray-400 focus:border-violet-500 focus:ring-2 focus:ring-violet-500/20"
            />

            {hint && (
                <p className="text-xs text-gray-500">{hint}</p>
            )}
        </div>
    );
}
