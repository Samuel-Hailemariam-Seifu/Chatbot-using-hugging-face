@echo off
echo.
echo ========================================
echo   UPDATE YOUR HUGGING FACE TOKEN
echo ========================================
echo.
echo 1. Go to: https://huggingface.co/settings/tokens
echo 2. Create a NEW token with "Write" permissions
echo 3. Copy the token (starts with hf_)
echo 4. Paste it below and press Enter
echo.
set /p NEW_TOKEN="Enter your new token: "
echo.
echo HF_TOKEN=%NEW_TOKEN% > .env.local
echo HF_MODEL=mistralai/Mistral-7B-Instruct-v0.2 >> .env.local
echo.
echo ✅ Token updated! Now restart your dev server:
echo    npm run dev
echo.
pause
