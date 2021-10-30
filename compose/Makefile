ARGS = $(filter-out $@,$(MAKECMDGOALS))
MAKEFLAGS += --silent


#############################
# ENVIRONMENT
#############################
-include .env
export
export COMPOSE_PROJECT_NAME=${PROJECT_NAME}


#############################
# CONTAINER ACCESS
#############################

up:
	[[ -f .env ]] || cp .env.example .env
	echo ""
	bash ./.utils/message.sh info "Starting your project..."
	docker-compose up -d
	make urls

stop:
	bash ./.utils/message.sh info "Stopping your project..."
	docker-compose stop

destroy:
	make stop
	bash ./.utils/message.sh info "Deleting all containers..."
	docker-compose down --rmi local --volumes --remove-orphans
	docker-compose down --remove-orphans --volumes
	docker-compose down --volumes

upgrade:
	bash ./.utils/message.sh info "Upgrading your project..."
	docker-compose pull
	docker-compose build --pull
	make up

restart:
	make stop
	make up

rebuild: destroy destroy destroy upgrade

stop-service:
	docker-compose stop $(ARGS)


#############################
# CONTAINER ACCESS
#############################

ssh:
	docker-compose exec $(ARGS) sh

run-ssh:
	docker-compose run $(ARGS) sh

#############################
# SSL
#############################

gen-cert: ## Generate a cert based on installed root-cert for set domain (mkcert)
	mkdir -p ~/.dinghy/certs
	mkcert -cert-file ~/.dinghy/certs/${CERT_NAME}.crt \
		-key-file ~/.dinghy/certs/${CERT_NAME}.key \
		${ADDITIONAL_DOMAIN} ${PROJECT_NAME}.docker "*.${PROJECT_NAME}.docker"
	make up

cert-install: ## Install root cert in browsers and supported systems (mkcert)
	bash ./.utils/message.sh info "Install root certificate in browsers and supported systems."
	mkcert -install


#############################
# INFORMATION
#############################

urls:
	bash ./.utils/message.sh headline "You can access your project at the following URLS:"
	bash ./.utils/message.sh info "With docker-mate proxy:"
	bash ./.utils/message.sh link "Elasticsearch:    http://elasitcsearch.${PROJECT_NAME}.docker/"
	bash ./.utils/message.sh link "Kibana:           http://kibana.${PROJECT_NAME}.docker/"
	bash ./.utils/message.sh info "Local port:"
	bash ./.utils/message.sh link "Elasticsearch:    http://localhost:9200/"
	bash ./.utils/message.sh link "Kibana:           http://localhost:5601/"
	echo ""

state:
	docker-compose ps

logs:
	docker-compose logs -f --tail=100 $(ARGS)


#############################
# STACK TOOLING
#############################

stack-deploy:
	docker stack deploy --with-registry-auth -c docker-compose.base.yml -c docker-compose.local.yml api

stack-remove:
	docker stack rm api

stack-rebuild: stack-remove
	sleep 10
	make stack-deploy


#############################
# Argument fix workaround
#############################
%:
	@:
