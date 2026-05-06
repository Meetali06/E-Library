const MAX_HISTORY_ITEMS = 50

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

function getHistoryKey(userId) {
  return `readingHistory_${userId}`
}

export function addBookToHistory(book) {
  const user = getCurrentUser()
  if (!user || user.role === 'admin' || !book?.title) return

  const historyKey = getHistoryKey(user.id)
  const current = getUserHistory()
  const now = new Date().toISOString()

  const existingIndex = current.findIndex(item => item.path === book.path || item.title === book.title)

  const nextItem = {
    title: book.title,
    description: book.description || '',
    path: book.path || '',
    source: book.source || 'library',
    openedAt: now
  }

  if (existingIndex >= 0) {
    current.splice(existingIndex, 1)
  }

  const next = [nextItem, ...current].slice(0, MAX_HISTORY_ITEMS)
  localStorage.setItem(historyKey, JSON.stringify(next))
}

export function getUserHistory() {
  const user = getCurrentUser()
  if (!user || user.role === 'admin') return []

  const historyKey = getHistoryKey(user.id)
  try {
    const stored = localStorage.getItem(historyKey)
    return stored ? JSON.parse(stored) : []
  } catch {
    return []
  }
}

export function clearUserHistory() {
  const user = getCurrentUser()
  if (!user || user.role === 'admin') return

  const historyKey = getHistoryKey(user.id)
  localStorage.removeItem(historyKey)
}
