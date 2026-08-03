"use client";

import Image from 'next/image';
import React from 'react';
import clsx from 'clsx';
import { usePathname } from 'next/navigation';
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faGithub, faUpwork } from "@fortawesome/free-brands-svg-icons";
import { faBars, faTimes, faUser } from '@fortawesome/free-solid-svg-icons';
import Link from 'next/link';

const links = [
  {
    name: 'Home',
    href: '/dashboard' },
  {
    name: 'Menu',
    href: '/dashboard/menu'
  },
  { name: 'Checkout',
    href: '/dashboard/checkout'
  }
];

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
  let [collapse, setCollapse] = React.useState(true);

  function collapseMenuClicked() {
    setCollapse(!collapse);
  }

  const pathname = usePathname();
  console.log("dbg pathname ", pathname)

  return (
    <>
      <section className="topbar">
        <div className="container">
            <div className="row">
                <div className="col-xl-6 col-sm-6 col-md-8">
                    <ul className="topbar_info d-flex flex-wrap d-none d-sm-flex">
                        <li>
                          <a href="mailto:wiwit.aditya.saputra@gmail.com">
                            <i className="fas fa-envelope" aria-hidden="true"></i> wiwit.aditya.saputra@gmail.com
                          </a>
                        </li>
                    </ul>
                </div>
                <div className="col-xl-6 col-sm-6 col-md-4">
                    <ul className="topbar_icon d-flex flex-wrap">
                        <li>
                          <a href="#">
                            <FontAwesomeIcon icon={faUpwork} size="sm" />
                          </a>
                        </li>
                        <li>
                          <a href="#">
                            <FontAwesomeIcon icon={faGithub} size="sm" />
                          </a>
                        </li>
                    </ul>
                </div>
            </div>
        </div>
      </section>

      <nav className="navbar navbar-expand-lg main_menu">
        <div className="container">
            <a className="navbar-brand" href="index.html">
                <Image
                  src="/images/logo.png"
                  width={1000}
                  height={760}
                  className="img-fluid"
                  alt="Screenshots of the dashboard project showing desktop version"
                />
            </a>

            <button className={clsx('navbar-toggler', {'show': !collapse})} type="button" onClick={collapseMenuClicked}>
              { collapse && <FontAwesomeIcon icon={faBars} size="sm" />}
              { !collapse && <FontAwesomeIcon icon={faTimes} size="sm" />}
            </button>
                          
            <div className={clsx('navbar-collapse', {
              'collapse': collapse
            })}>
            <ul className="navbar-nav m-auto">
              {links.map((link) => {
                return <>
                  <li className="nav-item">
                      <Link
                        key={link.name}
                        href={link.href}
                        className={clsx("nav-link", {"active": link.href.toLowerCase() === pathname.toLowerCase()})} aria-current="page">
                        {link.name}
                      </Link>
                  </li>                
                </>
              })}

              <li className="nav-item">
                  <a className="nav-link" href="menu.html">Order</a>
              </li>
              <li className="nav-item">
                  <a className="nav-link" href="chefs.html">Queue</a>
              </li>
            </ul>
            <ul className="menu_icon d-flex flex-wrap">
                <li>
                    <a href="dashboard.html">
                      <FontAwesomeIcon icon={faUser} size="sm" />
                    </a>
                </li>
            </ul>
            </div>
        </div>
      </nav>

      {children}
    </>
  );
}
