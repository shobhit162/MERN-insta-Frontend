import { createContext, useContext, useEffect, useState } from 'react'


export const LoaderContext = createContext()

export const LoaderProvider = ({ children }) => {
  const [isLoading, setIsLoading] = useState(false)
  const [loaderStack, setLoaderStack] = useState([])

  const start = () => {
    setLoaderStack([...loaderStack, true])
  }

  const stop = () => setLoaderStack([...loaderStack.slice(1)])

  useEffect(() => {
    if (!loaderStack.length) {
      setIsLoading(false)
      return
    }
    setIsLoading(true)
  }, [loaderStack, start, stop])

  return (
    <LoaderContext.Provider
      value={{
        isLoading,
        start,
        stop
      }}
    >
      {children}
    </LoaderContext.Provider>
  )
}

export const useLoader = () => {
  const loaderContext = useContext(LoaderContext)

  if (!loaderContext) {
    throw new Error('Please use useLoader inside the context of LoaderProvider')
  }

  return {
    start: loaderContext.start,
    stop: loaderContext.stop
  }
}