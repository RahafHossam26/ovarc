const { Sequelize, DataTypes } = require('sequelize');

const sequelize = new Sequelize({
  dialect: 'sqlite',
  storage: './database.sqlite',
  logging: false
});

const Author = sequelize.define('Author', {
  name: { type: DataTypes.STRING, allowNull: false }
});

const Book = sequelize.define('Book', {
  name: { type: DataTypes.STRING, allowNull: false },
  pages: { type: DataTypes.INTEGER }
});

const Store = sequelize.define('Store', {
  name: { type: DataTypes.STRING, allowNull: false },
  address: { type: DataTypes.STRING },
  logo: { type: DataTypes.STRING } // URL or file path
});

// The Junction Table (Many-to-Many)
const StoreBook = sequelize.define('StoreBook', {
  price: { type: DataTypes.FLOAT, defaultValue: 0 },
  copies: { type: DataTypes.INTEGER, defaultValue: 1 },
  sold_out: { type: DataTypes.BOOLEAN, defaultValue: false }
});

// Relationships
Author.hasMany(Book, { foreignKey: 'author_id' });
Book.belongsTo(Author, { foreignKey: 'author_id' });

Store.belongsToMany(Book, { through: StoreBook, foreignKey: 'store_id' });
Book.belongsToMany(Store, { through: StoreBook, foreignKey: 'book_id' });

module.exports = { sequelize, Author, Book, Store, StoreBook };