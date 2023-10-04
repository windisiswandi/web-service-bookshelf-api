const { nanoid } = require('nanoid');
const books = require('./books');

const addBooksHandler = (request, h) => {
  const id = nanoid(16);
  const insertedAt = new Date().toISOString();
  const updatedAt = new Date().toISOString();

  const res = {};

  const {
    name,
    year,
    author,
    summary,
    publisher,
    pageCount,
    readPage,
    reading,
  } = request.payload;

  const newBooks = {
    id,
    name,
    year,
    author,
    summary,
    publisher,
    pageCount,
    readPage,
    finished: pageCount === readPage,
    reading,
    insertedAt,
    updatedAt,
  };

  if (name) {
    if (readPage > pageCount) {
      res.status = 'fail';
      res.message = 'Gagal menambahkan buku. readPage tidak boleh lebih besar dari pageCount';
      const response = h.response(res);
      response.code(400);
      return response;
    }

    books.push(newBooks);
    res.status = 'success';
    res.message = 'Buku berhasil ditambahkan';
    res.data = { bookId: id };
    const response = h.response(res);
    response.code(201);
    return response;
  }

  const response = h.response({
    status: 'fail',
    message: 'Gagal menambahkan buku. Mohon isi nama buku',
  });

  response.code(400);

  return response;
};

const getAllBooksHandler = (request, h) => {
  let newDataBooks = books;
  const { name, reading, finished } = request.query;

  if (name) newDataBooks = books.filter((book) => book.name.toLowerCase().includes(name.toLowerCase()));
  if (reading === '1') newDataBooks = books.filter((book) => book.reading === true);
  if (reading === '0') newDataBooks = books.filter((book) => book.reading === false);
  if (finished === '1') newDataBooks = books.filter((book) => book.finished === true);
  if (finished === '0') newDataBooks = books.filter((book) => book.finished === false);

  const response = h.response({
    status: 'success',
    data: {
      books: newDataBooks.map((book) => ({ id: book.id, name: book.name, publisher: book.publisher })),
    },
  });
  response.code(200);
  return response;
};

const getBookById = (request, h) => {
  const { bookId } = request.params;
  const index = books.findIndex((book) => book.id === bookId);
  const res = {};

  if (index !== -1) {
    res.status = 'success';
    res.data = { book: books[index] };
    const response = h.response(res);
    response.code(200);
    return response;
  }

  res.status = 'fail';
  res.message = 'Buku tidak ditemukan';
  const response = h.response(res);
  response.code(404);
  return response;
};

const updateBookHandler = (request, h) => {
  const { bookId } = request.params;
  const index = books.findIndex((book) => book.id === bookId);
  const updatedAt = new Date().toISOString();
  const res = {};

  if (index === -1) {
    res.status = 'fail';
    res.message = 'Gagal memperbarui buku. Id tidak ditemukan';
    const response = h.response(res);
    response.code(404);
    return response;
  }

  const {
    name,
    year,
    author,
    summary,
    publisher,
    pageCount,
    readPage,
    reading,
  } = request.payload;

  if (name) {
    if (readPage > pageCount) {
      res.status = 'fail';
      res.message = 'Gagal memperbarui buku. readPage tidak boleh lebih besar dari pageCount';
      const response = h.response(res);
      response.code(400);
      return response;
    }

    books[index] = {
      ...books[index],
      name,
      year,
      author,
      summary,
      publisher,
      pageCount,
      readPage,
      finished: pageCount === readPage,
      reading,
      updatedAt,
    };
    res.status = 'success';
    res.message = 'Buku berhasil diperbarui';
    const response = h.response(res);
    response.code(200);
    return response;
  }

  const response = h.response({
    status: 'fail',
    message: 'Gagal memperbarui buku. Mohon isi nama buku',
  });
  response.code(400);
  return response;
};

const deleteBookHandler = (request, h) => {
  const index = books.findIndex((book) => book.id === request.params.bookId);

  if (index !== -1) {
    books.splice(index, 1);
    const response = h.response({
      status: 'success',
      message: 'Buku berhasil dihapus',
    });
    response.code(200);
    return response;
  }

  const response = h.response({
    status: 'fail',
    message: 'Buku gagal dihapus. Id tidak ditemukan',
  });
  response.code(404);
  return response;
};

module.exports = {
  addBooksHandler,
  getAllBooksHandler,
  getBookById,
  updateBookHandler,
  deleteBookHandler,
};
