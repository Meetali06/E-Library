import BookViewer from '../components/BookViewer'

function TheShining() {
  return (
    <BookViewer
      title="The Shining"
      pdfPath="/books/The Shining.pdf"
      coverImage="/images/shining-king.jpg"
      description="A terrifying tale of isolation and madness by Stephen King."
    />
  )
}

export default TheShining
