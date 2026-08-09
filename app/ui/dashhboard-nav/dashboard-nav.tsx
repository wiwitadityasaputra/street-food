"use client";

import React from 'react';
import clsx from 'clsx';
import Image from 'next/image';
import { usePathname } from 'next/navigation';
import Link from 'next/link';
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";

import { faBars, faTimes, faUser } from '@fortawesome/free-solid-svg-icons';
import { DashboardNavProps } from '@/app/ui/dashhboard-nav/dashboard-nav.definition';
import TotalCart from './total-cart';

const MENU_CART = "Cart";
const links = [
  {
    name: 'Home',
    href: '/' },
  {
    name: 'Menu',
    href: '/menu'
  },
  { name: MENU_CART,
    href: '/cart'
  }
];

export default function DashboardNav(props: DashboardNavProps) {
  let [collapse, setCollapse] = React.useState(true);

  function collapseMenuClicked() {
    setCollapse(!collapse);
  }

  const pathname = usePathname();

  const isCartMenu = (menuName: string) => {
    return MENU_CART === menuName;
  }

  const generateName = (menuName: string) => {
    if (MENU_CART === menuName) {
      return `${menuName} (${props.totalCart})`;
    }
    return menuName;
  }

  const isActive = (href: string, pathname: string) => {
    const a = pathname.toLowerCase().slice(1);
    const b = href.toLowerCase().slice(1);
    if (a === "" || b === "") {
      return a === b;
    }
    const result = a.indexOf(b) === 0
    return result;
  }

  return (<>
    <nav className="navbar navbar-expand-lg main_menu">
      <div className="container">
        <a className="navbar-brand" href="index.html">
            <Image
              src="/images/logo3.png"
              width={1000}
              height={760}
              className="img-fluid"
              alt="Screenshots of the dashboard project showing desktop version"
              unoptimized
            />
        </a>

        <button className={clsx('navbar-toggler', {'show': !collapse})} type="button"
          onClick={collapseMenuClicked}>
          { collapse && <FontAwesomeIcon icon={faBars} size="sm" />}
          { !collapse && <FontAwesomeIcon icon={faTimes} size="sm" />}
        </button>
                      
        <div className={clsx('navbar-collapse', {
          'collapse': collapse
          })}
        >
          <ul className="navbar-nav m-auto">
            {links.map((link) => {
              return (
                <li className="nav-item" key={link.name}>
                  <Link
                    key={link.name}
                    href={link.href}
                    className={clsx("nav-link", {"active": isActive(link.href, pathname)})} aria-current="page"
                    onClick={collapseMenuClicked}>
                    {isCartMenu(link.name) ? <TotalCart totalCartInit={props.totalCart} menuName={link.name} /> :  generateName(link.name)}
                  </Link>
                </li>);
            })}
            <li className="nav-item" key="queue">
                <a className="nav-link" href="chefs.html">Queue</a>
            </li>
          </ul>
          <ul className="menu_icon d-flex flex-wrap">
              <li key="account">
                  <a href="dashboard.html">
                    <FontAwesomeIcon icon={faUser} size="sm" />
                  </a>
              </li>
          </ul>
        </div>
      </div>
    </nav>
  </>);
}