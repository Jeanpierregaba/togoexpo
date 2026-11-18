#!/usr/bin/env bash
# Préparation d'un VPS Ubuntu/Debian neuf, une seule fois, en root :
#   ssh root@IP 'bash -s' < deploy/scripts/server-setup.sh
#
# Installe Docker (dépôt officiel), ouvre uniquement SSH/HTTP/HTTPS, ajoute
# 2 Go de swap (le build Next.js en a besoin sur un petit serveur), active les
# mises à jour de sécurité automatiques et crée l'utilisateur `deploy`, qui
# reçoit les mêmes clés SSH que root.
set -euo pipefail

[ "$(id -u)" -eq 0 ] || { echo "À lancer en root." >&2; exit 1; }
. /etc/os-release
case "$ID" in ubuntu|debian) ;; *) echo "Système non géré : $ID" >&2; exit 1 ;; esac

export DEBIAN_FRONTEND=noninteractive
echo "== Paquets système =="
apt-get update -q
apt-get upgrade -yq
apt-get install -yq ca-certificates curl gnupg ufw rsync unattended-upgrades fail2ban

echo "== Docker =="
if ! command -v docker >/dev/null; then
  install -m 0755 -d /etc/apt/keyrings
  curl -fsSL "https://download.docker.com/linux/$ID/gpg" -o /etc/apt/keyrings/docker.asc
  chmod a+r /etc/apt/keyrings/docker.asc
  echo "deb [arch=$(dpkg --print-architecture) signed-by=/etc/apt/keyrings/docker.asc] https://download.docker.com/linux/$ID $VERSION_CODENAME stable" \
    > /etc/apt/sources.list.d/docker.list
  apt-get update -q
  apt-get install -yq docker-ce docker-ce-cli containerd.io docker-buildx-plugin docker-compose-plugin
fi
systemctl enable --now docker

echo "== Pare-feu =="
ufw allow OpenSSH
ufw allow 80/tcp
ufw allow 443/tcp
ufw allow 443/udp
ufw --force enable

echo "== Swap =="
if ! swapon --show | grep -q .; then
  fallocate -l 2G /swapfile
  chmod 600 /swapfile
  mkswap /swapfile
  swapon /swapfile
  echo '/swapfile none swap sw 0 0' >> /etc/fstab
fi

echo "== Mises à jour de sécurité automatiques =="
dpkg-reconfigure -f noninteractive unattended-upgrades

echo "== Utilisateur deploy =="
if ! id deploy >/dev/null 2>&1; then
  adduser --disabled-password --gecos "" deploy
fi
usermod -aG docker deploy
install -d -m 700 -o deploy -g deploy /home/deploy/.ssh
if [ -f /root/.ssh/authorized_keys ]; then
  install -m 600 -o deploy -g deploy /root/.ssh/authorized_keys /home/deploy/.ssh/authorized_keys
fi
install -d -o deploy -g deploy /opt/togoexpo

echo
echo "Serveur prêt. Suite : depuis votre Mac, SERVER=deploy@$(hostname -I | awk '{print $1}') sh deploy/push.sh"
