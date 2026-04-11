import React, { useEffect, useRef } from "react"

const SelectFormGroup = ({ col, label, eRef, required = false, children, dropdownParent, disabled = false, onChange = () => { },
  templateResult,
  templateSelection
}) => {

  if (!eRef) eRef = useRef()

  useEffect(() => {
    $(eRef.current).select2({
      dropdownParent,
      templateResult,
      templateSelection
    })
    $(eRef.current).on('change', onChange)
  }, [dropdownParent])

  return <div className={`form-group ${col} mb-2`}>
    <label htmlFor='' className="form-label">
      {label} {(label && required) && <b className="text-danger">*</b>}
    </label>
    <select ref={eRef} required={required} className='form-control' style={{ width: '100%' }} disabled={disabled}>
      {children}
    </select>
  </div>
}

export default SelectFormGroup