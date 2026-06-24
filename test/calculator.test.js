const { somar, diminuir, multiplicar, dividir } = require("../src/calculator");

test("Somar dois valores validos", () => {
  expect(somar(150, 25)).toStrictEqual(175);
});

test("Somar com zero retorna o proprio valor", () => {
  expect(somar(100, 0)).toStrictEqual(100);
});

test("Somar valores negativos", () => {
  expect(somar(-10, -20)).toStrictEqual(-30);
});

test("Diminuir dois valores validos", () => {
  expect(diminuir(150, 25)).toStrictEqual(125);
});

test("Diminuir retorna negativo quando subtraendo maior", () => {
  expect(diminuir(10, 20)).toStrictEqual(-10);
});

test("Diminuir com zero retorna o proprio valor", () => {
  expect(diminuir(50, 0)).toStrictEqual(50);
});

test("Multiplicar dois valores validos", () => {
  expect(multiplicar(5, 10)).toStrictEqual(50);
});

test("Multiplicar por zero retorna zero", () => {
  expect(multiplicar(100, 0)).toStrictEqual(0);
});

test("Multiplicar valores negativos retorna positivo", () => {
  expect(multiplicar(-5, -4)).toStrictEqual(20);
});

test("Dividir dois valores validos", () => {
  expect(dividir(20, 10)).toStrictEqual(2);
});

test("Dividir por 1 retorna o proprio valor", () => {
  expect(dividir(15, 1)).toStrictEqual(15);
});

test("Dividir numeros que resultam em fracao", () => {
  expect(dividir(10, 4)).toStrictEqual(2.5);
});
