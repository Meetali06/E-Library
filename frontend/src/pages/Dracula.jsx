import BookViewer from '../components/BookViewer'

function Dracula() {
  return (
    <BookViewer
      title="Dracula"
      pdfPath="/books/dracula.pdf"
      coverImage="/images/dracula.jpg"
      description="The classic Gothic horror novel by Bram Stoker."
    />
  )
}

export default Dracula
