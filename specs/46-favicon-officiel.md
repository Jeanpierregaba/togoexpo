# 46 — Favicon officiel

## Demande
Récupérer le favicon officiel de l'ancien site (togoexpo.tg) et le mettre sur le site actuel.

## Fait
- Source : icône du site WordPress de togoexpo.tg
  (`wp-content/uploads/2025/03/cropped-EXPO-04-removebg-preview-1*.png`, logo TogoExpo
  sur fond transparent).
- `frontend/src/app/icon.png` : l'original 512 × 512.
- `frontend/src/app/apple-icon.png` : 180 × 180 sur fond blanc (iOS noircit la transparence).
- `frontend/src/app/favicon.ico` : la version 32 × 32 de l'ancien site, en .ico.
- Remplace le rond jaune sur fond vert. Next sert ces fichiers et les déclare tout seul.

## Vérif
`npm run audit` ; `/favicon.ico`, `/icon.png`, `/apple-icon.png` servis en ligne.
