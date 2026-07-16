# Avaliação da Qualidade de Testes de GUI em Ambientes Educacionais

Kit de reprodução do estudo empírico que compara suítes de teste de GUI (Cypress) produzidas por estudantes de graduação com suítes de referência elaboradas sob critérios especialistas, no sistema de e-commerce **Sylius**. A avaliação usa três critérios: **capacidade de detecção de defeitos**, **presença de test smells** e **redundância**.

Este repositório contém os artefatos necessários para reproduzir a análise dos dados e as figuras do artigo, bem como as suítes de referência, os códigos brutos anonimizados dos discentes e o catálogo de defeitos utilizados no experimento.

## 🛡️ Política de Privacidade e Anonimização de Dados (LGPD)

Este pacote de replicação foi estruturado em estrita conformidade com as diretrizes de ética em pesquisa. Durante a coleta, identificou-se que as suítes originais submetidas pelos discentes continham dados pessoais identificáveis (nomes, e-mails institucionais e matrículas). Para proteger a privacidade dos participantes, adotou-se a seguinte estratégia:

1. **Anonimização:** A identidade dos estudantes foi substituída por IDs sequenciais (P1–P8, PG1–PG6, CL1–CL5, EN1–EN3). A correspondência aos autores originais não é divulgada.
2. **Disponibilização Segura:** Foram extraídos e disponibilizados apenas os scripts de teste brutos e anonimizados (`.cy.js`). Os arquivos originais completos (`.zip` e configurações locais) contendo o histórico e metadados dos alunos foram omitidos deste repositório para evitar exposição inadvertida.
3. **Reprodutibilidade:** A reprodutibilidade está garantida pelos dados de coleta tabulados, scripts estatísticos, catálogo de defeitos e o uso do Starter Kit oficial da disciplina.

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
├── student-suites-*/               # Pastas contendo os códigos anonimizados dos discentes (.cy.js)
├── docs/
│   └── catalogo_defeitos.md        # Catálogo de defeitos, pontos e roteiro de injeção
├── results/                        # Figuras geradas pelos scripts
├── requirements.txt                # Dependências Python
└── README.md


