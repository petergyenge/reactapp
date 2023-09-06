import axios, { AxiosError, AxiosResponse } from "axios"
import { z } from "zod"

const client = axios.create({
  baseURL: "http://localhost:8000"
})

const getImages = async (title?: string): Promise<AxiosResponse | null> => {
  try {
    const params = title ? { title } : { }
    const response = await client.get("/api/images", { params })
    return response
  } catch (error) {
    return (error as AxiosError).response || null
  }
}

const ImageResponse = z.object({
  id: z.number(),
  title: z.string(),
  url: z.string()
}).array()

type ImageResponse = z.infer<typeof ImageResponse>

const validateImages = (response: AxiosResponse): ImageResponse | null => {
  const result = ImageResponse.safeParse(response.data)
  if (!result.success) {
    return null
  }
  return result.data
}

type Response<Type> = {
  data: Type
  status: number
  success: true
} | {
  error: string
  status: number
  success: false
}

export const loadImages = async (title?: string): Promise<Response<ImageResponse>> => {
  const response = await getImages(title)
  if (!response)
    return { success: false, status: 0, error: "Network Error"  }
  if (response.status !== 200)
    return { success: false, status: response.status, error: "Server error"  }
  const data = validateImages(response)
  if (!data)
    return { success: false, status: response.status, error: "Validation"  }
  return { success: true, status: response.status, data }
}