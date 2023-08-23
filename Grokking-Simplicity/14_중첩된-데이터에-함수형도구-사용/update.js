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

const employee = {
  name: "Kim",
  salary: 120000,
};

const updated = update(employee, "salary", (salary) => salary * 1.1);
console.log("employee", employee); // { name: 'Kim', salary: 120000 }
console.log("updated", updated); // { name: 'Kim', salary: 132000 }
