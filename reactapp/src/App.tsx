import { useState } from 'react'
import './App.css'
import { loadImages } from './api'

type Image = {
  id: number
  title: string
  url: string
  smallAmount: number
  largeAmount: number
}


function App() {

  const [ isLoadin, setIsLoading] = useState(false)
  const [ notificationText, setNotificationText ] = useState<string | null>()
  const [ images, setImages ] = useState<Image[]>([])

  const search = async () => {
    setIsLoading(true)
    const response = await loadImages()
    setIsLoading(false)
    if (!response.success)
      return setNotificationText(response.error)
    const data = response.data
    setImages(data.map(img => ({ ...img, smallAmount: 0, largeAmount: 0 })))
  }

  return (
      <div className="card">
        <button onClick={search}>Search</button>
        { isLoadin ? "Loading..." : images.map(img => <div>{img.title}</div>) }
        { notificationText && <h1>{notificationText}</h1> }
      </div>
  )
}

export default App
