# Dockerfile Mastery Lab

Dockerfile Mastery Lab is a containerized full-stack training platform for learning Dockerfile instructions through explanations, examples, quizzes, flashcards, visual demos, a practice playground, and progress tracking.

## Run With Docker Compose

```bash
docker compose up --build
```

Open [http://localhost:3000](http://localhost:3000). The API runs on [http://localhost:4000](http://localhost:4000), and SQLite data persists in the `sqlite-data` Docker volume.

## Local Development

```bash
npm run install:all
npm run dev
```

Frontend: `http://localhost:3000`

Backend: `http://localhost:4000`

## Tests

```bash
npm test
```

## Production Notes

- The frontend uses a multi-stage `node:22-alpine` build and Next.js standalone output.
- The backend runs as a non-root user behind `tini`.
- SQLite is stored at `/data/mastery.db` and mounted through Docker Compose.
- Set `NEXT_PUBLIC_API_URL` to the public API origin and `INTERNAL_API_URL` to the private service URL for server-side frontend calls.

## Included Learning Areas

The app seeds content for `ADD`, `ARG`, `CMD`, `COPY`, `ENTRYPOINT`, `ENV`, `EXPOSE`, `FROM`, `HEALTHCHECK`, `LABEL`, `MAINTAINER`, `ONBUILD`, `RUN`, `SHELL`, `STOPSIGNAL`, `USER`, `VOLUME`, and `WORKDIR`.
