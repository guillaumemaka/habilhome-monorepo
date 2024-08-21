# Habilhome

Habilhome est une application web offrant une assistance aux personne ayant une déficience intellectuel en leurs proposant un outils de recherche d'outils applicatifs ou physique permettant de les accompagnés dans leurs tâches quotidiennes

# Structure

L'application est désignée selon une architecture N-Tier containerisé.
- Frontend -> Backend -> Database

L'application expose:
- Un frontend public
- Un backoffice administratif
- Une API Rest
- Une base de donnée NoSQL

L'application est hébergées sur la plateforme cloud AWS:
- AWS Compute EC2
- AWS SES
- AWS Route 53
- AWS S3
- Docker:
  - Traefik (reverse proxy + let's encrypt ssl certificate management + telemetry)
  - Frontend public habilhome.com
  - Frontend Admin admin.habilhome.com
  - API Rest api.habilhome.com

