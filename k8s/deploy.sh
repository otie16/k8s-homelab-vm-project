#!/bin/bash
set -e

NAMESPACE="k8s-vm-app"
MANIFESTS="$(dirname "$0")"

echo "=================================================="
echo " K8s Homelab — Full Stack Deploy"
echo "=================================================="

echo ""
echo "==> [1/7] Creating namespace..."
kubectl apply -f $MANIFESTS/namespace.yaml

echo ""
echo "==> [2/7] Applying ConfigMap and Secrets..."
kubectl apply -f $MANIFESTS/configmap.yaml
kubectl apply -f $MANIFESTS/secret.yaml

echo ""
echo "==> [3/7] Deploying PostgreSQL..."
kubectl apply -f $MANIFESTS/postgres-statefulset.yaml
kubectl apply -f $MANIFESTS/postgres-service.yaml

echo ""
echo "==> [4/7] Waiting for PostgreSQL to be ready (timeout: 120s)..."
kubectl wait --for=condition=ready pod/postgres-0 \
  -n $NAMESPACE --timeout=120s
echo "    PostgreSQL is ready."

echo ""
echo "==> [5/7] Running database migrations..."
kubectl delete job django-migrate -n $NAMESPACE --ignore-not-found
kubectl apply -f $MANIFESTS/migrate-job.yaml
kubectl wait --for=condition=complete job/django-migrate \
  -n $NAMESPACE --timeout=60s
echo "    Migrations complete."

echo ""
echo "==> [6/7] Deploying backend..."
kubectl apply -f $MANIFESTS/backend-deployment.yaml
kubectl apply -f $MANIFESTS/backend-service.yaml

echo ""
echo "==> [7/7] Deploying frontend..."
kubectl apply -f $MANIFESTS/frontend-deployment.yaml
kubectl apply -f $MANIFESTS/frontend-service.yaml

echo ""
echo "=================================================="
echo " Deploy complete. Current cluster state:"
echo "=================================================="
kubectl get all -n $NAMESPACE