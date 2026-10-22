export function renderConsultationSection(): string {
  return `
    <section class="section" id="consultation-section">
      <div class="container">
        
        <!-- Section Header -->
        <div class="section-header text-center">
          <span class="section-tag gold">
            <svg width="12" height="12" viewBox="0 0 24 24" fill="currentColor">
              <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"/>
            </svg>
            Processo Exclusivo de Ateliê
          </span>
          <h2 class="section-title">
            Da Concepção Digital à <span class="gold-gradient">Instalação Impecável</span>
          </h2>
          <p class="section-subtitle">
            Combinamos marcenaria artesanal brasileira com modelagem paramétrica de ponta. 
            Conheça o passo a passo da encomenda de uma peça de alto padrão.
          </p>
        </div>

        <!-- 4-Step Bespoke Journey Grid -->
        <div class="process-steps-grid">
          <div class="process-step-card glass-panel">
            <div class="step-badge">Etapa 01</div>
            <h3 class="step-title">Síntese Espacial 3D</h3>
            <p class="step-description">
              Definimos as proporções ideais para seu ambiente através de modelagem digital e simulação de iluminação e circulação.
            </p>
          </div>

          <div class="process-step-card glass-panel">
            <div class="step-badge">Etapa 02</div>
            <h3 class="step-title">Caixa de Amostras</h3>
            <p class="step-description">
              Enviamos por portador uma caixa de curadoria com amostras de Cumaru, Freijó, Jacarandá e conexões de inox/titânio.
            </p>
          </div>

          <div class="process-step-card glass-panel">
            <div class="step-badge">Etapa 03</div>
            <h3 class="step-title">Engenharia FEA</h3>
            <p class="step-description">
              Simulação de Elementos Finitos que calcula a pré-tensão de cada cabo para garantir deflexão milimétrica zero.
            </p>
          </div>

          <div class="process-step-card glass-panel">
            <div class="step-badge">Etapa 04</div>
            <h3 class="step-title">Entrega White-Glove</h3>
            <p class="step-description">
              Nossa equipe de mestres marceneiros realiza o transporte seguro e a montagem técnica calibrada em sua residência.
            </p>
          </div>
        </div>

        <!-- Direct High-Ticket On-Page Commission Form -->
        <div class="commission-form-card glass-panel" style="margin-top: 64px;">
          <div class="commission-header text-center">
            <span class="commission-badge">CANAL DIRETO COM O ATELIÊ</span>
            <h3 class="commission-title">Solicite seu Orçamento ou Agende uma Visita Técnica</h3>
            <p class="commission-subtitle">
              Receba o contato direto do nosso marceneiro-chefe e diretor de engenharia em até 24 horas úteis.
            </p>
          </div>

          <form id="onpage-commission-form" class="commission-form-grid">
            <div class="form-group">
              <label for="comm-name">Nome Completo *</label>
              <input type="text" id="comm-name" class="form-input" placeholder="Ex: Dra. Mariana Vasconcellos" required />
            </div>

            <div class="form-group">
              <label for="comm-email">E-mail Profissional ou Pessoal *</label>
              <input type="email" id="comm-email" class="form-input" placeholder="mariana@arquitetura.com.br" required />
            </div>

            <div class="form-group">
              <label for="comm-phone">WhatsApp / Telefone com DDD *</label>
              <input type="tel" id="comm-phone" class="form-input" placeholder="(11) 98765-4321" required />
            </div>

            <div class="form-group">
              <label for="comm-archetype">Peça de Interesse *</label>
              <select id="comm-archetype" class="form-select" required>
                <option value="Mesa de Jantar Flutuante Ipanema">Mesa de Jantar Flutuante Ipanema (Cumaru)</option>
                <option value="Poltrona Tensa Niemeyer">Poltrona Tensa Niemeyer (Freijó &amp; Couro)</option>
                <option value="Aparador Escultural Cerrado">Aparador Escultural Cerrado (Jacarandá)</option>
                <option value="Mesa de Centro Tupi">Mesa de Centro Tupi (Pequiá &amp; Vidro)</option>
                <option value="Cúpula Geodésica Biosfera">Cúpula Geodésica Biosfera / Pavilhão</option>
                <option value="Projeto Corporativo ou Residencial Sob Medida">Projeto Residencial Sob Medida</option>
              </select>
            </div>

            <div class="form-group">
              <label for="comm-budget">Faixa de Investimento Prevista</label>
              <select id="comm-budget" class="form-select">
                <option value="R$ 15.000 a R$ 25.000">R$ 15.000 a R$ 25.000</option>
                <option value="R$ 25.000 a R$ 50.000" selected>R$ 25.000 a R$ 50.000</option>
                <option value="R$ 50.000 a R$ 100.000">R$ 50.000 a R$ 100.000</option>
                <option value="Acima de R$ 100.000">Acima de R$ 100.000 (Grandes Projetos)</option>
              </select>
            </div>

            <div class="form-group">
              <label for="comm-city">Cidade / Estado</label>
              <input type="text" id="comm-city" class="form-input" placeholder="São Paulo - SP, Rio de Janeiro - RJ..." />
            </div>

            <div class="form-group full-width">
              <label for="comm-notes">Dimensões do Espaço ou Detalhes Especiais</label>
              <textarea id="comm-notes" class="form-textarea" rows="3" placeholder="Conte-nos sobre o ambiente, estilo decorativo, medidas ou prazos específicos..."></textarea>
            </div>

            <div class="form-submit-row full-width">
              <button type="submit" class="btn btn-primary-gold btn-lg btn-block" id="comm-submit-btn">
                <span>Enviar Solicitação de Encomenda para o Ateliê</span>
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5">
                  <path d="M5 12h14M12 5l7 7-7 7"/>
                </svg>
              </button>
            </div>
          </form>

          <!-- Success Message State (Hidden Initially) -->
          <div id="commission-success-state" class="commission-success-box" style="display: none;">
            <div class="success-icon-wrap">
              <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="#10b981" stroke-width="2.5">
                <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"/>
                <polyline points="22 4 12 14.01 9 11.01"/>
              </svg>
            </div>
            <h4 class="success-title">Sua Solicitação foi Recebida pelo Nosso Marceneiro-Chefe</h4>
            <p class="success-desc">
              Sua vaga de produção preliminar no trimestre foi reservada. Nossa equipe técnica entrará em contato via WhatsApp e e-mail com as diretrizes e catálogo em até 24 horas úteis.
            </p>
            <div class="success-contact-badge">
              <span>Atendimento Direto: contato@tensortimber.com.br • WhatsApp: (11) 98921-4400</span>
            </div>
          </div>
        </div>

      </div>
    </section>
  `;
}
