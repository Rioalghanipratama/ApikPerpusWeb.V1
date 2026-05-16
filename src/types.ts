export interface Book {
  id: string;
  title: string;
  author: string;
  isbn: string;
  category: string;
  status: 'Available' | 'Borrowed';
  quantity: number;
  availableQuantity: number;
  coverUrl?: string;
}

export interface Member {
  id: string;
  studentId: string;
  name: string;
  major: string;
  email: string;
  joinDate: string;
}

export interface Transaction {
  id: string;
  bookId: string;
  memberId: string;
  borrowDate: string;
  returnDate?: string;
  status: 'Borrowed' | 'Returned' | 'Overdue' | 'Pending';
  bookingCode?: string;
}

export interface LibrarySettings {
  finePerDay: number;
  maxBorrowDays: number;
  maxBooksPerMember: number;
  enableNotifications: boolean;
  darkMode: boolean;
}
