@echo off
title DeAaZ - Deploy para GitHub
color 0A

echo ===================================================
echo           DEAAZ - DEPLOY PARA O GITHUB
echo ===================================================
echo.

:: 1. Ir para a pasta do projeto (caso o bat seja executado de outro local)
cd /d "%~dp0"

echo [1/3] A adicionar ficheiros alterados (git add .)...
git add .

echo.
:: 2. Pedir mensagem de commit ao utilizador
set /p msg="Escreve a mensagem do commit (ou pressiona ENTER para padrao): "

if "%msg%"=="" (
    set msg="Atualizacao automatica da loja DeAaZ"
)

echo.
echo [2/3] A guardar alteracoes (git commit)...
git commit -m "%msg%"

echo.
echo [3/3] A enviar para o GitHub (git push)...
git push origin main

echo.
echo ===================================================
echo   ✅ DEPLOY CONCLUIDO COM SUCESSO!
echo   A Vercel vai atualizar a loja em cerca de 30s.
echo ===================================================
echo.
pause