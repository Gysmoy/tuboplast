import React, { useEffect, useRef } from "react"

const SelectFormGroup = ({ col, label, eRef, required = false, children, dropdownParent, disabled = false, onChange = () => { },
  templateResult,
  templateSelection
}) => {

  if (!eRef) eRef = useRef()

  useEffect(() => {
    const $element = $(eRef.current)
    const $dropdownParent = dropdownParent ? $(dropdownParent) : undefined
    $element.select2({
      dropdownParent: $dropdownParent,
      templateResult,
      templateSelection
    })
    $element.on('change', onChange)

    return () => {
      $element.off('change', onChange)
      if ($element.data('select2')) $element.select2('destroy')
    }
  }, [dropdownParent, onChange, templateResult, templateSelection])

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
