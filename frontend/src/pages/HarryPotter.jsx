import BookViewer from '../components/BookViewer'

function HarryPotter() {
  return (
    <BookViewer
      title="Harry Potter and the Sorcerer's Stone"
      pdfPath="/books/Harry-Potter-and-The-Philosophers-Stone.pdf"
      coverImage="/images/harry-potter.jpg"
      description="The magical beginning of the wizarding world by J.K. Rowling."
    />
  )
}

export default HarryPotter
