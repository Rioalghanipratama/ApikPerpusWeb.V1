import { Book, Member, Transaction } from '../types';

export const mockBooks: Book[] = [
  { id: '1', title: 'The Art of Computer Programming', author: 'Donald Knuth', isbn: '978-0201896831', category: 'Ilmu Komputer', status: 'Available', quantity: 5, availableQuantity: 5 },
  { id: '2', title: 'Clean Code', author: 'Robert C. Martin', isbn: '978-0132350884', category: 'Software Engineering', status: 'Borrowed', quantity: 3, availableQuantity: 0 },
  { id: '3', title: 'Design Patterns', author: 'Erich Gamma et al.', isbn: '978-0201633610', category: 'Software Engineering', status: 'Available', quantity: 4, availableQuantity: 2 },
  { id: '4', title: 'Introduction to Algorithms', author: 'Thomas H. Cormen', isbn: '978-0262033848', category: 'Ilmu Komputer', status: 'Borrowed', quantity: 2, availableQuantity: 0 },
  { id: '5', title: 'Database System Concepts', author: 'Abraham Silberschatz', isbn: '978-0073523323', category: 'Sistem Informasi', status: 'Available', quantity: 6, availableQuantity: 6 },
];

export const mockMembers: Member[] = [
  { id: '1', studentId: 'NIM2022001', name: 'Budi Santoso', major: 'Teknik Informatika', email: 'budi@kampus.ac.id', joinDate: '2022-08-15' },
  { id: '2', studentId: 'NIM2022045', name: 'Siti Aminah', major: 'Sistem Informasi', email: 'siti@kampus.ac.id', joinDate: '2022-08-16' },
  { id: '3', studentId: 'NIM2023012', name: 'Andi Wijaya', major: 'Ilmu Komputer', email: 'andi@kampus.ac.id', joinDate: '2023-08-20' },
];

export const mockTransactions: Transaction[] = [
  { id: '1', bookId: '2', memberId: '1', borrowDate: '2023-10-01', returnDate: '2023-10-15', status: 'Returned' },
  { id: '2', bookId: '4', memberId: '2', borrowDate: '2023-10-20', status: 'Borrowed' },
  { id: '3', bookId: '2', memberId: '3', borrowDate: '2023-10-25', status: 'Borrowed' },
];
