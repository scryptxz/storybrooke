import { create } from 'zustand';
import { createJSONStorage, persist } from 'zustand/middleware';
import { useUser } from './useUser';
import axios from 'axios';

export const useWishList = create()(
  persist(
    (set, get) => ({
      wishLists: {},

      addToWishList: async book => {
        const userId = useUser.getState().user?.userId;
        if (!userId) return;

        await axios('https://192.168.15.40:5278/api/WishList', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          data: {
            userId: userId,
            bookId: book.id,
          },
        }).then(res => {
          console.log(res);
          const current = get().wishLists[userId] || [];
          if (!current.find(b => b.id === book.id)) {
            set(state => ({
              wishLists: {
                ...state.wishLists,
                [userId]: [...current, book],
              },
            }));
          }
        });
      },

      removeFromWishList: async (bookId) => {
        const userId = useUser.getState().user?.userId;
        if (!userId) return;
        console.log(bookId);
        await axios(
          `https://192.168.15.40:5278/api/WishList/${userId}/${bookId}`,
          {
            method: 'DELETE',
          },
        ).then(res => {
          console.log('DELETAR', res);
          const current = get().wishLists[userId] || [];

          set(state => ({
            wishLists: {
              ...state.wishLists,
              [userId]: current.filter(b => b.id !== bookId),
            },
          }));
        });
      },

      isInWishList: bookId => {
        const userId = useUser.getState().user?.userId;
        if (!userId) return false;

        const list = get().wishLists[userId] || [];

        return list.some(book => book.id === bookId);
      },

      getWishList: async () => {
        const userId = useUser.getState().user?.userId;
        if (!userId) return [];
        await axios(
          `https://192.168.15.40:5278/api/WishList/ByUser/${userId}`,
          {
            method: 'GET',
            headers: {
              'Content-Type': 'application/json',
            },
          },
        );
        return get().wishLists[userId] || [];
      },
    }),
    {
      name: '_storybrooke-wishlist',
      storage: createJSONStorage(() => localStorage),
    },
  ),
);
