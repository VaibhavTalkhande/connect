import { NavItemType } from '@/types/navItem'
import Link from 'next/link'
import React from 'react'

interface SideMenuProps {
  navItems: NavItemType[];
  pathname: string;
}

const SideMenu: React.FC<SideMenuProps> = ({navItems,pathname}) => {
  return (
    <aside className="hidden md:block w-64 bg-white">

    <nav className="mt-8"> 
      <ul>
        {navItems.map((item) => (
          <li key={item.href}>
            <Link
              href={item.href}
              className={`flex items-center px-4 py-4 text-gray-700  hover:bg-gray-100 ${
                pathname === item.href ? "bg-blue-100" : ""
              }`}
            >
              <item.icon className="w-5 h-5 mr-3" />
              {item.label}
            </Link>
          </li>
        ))}
      </ul>
    </nav>
  </aside>
  )
}

export default SideMenu