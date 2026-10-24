export function renderConsultationSection(): string {
  return `
    <section class="section" id="consultation-section" style="background: var(--bg-subtle);">
      <div class="container">
        
        <div class="section-header text-center">
          <span class="section-tag">
            Atendimento Direto
          </span>
          <h2 class="section-title">
            Solicite seu <span class="accent-text">Orçamento</span>
          </h2>
          <p class="section-subtitle">
            Envie sua ideia, as dimensões do ambiente ou seu projeto arquitetônico. Retornamos com rapidez.
          </p>
        </div>

        <div class="consultation-grid">
          
          <!-- Contact Info Column -->
          <div class="contact-info-card">
            <div class="contact-item">
              <div class="contact-icon-box">💬</div>
              <div class="contact-text-wrap">
                <h4>Atendimento Direto no WhatsApp</h4>
                <p>Converse diretamente com o marceneiro para tirar dúvidas técnicas e receber uma estimativa inicial de valores.</p>
                <a href="https://wa.me/558398229900" target="_blank" rel="noopener noreferrer" style="font-weight: 700; color: var(--accent-wood); display: inline-block; margin-top: 4px;">
                  (83) 9822-9900 &rarr;
                </a>
              </div>
            </div>

            <div class="contact-item">
              <div class="contact-icon-box">🪵</div>
              <div class="contact-text-wrap">
                <h4>Material à Sua Escolha</h4>
                <p>Trabalhamos com madeiras maciças, MDF ou compensados. Você decide de acordo com sua preferência e orçamento.</p>
              </div>
            </div>

            <div class="contact-item">
              <div class="contact-icon-box">🚚</div>
              <div class="contact-text-wrap">
                <h4>Entrega e Montagem Local</h4>
                <p>Montagem profissional no local em João Pessoa e região metropolitana, com possibilidade de envio nacional.</p>
              </div>
            </div>

            <div class="contact-item">
              <div class="contact-icon-box">📋</div>
              <div class="contact-text-wrap">
                <h4>Dados Cadastrais Oficiais</h4>
                <p>
                  <strong>83 EMPREENDIMENTOS LTDA</strong> (83 Ambientes Planejados)<br>
                  CNPJ: 59.492.848/0001-28 &bull; CNAE: 33.29-5-01 (Montagem de móveis)<br>
                  Av. Bahia, 703, CXPST 042 — Bairro dos Estados, João Pessoa - PB
                </p>
              </div>
            </div>
          </div>

          <!-- Form Column -->
          <div class="contact-form-card">
            <h3 class="form-title">Enviar Pedido de Orçamento</h3>
            <p class="form-subtitle">Preencha o formulário abaixo e retornaremos pelo WhatsApp.</p>

            <form id="onpage-commission-form">
              <div class="form-row">
                <div class="form-group">
                  <label for="comm-name">Seu Nome *</label>
                  <input type="text" id="comm-name" placeholder="Ex: Roberto Silva" required />
                </div>
                <div class="form-group">
                  <label for="comm-phone">WhatsApp *</label>
                  <input type="tel" id="comm-phone" placeholder="(83) 98888-0000" required />
                </div>
              </div>

              <div class="form-row">
                <div class="form-group">
                  <label for="comm-city">Cidade / Estado *</label>
                  <input type="text" id="comm-city" placeholder="Ex: João Pessoa - PB" required />
                </div>
                <div class="form-group">
                  <label for="comm-archetype">Tipo de Móvel *</label>
                  <select id="comm-archetype" required>
                    <option value="Mesa de Jantar Flutuante">Mesa de Jantar Flutuante</option>
                    <option value="Poltrona Tensa Lounge">Poltrona Lounge</option>
                    <option value="Aparador Suspenso Cerrado">Aparador Suspenso</option>
                    <option value="Mesa de Centro Tupi">Mesa de Centro</option>
                    <option value="Móveis Planejados Residenciais">Móveis Planejados Residenciais</option>
                    <option value="Outro Projeto Sob Medida">Outro Projeto Sob Medida</option>
                  </select>
                </div>
              </div>

              <div class="form-group">
                <label for="comm-notes">Descreva o que você precisa ou medidas desejadas</label>
                <textarea id="comm-notes" rows="3" placeholder="Ex: Mesa para 8 lugares, tampo de 2,40m, preferência por madeira clara ou MDF."></textarea>
              </div>

              <button type="submit" class="btn btn-primary btn-block btn-lg" id="btn-submit-commission">
                <span>Enviar Solicitação de Orçamento</span>
              </button>

              <div id="commission-success-state" style="display: none; margin-top: 16px; padding: 14px; background: #ecfdf5; border: 1px solid #a7f3d0; border-radius: 8px; color: #065f46; text-align: center;">
                <strong>Solicitação enviada com sucesso!</strong>
                <p style="font-size: 0.85rem; margin-top: 4px;">Nossa equipe entrará em contato em breve.</p>
              </div>
            </form>
          </div>

        </div>

      </div>
    </section>
  `;
}
