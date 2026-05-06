const MAX_FAVORITE_ITEMS = 200

function getCurrentUser() {
  try {
    const raw = localStorage.getItem('studentUser')
    if (!raw) return null

    const parsed = JSON.parse(raw)
    if (!parsed?.id) return null

    return parsed
  } catch {
    return null
  }
}

function getFavoritesKey(userId) {
  return `favoriteBooks_${userId}`
}

function normalizeText(value = '') {
  return String(value).trim().toLowerCase()
}

function isSameFavorite(left, right) {
  if (!left || !right) return false

  const leftPath = normalizeText(left.path)
  const rightPath = normalizeText(right.path)
  if (leftPath && rightPath && leftPath === rightPath) return true

  const leftReadUrl = normalizeText(left.readUrl)
  const rightReadUrl = normalizeText(right.readUrl)
  if (leftReadUrl && rightReadUrl && leftReadUrl === rightReadUrl) return true

  return normalizeText(left.title) === normalizeText(right.title)
}

export function getUserFavorites() {
  const user = getCurrentUser()
  if (!user || user.role === 'admin') return []

  try {
    const stored = localStorage.getItem(getFavoritesKey(user.id))
    return stored ? JSON.parse(stored) : []
  } catch {
    return []
  }
}

export function isBookFavorite(book) {
  if (!book) return false
  const current = getUserFavorites()
  return current.some(item => isSameFavorite(item, book))
}

export function addBookToFavorites(book) {
  const user = getCurrentUser()
  if (!user || user.role === 'admin' || !book?.title) return

  const key = getFavoritesKey(user.id)
  const current = getUserFavorites()
  const now = new Date().toISOString()

  const nextItem = {
    title: book.title,
    author: book.author || '',
    description: book.description || '',
    path: book.path || '',
    readUrl: book.readUrl || '',
    img: book.img || '',
    source: book.source || 'library',
    addedAt: now
  }

  const existingIndex = current.findIndex(item => isSameFavorite(item, nextItem))
  if (existingIndex >= 0) {
    current.splice(existingIndex, 1)
  }

  const next = [nextItem, ...current].slice(0, MAX_FAVORITE_ITEMS)
  localStorage.setItem(key, JSON.stringify(next))
}

export function removeBookFromFavorites(book) {
  const user = getCurrentUser()
  if (!user || user.role === 'admin' || !book) return

  const key = getFavoritesKey(user.id)
  const current = getUserFavorites()
  const next = current.filter(item => !isSameFavorite(item, book))
  localStorage.setItem(key, JSON.stringify(next))
}

export function toggleBookFavorite(book) {
  if (isBookFavorite(book)) {
    removeBookFromFavorites(book)
    return false
  }

  addBookToFavorites(book)
  return true
}

export function clearUserFavorites() {
  const user = getCurrentUser()
  if (!user || user.role === 'admin') return

  localStorage.removeItem(getFavoritesKey(user.id))
}
