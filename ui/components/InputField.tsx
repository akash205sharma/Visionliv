import React from "react";

interface Props {
  label: string;
  value: string;
  name: string;
  placeholder: string;
  type?:string;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
}

const InputField: React.FC<Props> = ({ label, value, onChange , placeholder , name, type }) => {
  return (
    <div className="mt-3">
      <label className="text-sm font-medium text-gray-400 w-full">{label}</label>
      <input
        type={ type ||"text"}
        value={value}
        name ={name}
        placeholder={placeholder}
        onChange={onChange}
        className="mt-1  p-2 border rounded-lg w-full"
      />
    </div>
  );
};

export default InputField;



//[#191919]