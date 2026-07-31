import React from 'react'
import { createRoot } from 'react-dom/client'
import CreateReactScript from '../Utils/CreateReactScript.jsx'
import ProductTaxonomyPage from './ProductTaxonomyPage.jsx'

CreateReactScript((el, properties) => {
  createRoot(el).render(
    <ProductTaxonomyPage {...properties} path='product-types' title='Tipos' singular='tipo' icon='ti ti-tags' />
  )
})
