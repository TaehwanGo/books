const objectSet = (object, key, value) => {
  const clone = Object.assign({}, object);
  clone[key] = value;
  return clone;
};

const update = (object, key, modify) => {
  const value = object[key];
  const modified = modify(value);
  return objectSet(object, key, modified);
};

/**
 * @param {Object} object
 * @param {string[]} keys
 * @param {Function} modify
 */
const nestedUpdate = (object, keys, modify) => {
  if (keys.length === 0) {
    return modify(object);
  }
  const [first, ...restKeys] = keys;
  return update(object, first, (value) =>
    nestedUpdate(value, restKeys, modify)
  );
};

const cart = {
  shirt: {
    name: "shirt",
    price: 13,
    options: {
      color: "blue",
      size: 3,
    },
  },
};

const updated = nestedUpdate(
  cart,
  ["shirt", "options", "size"],
  (size) => size + 1
);
console.log("cart", cart);
console.log("updated", updated);
