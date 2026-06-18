.PHONY: dev backend frontend install

dev:
	$(MAKE) -j2 backend frontend

backend:
	cd backend && uv run uvicorn main:app --reload --port 8000

frontend:
	npm start

install:
	cd backend && uv sync
	npm install
