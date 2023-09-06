import "./style.css";
import { data } from "./util/data";
import { loadImages } from "./api";

type Image = {
  id: number
  title: string
  url: string
  smallAmount: number
  largeAmount: number
}

type Item = {
  id: number,
  smallAmount: number
  largeAmount: number
}

type Order = {
  email: string
  items: Item[]
}


// ------------------------------ App state ------------------------------
let isLoading = data(false)
let images = data<Image[]>([])
let searchInput = data("")
let order: Order | null = null
let page: "order" | "success" | "error" = "order"
let isSending = false
let notificationText = data<string | null>(null)
// ------------------------------ App state ------------------------------



// ------------------------------ Mutation ------------------------------
const start = async () => {
  isLoading.next(true)
  const response = await loadImages()
  isLoading.next(false)
  if (!response.success)
    return notificationText.next("" + response.error)
  images.next(response.data.map(img => ({ ...img, smallAmount: 0, largeAmount: 0 })))
}

const search = async () => {
  isLoading.next(true)
  const response = await loadImages(searchInput.get())
  isLoading.next(false)
  if (!response.success)
    return notificationText.next("" + response.error)
  const data = response.data
  images.next(data.map(img => ({ ...img, smallAmount: 0, largeAmount: 0 })))
}
// ------------------------------ Mutation ------------------------------


// ------------------------------ Event listener ------------------------------
const searchInputChangeListener = (event: Event) => {
  searchInput.next((event.target as HTMLInputElement).value)
}
// ------------------------------ Event listener ------------------------------



// ------------------------------ Rendering ------------------------------
const renderLoading = (isLoading: boolean) =>
  document.getElementById("loading-container")!.innerHTML =
    isLoading ? `<span class="loading loading-dots loading-lg"></span>` : ""

const renderNotification = (notification: string | null) =>
  document.getElementById("notification-container")!.innerHTML =
    notification ? `
    <div class="alert alert-error">
      <svg xmlns="http://www.w3.org/2000/svg" class="stroke-current shrink-0 h-6 w-6" fill="none" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M10 14l2-2m0 0l2-2m-2 2l-2-2m2 2l2 2m7-2a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
      <span>${notification}</span>
    </div>
    ` : ""

const renderImages = (images: Image[]) =>
  document.getElementById("images-container")!.innerHTML = `
    <div class="flex gap-8 flex-wrap p-8">
      ${images.map(img => `
        <div class="card bg-primary text-primary-content shadow-xl basis-[240px] flex-grow flex-shrink-0">
          <figure><img src="${img.url}" alt="Shoes" /></figure>
          <div class="card-body">
            <h2 class="card-title">${img.title}</h2>
            <div class="card-actions justify-end">
              <button class="btn btn-success">Buy Now</button>
            </div>
          </div>
        </div>
      `).join("")}
    </div>
  `

const renderSearchInput = (searchValue: string) => {
  const input = document.getElementById("search-input") as HTMLInputElement
  input.value = searchValue
}

document.getElementById("search-button")!.addEventListener("click", search)
document.getElementById("search-input")!.addEventListener("change", searchInputChangeListener)
// ------------------------------ Rendering ------------------------------

isLoading.subscribe(renderLoading)
notificationText.subscribe(renderNotification)
images.subscribe(renderImages)
searchInput.subscribe(renderSearchInput)

start()





