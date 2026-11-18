import { ImageResponse } from 'next/og';
import { getDictionary } from '@/i18n/dict';
import { toLang } from '@/i18n/lang';

export const runtime = 'edge';
export const size = { width: 1200, height: 630 };
export const contentType = 'image/png';
export const alt = 'TogoExpo';

export default function OgImage({ params }: { params: { lang: string } }) {
  const t = getDictionary(toLang(params.lang));
  return new ImageResponse(
    (
      <div
        style={{
          width: '100%',
          height: '100%',
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'center',
          padding: 80,
          backgroundColor: '#0B0F0C',
          color: '#fff',
          fontFamily: 'system-ui, sans-serif',
        }}
      >
        <div style={{ fontSize: 28, letterSpacing: 8, color: '#FFCE00' }}>{t.meta.ogKicker}</div>
        <div style={{ display: 'flex', fontSize: 96, fontWeight: 800, marginTop: 8 }}>
          TOGO<span style={{ color: '#008751' }}>EXPO</span>
        </div>
        <div style={{ fontSize: 30, marginTop: 16, color: 'rgba(255,255,255,0.8)' }}>{t.meta.ogTagline}</div>
      </div>
    ),
    { ...size },
  );
}
