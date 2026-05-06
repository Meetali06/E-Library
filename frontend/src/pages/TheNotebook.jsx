import BookViewer from '../components/BookViewer'

function TheNotebook() {
  return (
    <BookViewer
      title="The Notebook"
      pdfPath="/books/The Notebook - Nicholas Spark.pdf"
      coverImage="/images/notebook-sparks.jpg"
      description="A timeless love story by Nicholas Sparks."
    />
  )
}

export default TheNotebook
