export function fibonacci(n: number): number[] {
  const sequence: number[] = [];
  let a = 0;
  let b = 1;

  for (let i = 0; i < n; i++) {
    sequence.push(a);
    const temp = a;
    a = b;
    b = temp + b;
  }

  return sequence;
}
