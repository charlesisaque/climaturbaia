# 🌌 ClimaTUR Baia

> **"Transformamos dados climáticos em alertas inteligentes para proteger vidas, turismo e cidades baianas."**

**ClimaTUR Baia** é uma plataforma ultra-futurista e cinematográfica de inteligência climática, turismo resiliente, monitoramento civil e smart cities para o Estado da Bahia. Projetada com estética de *situation room* da NASA, painéis minimalistas estilo Tesla/cyberpunk e telemetria avançada, a aplicação serve como centro nervoso de tomada de decisões para turistas e forças de proteção urbana (Defesa Civil).

---

## 🚀 Funcionalidades Principais

*   **Holographic Sensor Network (Mapa Temático)**: Mapa interativo vetorizado (SVG) do Estado da Bahia que monitora as cidades de *Salvador, Ilhéus, Itacaré, Porto Seguro, Lençóis, Juazeiro e Paulo Afonso*. Inclui filtros de radar em tempo real (Radar IA, Térmico, Pluviométrico, Turismo Seguro) e varreduras de sonar concêntricas.
*   **Ambient Weather Particle Simulator**: Sistema em Canvas HTML5 que renderiza partículas atmosféricas realistas (chuva torrencial para riscos de enchente, correntes térmicas ascendentes para ondas de calor/seca, ou poeira flutuante para climas amenos) de forma coordenada ao nível de risco da cidade inspecionada.
*   **Live Alerts Engine & IA Console**: Lista dinâmica de riscos climatológicos locais (enchentes, secas severas, calor crítico, deslizamentos) integrada a um terminal interativo com recomendações geradas por IA para turistas e órgãos governamentais.
*   **Analytics Panel & Tourist Safe Score™**: Gráficos de área com brilho neon integrando dados de temperatura, umidade, vento e chuva acumulada. Possui também um medidor circular dinâmico da escala de segurança turística (*0-25 Seguro*, *26-50 Atenção*, *51-75 Alto Risco*, *76-100 Crítico*).
*   **Modo Defesa Civil (Cockpit Militar)**: Um painel de emergência em tela cheia que simula um centro de crise. Inclui sonar tático animado, telemetria de satélite, medidores de saturação hídrica do solo e evacuação urbana, além de um console CLI interativo alimentado em tempo real. Permite o acionamento de sirenes sonoras digitais e envio simulado de SMS geolocalizado.
*   **Central de Simulação Climática**: Console interativo para jurados ou investidores modularem offset térmico, fatores de chuva extrema ou rajadas de ventos para observar a resiliência do ecossistema e o comportamento do mapa em tempo real.

---

## 🛠️ Stack Tecnológica

*   **Framework**: Next.js 16 (App Router, React 19)
*   **Styling**: Tailwind CSS v4 (Glassmorphism, custom animations, cyberpunk glow variables)
*   **Animações**: Framer Motion
*   **Gráficos**: Recharts & HTML5 Canvas
*   **Ícones**: Lucide React
*   **Tipografia**: Space Grotesk (Google Fonts)

---

## 💻 Instalação e Execução Local

Siga os passos abaixo para clonar e rodar o projeto localmente:

1.  **Clone o repositório**:
    ```bash
    git clone https://github.com/charlesisaque/climaturbaia.git
    cd climaturbaia
    ```

2.  **Instale as dependências**:
    ```bash
    npm install --legacy-peer-deps
    ```

3.  **Execute o servidor de desenvolvimento**:
    ```bash
    npm run dev
    ```

4.  **Acesse no navegador**:
    Abra [http://localhost:3000](http://localhost:3000) no seu navegador para explorar o painel interactivo.

---

## 📂 Estrutura do Projeto

```
src/
├── app/
│   ├── globals.css           # Temas de design, glows e gradientes animados do painel
│   ├── layout.tsx            # Fonte Space Grotesk e tags SEO da plataforma
│   └── page.tsx              # Orquestrador central de estado da aplicação
└── components/
    ├── Sidebar.tsx           # Barra de navegação e telemetria de hardware local
    ├── TopBar.tsx            # HUD com risco global, status da IA e Headline
    ├── HolographicMap.tsx    # Vetores de Bahia, coordenadas e filtros do radar
    ├── AlertPanel.tsx        # Feed de riscos ativos e terminal de recomendações IA
    ├── AnalyticsPanel.tsx    # Gráficos Recharts e medidor do Tourist Safe Score™
    ├── DefenseCivilMode.tsx  # Central tática de crises militares e console de log
    └── WeatherParticles.tsx  # Canvas com animações meteorológicas em tempo real
```

---

## 🛡️ Segurança e Resiliência Urbana

O projeto foi projetado com foco no **Objetivo de Desenvolvimento Sustentável 11 (Cidades e Comunidades Sustentáveis)** e **13 (Ação Contra a Mudança Global do Clima)** da ONU, transformando telemetria em ações tangíveis que salvam vidas e mantêm o turismo do estado seguro.
