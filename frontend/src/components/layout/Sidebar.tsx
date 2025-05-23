'use client';

import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { Home, Briefcase, FileText, LogOut, Building, Users, Settings } from 'lucide-react';
import { Button } from '@/components/ui/button';
import Image from 'next/image';

const navItems = [
  { href: '/dashboard', label: 'Dashboard', icon: Home },
  { href: '/jobs', label: 'My Jobs', icon: Briefcase }, // US1, US2, US4 (Yük Sahibi)
  { href: '/quotes', label: 'Quotes Received', icon: FileText }, // US2 (Yük Sahibi)
  { href: '/invited-jobs', label: 'Invited Jobs', icon: Briefcase }, // US5 (Taşıma Firması)
  { href: '/my-quotes', label: 'My Quotes', icon: FileText }, // US6 (Taşıma Firması)
  { href: '/companies', label: 'Companies', icon: Building }, // Placeholder for company management
  { href: '/users', label: 'Users', icon: Users }, // Placeholder for user management
  { href: '/settings', label: 'Settings', icon: Settings }, // Placeholder for settings
];

export default function Sidebar() {
  const router = useRouter();

  const handleLogout = () => {
    // Mock logout logic
    console.log('Logout');
    router.push('/login');
  };

  return (
    <aside className="w-64 bg-white dark:bg-gray-800 p-4 flex flex-col shadow-lg">
      <div className="mb-8 flex items-center justify-center">
        <Image src="/images/Cargill.png" alt="Logo" width={120} height={40} objectFit="contain" />
      </div>
      <nav className="flex-grow">
        <ul className="space-y-2">
          {navItems.map((item) => (
            <li key={item.label}>
              <Link
                href={item.href}
                className="flex items-center space-x-3 p-2 rounded-md text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-700 transition-colors duration-150"
              >
                <item.icon className="h-5 w-5" />
                <span>{item.label}</span>
              </Link>
            </li>
          ))}
        </ul>
      </nav>
      <div className="mt-auto">
        <Button
          variant="ghost"
          className="w-full flex items-center justify-start space-x-3 p-2 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-700"
          onClick={handleLogout}
        >
          <LogOut className="h-5 w-5" />
          <span>Logout</span>
        </Button>
      </div>
    </aside>
  );
} 