export const getDepartments = (rows) => {
  return Array.from(new Set((rows || []).map(x => x.department))).filter(Boolean).sort((a, b) => a.localeCompare(b))
}

export const getProvinces = (rows, department) => {
  return Array.from(new Set((rows || [])
    .filter(x => x.department === department)
    .map(x => x.province))).filter(Boolean).sort((a, b) => a.localeCompare(b))
}

export const getDistricts = (rows, department, province) => {
  return (rows || [])
    .filter(x => x.department === department && x.province === province)
    .sort((a, b) => String(a.district).localeCompare(String(b.district)))
}

