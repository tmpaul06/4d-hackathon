export default {
  random,
  randomInt
};

export function random(a, b) {
  return Math.random() * (b - a) + a;
};

export function randomInt(a, b) {
  return Math.floor(Math.random() * (b - a)) + a;
};