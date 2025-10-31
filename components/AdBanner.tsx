"use client"
import { useEffect } from 'react';

// Tipa as props para que possamos reutilizar o banner
type AdBannerProps = {
  dataAdSlot: string; // O ID do seu bloco de anúncio
  className?: string;
};

// Declara o 'adsbygoogle' no window para o TypeScript não reclamar
declare global {
  interface Window {
    adsbygoogle?: { [key: string]: unknown }[];
  }
}

export const AdBanner = ({ dataAdSlot, className }: AdBannerProps) => {

  useEffect(() => {
    // Esta é a parte <script>(adsbygoogle = ...).push({});</script>
    // que roda depois que o componente aparece na tela.
    try {
      (window.adsbygoogle = window.adsbygoogle || []).push({});
    } catch (err) {
      console.error("Erro ao carregar AdSense", err);
    }
  }, [dataAdSlot]); // Roda quando o componente monta e se o slot mudar

  // Esta é a parte <ins class="adsbygoogle"...
  return (
    <ins
      className={`adsbygoogle ${className || ''}`}
      style={{ display: 'block' }} // O AdSense precisa que seja 'block'
      data-ad-client="ca-pub-8958901962627606" // Seu ID de publisher
      data-ad-slot={dataAdSlot} // O ID do Bloco de Anúncio
      data-ad-format="auto"
      data-full-width-responsive="true"
    ></ins>
  );
};