import './globals.css';
import { NotFoundContent } from '@/components/NotFoundContent';

// Le layout racine ne rend pas <html>/<body> (le `lang` dépend du segment de
// langue) : la page 404 fournit donc son propre document complet. Elle ne sert
// plus que hors des segments de langue : /[lang]/… a sa propre 404 mise en page.
export default function RootNotFound() {
  return (
    <html lang="fr">
      <body className="bg-ink">
        <main>
          <NotFoundContent />
        </main>
      </body>
    </html>
  );
}
