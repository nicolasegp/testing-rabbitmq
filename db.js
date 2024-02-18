const data = [
  {
    name: 'Scarlett Johansson',
    email: 'scarlett.johansson@mail.com',
  },
  {
    name: 'Robert Downey Jr.',
    email: 'robert.downey@mail.com ',
  },
  {
    name: 'Evangeline Lilly',
    email: 'evangeline.lilly@mail.com',
  },
  {
    name: 'Chris Evans',
    email: 'chris.evans@mail.com',
  },
  {
    name: 'Elizabeth Olsen',
    email: 'elizabeth.olsen@mail.com',
  },
];

export default function getData(index) {
  return data[index-1] ?? data[0];
}
