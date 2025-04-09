const bcrypt = require('bcrypt');
const hash = '$2b$10$3kqHbli/iu5GW4ruzti1S.N1VLCOUeNeBLiRuw0BWOsdYBs5SCiaW'; // Copiez le hash de votre DB
const match = await bcrypt.compare('CvDK6tdcr7BnghS', hash);
console.log('Match:', match); // Doit retourner true