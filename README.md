# Qualidade de testes de interface no Sylius

Como saber se um teste automatizado percebe que uma funcionalidade parou de funcionar? Este projeto de mestrado em Ciência da Computação na UFCG investiga essa questão no painel administrativo do [Sylius](https://github.com/Sylius/Sylius). O repositório reúne testes de ponta a ponta escritos em **JavaScript com Cypress** e scripts de análise em **Python**. O recorte publicado cobre quatro funcionalidades de e-commerce

[![DOI](https://zenodo.org/badge/1302052124.svg)](https://doi.org/10.5281/zenodo.21400917)

## Suítes de teste

Cada suíte discente reúne os testes de uma entrega de graduação. Para cada funcionalidade, há também uma suíte de referência usada na comparação. Os identificadores como P1 e CL2 distinguem as suítes discentes.

| Funcionalidade | Suítes discentes | Suíte de referência |
| --- | --- | --- |
| Produtos | [P1 a P8](student-suites-products/) | [Produtos](reference-suites/products-reference.cy.js) |
| Métodos de pagamento | [PG1 a PG6](student-suites-payment-methods/) | [Métodos de pagamento](reference-suites/payment-methods-reference.cy.js) |
| Clientes | [CL1, CL3, CL4 e CL5](student-suites-customers/) e [CL2](student-suites-CL2/) | [Clientes](reference-suites/customers-references.cy.js) |
| Métodos de envio | [EN1 a EN3](student-suites-shipping-methods/) | [Métodos de envio](reference-suites/shipping-methods-reference.cy.js) |

O conjunto tem **22 suítes discentes e 4 de referência**. Cada referência contém 10 casos de teste.

## Como a avaliação funciona

Primeiro, cada suíte é executada em uma instância de teste do Sylius com Docker. Essa rodada registra o resultado de cada caso na aplicação original. Em seguida, introduz-se uma falta por vez e verifica-se na interface se ela produz o efeito esperado. Um caso que passou na base e falhou com a alteração é candidato a detecção. A confirmação depende de conferir se a causa da falha corresponde ao comportamento alterado.

**Exemplo em Produtos.** A referência testa o limite inferior de preço cadastrando um produto com preço zero e verificando a mensagem de sucesso. Se uma alteração fizer o formulário recusar zero, esse teste deve acusar a regressão. Outro caso verifica a rejeição de um preço negativo. Os dois casos exercitam lados diferentes do mesmo limite. [Ver o código dos testes](reference-suites/products-reference.cy.js)

O estudo também examina padrões de código que dificultam a manutenção dos testes (*test smells*) e a redundância entre casos. Os scripts em Python leem as medidas coletadas para calcular estatísticas e gerar figuras.

## Como executar uma referência

Use uma instância de teste com os dados de demonstração do Sylius. As suítes cadastram, editam e excluem registros. Para experimentar a referência de Produtos:

1. Configure a aplicação conforme as instruções do [Sylius Showcase em Docker](https://github.com/mourats/sylius-showcase-docker) e confirme que o painel administrativo abre.
2. Clone o [starter kit de testes](https://github.com/mourats/gui-testing-cypress-selenium) e rode `yarn install` na raiz dele. A configuração do kit usa `http://localhost:9990`. Se sua instância usa outra porta, ajuste a `baseUrl`.
3. Copie o arquivo [products-reference.cy.js](reference-suites/products-reference.cy.js) para `cypress/e2e/` no starter kit. Mantenha o suporte do kit, que fornece o comando `cy.login`.
4. Na raiz do starter kit, execute:

   ```sh
   yarn cypress:test-file cypress/e2e/products-reference.cy.js
   ```

Para executar a suíte discente CL2, consulte também os [comandos Cypress específicos dessa entrega](student-suites-CL2/commands.js).

## Análise dos dados

As [figuras em PDF](results/) estão disponíveis para consulta. Para recalcular as estatísticas ou gerar a figura de correlação, os scripts esperam a planilha de coleta em `data/coleta_ampliada.xlsx`. A planilha e o catálogo de faltas ficam fora deste repositório. Com a planilha disponível nesse caminho, execute a partir da raiz:

```sh
python -m pip install -r requirements.txt
python scripts/analise-estatistica.py
python scripts/grafico_estatistica.py
```

Os artefatos são disponibilizados para fins acadêmicos e de reprodução do estudo.
