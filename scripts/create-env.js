const fs = require('fs');
require('dotenv').config();

fs.writeFileSync(
  './.env',
  `REACT_APP_REMOTE_WEB3_PROVIDER=${
    process.env.REACT_APP_REMOTE_WEB3_PROVIDER
  }\nREACT_APP_CONTRACT_ADDRESS=${process.env.REACT_APP_CONTRACT_ADDRESS}\n
  \nREACT_APP_GOOGLE_API_KEY=${process.env.REACT_APP_GOOGLE_API_KEY}\n`,
);
