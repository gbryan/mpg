.PHONY: build-frontend-prod docker-build build-prod deploy-stage

build-frontend-stage:
	cd frontend && PUBLIC_URL=https://stage.mpgcompare.com npm run build

docker-build:
	docker build -t gbryan/mpg .
	docker tag gbryan/mpg:latest gbryan/mpg:latest
	docker push gbryan/mpg:latest

build-stage: build-frontend-stage docker-build

deploy-stage:
	kubectl -n mpg apply -f deploy/mpg/stage-deployment.yaml
	kubectl -n mpg set image deployment/stage-mpg stage-mpg=gbryan/mpg:latest
