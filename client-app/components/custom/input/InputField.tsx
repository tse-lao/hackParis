"use client"

export default function InputField({ label, name, type, value, onChange,placeholder, required,helptext, onEnter }:
     {label:string, name?:string, type:string, value:string, onChange:any, placeholder?:string, required?:boolean,helptext?:string, onEnter?:any}
    ) {

    
  const handleKeyDown = (e:any) => {
    if (e.key === 'Enter') {
      console.log("Enter key was pressed. Current input value: ", e.target.value);
      if(onEnter) {
        
        onEnter(e.target.value)

      }
    }
  }
    return (
      <div className="col-span-1">
        <label htmlFor={name} className="block text-sm tracking-wider text-gray-700">
          {label}
        </label>
        <input
          type={type}
          name={name}
          id={name}
          placeholder={placeholder}
          value={value}
          onChange={onChange}
          onKeyDown={handleKeyDown}
          className="mt-1 block w-full py-2 px-3 border border-gray-300 bg-white rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
        />
        <span className="mt-2 text-sm text-gray-500">
            {helptext}
        </span>
      </div>
    );
  }
  