const arr = [
  {
    nama: 'dicoding',
  },
  {
    nama: 'Dicoding',
  },
  {
    nama: 'buku A',
  },
];

const item = 'Dicoding';

const arr2 = arr.filter((a) => a.nama.includes(item));
console.log(arr2);
