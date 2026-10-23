export function renderConsultationSection(): string {
  return `
    <section class="section consultation-section" id="consultation-section">
      <div class="container">
        
        <div class="section-header text-center">
          <span class="section-tag gold">
            Atendimento &bull; Orçamento Sem Compromisso
          </span>
          <h2 class="section-title">
            Fale Conosco e Solicite seu <span class="gold-gradient">Orçamento</span>
          </h2>
          <p class="section-subtitle">
            Envie sua ideia, as dimensões do ambiente ou seu projeto arquitetônico. Atendemos com rapidez e clareza.
          </p>
        </div>

        <div class="consultation-layout-grid">
          
          <!-- Left Column: Simple Honest Points & Legal Data -->
          <div class="consultation-info-col">
            
            <div class="consultation-card glass-panel">
              <div class="consultation-feature">
                <div class="cf-icon">💬</div>
                <div class="cf-text">
                  <strong>Atendimento Direto pelo WhatsApp</strong>
                  <p>Fale diretamente com quem fabrica. Tire dúvidas técnicas e receba estimativas iniciais de valores e prazos.</p>
                </div>
              </div>

              <div class="consultation-feature">
                <div class="cf-icon">🪵</div>
                <div class="cf-text">
                  <strong>Material Conforme Sua Escolha</strong>
                  <p>Trabalhamos com madeiras maciças (Cumaru, Freijó, Peroba, Pinus), MDF ou compensados, adequando ao projeto e ao seu orçamento.</p>
                </div>
              </div>

              <div class="consultation-feature">
                <div class="cf-icon">🚚</div>
                <div class="cf-text">
                  <strong>Entrega e Montagem Especializada</strong>
                  <p>Montagem cuidadosa no local em João Pessoa e região, com possibilidade de envio para outros estados.</p>
                </div>
              </div>

              <div class="consultation-feature">
                <div class="cf-icon">📋</div>
                <div class="cf-text">
                  <strong>Dados Cadastrais Oficiais</strong>
                  <p>
                    <strong>83 EMPREENDIMENTOS LTDA</strong> (83 Ambientes Planejados)<br>
                    CNPJ: 59.492.848/0001-28 &bull; CNAE 33.29-5-01 (Montagem de móveis)<br>
                    Av. Bahia, 703, CXPST 042 — Bairro dos Estados, João Pessoa - PB
                  </p>
                </div>
              </div>
            </div>

            <!-- Direct Contact Box -->
            <div class="direct-phone-box glass-panel">
              <span class="direct-label">ATENDIMENTO RÁPIDO</span>
              <a href="https://wa.me/558398229900" target="_blank" rel="noopener noreferrer" class="direct-link">
                (83) 9822-9900
              </a>
              <span class="direct-sub">Segunda a Sexta, das 8h às 18h &bull; Sábado, das 8h às 12h</span>
            </div>

          </div>

          <!-- Right Column: Clean Form -->
          <div class="consultation-form-col glass-panel">
            <h3 class="form-box-title">Solicitar Proposta de Móvel Sob Medida</h3>
            <p class="form-box-sub">Preencha os campos abaixo. Retornamos o contato em até 24 horas úteis.</p>

            <form id="onpage-commission-form" class="bespoke-commission-form">
              <div class="form-row">
                <div class="form-group">
                  <label for="comm-name">Seu Nome Completo *</label>
                  <input type="text" id="comm-name" placeholder="Ex: Maria Fernandes" required />
                </div>
                <div class="form-group">
                  <label for="comm-phone">WhatsApp / Telefone *</label>
                  <input type="tel" id="comm-phone" placeholder="(83) 98888-0000" required />
                </div>
              </div>

              <div class="form-row">
                <div class="form-group">
                  <label for="comm-city">Cidade / Estado *</label>
                  <input type="text" id="comm-city" placeholder="Ex: João Pessoa - PB" required />
                </div>
                <div class="form-group">
                  <label for="comm-archetype">Tipo de Projeto *</label>
                  <select id="comm-archetype" required>
                    <option value="Mesa de Jantar Flutuante">Mesa de Jantar Flutuante</option>
                    <option value="Poltrona Tensa Lounge">Poltrona Tensa Lounge</option>
                    <option value="Aparador Suspenso Cerrado">Aparador Suspenso</option>
                    <option value="Mesa de Centro Tupi">Mesa de Centro</option>
                    <option value="Móveis Planejados Residenciais">Móveis Planejados Residenciais</option>
                    <option value="Cúpula Geodésica 6M">Cúpula Geodésica em Madeira</option>
                    <option value="Outro Projeto Sob Medida">Outro Projeto Sob Medida</option>
                  </select>
                </div>
              </div>

              <div class="form-group">
                <label for="comm-notes">Descreva seu Projeto ou Medidas Desejadas</label>
                <textarea id="comm-notes" rows="4" placeholder="Ex: Mesa para 8 lugares, tampo de 2,40m, preferência por madeira clara ou MDF."></textarea>
              </div>

              <button type="submit" class="btn btn-primary-gold btn-block btn-lg" id="btn-submit-commission">
                <span>Enviar Solicitação de Orçamento</span>
                <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5">
                  <path d="M5 12h14M12 5l7 7-7 7"/>
                </svg>
              </button>

              <div id="commission-success-state" class="commission-success-state" style="display: none;">
                <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="#10b981" stroke-width="2.5"><polyline points="20 6 9 17 4 12"/></svg>
                <h4>Solicitação Recebida com Sucesso!</h4>
                <p>Nossa equipe entrará em contato pelo seu WhatsApp.</p>
              </div>
            </form>
          </div>

        </div>

      </div>
    </section>
  `;
}
