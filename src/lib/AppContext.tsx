import React, { createContext, useContext, useState, ReactNode } from 'react';
import { Book, Member, Transaction, LibrarySettings } from '../types';
import { mockBooks, mockMembers, mockTransactions } from './data';

interface AppContextType {
  books: Book[];
  members: Member[];
  transactions: Transaction[];
  settings: LibrarySettings;
  borrowBook: (bookId: string, memberId: string) => void;
  requestBook: (bookId: string, memberId: string) => string; // Returns booking code
  validateBooking: (bookingCode: string) => { success: boolean; message: string };
  returnBook: (transactionId: string) => void;
  addBook: (book: Omit<Book, 'id'>) => void;
  updateBook: (id: string, book: Partial<Book>) => void;
  deleteBook: (id: string) => void;
  addMember: (member: Omit<Member, 'id'>) => void;
  updateSettings: (settings: Partial<LibrarySettings>) => void;
}

const AppContext = createContext<AppContextType | undefined>(undefined);

export function AppProvider({ children }: { children: ReactNode }) {
  const [books, setBooks] = useState<Book[]>(mockBooks);
  const [members, setMembers] = useState<Member[]>(mockMembers);
  const [transactions, setTransactions] = useState<Transaction[]>(mockTransactions);
  const [settings, setSettings] = useState<LibrarySettings>({
    finePerDay: 2000,
    maxBorrowDays: 7,
    maxBooksPerMember: 3,
    enableNotifications: true,
    darkMode: false
  });

  const borrowBook = (bookId: string, memberId: string) => {
    setBooks(prev => prev.map(b => 
      b.id === bookId 
        ? { ...b, availableQuantity: Math.max(0, b.availableQuantity - 1), status: b.availableQuantity <= 1 ? 'Borrowed' : 'Available' } 
        : b
    ));
    const newTx: Transaction = {
      id: Math.random().toString(36).substr(2, 9),
      bookId,
      memberId,
      borrowDate: new Date().toISOString().split('T')[0],
      status: 'Borrowed'
    };
    setTransactions(prev => [...prev, newTx]);
  };

  const requestBook = (bookId: string, memberId: string): string => {
    const bookingCode = Math.random().toString(36).substring(2, 7).toUpperCase();
    
    setBooks(prev => prev.map(b => 
      b.id === bookId 
        ? { ...b, availableQuantity: Math.max(0, b.availableQuantity - 1), status: b.availableQuantity <= 1 ? 'Borrowed' : 'Available' } 
        : b
    ));

    const newTx: Transaction = {
      id: Math.random().toString(36).substr(2, 9),
      bookId,
      memberId,
      borrowDate: new Date().toISOString().split('T')[0],
      status: 'Pending',
      bookingCode
    };
    
    setTransactions(prev => [...prev, newTx]);
    return bookingCode;
  };

  const validateBooking = (bookingCode: string) => {
    const txIndex = transactions.findIndex(t => t.bookingCode === bookingCode && t.status === 'Pending');
    
    if (txIndex === -1) {
      return { success: false, message: 'Kode booking tidak valid atau sudah kedaluwarsa.' };
    }

    const tx = transactions[txIndex];
    
    setTransactions(prev => prev.map(t => 
      t.bookingCode === bookingCode ? { ...t, status: 'Borrowed' } : t
    ));
    
    // Note: Book quantity already decreased during requestBook
    
    return { success: true, message: `Buku "${books.find(b => b.id === tx.bookId)?.title}" berhasil dikonfirmasi peminjamannya.` };
  };

  const returnBook = (transactionId: string) => {
    const tx = transactions.find(t => t.id === transactionId);
    if (!tx) return;
    
    setTransactions(prev => prev.map(t => 
      t.id === transactionId ? { ...t, status: 'Returned', returnDate: new Date().toISOString().split('T')[0] } : t
    ));
    setBooks(prev => prev.map(b => b.id === tx.bookId 
      ? { ...b, availableQuantity: Math.min(b.quantity, b.availableQuantity + 1), status: 'Available' } 
      : b
    ));
  };

  const addBook = (bookData: Omit<Book, 'id'>) => {
    const newBook: Book = { 
      ...bookData, 
      id: Math.random().toString(36).substring(2, 9),
      availableQuantity: bookData.quantity || 1,
      quantity: bookData.quantity || 1
    };
    setBooks(prev => [...prev, newBook]);
  };

  const updateBook = (id: string, bookData: Partial<Book>) => {
    setBooks(prev => prev.map(b => b.id === id ? { ...b, ...bookData } : b));
  };

  const deleteBook = (id: string) => {
    setBooks(prev => prev.filter(b => b.id !== id));
  };

  const addMember = (memberData: Omit<Member, 'id'>) => {
    const newMember: Member = { ...memberData, id: Math.random().toString(36).substring(2, 9) };
    setMembers(prev => [...prev, newMember]);
  };

  const updateSettings = (newSettings: Partial<LibrarySettings>) => {
    setSettings(prev => ({ ...prev, ...newSettings }));
  };

  return (
    <AppContext.Provider value={{ 
      books, 
      members, 
      transactions, 
      settings,
      borrowBook, 
      requestBook,
      validateBooking,
      returnBook, 
      addBook, 
      updateBook,
      deleteBook,
      addMember,
      updateSettings
    }}>
      {children}
    </AppContext.Provider>
  );
}

export function useApp() {
  const context = useContext(AppContext);
  if (!context) {
    throw new Error('useApp must be used within an AppProvider');
  }
  return context;
}
