import { ThemeProvider } from '@/components/theme/ThemeProvider';
import AuthGuard from '@/components/auth/AuthGuard';
import Sidebar from '@/components/shared/Sidebar';
import RightColumn from '@/components/shared/RightColumn';
import Footer from '@/components/shared/Footer';
import styles from './main.module.css';

// Class 28's App.jsx -> a shared layout for every page in the (main) route group:
// /home, /explore, /notifications, /messages, /bookmarks, /profile, /settings.
// The sidebar + right column stay mounted while only {children} changes.
// "(main)" is a route group - the folder name is NOT part of the URL.
// <AuthGuard> sends signed-out visitors to /login.
export default function MainLayout({ children }) {
    return (
        <ThemeProvider>
            <AuthGuard mode="user">
                <div className={styles.page}>
                    <Sidebar />
                    <main className={styles.feed}>{children}</main>
                    <RightColumn />
                </div>
                <Footer />
            </AuthGuard>
        </ThemeProvider>
    );
}
