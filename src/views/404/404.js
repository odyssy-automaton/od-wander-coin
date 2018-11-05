import React from 'react';
import { Link } from 'react-router-dom';

function FourOhFour() {
  return (
    <div>
      You're lost. <Link to="/">Go back home.</Link>
    </div>
  );
}

export default FourOhFour;
