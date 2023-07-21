
export default function Textarea({ label, name, rows, value, onChange, required, code, className, helptext }
    : {label:string, name:string, rows:number, value:string, onChange:any, required:boolean, code?:boolean, className?:string, helptext?:string}) {
    return (
      <div className={`${className}`}>
        <label htmlFor={name} className="block text-sm tracking-wider text-gray-700">
          {label}
        </label>
        <textarea
          name={name}
          id={name}
          rows={rows}
          value={value}
          onChange={onChange}
          required={required}
          className={`mt-1 block w-full py-2 px-3 border border-gray-300 bg-white rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm ${code && 'bg-black text-green-600 font-bold focus:ring-green-300'}`}
        ></textarea>
        {helptext && <span className="text-sm text-gray-500">{helptext}</span>}
      </div>
    );
  }
  