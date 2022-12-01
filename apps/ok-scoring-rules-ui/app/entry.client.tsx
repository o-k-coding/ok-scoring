// entry.client.tsx
import React, { ReactElement, useState } from 'react'
import { hydrate } from 'react-dom'
import { CacheProvider } from '@emotion/react'
import { RemixBrowser } from '@remix-run/react'

import { ClientStyleContext } from './context'
import createEmotionCache from './createEmotionCache'

interface ClientCacheProviderProps {
  children: React.ReactNode;
}

function ClientCacheProvider({ children }: ClientCacheProviderProps) {
  const [cache, setCache] = useState(createEmotionCache());

  function reset() {
    setCache(createEmotionCache());
  }

  return (
    <ClientStyleContext.Provider value={{ reset }}>
      <CacheProvider value={cache}>{children}</CacheProvider>
    </ClientStyleContext.Provider>
  );
}

hydrate<ReactElement>(
  <ClientCacheProvider>
    <RemixBrowser />
  </ClientCacheProvider>,
  document as any,
);
