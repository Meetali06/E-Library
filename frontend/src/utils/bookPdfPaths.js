const bookPdfPaths = {
  '/book/rich-dad-poor-dad': '/books/Rich Dad Poor Dad ( PDFDrive ).pdf',
  '/book/think-and-grow-rich': '/books/Think And Grow Rich ( PDFDrive ).pdf',
  '/book/give-and-take': '/books/Give and Take_ WHY HELPING OTHERS DRIVES OUR SUCCESS ( PDFDrive ).pdf',
  '/book/resisting-happiness': '/books/RH.pdf',
  '/book/three-mistakes': '/books/Three Mistakes of My Life by Chetan Bhagat ( PDFDrive ) (1).pdf',
  '/book/wings-of-fire': '/books/Wings of fire ( PDFDrive ).pdf',
  '/book/one-indian-girl': '/books/One_Indian_Girl_-_Chetan_Bhagat-Redicals.pdf',
  '/book/triumphant-church': '/books/The Triumphant Church, Kenneth Hagin, 433pg.pdf',
  '/book/digital-colour-graphic': '/books/Digital Colour Graphic.pdf',
  '/book/maths-puzzle': '/books/Maths Puzzle Book.pdf',
  '/book/art-of-work': '/books/The Art of Work_ A Proven Path to Discovering What You Were Meant to Do ( PDFDrive ).pdf',
  '/book/stop-worrying': '/books/How To Stop Worrying And Start Living ( PDFDrive ).pdf',
  '/book/mystery-story': '/books/mystery_short_stories.pdf',
  '/book/atomic-habits': '/books/Atomic Habits by James Clear.pdf.pdf',
  '/book/the-alchemist': '/books/_OceanofPDF.com_The_Alchemist.pdf',
  '/book/quiet-power-introverts': '/books/Quiet The Power of Introverts in a World that Cant Stop Talking (Susan Cain) (Z-Library).pdf',
  '/book/the-kite-runner': '/books/The Kite Runner.pdf',
  '/book/two-states': '/books/2 states.pdf',
  '/book/steve-jobs': '/books/Steve-Jobs-PDFDrive-1.pdf',
  '/book/my-experiments-truth': '/books/mk gandhi.pdf',
  '/book/sherlock-holmes': '/books/toaz.info-the-complete-sherlock-holmes-pr_3b22c631ef252a8e6d5a7c0db7a1540a.pdf',
  '/book/gone-girl': '/books/Gone Girl.pdf',
  '/book/drawing-for-beginners': '/books/drawing for beginners.pdf',
  '/book/brief-history-time': '/books/A Brief History of Time .. Stephen Hawking.pdf',
  '/book/elegant-universe': '/books/7. Brian Green - The Elegant Universe (1999).pdf',
  '/book/meditations': '/books/Marcus Aurelius - Meditations.pdf',
  '/book/beyond-good-and-evil': '/books/2.pdf',
  '/book/pride-prejudice': '/books/Pride and Prejudice.pdf',
  '/book/the-notebook': '/books/The Notebook - Nicholas Spark.pdf',
  '/book/diary-young-girl': '/books/Anna frank_diary.pdf',
  '/book/the-shining': '/books/The Shining.pdf',
  '/book/dracula': '/books/dracula.pdf',
  '/book/rumi-poems': '/books/Coleman-Barks-The-Essential-Rumi.pdf',
  '/book/milk-and-honey': '/books/Milk and honey PDF.pdf',
  '/book/zero-to-one': '/books/Zero to one.pdf',
  '/book/intelligent-investor': '/books/The Intelligent Investor - BENJAMIN GRAHAM.pdf',
  '/book/why-we-sleep': '/books/-Why-We-Sleep.pdf',
  '/book/born-to-run': '/books/Born to Run PDF.pdf',
  '/book/harry-potter': '/books/Harry-Potter-and-The-Philosophers-Stone.pdf',
  '/book/charlottes-web': '/books/Charlotte_s_Web_.pdf',
  '/book/into-the-wild': '/books/Into The Wild.pdf',
  '/book/eat-pray-love': '/books/eat pray love.pdf',
  '/book/maus': '/books/Maus - Full Text.pdf',
  '/book/watchmen': '/books/Watchmen FULL TEXT.pdf',
  '/book/the-mountain-is-you': '/books/The Mountain Is You Transforming Self-Sabotage Into Self-Mastery (Brianna Wiest) (Z-Library).pdf'
}

export function getBookPdfPath(routePath) {
  return bookPdfPaths[routePath] || ''
}

export function toDirectPdfUrl(pdfPath) {
  if (!pdfPath) return ''
  return encodeURI(pdfPath)
}
