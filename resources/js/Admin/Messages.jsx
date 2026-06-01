import React from 'react'
import { createRoot } from 'react-dom/client'
import CreateReactScript from '../Utils/CreateReactScript.jsx'
import Adminto from '../Components/Adminto.jsx'
import MessagesRest from '../Actions/Admin/MessagesRest.js'
import MessageInbox from './MessageInbox.jsx'

const messagesRest = new MessagesRest()

CreateReactScript((el, properties) => {
  createRoot(el).render(
    <Adminto {...properties} title='Mensajes'>
      <MessageInbox
        badgeEvent='messages:seen'
        rest={messagesRest}
        title='Mensajes'
      />
    </Adminto>
  )
})
