#!/bin/bash
# Install script for macOS and Linux

echo -e "\033[1;36m====================================================\033[0m"
echo -e "\033[1;36m       Instalador de NotionOllama (Mac/Linux)       \033[0m"
echo -e "\033[1;36m====================================================\033[0m"
echo ""

OS="$(uname -s)"
HAS_BREW=false

if command -v brew &> /dev/null; then
    HAS_BREW=true
fi

install_with_brew() {
    local PACKAGE_NAME=$1
    echo -e "\033[1;34m[?] Hemos detectado Homebrew instalado en tu sistema.\033[0m"
    echo -e "¿Deseas instalar \033[1;33m$PACKAGE_NAME\033[0m automáticamente usando Homebrew? (y/n)"
    read -r response </dev/tty
    if [[ "$response" =~ ^([yY][eE][sS]|[yY])$ ]]; then
        brew install "$PACKAGE_NAME"
        return 0
    else
        return 1
    fi
}

# --- 1. Checking for Node.js ---
if ! command -v node &> /dev/null; then
    echo -e "\033[1;31m[❌] Node.js no está instalado.\033[0m"
    
    if [ "$HAS_BREW" = true ]; then
        if install_with_brew "node"; then
            echo -e "\033[1;32m[✓] Node.js ha sido instalado vía Homebrew.\033[0m"
        else
            echo "Instalación omitida. Por favor, instala Node.js manualmente y regresa."
            exit 1
        fi
    else
        echo "Por favor, instala Node.js descargándolo desde: https://nodejs.org/"
        if [ "$OS" = "Linux" ]; then
            if [ -f /etc/debian_version ] || command -v apt-get &> /dev/null; then
                echo "  (Debian/Ubuntu - Oficial LTS):"
                echo "    curl -fsSL https://deb.nodesource.com/setup_lts.x | sudo -E bash -"
                echo "    sudo apt-get install -y nodejs"
            elif [ -f /etc/redhat-release ] || command -v dnf &> /dev/null; then
                echo "  (Fedora/RHEL):"
                echo "    sudo dnf install nodejs npm -y"
            elif [ -f /etc/arch-release ] || command -v pacman &> /dev/null; then
                echo "  (Arch Linux):"
                echo "    sudo pacman -S nodejs npm --noconfirm"
            else
                echo "  Verifica el administrador de paquetes de tu distribución."
            fi
        fi
        exit 1
    fi
else
    echo -e "\033[1;32m[✓] Node.js está instalado ($(node -v)).\033[0m"
fi

# --- 2. Checking for npm ---
if ! command -v npm &> /dev/null; then
    echo -e "\033[1;31m[❌] npm no está instalado.\033[0m"
    echo "Suele venir instalado con Node.js, por favor verifica tu instalación de Node."
    exit 1
else
    echo -e "\033[1;32m[✓] npm está instalado ($(npm -v)).\033[0m"
fi

# --- 3. Checking for Ollama ---
if ! command -v ollama &> /dev/null; then
    echo -e "\033[1;33m[⚠️] Ollama no está instalado o no se encuentra en el PATH.\033[0m"
    
    if [ "$HAS_BREW" = true ]; then
        if install_with_brew "ollama"; then
            echo -e "\033[1;32m[✓] Ollama ha sido instalado vía Homebrew.\033[0m"
        else
            echo "Si usas solo Multi-API Cloud no necesitarás Ollama."
            echo "Presiona Enter para continuar con la instalación del entorno, o Ctrl+C para salir..."
            read -r </dev/tty
        fi
    else
        if [ "$OS" = "Darwin" ]; then
            echo "Para macOS puedes instalarlo desde: https://ollama.com/download/mac"
        elif [ "$OS" = "Linux" ]; then
            echo "Para instalar Ollama de forma oficial en Linux ejecuta:"
            echo "  curl -fsSL https://ollama.com/install.sh | sh"
            if [ -f /etc/arch-release ] || command -v pacman &> /dev/null; then
                echo "  (Alternativa en Arch Linux): sudo pacman -S ollama"
            fi
        fi
        
        echo "Ollama es necesario SOLO si usarás modelos locales privados (ej. qwen2.5 / moondream)."
        echo "Si vas a utilizar modelos de Nube en .env (ChatGPT, Claude, etc) puedes ignorar esta advertencia."
        echo "Presiona Enter para continuar sin Ollama o Ctrl+C para cancelar e ir a instalarlo..."
        read -r </dev/tty
    fi
else
    echo -e "\033[1;32m[✓] Ollama está instalado.\033[0m"
fi

# --- 4. Install Dependencies ---
echo ""
echo -e "\033[1;34m[>] Instalando dependencias de NotionOllama...\033[0m"
npm install

if [ $? -eq 0 ]; then
    echo ""
    echo -e "\033[1;32m[✨] Instalación completada con éxito.\033[0m"
    if [ ! -f .env ]; then
        echo -e "\033[1;33m[!] Recuerda copiar el archivo .env.example a .env y colocar allí tus claves.\033[0m"
        cp -n .env.example .env 2>/dev/null
    fi
    echo ""
    echo -e "Puedes inicializar tu asistente en cualquier momento ejecutando:"
    echo -e "\033[1;36m  node main.js\033[0m"
else
    echo -e "\033[1;31m[❌] Hubo un error instalando las librerías NPM. Verifica el log generado.\033[0m"
    exit 1
fi
