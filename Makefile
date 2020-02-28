build-frontend-stage:
	cd frontend && PUBLIC_URL=https://stage.mpgcompare.com npm run build

build-frontend-prod:
	cd frontend && PUBLIC_URL=https://mpgcompare.com npm run build

docker-build-stage:
	docker build -t gbryan/mpg:latest-stage .
	docker push gbryan/mpg:latest-stage

docker-build-prod:
	docker build -t gbryan/mpg:latest-prod .
	docker push gbryan/mpg:latest-prod

build-stage: build-frontend-stage docker-build-stage

build-prod: build-frontend-prod docker-build-prod

deploy-stage:
	kubectl -n mpg apply -f deploy/stage/deployment.yaml
	kubectl -n mpg rollout restart deployment/stage-mpg

deploy-prod:
	kubectl -n mpg apply -f deploy/prod/deployment.yaml
	kubectl -n mpg rollout restart deployment/mpg
