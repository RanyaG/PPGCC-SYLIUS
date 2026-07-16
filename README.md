# Avaliação da Qualidade de Testes de GUI em Ambientes Educacionais

Kit de reprodução do estudo empírico que compara suítes de teste de GUI (Cypress) produzidas por estudantes de graduação com suítes de referência elaboradas sob critérios especialistas, no sistema de e-commerce **Sylius**. A avaliação usa três critérios: **capacidade de detecção de defeitos**, **presença de test smells** e **redundância**.

Este repositório contém os artefatos necessários para reproduzir a análise dos dados e as figuras do artigo, bem como as suítes de referência e o catálogo de defeitos utilizados no experimento.

## 🛡️ Política de Privacidade e Anonimização de Dados (LGPD)

Este pacote de replicação foi estruturado em estrita conformidade com as diretrizes de ética em pesquisa. Durante a coleta, identificou-se que as suítes originais submetidas pelos discentes continham dados pessoais identificáveis (nomes, e-mails institucionais e matrículas). Para proteger a privacidade dos participantes, adotou-se a seguinte estratégia:

1. **Anonimização:** A identidade dos estudantes foi substituída por IDs sequenciais (P1–P8, PG1–PG6, CL1–CL5, EN1–EN3). A correspondência aos autores originais não é divulgada.
2. **Omissão do Código Bruto:** Os arquivos originais (`.zip` e links do Drive) contendo o código-fonte dos alunos não foram incluídos neste repositório para evitar exposição inadvertida de metadados.
3. **Reprodutibilidade:** A reprodutibilidade está garantida pelos dados de coleta tabulados, scripts estatísticos, catálogo de defeitos e suítes de referência.

## Estrutura do repositório

```text
.
├── data/
│   └── coleta_ampliada.xlsx        # Planilha anonimizada com a classificação das 22 suítes
├── scripts/
│   ├── analise_estatistica.py      # Testes estatísticos (Shapiro-Wilk, Wilcoxon, Spearman, IC)
│   └── grafico_estatistica.py      # Gera a figura de correlação + intervalos de confiança
├── reference-suites/               # As 4 suítes de referência (Cypress) construídas
│   ├── products-reference.cy.js
│   ├── payment-methods-reference.cy.js
│   ├── customers-reference.cy.js
│   └── shipping-methods-reference.cy.js
├── docs/
│   └── catalogo_defeitos.md        # Catálogo de defeitos, pontos e roteiro de injeção
├── results/                        # Figuras geradas pelos scripts
├── requirements.txt                # Dependências Python
└── README.md
```

## Requisitos

- **Python 3.12+** (para a análise estatística)
- **Node.js 22+** e **Cypress 12.12** (apenas para reexecutar as suítes de referência)
- **Docker** com a instância da loja de demonstração do **Sylius 1.x**

## Reproduzindo a análise estatística

A análise estatística e as figuras são reproduzíveis diretamente a partir da planilha de coleta anonimizada.

```bash
# 1. Instalar as dependências
pip install -r requirements.txt

# 2. Entrar na pasta de scripts
cd scripts

# 3. Rodar os testes estatísticos (imprime resultados no terminal)
python analise_estatistica.py

# 4. Gerar a figura de correlação
python grafico_estatistica.py
```

## Reexecutando as suítes de referência (opcional)

As suítes de referência foram escritas para a loja de demonstração do Sylius rodando localmente via Docker, acessível em `http://localhost:9990`. Para executá-las:

```bash
npx cypress run --spec "reference-suites/products-reference.cy.js" \
  --config baseUrl=http://localhost:9990
```

## Composição da amostra

As 22 suítes discentes analisadas distribuem-se em quatro funcionalidades administrativas do Sylius:

| Funcionalidade        | Suítes |
|-----------------------|:------:|
| Produtos              |   8    |
| Métodos de Pagamento  |   6    |
| Clientes              |   5    |
| Métodos de Envio      |   3    |
| **Total**             | **22** |

## Licença

Os artefatos deste repositório destinam-se a fins acadêmicos e de reprodução do estudo.
