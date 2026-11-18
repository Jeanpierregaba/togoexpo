import { NotFoundContent } from '@/components/NotFoundContent';

// Frontière `not-found` du segment de langue : composant serveur (Next l'exige
// pour l'envelopper dans le layout), le libellé traduit vient du client.
export default function NotFound() {
  return <NotFoundContent />;
}
