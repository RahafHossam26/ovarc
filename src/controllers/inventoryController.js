const fs = require('fs');
const csv = require('csv-parser');
const { Author, Book, Store, StoreBook } = require('../models');

exports.uploadCSV = async (req, res) => {
  if (!req.file) return res.status(400).send('No file uploaded.');

  const results = [];
  // Use createReadStream to parse the uploaded CSV file
  fs.createReadStream(req.file.path)
    .pipe(csv())
    .on('data', (data) => results.push(data))
    .on('end', async () => {
      try {
        for (const row of results) {
          // 1. Author logic
          const [author] = await Author.findOrCreate({ where: { name: row.author_name } });

          // 2. Book logic
          const [book] = await Book.findOrCreate({ 
            where: { name: row.book_name, author_id: author.id },
            defaults: { pages: parseInt(row.pages) }
          });

          // 3. Store logic
          const [store] = await Store.findOrCreate({ 
            where: { name: row.store_name },
            defaults: { address: row.store_address, logo: row.logo }
          });

          // 4. StoreBook logic (The Upsert)
          const existingEntry = await StoreBook.findOne({ 
            where: { store_id: store.id, book_id: book.id } 
          });

          if (existingEntry) {
            // Increment copies if book exists in store
            await existingEntry.increment('copies', { by: 1 });
          } else {
            // Create new record if first time
            await StoreBook.create({
              store_id: store.id,
              book_id: book.id,
              price: parseFloat(row.price),
              copies: 1
            });
          }
        }
        res.status(200).json({ message: 'Inventory updated successfully' });
      } catch (error) {
        res.status(500).json({ error: error.message });
      } finally {
        // Delete temp file after processing
        if (fs.existsSync(req.file.path)) fs.unlinkSync(req.file.path);
      }
    });
};