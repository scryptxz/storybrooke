import { useEffect, useState } from 'react';
import { BookCard } from '../components/BookCard';
import { Search } from '../components/Search';
import BaseLayout from '../layouts/BaseLayout';
import { useWishList } from '../stores/useWishList';
import axios from 'axios';
import { useUser } from '../stores/useUser';
import toast from 'react-hot-toast';

export const WishList = () => {
  const [wishlistBooks, setWishlistBooks] = useState([]);
  const [loading, setLoading] = useState(true);
  const userId = useUser.getState().user?.userId;

  useEffect(() => {
    setLoading(true);
    axios(`https://localhost:5278/api/WishList/ByUser/${userId}`, {
      method: 'GET',
    })
      .then(async res => {
        const detailedBooks = await Promise.all(
          res.data.map(async item => {
            const bookRes = await axios.get(
              `https://www.googleapis.com/books/v1/volumes/${item.bookId}`,
            );
            return {
              ...item,
              book: bookRes.data,
            };
          }),
        );
        setWishlistBooks(detailedBooks);
        setLoading(false);
        console.log(detailedBooks);
      })
      .catch(() => {
        toast.error('Error no servidor');
        setLoading(false);
      });
  }, []);

  const { getWishList } = useWishList();

  console.log('getWishList', getWishList());

  return (
    <BaseLayout>
      <Search />

      {loading ? (
        <div className="mt-6 flex justify-center">
          <div className="border-primary h-8 w-8 animate-spin rounded-full border-4 border-t-transparent"></div>
        </div>
      ) : (
        <div className="mt-6 grid grid-cols-1 gap-6 sm:grid-cols-2 md:grid-cols-3 xl:grid-cols-5">
          {wishlistBooks.length > 0 ? (
            wishlistBooks.map(book => (
              <BookCard key={book.id} book={book.book} />
            ))
          ) : (
            <div className="col-span-full">
              <p className="text-center text-gray-500">
                Você ainda não tem nenhum livro na sua lista de leitura
              </p>
            </div>
          )}
        </div>
      )}
    </BaseLayout>
  );
};
