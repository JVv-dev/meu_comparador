"use client"
import { useEffect } from 'react';

// Tipa as props para que possamos reutilizar o banner
type AdBannerProps = {
  dataAdSlot: string; // O ID do seu bloco de anúncio
  dataAdFormat?: string;
  dataFullWidthResponsive?: string;
  style?: React.CSSProperties;
  className?: string;
};

// Declara o 'adsbygoogle' no window para o TypeScript não reclamar
declare global {
  interface Window {
    adsbygoogle?: { [key: string]: unknown }[];
  }
}

export const AdBanner = ({
  dataAdSlot,
  dataAdFormat = "auto",
  dataFullWidthResponsive = "true",
  style = { display: 'block' }, // O AdSense precisa que seja 'block'
  className
}: AdBannerProps) => {

  useEffect(() => {
    // Esta função "ativa" o anúncio
    try {
      (window.adsbygoogle = window.adsbygoogle || []).push({});
    } catch (err) {
      console.error("Erro ao carregar AdSense", err);
    }
  }, []); // Roda uma vez quando o componente monta

  return (
    <ins
      className={`adsbygoogle ${className || ''}`}
      style={style}
      data-ad-client="ca-pub-8958901962627606" // Seu ID de publisher
      data-ad-slot={dataAdSlot} // O ID do Bloco de Anúncio
      data-ad-format={dataAdFormat}
      data-full-width-responsive={dataFullWidthResponsive}
    ></ins>
  );
};