import './globals.css';
import { NotFoundContent } from '@/components/NotFoundContent';

// Le layout racine ne rend pas <html>/<body> (le `lang` dépend du segment de
// langue) : la page 404 fournit donc son propre document complet.
export default function RootNotFound() {
  return (
    <html lang="fr">
      <body>
        <NotFoundContent />
      </body>
    </html>
  );
}
