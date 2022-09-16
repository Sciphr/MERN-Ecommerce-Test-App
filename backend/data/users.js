import bcrypt from 'bcryptjs';

const users = [
  {
    name: 'Jacob Berry',
    email: 'jacob@gmail.com',
    password: bcrypt.hashSync('canada99', 10),
    isAdmin: true,
  },
  {
    name: 'Avery Gillis',
    email: 'avery@gmail.com',
    password: bcrypt.hashSync('canada99', 10),
  },
  {
    name: 'Max Freeman',
    email: 'max@gmail.com',
    password: bcrypt.hashSync('canada99', 10),
  },
];

export default users;
