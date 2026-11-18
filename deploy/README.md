# Déploiement de TogoExpo sur un VPS

Tout tourne sur le serveur, dans Docker :

| Adresse | Service |
|---|---|
| `togoexpo.tg` (`www.` y redirige) | Le site Next.js |
| `cms.togoexpo.tg` | WordPress : administration, API GraphQL, médias. Les autres adresses redirigent vers le site. |

Caddy obtient et renouvelle les certificats HTTPS tout seul. Le site lit WordPress
par le réseau interne du serveur, et WordPress prévient le site à chaque
publication : un article publié est en ligne dans la seconde.

**Serveur conseillé :** Ubuntu 22.04/24.04 ou Debian 12, 2 vCPU, 4 Go de RAM
(2 Go suffisent, le script ajoute de la mémoire d'échange pour le build).

Toutes les commandes `sh deploy/...` se lancent depuis la racine du projet sur
votre Mac. Remplacez `IP` par l'adresse du serveur.

---

## 1. Accès SSH par clé (une fois)

```bash
ssh-copy-id root@IP
```

Si vous n'avez pas encore de clé : `ssh-keygen -t ed25519`, puis la commande ci-dessus.

## 2. Préparer le serveur (une fois)

```bash
ssh root@IP 'bash -s' < deploy/scripts/server-setup.sh
```

Installe Docker, le pare-feu (seuls SSH, HTTP et HTTPS ouverts), les mises à
jour de sécurité automatiques, et crée l'utilisateur `deploy` qui servira ensuite.

## 3. DNS : le CMS et une préproduction (zone DNS chez Hosteur)

Ajoutez deux enregistrements **A** vers `IP` :

| Nom | Type | Valeur |
|---|---|---|
| `cms` | A | IP |
| `preprod` | A | IP |
| `www.preprod` | A | IP |

Profitez-en pour baisser à 300 secondes le TTL des enregistrements `@` et `www`
(ils changeront au jour J). **Ne touchez pas aux enregistrements MX et TXT** :
ce sont les e-mails `@togoexpo.tg`.

## 4. Premier envoi et réglages

```bash
SERVER=deploy@IP sh deploy/push.sh
```

Le premier envoi s'arrête : il manque les réglages. Créez-les sur le serveur :

```bash
ssh deploy@IP
cd /opt/togoexpo/deploy
cp .env.example .env
nano .env
```

- `SITE_DOMAIN=preprod.togoexpo.tg` pour l'instant (on passera à `togoexpo.tg` au jour J).
- Chaque `change_me` : une valeur aléatoire, générée avec
  `openssl rand -base64 33 | tr -d '/+=' | cut -c1-40`.
- `RESEND_API_KEY` : la clé Resend du formulaire de contact (déjà utilisée sur Vercel).

Gardez le mot de passe administrateur WordPress (`WP_ADMIN_PASSWORD`) dans votre
gestionnaire de mots de passe.

## 5. Installer WordPress

```bash
ssh deploy@IP 'cd /opt/togoexpo/deploy && sh scripts/wp-init.sh'
```

WordPress en français, WPGraphQL, Polylang (FR par défaut, EN, JA), permaliens.
L'administration répond sur `https://cms.togoexpo.tg/wp-admin`.

## 6. Le contenu (dans cet ordre)

**a. Les éditions traduites, depuis le WordPress local.** Cette étape **remplace
toute la base** du serveur : faites-la en premier, une seule fois.

```bash
cd wp && docker compose -p togoexpo up -d db && cd ..
SERVER=deploy@IP sh deploy/migrate-local-content.sh
```

Les 7 éditions en FR/EN/JA et leurs images arrivent sur le serveur. Les 2
articles de démonstration (« Le Togo à Osaka 2025 », « Bilan du pavillon… »,
en 3 langues) viennent avec : supprimez-les dans l'administration s'ils ne
doivent pas être publiés. Seul le compte administrateur de `deploy/.env` est conservé.

**b. Les 33 articles de l'ancien site.** Tant que l'ancien site est en ligne
(les images sont téléchargées depuis lui) :

1. Ancien WordPress › Outils › Exporter › **Articles** › Télécharger.
2. Envoi et import :
   ```bash
   scp ~/Downloads/togoexpo.WordPress.*.xml deploy@IP:/opt/togoexpo/deploy/import/
   ssh deploy@IP 'cd /opt/togoexpo/deploy && sh scripts/wp-import.sh import/NOM_DU_FICHIER.xml'
   ```

Les articles gardent leur adresse : les redirections de l'ancien site
(`/ancien-article` → `/fr/actualites/ancien-article`) fonctionnent d'elles-mêmes.

## 7. Construire le site et tester la préproduction

```bash
SERVER=deploy@IP sh deploy/push.sh
```

À vérifier sur `https://preprod.togoexpo.tg` :
- les pages, les éditions, les actualités et leurs images ;
- publier un article de test dans `cms.togoexpo.tg` : il apparaît sur la préproduction dans la seconde ;
- le formulaire de contact.

## 8. Jour J : bascule du domaine

1. Zone DNS Hosteur : `@` en **A** vers `IP`, `www` en **A** vers `IP` (supprimez
   l'éventuel CNAME `www`). Rien d'autre.
2. Une fois que `dig +short togoexpo.tg` et `dig +short cms.togoexpo.tg` donnent `IP` :
   ```bash
   ssh deploy@IP 'cd /opt/togoexpo/deploy && sh scripts/set-domains.sh togoexpo.tg cms.togoexpo.tg'
   ```
   Le script met à jour les réglages, réécrit les adresses des images dans
   WordPress, reconstruit le site et obtient les certificats.
3. Vérifier `https://togoexpo.tg`, `https://www.togoexpo.tg` (redirection),
   une ancienne adresse (`https://togoexpo.tg/devenir-sponsor`) et l'envoi d'un e-mail vers `@togoexpo.tg`.
4. Google Search Console : soumettre `https://togoexpo.tg/sitemap.xml`.
5. Dans 2 à 4 semaines, supprimer l'ancien site chez Hosteur (gardez sa sauvegarde),
   le projet Vercel et l'enregistrement `preprod`.

## 9. Sauvegardes (une fois)

```bash
ssh deploy@IP '(crontab -l 2>/dev/null; echo "0 3 * * * sh /opt/togoexpo/deploy/scripts/backup.sh >/dev/null 2>&1") | crontab -'
```

Base et médias chaque nuit dans `/opt/togoexpo/backups` (14 jours gardés).
Copiez ce dossier hors du serveur de temps en temps.

---

## Au quotidien

| Besoin | Commande |
|---|---|
| Mettre en ligne une modification du code | `git push` sur `main` (automatique, voir plus bas) |
| … ou à la main, depuis le Mac | `SERVER=deploy@IP sh deploy/push.sh` |
| Changer de domaines | `sh scripts/set-domains.sh <site> <cms>` (sur le serveur) |
| Voir les journaux du site | `ssh deploy@IP 'cd /opt/togoexpo/deploy && docker compose logs -f --tail 100 front'` |
| Forcer le site à relire WordPress | `ssh deploy@IP 'cd /opt/togoexpo/deploy && sh scripts/revalidate.sh'` |
| Mettre à jour WordPress, MySQL, Caddy | `ssh deploy@IP 'cd /opt/togoexpo/deploy && docker compose pull && docker compose up -d'` |
| Commande WP-CLI | `ssh deploy@IP 'cd /opt/togoexpo/deploy && docker compose run --rm wpcli plugin list'` |

Les extensions WordPress se mettent à jour depuis l'administration, comme d'habitude.

## Déploiement automatique (GitHub Actions)

Chaque `git push` sur `main` qui touche `frontend/`, `deploy/` ou `wp/mu-plugins/`
lance `.github/workflows/deploy.yml` :

1. **Vérification** : typecheck et lint du front. En cas d'erreur, rien n'est déployé.
2. **Mise en ligne** : `deploy/push.sh` depuis GitHub. Le site est reconstruit sur
   le serveur ; si le build échoue, la version précédente reste en ligne.

Suivi : onglet **Actions** du dépôt. Relance manuelle : Actions › Déploiement › Run workflow.

Réglages du dépôt (Settings › Secrets and variables › Actions) :

| Nom | Type | Contenu |
|---|---|---|
| `DEPLOY_SERVER` | variable | `deploy@IP` |
| `DEPLOY_SSH_KEY` | secret | clé SSH privée réservée au déploiement (sa clé publique est dans `~deploy/.ssh/authorized_keys`, commentaire `github-actions@togoexpo`) |
| `DEPLOY_KNOWN_HOSTS` | secret | `ssh-keyscan IP` |

Pour couper l'accès de GitHub au serveur : supprimer la ligne `github-actions@togoexpo`
de `~deploy/.ssh/authorized_keys`.

## En cas de problème

- **Pas de certificat HTTPS** : le domaine ne pointe pas encore vers le serveur
  (`dig +short cms.togoexpo.tg`). Caddy réessaie tout seul ; journal : `docker compose logs caddy`.
- **Un article publié n'apparaît pas** : `sh scripts/revalidate.sh`. Sinon, il
  apparaît de toute façon en moins de 5 minutes.
- **« Mot de passe oublié » ne part pas** : WordPress n'a pas d'envoi d'e-mails
  configuré. Installez une extension SMTP (par exemple FluentSMTP) avec une boîte `@togoexpo.tg`.
