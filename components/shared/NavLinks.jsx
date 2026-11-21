'use client';

// Class 28 kept the active item in useState('Home').
// In Next.js the URL is the source of truth, so usePathname() decides which link is active.
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { navLinks } from '@/data/data';
import styles from './Sidebar.module.css';

export default function NavLinks() {
    const pathname = usePathname();

    return (
        <ul className={styles.navList}>
            {navLinks.map((link) => {
                const isActive = pathname === link.href;
                return (
                    <li key={link.href}>
                        <Link
                            href={link.href}
                            className={`${styles.navItem} ${isActive ? styles.active : ''}`}
                            aria-current={isActive ? 'page' : undefined}
                        >
                            {link.label}
                        </Link>
                    </li>
                );
            })}
        </ul>
    );
}
