import ReduxProvider from '@/components/ReduxProvider';
import './globals.css';
import { Toaster } from 'react-hot-toast';

export const metadata = {
  title: 'TravelPlanner - Plan Your Perfect Trip',
  description: 'Collaborate, track expenses, and discover destinations',
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body>
        <ReduxProvider>
          {children}
          <Toaster position="top-right" />
        </ReduxProvider>
      </body>
    </html>
  );
}
