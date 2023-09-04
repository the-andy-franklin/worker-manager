import { dispatch } from "./dispatch.ts";
import { fibonacci } from "./fibonacci.ts";
import { calculatePrimes } from "./calculate-primes.ts";

const [response1, response2] = await Promise.allSettled([
  dispatch(
    fibonacci,
    [1000],
  ),
  dispatch(
    calculatePrimes,
    [10000],
  ),
]);

response1.status === "fulfilled" ? console.log(response1.value) : console.error(response1.reason);
response2.status === "fulfilled" ? console.log(response2.value) : console.error(response2.reason);
