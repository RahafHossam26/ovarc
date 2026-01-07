const PDFDocument = require('pdfkit');
const { Store, Book, Author, StoreBook, sequelize } = require('../models');
const dayjs = require('dayjs');

exports.generateReport = async (req, res) => {
  try {
    const store = await Store.findByPk(req.params.id);
    if (!store) return res.status(404).send('Store not found');

    // 1. Query Top 5 Priciest Books 
    const priciestBooks = await StoreBook.findAll({
      where: { store_id: store.id },
      include: [{
        model: Book,
        attributes: ['name']
      }],
      order: [['price', 'DESC']],
      limit: 5
    });

    // 2. Query Top 5 Prolific Authors (Fixed SQLite Alias Issue)
    // We use a literal subquery to count books - this is the safest way in SQLite
    const prolificAuthors = await Author.findAll({
      attributes: [
        'name', 
        [
          sequelize.literal(`(
            SELECT COUNT(*) 
            FROM Books 
            INNER JOIN StoreBooks ON Books.id = StoreBooks.book_id 
            WHERE Books.author_id = Author.id 
            AND StoreBooks.store_id = ${store.id}
          )`), 
          'bookCount'
        ]
      ],
      order: [[sequelize.literal('bookCount'), 'DESC']],
      limit: 5
    });

    // 3. Generate PDF
    const doc = new PDFDocument();
    const fileName = `${store.name.replace(/\s+/g, '_')}-Report-${dayjs().format('YYYY-MM-DD')}.pdf`;
    
    res.setHeader('Content-Type', 'application/pdf');
    res.setHeader('Content-Disposition', `attachment; filename="${fileName}"`);
    doc.pipe(res);

    // --- PDF Layout ---
    doc.fontSize(25).text(store.name, { align: 'center' });
    doc.fontSize(12).text(store.address, { align: 'center' });
    doc.moveDown(2);
    
    // Table 1: Priciest Books
    doc.fontSize(18).fillColor('#2c3e50').text('Top 5 Priciest Books:');
    doc.moveDown(0.5);
    if (priciestBooks && priciestBooks.length > 0) {
      priciestBooks.forEach(pb => {
        const bookName = pb.Book ? pb.Book.name : 'Unknown Book';
        doc.fontSize(12).fillColor('black').text(`${bookName} - $${pb.price.toFixed(2)}`);
      });
    } else {
      doc.fontSize(12).fillColor('black').text('No books found for this store.');
    }
    
    doc.moveDown(2);
    
    // Table 2: Prolific Authors
    doc.fontSize(18).fillColor('#2c3e50').text('Top 5 Prolific Authors:');
    doc.moveDown(0.5);
    if (prolificAuthors && prolificAuthors.length > 0) {
      prolificAuthors.forEach(a => {
        const count = a.get('bookCount') || 0;
        doc.fontSize(12).fillColor('black').text(`${a.name} (${count} books in stock)`);
      });
    } else {
      doc.fontSize(12).fillColor('black').text('No authors found for this store.');
    }
    
    doc.end();
  } catch (error) {
    console.error('PDF Generation Error:', error);
    // Fallback if the database is empty or error occurs
    res.status(500).send('Internal Server Error: ' + error.message);
  }
};