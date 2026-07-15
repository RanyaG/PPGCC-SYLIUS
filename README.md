# Avaliação da Qualidade de Testes de GUI em Ambientes Educacionais

Kit de reprodução do estudo empírico que compara suítes de teste de GUI (Cypress)
produzidas por estudantes de graduação com suítes de referência elaboradas sob
critérios especialistas, no sistema de e-commerce **Sylius**. A avaliação usa três
critérios: **capacidade de detecção de defeitos**, **presença de test smells** e
**redundância**.

Este repositório contém os artefatos necessários para reproduzir a análise dos
dados e as figuras do artigo, bem como as suítes de referência e o catálogo de
defeitos utilizados no experimento.

## Estrutura do repositório

```
.
├── data/
│   └── coleta_ampliada.xlsx        # Planilha de coleta: classificação das 22 suítes
│                                   #   discentes (detecção, smells, redundância)
├── scripts/
│   ├── analise_estatistica.py      # Testes estatísticos (Shapiro-Wilk, Wilcoxon,
│   │                               #   Spearman, IC bootstrap)
│   └── grafico_estatistica.py      # Gera a figura de correlação + intervalos de confiança
├── reference-suites/               # As 4 suítes de referência (Cypress) construídas
│   │                               #   com Partição por Equivalência e Análise de Valor Limite
│   ├── products-reference.cy.js
│   ├── payment-methods-reference.cy.js
│   ├── customers-reference.cy.js
│   └── shipping-methods-reference.cy.js
├── docs/
│   └── catalogo_defeitos.md        # Catálogo de defeitos: fundamentação (ODC + mutação),
│                                   #   pontos de injeção no Sylius e roteiro de injeção
├── results/                        # Figuras geradas pelos scripts
├── requirements.txt                # Dependências Python
└── README.md
```

## Requisitos

- **Python 3.12+** (para a análise estatística)
- **Node.js 22+** e **Cypress 12.12** (apenas para reexecutar as suítes de referência)
- **Docker** com a instância da loja de demonstração do **Sylius 1.x**
  (apenas para reexecutar as suítes; a análise dos dados não requer o Sylius)

## Reproduzindo a análise estatística

A análise estatística e as figuras são reproduzíveis **diretamente a partir da
planilha de coleta**, sem necessidade de instalar o Sylius ou o Cypress.

```bash
# 1. Instalar as dependências
pip install -r requirements.txt

# 2. Entrar na pasta de scripts (a planilha é lida do diretório atual)
cd scripts
cp ../data/coleta_ampliada.xlsx .

# 3. Rodar os testes estatísticos (imprime resultados no terminal)
python analise_estatistica.py

# 4. Gerar a figura de correlação + intervalos de confiança
python grafico_estatistica.py
```

O script `analise_estatistica.py` reproduz:
- **Teste de normalidade** de Shapiro-Wilk para as três métricas;
- **Teste de hipótese** de Wilcoxon (suítes discentes vs. valor da referência);
- **Correlação de Spearman** entre as três métricas;
- **Intervalos de confiança de 95%** por *bootstrap* (10.000 reamostragens).

## Reexecutando as suítes de referência (opcional)

As suítes de referência foram escritas para a loja de demonstração do Sylius
rodando localmente via Docker, acessível em `http://localhost:9990`. Para
executá-las:

```bash
# baseUrl pode ser sobrescrito na linha de comando, caso sua instância use outra porta
npx cypress run --spec "reference-suites/products-reference.cy.js" \
  --config baseUrl=http://localhost:9990
```

O **catálogo de defeitos** (`docs/catalogo_defeitos.md`) documenta, para cada
defeito, o ponto exato de injeção no código-fonte do Sylius e o procedimento de
injeção e reversão.

## Composição da amostra

As 22 suítes discentes analisadas distribuem-se em quatro funcionalidades
administrativas do Sylius:

| Funcionalidade        | Suítes |
|-----------------------|:------:|
| Produtos              |   8    |
| Métodos de Pagamento  |   6    |
| Clientes              |   5    |
| Métodos de Envio      |   3    |
| **Total**             | **22** |

As suítes discentes são identificadas de forma anonimizada (P1–P8, PG1–PG6,
CL1–CL5, EN1–EN3); a correspondência aos autores originais não é divulgada.

## Licença

Os artefatos deste repositório destinam-se a fins acadêmicos e de reprodução do
estudo.
