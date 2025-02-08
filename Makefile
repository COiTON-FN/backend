mgt:
	cd src/api/v1/database && npx sequelize-cli db:migrate --env development

mgprod:
	export NODE_TLS_REJECT_UNAUTHORIZED='0' && cd src/api/v1/database && npx sequelize-cli db:migrate --env production


mc:
	cd src/api/v1/database && npx sequelize-cli migration:create --name ${name}

dev:
	cd src/api/v1/database && npx sequelize-cli db:migrate && mv /Users/victorsamuel/Documents/zarah/shit/coiton/backend/src/api/v1/database/dev.sqlite /Users/victorsamuel/Documents/zarah/shit/coiton/backend && npm run dev