@echo off
title DeAaZ - Deploy para GitHub
color 0A

echo ===================================================
echo           DEAAZ - DEPLOY PARA O GITHUB
echo ===================================================
echo.

:: 1. Ir para a pasta do projeto
cd /d "%~dp0"

:: 2. Identificar o branch atual
for /f "tokens=*" %%a in ('git branch --show-current') do set CURRENT_BRANCH=%%a
if "%CURRENT_BRANCH%"=="" set CURRENT_BRANCH=main

echo [Info] Branch ativo detetado: %CURRENT_BRANCH%
echo.

echo [1/4] A puxar atualizacoes remotas (git pull)...
git pull origin %CURRENT_BRANCH% --rebase

echo.
echo [2/4] A adicionar ficheiros alterados (git add .)...
git add .

echo.
:: 3. Pedir mensagem de commit
set /p msg="Escreve a mensagem do commit (ou pressiona ENTER para padrao): "

if "%msg%"=="" (
    set msg=Atualizacao automatica da loja DeAaZ
)

echo.
echo [3/4] A guardar alteracoes (git commit)...
git commit -m "%msg%"

echo.
echo [4/4] A enviar para o GitHub (git push origin %CURRENT_BRANCH%)...
git push origin %CURRENT_BRANCH%

if %ERRORLEVEL% NEQ 0 (
    color 0C
    echo.
    echo ===================================================
    echo   ❌ ERRO NO ENVIO PARA O GITHUB!
    echo   Verifica as mensagens de erro acima.
    echo ===================================================
) else (
    echo.
    echo ===================================================
    echo   ✅ DEPLOY CONCLUIDO COM SUCESSO!
    echo   A Vercel vai atualizar a loja em cerca de 30s.
    echo ===================================================
)

echo.
pause