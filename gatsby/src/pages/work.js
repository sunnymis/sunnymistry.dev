
import React from "react";

import Timeline from '../components/Timeline';
import Nav from '../components/Nav';
import '../styles/main.scss';

export default () => {
  return (
    <div className="container">
      <Nav />
      <Timeline />
    </div>
  )
}
