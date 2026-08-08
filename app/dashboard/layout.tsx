import React from 'react';
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faGithub, faUpwork } from "@fortawesome/free-brands-svg-icons";
import DashboardNav from '@/app/ui/dashboard-nav';
import { cookisGetTotalCart } from '../lib/cookie-util';

export default async function DashboardLayout({ children }: { children: React.ReactNode }) {
  const totalCart = await cookisGetTotalCart();
  return (
    <>
      <section className="topbar">
        <div className="container">
            <div className="row">
                <div className="col-xl-6 col-sm-6 col-md-6 col-8">
                    <ul className="topbar_info d-flex flex-wrap">
                        <li>
                          <a href="mailto:wiwit.aditya.saputra@gmail.com">
                            <i className="fas fa-envelope" aria-hidden="true"></i> wiwit.aditya.saputra@gmail.com
                          </a>
                        </li>
                    </ul>
                </div>
                <div className="col-xl-6 col-sm-6 col-md-6 col-4">
                    <ul className="topbar_icon d-flex flex-wrap">
                        <li>
                          <a target='_blank' href="https://www.upwork.com/freelancers/wiwitadityasaputra">
                            <FontAwesomeIcon icon={faUpwork} size="sm" />
                          </a>
                        </li>
                        <li>
                          <a target='_blank' href="https://github.com/wiwitadityasaputra#">
                            <FontAwesomeIcon icon={faGithub} size="sm" />
                          </a>
                        </li>
                    </ul>
                </div>
            </div>
        </div>
      </section>

      <DashboardNav totalCart={totalCart} />
      
      {children}
    </>
  );
}
