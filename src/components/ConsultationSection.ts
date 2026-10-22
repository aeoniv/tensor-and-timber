export function renderConsultationSection(): string {
  return `
    <section class="section" id="consultation-section">
      <div class="container">
        
        <div class="section-header text-center">
          <span class="section-tag gold">
            <span class="flag-dot-green"></span>
            Atendimento Personalizado
          </span>
          <h2 class="section-title">
            Inicie sua Encomenda <span class="gold-gradient">Sob Medida</span>
          </h2>
          <p class="section-subtitle">
            Atendemos arquitetos, designers de interiores e clientes finais em todo o Brasil.
            Fale diretamente com o mestre marceneiro ou envie as especificações do seu espaço.
          </p>
        </div>

        <div class="consultation-layout-grid">
          
          <!-- Left: Direct WhatsApp Card & Guarantees -->
          <div class="consultation-direct-card glass-panel">
            <div class="direct-card-tag">CANAL DIRETO &bull; RESPOSTA RÁPIDA</div>
            <h3 class="direct-card-title">Prefere conversar diretamente no WhatsApp?</h3>
            <p class="direct-card-desc">
              Envie fotos do seu ambiente, plantas em PDF ou tire dúvidas técnicas sobre madeiras nobres, resistência e prazos com nosso atelier.
            </p>

            <a 
              href="https://wa.me/5511999998888?text=Olá!%20Gostaria%20de%20solicitar%20um%20orçamento%20para%20mobiliário%20sob%20medida%20da%20Tensor%20%26%20Timber." 
              target="_blank" 
              rel="noopener noreferrer" 
              class="btn btn-whatsapp-full"
            >
              <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
                <path d="M12.031 6.172c-3.181 0-5.767 2.586-5.768 5.766-.001 1.298.38 2.27 1.019 3.287l-.711 2.598 2.669-.699c.969.54 1.771.815 2.791.815 3.179 0 5.765-2.586 5.765-5.766 0-3.18-2.586-5.766-5.765-5.766zm9.969 5.766c0 5.514-4.486 10-10 10-1.741 0-3.376-.448-4.807-1.231l-5.193 1.36 1.385-5.059c-.886-1.488-1.385-3.228-1.385-5.07 0-5.514 4.486-10 10-10s10 4.486 10 10z"/>
              </svg>
              <span>Abrir Conversa no WhatsApp</span>
            </a>

            <div class="guarantees-list">
              <div class="guarantee-item">
                <span class="guarantee-icon">🌿</span>
                <div>
                  <strong>Madeiras 100% FSC® e Demolição</strong>
                  <p>Origem rastreada e documentação DOF emitida pelo IBAMA.</p>
                </div>
              </div>
              <div class="guarantee-item">
                <span class="guarantee-icon">📐</span>
                <div>
                  <strong>Cálculo Estrutural de Precisão</strong>
                  <p>Análise de elementos finitos e cabos navais de 1.800 kgf.</p>
                </div>
              </div>
              <div class="guarantee-item">
                <span class="guarantee-icon">🚚</span>
                <div>
                  <strong>Entrega White-Glove em Todo o Brasil</strong>
                  <p>Transporte climatizado e equipe própria de montagem.</p>
                </div>
              </div>
              <div class="guarantee-item">
                <span class="guarantee-icon">🛡️</span>
                <div>
                  <strong>Garantia Vitalícia da Estrutura</strong>
                  <p>Certificado de autenticidade numerado e calibração periódica.</p>
                </div>
              </div>
            </div>
          </div>

          <!-- Right: Clean Consultation Form -->
          <div class="consultation-form-card glass-panel">
            <h3 class="form-card-title">Solicitar Proposta por E-mail</h3>
            <p class="form-card-subtitle">Retornamos com proposta detalhada em até 24 horas úteis.</p>

            <form id="onpage-commission-form" class="clean-form">
              <div class="form-field">
                <label for="comm-name">Seu Nome Completo</label>
                <input type="text" id="comm-name" placeholder="Ex: Dra. Mariana Vasconcelos" required />
              </div>

              <div class="form-row-2">
                <div class="form-field">
                  <label for="comm-phone">WhatsApp / Telefone</label>
                  <input type="tel" id="comm-phone" placeholder="(11) 99876-5432" required />
                </div>
                <div class="form-field">
                  <label for="comm-city">Cidade / Estado</label>
                  <input type="text" id="comm-city" placeholder="Ex: São Paulo - SP" required />
                </div>
              </div>

              <div class="form-field">
                <label for="comm-archetype">Peça de Interesse</label>
                <select id="comm-archetype">
                  <option value="Mesa de Jantar Flutuante Ipanema">Mesa de Jantar Flutuante Ipanema (Cumaru Maciço)</option>
                  <option value="Poltrona Tensa Niemeyer">Poltrona Tensa Niemeyer (Freijó &amp; Couro)</option>
                  <option value="Aparador Escultural Cerrado">Aparador Escultural Cerrado (Jacarandá da Bahia)</option>
                  <option value="Mesa de Centro Tupi">Mesa de Centro Tupi (Pequiá &amp; Vidro 19mm)</option>
                  <option value="Cúpula Geodésica Biosfera">Cúpula Geodésica Biosfera 3V</option>
                  <option value="Projeto Especial Sob Medida">Projeto Especial com Arquiteto</option>
                </select>
              </div>

              <div class="form-field">
                <label for="comm-notes">Dimensões do Espaço ou Observações</label>
                <textarea id="comm-notes" rows="3" placeholder="Ex: Living integrado com 45m², desejamos uma mesa para 10 a 12 lugares em tom mel..."></textarea>
              </div>

              <button type="submit" class="btn btn-primary-gold btn-block btn-lg" id="btn-submit-commission">
                <span>Enviar Solicitação de Orçamento &rarr;</span>
              </button>

              <div id="commission-success-state" class="form-success-message" style="display: none;">
                ✓ Solicitação recebida com sucesso! Nossa equipe técnica entrará em contato via WhatsApp em breve.
              </div>
            </form>
          </div>

        </div>

      </div>
    </section>
  `;
}
