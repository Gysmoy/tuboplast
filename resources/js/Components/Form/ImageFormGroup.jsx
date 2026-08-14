import React, { useEffect, useRef } from "react"

const ImageFormGroup = ({ id, col, label, eRef, required = false, onChange = () => { }, aspect = '21/9', fit = 'cover', onError = '/api/cover/thumbnail/null'}) => {

  if (!id) id = `ck-${crypto.randomUUID()}`

  const fallbackRef = useRef()
  const inputRef = eRef || fallbackRef
  const imageRef = useRef()

  const onImageChange = async (e) => {
    const file = e.target.files[0]
    if (!file) return
    const url = await File.toURL(file)
    imageRef.current.src = url
    onChange(e)
  }

  useEffect(() => {
    if (inputRef?.current) {
      inputRef.current.image = imageRef.current
    }
  }, [inputRef])

  return <div className={`form-group ${col} mb-1`}>
    <label htmlFor={id} className="mb-1">
      {label} {required && <b className="text-danger">*</b>}
    </label>
    <label htmlFor={id} style={{width: '100%'}}>
      <img ref={imageRef} className="d-block" src="" alt="" onError={e => { if (onError && !e.target.src.endsWith(onError)) e.target.src = onError }} style={{
        width: '100%',
        borderRadius: '4px',
        cursor: 'pointer',
        aspectRatio: aspect,
        objectFit: fit,
        objectPosition: 'center'
      }} />
    </label>
    <input ref={inputRef} id={id} type="file" src="" alt="" hidden accept="image/*" onChange={onImageChange} />
  </div>
}

export default ImageFormGroup
