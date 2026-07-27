import React from 'react';

interface CheckboxInputProps {
  isActive: boolean;
  onChange: () => void;
}

const CheckboxInput: React.FC<CheckboxInputProps> = ({isActive, onChange}) => {
  return (
    <div style={{marginTop: '3px'}}>
      <input
        type="checkbox"
        defaultChecked={isActive ?? false}
        onChange={onChange}
      />
    </div>
  );
};

export default CheckboxInput;
