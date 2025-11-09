import dayjs from 'dayjs';
import { LuBookmarkCheck, LuBookmarkPlus } from 'react-icons/lu';
import { useNavigate } from 'react-router-dom';
//import { useUser } from '../stores/useUser';
import { useWishList } from '../stores/useWishList';
import { Button } from './Button';
import { IconButton } from './IconButton';

export const BookCard = ({ book }) => {
  //const { user } = useUser();
  const { addToWishList, removeFromWishList, isInWishList } = useWishList();
  const navigate = useNavigate();

  const handleToggleWishlist = () => {
    console.log(book.id)
    if (isInWishList(book.id)) {
      removeFromWishList(book.id);
      return;
    }

    addToWishList(book);
  };

  return (
    <div className="group flex flex-col overflow-hidden rounded-2xl border border-gray-200 bg-white">
      <div className="h-96 overflow-hidden">
        <img
          src={
            book?.volumeInfo?.imageLinks?.thumbnail ||
            'https://via.placeholder.com/128x192'
          }
          alt={book?.volumeInfo?.title}
          className="h-96 w-full object-cover transition-transform duration-300 ease-in-out group-hover:scale-105 group-hover:transform"
        />
      </div>

      <div className="flex-1 p-4">
        <h3 className="text-lg font-semibold">{book?.volumeInfo?.title}</h3>
        <p className="text-sm text-gray-500">
          {book?.volumeInfo?.authors?.join(', ')} •{' '}
          {dayjs(book?.volumeInfo?.publishedDate).format('YYYY')}
        </p>

        <p className="text-sm text-gray-500">
          Genero: {book?.volumeInfo?.categories?.join(', ')}
        </p>

        <p className="mt-2 text-sm italic">
          {book?.volumeInfo?.description?.substring(0, 100) ||
            'No description available'}
        </p>
      </div>

      <div className="flex items-center gap-2 px-4 pb-4">
        <Button className="flex-1" onClick={() => navigate(`/book/${book.id}`)}>
          Ver detalhes
        </Button>

        <IconButton
          icon={
            isInWishList(book.id) ? <LuBookmarkCheck /> : <LuBookmarkPlus />
          }
          onClick={handleToggleWishlist}
        />
      </div>
    </div>
  );
};
