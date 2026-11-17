// Initial dataset of six web pages
export const initialPages = [
  {
    id: 1,
    url: 'pune-food-guide.com',
    content: 'Where to eat in Pune - vada pav and biryani and pizza',
    outgoingLinks: [2],
  },
  {
    id: 2,
    url: 'best-pizza-pune.com',
    content: 'Fresh wood-fired pizza made daily - try our cheese pizza',
    outgoingLinks: [1, 3],
  },
  {
    id: 3,
    url: 'college-canteen-blog.com',
    content: 'Student reviews of canteen food and chai and Friday pizza',
    outgoingLinks: [2, 4],
  },
  {
    id: 4,
    url: 'pizza-recipes-home.com',
    content: 'Make pizza at home - pizza dough and pizza sauce',
    outgoingLinks: [2, 5],
  },
  {
    id: 5,
    url: 'cheap-eats-pune.com',
    content: 'Good food under 100 rupees - misal and dosa and pizza slices',
    outgoingLinks: [2],
  },
  {
    id: 6,
    url: 'pizza-pizza-pizza.com',
    content: 'pizza pizza pizza pizza pizza pizza pizza pizza pizza pizza',
    outgoingLinks: [1],
  },
];

