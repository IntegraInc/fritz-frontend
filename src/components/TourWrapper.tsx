"use client";

import { useEffect } from "react";
import { driver } from "driver.js";
import "driver.js/dist/driver.css";

export function TourWrapper({ children }: { children: React.ReactNode }) {
  useEffect(() => {
    // Verifica se o usuário já fez o tour global
    const tourConcluido = localStorage.getItem("fritz_tour_completo");
    if (tourConcluido) return;

    const driverObj = driver({
      showProgress: true,
      animate: true,
      nextBtnText: 'Próximo &rarr;',
      prevBtnText: '&larr; Anterior',
      doneBtnText: 'Começar a usar!',
      steps: [
        { 
          popover: { 
            title: 'Boas-vindas ao Portal Fritz! 🚀', 
            description: 'Construímos um arsenal de ferramentas de alta performance para acelerar sua rotina. Que tal um tour de 30 segundos pelos seus novos superpoderes?' 
          } 
        },
        { 
          element: '#tour-sidebar-troca', 
          popover: { 
            title: 'Múltiplos Ambientes num Clique 🏢', 
            description: 'Chega de fazer login várias vezes. Clique em "Trocar" a qualquer momento para navegar entre diferentes Empresas e Filiais num piscar de olhos, sem sair da tela atual.' 
          } 
        },
        { 
          element: '#tour-badge-erp', 
          popover: { 
            title: 'Sincronia Perfeita com o Senior ⚡', 
            description: 'Esqueça o delay. Seus dados estão vivos! Tudo o que você opera aqui reflete e consome informações da realidade do seu ERP Senior em tempo real.' 
          } 
        },
        { 
          element: '#tour-caixa-busca', 
          popover: { 
            title: 'Busca Automática (Live Search) 🔍', 
            description: 'Tempo é dinheiro! Digite o que precisa e o sistema busca sozinho, sem você precisar apertar Enter.<br><br>🔥 <b>Dica Ninja:</b> Aperte a tecla <b>[ / ]</b> de qualquer lugar da tela para focar na busca instantaneamente!' 
          } 
        },
        { 
          element: '#tour-cabecalho-tabela', 
          popover: { 
            title: 'Tabela Flexível e Inteligente ↕️', 
            description: 'Clique no título de qualquer coluna para <b>ordenar de A-Z</b> ou valores maiores/menores. A descrição ficou curta? Clique na bordinha direita da coluna e <b>arraste para redimensionar!</b>' 
          } 
        },
        { 
          element: '#tour-corpo-tabela', 
          popover: { 
            title: 'Foco e Produtividade Máxima 🎯', 
            description: 'Trabalhando com dois monitores? <b>Clique em qualquer linha</b> para destacá-la com um marcador amarelo e não se perder na leitura.<br><br>🪄 <b>Mágica:</b> Dê um clique em qualquer <b>Código de Produto</b> para copiá-lo direto para sua área de transferência!' 
          } 
        },
        { 
          element: '#tour-paginacao', 
          popover: { 
            title: 'Navegação sem Engasgos 📄', 
            description: 'Navegue por catálogos gigantescos sem travar sua máquina. E o melhor: ao avançar de página, o sistema rola a tela de volta para o topo automaticamente para você continuar operando com conforto.' 
          } 
        }
      ],
      onDestroyStarted: () => {
        // Grava no navegador que o tour foi finalizado
        localStorage.setItem("fritz_tour_completo", "true");
        driverObj.destroy();
      }
    });

    // Inicia o tour 1 segundo após o componente montar
    const timer = setTimeout(() => {
      driverObj.drive();
    }, 1000);

    return () => clearTimeout(timer);
  }, []);

  return <>{children}</>;
}