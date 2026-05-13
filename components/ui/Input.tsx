interface InputProps {
  label: string;
  value: string;
  type?: string;
  placeholder?: string; // Add this
  disabled?: boolean;    // Add this
  onChange: (val: string) => void;
}

export default function Input({ 
  label, 
  value, 
  type = "text", 
  placeholder, 
  disabled, 
  onChange 
}: InputProps) {
  return (
    <div className="flex flex-col mb-4 w-full">
      <label className="text-gray-700 mb-1 font-medium text-sm">{label}</label>
      <input
        type={type}
        value={value}
        placeholder={placeholder} // Pass it down
        disabled={disabled}       // Pass it down
        onChange={(e) => onChange(e.target.value)}
        className="border border-gray-300 px-3 py-3 rounded-xl focus:outline-none focus:ring-2 focus:ring-orange-500 transition-all disabled:bg-gray-100 disabled:cursor-not-allowed disabled:text-gray-400"
      />
    </div>
  );
}