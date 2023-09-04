import { dispatch } from "./dispatch.ts";
import { fibonacci } from "./fibonacci.ts";
import { calculatePrimes } from "./calculate-primes.ts";

const responses = await Promise.allSettled([
  dispatch(
    fibonacci,
    [1000],
  ),
  dispatch(
    calculatePrimes,
    [10000],
  ),
]);

for (const response of responses) {
  response.status === "fulfilled" ? console.log(response.value) : console.error(response.reason);
}
