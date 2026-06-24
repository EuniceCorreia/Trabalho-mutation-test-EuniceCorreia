const ContaBancaria = require("../src/contaBancaria");

function criarConta(overrides = {}) {
  return {
    id: "001",
    titular: "Ugioni",
    saldo: 1000,
    status: "ativa",
    limite: 500,
    criadaEm: new Date(),
    atualizadaEm: new Date(),
    ...overrides,
  };
}

describe("ContaBancaria - obterSaldo", () => {
  test("retorna o saldo da conta", () => {
    const conta = new ContaBancaria(criarConta({ saldo: 2500 }));
    expect(conta.obterSaldo()).toBe(2500);
  });

  test("retorna zero quando saldo e zero", () => {
    const conta = new ContaBancaria(criarConta({ saldo: 0 }));
    expect(conta.obterSaldo()).toBe(0);
  });
});

describe("ContaBancaria - obterTitular", () => {
  test("retorna o titular da conta", () => {
    const conta = new ContaBancaria(criarConta({ titular: "Maria" }));
    expect(conta.obterTitular()).toBe("Maria");
  });
});

describe("ContaBancaria - obterStatus", () => {
  test("retorna o status ativa", () => {
    const conta = new ContaBancaria(criarConta({ status: "ativa" }));
    expect(conta.obterStatus()).toBe("ativa");
  });

  test("retorna o status bloqueada", () => {
    const conta = new ContaBancaria(criarConta({ status: "bloqueada" }));
    expect(conta.obterStatus()).toBe("bloqueada");
  });
});

describe("ContaBancaria - estaAtiva", () => {
  test("retorna true quando status e ativa", () => {
    const conta = new ContaBancaria(criarConta({ status: "ativa" }));
    expect(conta.estaAtiva()).toBe(true);
  });

  test("retorna false quando status e bloqueada", () => {
    const conta = new ContaBancaria(criarConta({ status: "bloqueada" }));
    expect(conta.estaAtiva()).toBe(false);
  });

  test("retorna false quando status e encerrada", () => {
    const conta = new ContaBancaria(criarConta({ status: "encerrada" }));
    expect(conta.estaAtiva()).toBe(false);
  });
});

describe("ContaBancaria - obterLimite", () => {
  test("retorna o limite da conta", () => {
    const conta = new ContaBancaria(criarConta({ limite: 5000 }));
    expect(conta.obterLimite()).toBe(5000);
  });

  test("retorna zero quando limite e zero", () => {
    const conta = new ContaBancaria(criarConta({ limite: 0 }));
    expect(conta.obterLimite()).toBe(0);
  });
});

describe("ContaBancaria - depositar", () => {
  test("deposita valor valido e retorna true", () => {
    const conta = new ContaBancaria(criarConta({ saldo: 1000 }));
    expect(conta.depositar(500)).toBe(true);
    expect(conta.obterSaldo()).toBe(1500);
  });

  test("retorna false ao depositar valor zero", () => {
    const conta = new ContaBancaria(criarConta({ saldo: 1000 }));
    expect(conta.depositar(0)).toBe(false);
    expect(conta.obterSaldo()).toBe(1000);
  });

  test("retorna false ao depositar valor negativo", () => {
    const conta = new ContaBancaria(criarConta({ saldo: 1000 }));
    expect(conta.depositar(-100)).toBe(false);
    expect(conta.obterSaldo()).toBe(1000);
  });

  test("atualiza atualizadaEm ao depositar", () => {
    const antes = new Date();
    const conta = new ContaBancaria(criarConta({ saldo: 0 }));
    conta.depositar(1);
    expect(conta.conta.atualizadaEm).toBeInstanceOf(Date);
    expect(conta.conta.atualizadaEm >= antes).toBe(true);
  });
});

describe("ContaBancaria - sacar", () => {
  test("saca valor valido dentro do saldo e retorna true", () => {
    const conta = new ContaBancaria(criarConta({ saldo: 1000, limite: 0 }));
    expect(conta.sacar(500)).toBe(true);
    expect(conta.obterSaldo()).toBe(500);
  });

  test("saca valor usando limite e retorna true", () => {
    const conta = new ContaBancaria(criarConta({ saldo: 100, limite: 500 }));
    expect(conta.sacar(600)).toBe(true);
    expect(conta.obterSaldo()).toBe(-500);
  });

  test("saca exatamente o saldo disponivel (saldo+limite)", () => {
    const conta = new ContaBancaria(criarConta({ saldo: 300, limite: 200 }));
    expect(conta.sacar(500)).toBe(true);
    expect(conta.obterSaldo()).toBe(-200);
  });

  test("retorna false ao sacar mais que saldo disponivel", () => {
    const conta = new ContaBancaria(criarConta({ saldo: 100, limite: 200 }));
    expect(conta.sacar(301)).toBe(false);
    expect(conta.obterSaldo()).toBe(100);
  });

  test("retorna false ao sacar valor zero", () => {
    const conta = new ContaBancaria(criarConta({ saldo: 1000 }));
    expect(conta.sacar(0)).toBe(false);
  });

  test("retorna false ao sacar valor negativo", () => {
    const conta = new ContaBancaria(criarConta({ saldo: 1000 }));
    expect(conta.sacar(-50)).toBe(false);
  });

  test("atualiza atualizadaEm ao sacar", () => {
    const antes = new Date();
    const conta = new ContaBancaria(criarConta({ saldo: 100 }));
    conta.sacar(1);
    expect(conta.conta.atualizadaEm >= antes).toBe(true);
  });
});

describe("ContaBancaria - alterarTitular", () => {
  test("altera o titular e retorna true", () => {
    const conta = new ContaBancaria(criarConta({ titular: "Ugioni" }));
    expect(conta.alterarTitular("Carlos")).toBe(true);
    expect(conta.obterTitular()).toBe("Carlos");
  });

  test("retorna false ao passar string vazia", () => {
    const conta = new ContaBancaria(criarConta({ titular: "Ugioni" }));
    expect(conta.alterarTitular("")).toBe(false);
    expect(conta.obterTitular()).toBe("Ugioni");
  });

  test("retorna false ao passar null", () => {
    const conta = new ContaBancaria(criarConta());
    expect(conta.alterarTitular(null)).toBe(false);
  });

  test("retorna false ao passar undefined", () => {
    const conta = new ContaBancaria(criarConta());
    expect(conta.alterarTitular(undefined)).toBe(false);
  });
});

describe("ContaBancaria - bloquearConta", () => {
  test("bloqueia conta ativa e retorna true", () => {
    const conta = new ContaBancaria(criarConta({ status: "ativa" }));
    expect(conta.bloquearConta()).toBe(true);
    expect(conta.obterStatus()).toBe("bloqueada");
  });

  test("retorna false ao bloquear conta ja bloqueada", () => {
    const conta = new ContaBancaria(criarConta({ status: "bloqueada" }));
    expect(conta.bloquearConta()).toBe(false);
    expect(conta.obterStatus()).toBe("bloqueada");
  });

  test("bloqueia conta encerrada e retorna true", () => {
    const conta = new ContaBancaria(criarConta({ status: "encerrada" }));
    expect(conta.bloquearConta()).toBe(true);
    expect(conta.obterStatus()).toBe("bloqueada");
  });
});

describe("ContaBancaria - ativarConta", () => {
  test("ativa conta bloqueada e retorna true", () => {
    const conta = new ContaBancaria(criarConta({ status: "bloqueada" }));
    expect(conta.ativarConta()).toBe(true);
    expect(conta.obterStatus()).toBe("ativa");
  });

  test("retorna false ao ativar conta ja ativa", () => {
    const conta = new ContaBancaria(criarConta({ status: "ativa" }));
    expect(conta.ativarConta()).toBe(false);
    expect(conta.obterStatus()).toBe("ativa");
  });

  test("ativa conta encerrada e retorna true", () => {
    const conta = new ContaBancaria(criarConta({ status: "encerrada" }));
    expect(conta.ativarConta()).toBe(true);
    expect(conta.obterStatus()).toBe("ativa");
  });
});

describe("ContaBancaria - encerrarConta", () => {
  test("encerra conta com saldo zero e retorna true", () => {
    const conta = new ContaBancaria(criarConta({ saldo: 0 }));
    expect(conta.encerrarConta()).toBe(true);
    expect(conta.obterStatus()).toBe("encerrada");
  });

  test("retorna false ao encerrar conta com saldo positivo", () => {
    const conta = new ContaBancaria(criarConta({ saldo: 100 }));
    expect(conta.encerrarConta()).toBe(false);
  });

  test("retorna false ao encerrar conta com saldo negativo", () => {
    const conta = new ContaBancaria(criarConta({ saldo: -50 }));
    expect(conta.encerrarConta()).toBe(false);
  });
});

describe("ContaBancaria - podeSacar", () => {
  test("retorna true quando valor e positivo e dentro do limite disponivel", () => {
    const conta = new ContaBancaria(criarConta({ saldo: 1000, limite: 0 }));
    expect(conta.podeSacar(500)).toBe(true);
  });

  test("retorna true quando valor e exatamente o saldo disponivel", () => {
    const conta = new ContaBancaria(criarConta({ saldo: 300, limite: 200 }));
    expect(conta.podeSacar(500)).toBe(true);
  });

  test("retorna false quando valor excede saldo disponivel", () => {
    const conta = new ContaBancaria(criarConta({ saldo: 100, limite: 100 }));
    expect(conta.podeSacar(201)).toBe(false);
  });

  test("retorna false quando valor e zero", () => {
    const conta = new ContaBancaria(criarConta({ saldo: 1000 }));
    expect(conta.podeSacar(0)).toBe(false);
  });

  test("retorna false quando valor e negativo", () => {
    const conta = new ContaBancaria(criarConta({ saldo: 1000 }));
    expect(conta.podeSacar(-1)).toBe(false);
  });
});

describe("ContaBancaria - aplicarTarifa", () => {
  test("desconta tarifa do saldo e retorna true", () => {
    const conta = new ContaBancaria(criarConta({ saldo: 1000 }));
    expect(conta.aplicarTarifa(50)).toBe(true);
    expect(conta.obterSaldo()).toBe(950);
  });

  test("retorna false para tarifa zero", () => {
    const conta = new ContaBancaria(criarConta({ saldo: 1000 }));
    expect(conta.aplicarTarifa(0)).toBe(false);
    expect(conta.obterSaldo()).toBe(1000);
  });

  test("retorna false para tarifa negativa", () => {
    const conta = new ContaBancaria(criarConta({ saldo: 1000 }));
    expect(conta.aplicarTarifa(-10)).toBe(false);
    expect(conta.obterSaldo()).toBe(1000);
  });
});

describe("ContaBancaria - ajustarLimite", () => {
  test("ajusta limite para valor positivo e retorna true", () => {
    const conta = new ContaBancaria(criarConta({ limite: 500 }));
    expect(conta.ajustarLimite(1000)).toBe(true);
    expect(conta.obterLimite()).toBe(1000);
  });

  test("ajusta limite para zero e retorna true", () => {
    const conta = new ContaBancaria(criarConta({ limite: 500 }));
    expect(conta.ajustarLimite(0)).toBe(true);
    expect(conta.obterLimite()).toBe(0);
  });

  test("retorna false para limite negativo", () => {
    const conta = new ContaBancaria(criarConta({ limite: 500 }));
    expect(conta.ajustarLimite(-1)).toBe(false);
    expect(conta.obterLimite()).toBe(500);
  });
});

describe("ContaBancaria - saldoNegativo", () => {
  test("retorna true quando saldo e negativo", () => {
    const conta = new ContaBancaria(criarConta({ saldo: -100 }));
    expect(conta.saldoNegativo()).toBe(true);
  });

  test("retorna false quando saldo e zero", () => {
    const conta = new ContaBancaria(criarConta({ saldo: 0 }));
    expect(conta.saldoNegativo()).toBe(false);
  });

  test("retorna false quando saldo e positivo", () => {
    const conta = new ContaBancaria(criarConta({ saldo: 100 }));
    expect(conta.saldoNegativo()).toBe(false);
  });
});

describe("ContaBancaria - transferir", () => {
  test("transfere valor valido entre contas e retorna true", () => {
    const origem = new ContaBancaria(criarConta({ saldo: 1000, limite: 0 }));
    const destino = new ContaBancaria(criarConta({ saldo: 200, limite: 0 }));
    expect(origem.transferir(300, destino)).toBe(true);
    expect(origem.obterSaldo()).toBe(700);
    expect(destino.obterSaldo()).toBe(500);
  });

  test("retorna false ao transferir mais que saldo disponivel", () => {
    const origem = new ContaBancaria(criarConta({ saldo: 100, limite: 0 }));
    const destino = new ContaBancaria(criarConta({ saldo: 0, limite: 0 }));
    expect(origem.transferir(200, destino)).toBe(false);
    expect(origem.obterSaldo()).toBe(100);
    expect(destino.obterSaldo()).toBe(0);
  });

  test("retorna false ao transferir valor zero", () => {
    const origem = new ContaBancaria(criarConta({ saldo: 1000 }));
    const destino = new ContaBancaria(criarConta({ saldo: 0 }));
    expect(origem.transferir(0, destino)).toBe(false);
  });

  test("retorna false ao transferir valor negativo", () => {
    const origem = new ContaBancaria(criarConta({ saldo: 1000 }));
    const destino = new ContaBancaria(criarConta({ saldo: 0 }));
    expect(origem.transferir(-50, destino)).toBe(false);
  });
});

describe("ContaBancaria - calcularSaldoDisponivel", () => {
  test("retorna saldo mais limite", () => {
    const conta = new ContaBancaria(criarConta({ saldo: 1000, limite: 500 }));
    expect(conta.calcularSaldoDisponivel()).toBe(1500);
  });

  test("retorna saldo quando limite e zero", () => {
    const conta = new ContaBancaria(criarConta({ saldo: 800, limite: 0 }));
    expect(conta.calcularSaldoDisponivel()).toBe(800);
  });

  test("retorna zero quando saldo e limite sao zero", () => {
    const conta = new ContaBancaria(criarConta({ saldo: 0, limite: 0 }));
    expect(conta.calcularSaldoDisponivel()).toBe(0);
  });
});

describe("ContaBancaria - gerarResumo", () => {
  test("retorna objeto com todos os campos do resumo", () => {
    const conta = new ContaBancaria(criarConta({ saldo: 1000, limite: 500, titular: "Ugioni", status: "ativa" }));
    const resumo = conta.gerarResumo();
    expect(resumo).toEqual({
      titular: "Ugioni",
      saldo: 1000,
      limite: 500,
      disponivel: 1500,
      status: "ativa",
    });
  });

  test("disponivel no resumo e a soma de saldo e limite", () => {
    const conta = new ContaBancaria(criarConta({ saldo: 200, limite: 300 }));
    const resumo = conta.gerarResumo();
    expect(resumo.disponivel).toBe(500);
  });
});

describe("ContaBancaria - validarConta", () => {
  test("retorna true para conta valida", () => {
    const conta = new ContaBancaria(criarConta());
    expect(conta.validarConta()).toBe(true);
  });

  test("retorna false quando id esta ausente", () => {
    const conta = new ContaBancaria(criarConta({ id: null }));
    expect(conta.validarConta()).toBe(false);
  });

  test("retorna false quando id e string vazia", () => {
    const conta = new ContaBancaria(criarConta({ id: "" }));
    expect(conta.validarConta()).toBe(false);
  });

  test("retorna false quando titular esta ausente", () => {
    const conta = new ContaBancaria(criarConta({ titular: null }));
    expect(conta.validarConta()).toBe(false);
  });

  test("retorna false quando saldo nao e numero", () => {
    const conta = new ContaBancaria(criarConta({ saldo: "mil" }));
    expect(conta.validarConta()).toBe(false);
  });

  test("retorna false quando limite e negativo", () => {
    const conta = new ContaBancaria(criarConta({ limite: -1 }));
    expect(conta.validarConta()).toBe(false);
  });

  test("retorna true quando limite e zero", () => {
    const conta = new ContaBancaria(criarConta({ limite: 0 }));
    expect(conta.validarConta()).toBe(true);
  });

  test("retorna false quando status e invalido", () => {
    const conta = new ContaBancaria(criarConta({ status: "pendente" }));
    expect(conta.validarConta()).toBe(false);
  });

  test("retorna true quando status e bloqueada", () => {
    const conta = new ContaBancaria(criarConta({ status: "bloqueada" }));
    expect(conta.validarConta()).toBe(true);
  });

  test("retorna true quando status e encerrada", () => {
    const conta = new ContaBancaria(criarConta({ status: "encerrada" }));
    expect(conta.validarConta()).toBe(true);
  });

  test("retorna true quando saldo e zero", () => {
    const conta = new ContaBancaria(criarConta({ saldo: 0 }));
    expect(conta.validarConta()).toBe(true);
  });
});

describe("ContaBancaria - resetarConta", () => {
  test("reseta saldo para zero", () => {
    const conta = new ContaBancaria(criarConta({ saldo: 5000 }));
    conta.resetarConta();
    expect(conta.obterSaldo()).toBe(0);
  });

  test("reseta limite para zero", () => {
    const conta = new ContaBancaria(criarConta({ limite: 1000 }));
    conta.resetarConta();
    expect(conta.obterLimite()).toBe(0);
  });

  test("reseta status para ativa", () => {
    const conta = new ContaBancaria(criarConta({ status: "bloqueada" }));
    conta.resetarConta();
    expect(conta.obterStatus()).toBe("ativa");
  });

  test("atualiza atualizadaEm ao resetar", () => {
    const antes = new Date();
    const conta = new ContaBancaria(criarConta());
    conta.resetarConta();
    expect(conta.conta.atualizadaEm).toBeInstanceOf(Date);
    expect(conta.conta.atualizadaEm >= antes).toBe(true);
  });
});
