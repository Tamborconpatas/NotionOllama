@echo off
chcp 65001 >nul
echo ====================================================
echo        Instalador de NotionOllama (Windows)         
echo ====================================================
echo.

:: Checking for Node.js
where node >nul 2>nul
if %ERRORLEVEL% neq 0 (
    echo [X] Node.js no esta instalado.
    echo Por favor, instala Node.js descargandolo desde: https://nodejs.org/
    echo Luego vuelve a ejecutar este instalador.
    pause
    exit /b 1
) else (
    echo [OK] Node.js esta instalado.
)

:: Checking for npm
where npm >nul 2>nul
if %ERRORLEVEL% neq 0 (
    echo [X] npm no esta instalado.
    echo Suele venir instalado con Node.js, por favor verifica tu instalacion.
    pause
    exit /b 1
) else (
    echo [OK] npm esta instalado.
)

:: Checking for Ollama
where ollama >nul 2>nul
if %ERRORLEVEL% neq 0 (
    echo [!] Ollama no esta instalado o no se encuentra en las variables de entorno.
    echo Para instalar Ollama en Windows descargalo de: https://ollama.com/download/windows
    echo Se requiere Ollama activo si vas a usar el procesamiento local.
    echo Si vas a utilizar motores en la nube ^(multi-API^) puedes ignorar esta advertencia.
    pause
) else (
    echo [OK] Ollama esta instalado.
)

echo.
echo [^>] Instalando dependencias del proyecto...
call npm install

if %ERRORLEVEL% equ 0 (
    echo.
    echo [!] Instalacion completada con exito.
    
    if not exist ".env" (
        echo [!] Recuerda hacer una copia del archivo .env.example a .env y colocar tus claves 
        copy .env.example .env >nul
    )
    
    echo.
    echo Para iniciar el programa abre tu terminal en esta carpeta y ejecuta:
    echo   node main.js
    echo.
    pause
) else (
    echo.
    echo [X] Hubo un error instalando las dependencias. Verifica la traza de npm.
    pause
    exit /b 1
)
