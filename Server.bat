@echo off

if not exist ".env.local" (
  echo .env.local not found. Aborting "npm run dev".
  PAUSE
  exit /b 1
)

npm run dev
PAUSE
