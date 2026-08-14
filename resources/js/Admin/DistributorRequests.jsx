import React from 'react'
import { createRoot } from 'react-dom/client'
import CreateReactScript from '../Utils/CreateReactScript.jsx'
import Adminto from '../Components/Adminto.jsx'
import MessagesRest from '../Actions/Admin/MessagesRest.js'
import MessageInbox from './MessageInbox.jsx'

const distributorRequestsRest = new MessagesRest('distributor-requests')

CreateReactScript((el, properties) => {
  createRoot(el).render(
    <Adminto {...properties} title='Solicitudes de distribuidores'>
      <MessageInbox
        badgeEvent='distributor-requests:seen'
        countSuffix='solicitudes'
        icon='ti ti-truck-delivery'
        rest={distributorRequestsRest}
        title='Solicitudes de distribuidores'
      />
    </Adminto>
  )
})
