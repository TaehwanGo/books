import { filter, map, reduce } from "../utils/hof.mjs";

function maxKey(array, init, f) {
  return reduce(array, init, (biggestSofar, element) => {
    if (f(biggestSofar) > f(element)) {
      return biggestSofar;
    } else {
      return element;
    }
  });
}

function biggestPurchasesBestCustomers(customers) {
  const bestCustomers = filter(customers, (c) => c.purchases.length >= 3);
  const biggestPurchases = map(bestCustomers, (c) => {
    return maxKey(c.purchases, { total: 0 }, (p) => p.total);
  });

  return biggestPurchases;
}

// 가상의 데이터 생성
const customers = [
  {
    name: "Alice",
    purchases: [{ total: 150 }, { total: 200 }, { total: 120 }],
  },
  {
    name: "Bob",
    purchases: [{ total: 300 }, { total: 250 }, { total: 180 }],
  },
  {
    name: "Charlie",
    purchases: [{ total: 80 }, { total: 220 }, { total: 160 }],
  },
  {
    name: "David",
    purchases: [{ total: 130 }, { total: 190 }],
  },
];

// 함수 호출
const result = biggestPurchasesBestCustomers(customers);
console.log(result); // [ { total: 200 }, { total: 300 }, { total: 220 } ]
