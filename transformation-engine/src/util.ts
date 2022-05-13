export const drawUniform = (minimum = 0, maximum = 1) =>
  Math.floor(Math.random() * (maximum - minimum)) + minimum;
