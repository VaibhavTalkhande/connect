import { NavItemType } from '@/types/navItem'
import Link from 'next/link'
import React from 'react'

interface SideMenuProps {
  navItems: NavItemType[];
  pathname: string;
}

const SideMenu: React.FC<SideMenuProps> = ({navItems,pathname}) => {
  return (
    <aside className=" hidden md:block w-64 rounded-xl sm:w-72 bg-transparent shadow-md">

    <nav className="mt-8 block "> 
      <ul>
        {navItems.map((item) => (
          <li key={item.href}>
            <Link
              href={item.href}
              className={`flex items-center px-4 py-4 text-gray-700 font-semibold rounded-r-xl  hover:bg-gray-100 ${
                pathname === item.href ? "bg-teal-500" : ""
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