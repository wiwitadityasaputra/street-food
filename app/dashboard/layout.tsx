import React from 'react';
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faGithub, faUpwork } from "@fortawesome/free-brands-svg-icons";
import DashboardNav from '../ui/dashboard-nav';

export default function DashboardLayout({ children }: { children: React.ReactNode }) {


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

      <DashboardNav />

      {children}
    </>
  );
}
