type CartItem = {
  price: number;
  quantity: number;
  shipping: number;
  tax: number;
};

type Cart = {
  [itemName: string]: CartItem;
};

const validItemFields: (keyof CartItem)[] = [
  "price",
  "quantity",
  "shipping",
  "tax",
];

function setFieldByName(
  cart: Cart,
  name: string,
  field: keyof CartItem,
  value: number
): Cart {
  if (!validItemFields.includes(field)) {
    // 런타임에 확인
    throw new Error(`${field} is not a valid field!`);
  }
  const item = cart[name];
  if (!item) {
    throw new Error(`Item '${name}' not found in the cart!`);
  }
  const newItem = objectSet(item, field, value);
  const newCart = objectSet(cart, name, newItem);
  return newCart;
}

function objectSet<T extends object, K extends keyof T>(
  object: T,
  key: K,
  value: T[K]
): T {
  const copy = { ...object };
  copy[key] = value;
  return copy;
}

// 예제 데이터 생성
const exampleCart: Cart = {
  item1: { price: 10, quantity: 2, shipping: 5, tax: 1 },
  item2: { price: 15, quantity: 1, shipping: 3, tax: 2 },
};

// 필드 업데이트 예제
const updatedCart = setFieldByName(exampleCart, "item1", "price", 20);
console.log(updatedCart);
