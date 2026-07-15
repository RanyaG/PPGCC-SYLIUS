# Catálogo de Defeitos — Fundamentação e Plano de Injeção

## 1. Fundamentação teórica

| Conceito | Fonte | Como se aplica aqui |
|---|---|---|
| **Defeito de "Checking"** (ausência ou incorreção de validação) | Chillarege et al., *Orthogonal Defect Classification* (1992) | Categoria que engloba o D1 (remoção de `NotBlank`) e a maioria dos defeitos propostos abaixo |
| **ROR — Relational Operator Replacement** | Ammann & Offutt, operadores de mutação padrão (Offutt et al., 1996) | Modela defeitos de comparação/fronteira (ex.: `>= 0` virar `> 0`, ou limite removido) |
| **Operadores de mutação para web** | Praphamontripong & Offutt, *Applying Mutation Testing to Web Applications* | Defeitos de formato/parâmetro em formulários — motiva atacar constraints de `Regex`/formato |
| **Partição de Equivalência / Análise de Valor Limite** | Base do seu próprio curso, já usada nas suítes de referência | Defeitos concentram-se nas fronteiras das classes — por isso atacar validações é um alvo eficiente e mensurável |

**Argumento central pro artigo:** os defeitos injetados não são arbitrários — cada um corresponde a uma categoria reconhecida na literatura de teste de software, e o alvo (validações de formulário) é onde a própria teoria de partição/fronteira diz que os defeitos mais frequentemente residem.

---

## 2. Lição aprendida com o D1 (piloto)

O D1 revelou que um defeito de "Checking" pode se manifestar em **múltiplas camadas**:
1. Validação do Symfony (arquivo XML/YAML)
2. Constraint de banco de dados (schema, `NOT NULL`)
3. Tipagem de eventos internos (ex.: `ProductCreated` esperando `string`, recebendo `null`)

**Implicação prática:** para os dias 4-5, priorizar defeitos que fiquem **contidos na camada 1** (só o arquivo de validação), evitando repetir o trabalho de mexer em schema de banco — a menos que o tempo permita.

---

## 3. Catálogo — Camada 1 (prioridade, "tier 1")

Um defeito por funcionalidade, todos do tipo **Checking — Missing** (remoção de `NotBlank`), pela mesma razão do D1: é o defeito mais rápido de injetar (só editar XML + limpar cache) e já tem o passo a passo testado.

| ID | Funcionalidade | Bundle | Arquivo (caminho relativo a `vendor/sylius/sylius/src/Sylius/Bundle/`) | Campo alvo | O que remover |
|---|---|---|---|---|---|
| D1 | Produtos | `ProductBundle` | `Resources/config/validation/ProductVariant.xml` | `code` | `<constraint name="NotBlank">` — **já concluído** |
| D2 | Payment Methods | `PaymentBundle` | `Resources/config/validation/PaymentMethod.xml` (confirmar nome exato via `ls`) | `code` | `<constraint name="NotBlank">` no campo `code` |
| D3 | Customers | `CustomerBundle` | `Resources/config/validation/Customer.xml` (confirmar nome exato) | `email` | `<constraint name="NotBlank">` no campo `email` |
| D4 | Shipping Methods | `ShippingBundle` | `Resources/config/validation/ShippingMethod.xml` (confirmar nome exato) | `code` | `<constraint name="NotBlank">` no campo `code` |

**Suíte de referência esperada a falhar:** o teste "rejeita criação com campo X vazio" de cada funcionalidade (vocês já têm isso nas 4 suítes de referência construídas).

---

## 4. Catálogo — Camada 2 (se sobrar tempo, "tier 2")

Defeitos de tipos diferentes, pra enriquecer a discussão do artigo com mais de uma categoria de defeito (não só "Checking — Missing" repetido 4x).

| ID | Funcionalidade | Tipo (ODC / mutação) | Constraint alvo | Efeito esperado |
|---|---|---|---|---|
| D5 | Produtos | Checking — Incorrect | `Regex` do campo `code` em `ProductVariant.xml` | Aceita caracteres inválidos que antes eram rejeitados |
| D6 | Payment Methods | Checking — Missing (unicidade) | `UniqueEntity` do campo `code` | Aceita código duplicado |
| D7 | Customers | Checking — Incorrect | Constraint `Email` (formato) no campo `email` | Aceita e-mail malformado |
| D8 | Shipping Methods | Boundary (ROR-like) | `GreaterThanOrEqualToZero`/similar na configuração de valor de frete | Aceita valor negativo (paralelo à AVL "preço ≥ 0" já testada em Produtos) |

---

## 5. Passo a passo genérico de injeção (baseado na lição do D1)

1. `docker exec sylius find /app/vendor/sylius/sylius/src/Sylius/Bundle/<Bundle>/Resources/config/validation -iname "*<Entidade>*"` — localizar o arquivo certo.
2. `docker exec sylius cat -n <caminho>` — ver os números de linha do bloco da constraint.
3. `docker exec sylius sed -i 'INICIO,FIMd' <caminho>` — remover **por número de linha** (evita o problema de aspas que tivemos com `sed` + padrão de texto no PowerShell).
4. Confirmar com `cat -n` de novo.
5. `docker exec sylius rm -rf /app/var/cache/*` → `docker restart sylius` → esperar ~60s.
6. Testar manualmente pela UI primeiro (criar/editar sem o campo) — **antes** de rodar a suíte inteira, pra confirmar que o defeito está mesmo ativo.
7. Rodar a suíte de referência da funcionalidade e conferir se o teste esperado **falha**.
8. **Atenção ao assert fraco**: como vimos no Cypress, uma asserção tipo `not.contain('successfully created')` pode "passar" mascarando um crash (erro 500) em vez de detectar a rejeição de verdade. Confirmar que a suíte de referência de cada funcionalidade não tem essa fragilidade antes de confiar no resultado (se tiver, aplicar a mesma correção feita em Produtos: checar também ausência de `'Internal Server Error'`/`'Whoops'`).
9. Reverter o defeito (restaurar backup do arquivo) antes de passar pro próximo.

---

## 6. Recomendação de escopo pros dias 4-5

Dado que o D1 sozinho consumiu uma sessão inteira (incluindo obstáculos de cache, camadas de banco e tipagem de evento), a recomendação realista é:

- **Meta mínima garantida:** D1 (já feito) + D2, D3, D4 (Tier 1) — um defeito por funcionalidade, mesma categoria, comparável entre si.
- **Meta estendida (só se o ambiente cooperar):** acrescentar 1-2 defeitos do Tier 2 pra mostrar diversidade de tipo de defeito no artigo.
- **Não é necessário** repetir a profundidade de investigação do D1 (múltiplas camadas) pros próximos — se um defeito ficar só na camada de validação (sem precisar mexer no banco), já é suficiente pra medição de detecção.
