type FunctionWithParams<T extends any[], R> = (...args: T) => R;

export function wrapAlert<T extends any[], R>(f: FunctionWithParams<T, R>) {
  return (...params: T) => {
    try {
      return f(...params);
    } catch (error) {
      console.error(error);
      alert(
        "An error occurred. Please check the console for more information."
      );
    }
  };
}

const add = (a: number, b: number) => a + b;
const wrappedAdd = wrapAlert(add);
const twoTimes = (a: number) => a * 2;
const wrappedTwoTimes = wrapAlert(twoTimes);
const log = () => console.log("Hello, world!");
const wrappedLog = wrapAlert(log);

export default function useAlert() {
  // alert can be replaced by toast
  return {
    wrapAlert,
  };
}
