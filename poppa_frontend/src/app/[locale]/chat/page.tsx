'use client';

import React, { useContext, useEffect, useRef } from 'react';
import Script from 'next/script';
import { AuthContext } from '../../../context/AuthContext'; // Adjust path as needed
import ProtectedRoute from '../../../components/ProtectedRoute'; // Adjust path as needed
import { useTranslation } from 'react-i18next';

const ElevenLabsChatPage = () => {
  const { user } = useContext(AuthContext);
  const { t } = useTranslation();
  const agentId = process.env.NEXT_PUBLIC_ELEVENLABS_AGENT_ID;
  const widgetRef = useRef<HTMLElement | null>(null); // Specify the type for the ref

  useEffect(() => {
    // The widget script will initialize the custom element.
    // We need to ensure the user_id is set after the element is defined and the user is available.
    
    const attemptSetDynamicVariables = () => {
      if (user && user.id && agentId) {
        // HTMLElement type doesn't inherently know about 'setAttribute' for dynamic-variables
        // for custom elements. We cast to 'any' or a more specific type if available.
        const widget = document.querySelector('elevenlabs-convai') as any; 
        if (widget) {
          console.log(`Setting dynamic-variables for user: ${user.id}`);
          widget.setAttribute('dynamic-variables', JSON.stringify({ user_id: user.id }));
        } else {
          // If the widget is not found, retry shortly as the script might still be loading
          // and defining the custom element.
          // console.log("Widget not found, will retry setting dynamic variables.");
          // setTimeout(attemptSetDynamicVariables, 500); // Retry after 500ms
        }
      }
    };

    // Attempt to set variables when user is available.
    // The script loading is async, so the custom element might not be defined immediately.
    // A more robust solution might involve listening for a custom event from the widget
    // indicating it's ready, or using MutationObserver if the widget is added dynamically.
    // For now, a simple timeout or direct call if user is already loaded.
    if (user && user.id) {
        attemptSetDynamicVariables();
    }
    
    // If the widget is already in the DOM and the script has run,
    // this will set the variables. If the script runs later, it should pick up agent-id.
    // The dynamic-variables might need to be set after the script fully processes.
    // A listener for the script's onload event can be more reliable for setting dynamic-variables.

    const scriptElement = document.querySelector('script[src="https://elevenlabs.io/convai-widget/index.js"]');
    if (scriptElement) {
        scriptElement.addEventListener('load', attemptSetDynamicVariables);
    }


    return () => {
        if (scriptElement) {
            scriptElement.removeEventListener('load', attemptSetDynamicVariables);
        }
    };

  }, [user, agentId]);


  if (!agentId) {
    return (
      <div className="container mx-auto px-4 py-8 text-center">
        <p className="text-red-500">{t('chat.error.agentIdMissing')}</p>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold text-center mb-8">{t('chat.title')}</h1>
      <div className="flex justify-center">
        {/* 
          The 'key' prop can be used to force re-initialization if agentId or user.id changes,
          though for agentId it's unlikely and for user.id, dynamic-variables is preferred.
          However, setting attributes directly via DOM manipulation as in useEffect is often
          necessary for third-party web components if they don't react to prop changes.
        */}
        <elevenlabs-convai ref={widgetRef} agent-id={agentId}></elevenlabs-convai>
      </div>
      {/* The script is loaded once via next/script for the application lifetime if placed in _app or layout,
          or per page if placed here. For a widget like this, per-page or per-component is fine.
          Ensure it's only loaded once if multiple instances of the page/component are not expected,
          or if the script handles multiple initializations gracefully.
      */}
      <Script src="https://elevenlabs.io/convai-widget/index.js" strategy="lazyOnload" async />
    </div>
  );
};


// Wrap the page with ProtectedRoute
const ProtectedElevenLabsChatPage = () => {
  return (
    <ProtectedRoute>
      <ElevenLabsChatPage />
    </ProtectedRoute>
  );
};

export default ProtectedElevenLabsChatPage;
