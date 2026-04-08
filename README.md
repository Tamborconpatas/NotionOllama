# 🚀 NotionOllama: Tu IA Personal y Privada para Notion

[![License: MIT + Commons Clause](https://img.shields.io/badge/License-MIT%20%2B%20Commons%20Clause-green.svg)](LICENSE.md)

NotionOllama es una herramienta CLI que conecta modelos de IA locales (Ollama) con tus páginas de Notion. Permite realizar ediciones inteligentes, resúmenes, generación de diagramas y análisis de imágenes (visión) directamente sobre tus páginas de Notion, manteniendo tus datos privados y sin suscripciones mensuales.

## ✨ Características Principales

- 🤖 **IA 100% Local**: Usa modelos locales corriendo en tu propia máquina a través de Ollama.
- ☁️ **Soporte Multi-API en la Nube**: Configura los mejores LLMs globales desde `.env` si decides no consumir tu hardware local. Compatible con **OpenAI (ChatGPT)**, **Anthropic (Claude)**, **Google (Gemini)**, **Azure OpenAI** y **AWS Bedrock**.
- 📋 **Menú Interactivo**: Interfaz elegante basada en `@clack/prompts` para una navegación rápida y sin errores.
- 👁️ **Visión Multimodal Dinámica**: Arrastra y suelta imágenes en la terminal. Tu IA la leerá si soporta visión, o aplicará un modelo de respaldo seguro (`moondream`) para evitar errores.
- 📉 **Diagramas Mermaid**: Generación y actualización automática de diagramas de flujo y secuencias nativos de Notion.
- 🪄 **Herramientas Estilo Notion AI**:
  - Traducción inteligente anti-redundancia.
  - Hacer más largo / Hacer más corto / Simplificar.
  - Edición con instrucciones personalizadas ("Ask AI").
  - Corregir ortografía y ajustar tono.
- 🧹 **Modos de Escritura**: Elige entre añadir al final, reemplazar la página completa o actualizar bloques específicos.
- 📜 **Historial de Páginas**: Recuerda tus últimas páginas de Notion visitadas para un acceso rápido.

## 🛠️ Requisitos Previos
1. **Node.js**: Debes tener [Node.js](https://nodejs.org/es/download) instalado.
2. **Ollama**: Debes tener [Ollama](https://ollama.com/download) instalado y corriendo (`ollama serve`).
3. **Modelos Locales Recomendados**: Te sugerimos contar con los siguientes modelos mediante Ollama dependiendo del caso de uso. Descárgalos usando `ollama pull <nombre>`:

   | Especialización | Modelos Recomendados | Comando de ejemplo |
   | :--- | :--- | :--- |
   | ⚖️ **Equilibrado (Para uso diario)** | `qwen2.5:7b`, `llama3.2:3b` | `ollama pull qwen2.5:7b` |
   | 🧠 **Razonamiento Profundo** | `gemma4:26b`, `qwen2.5:32b` | `ollama pull gemma4:26b` |
   | ⚡ **Súper Rápidos (Low RAM)** | `qwen2.5:3b`, `gemma4:e2b` | `ollama pull gemma4:e2b` |
   | 👁️ **Visión (Análisis de Imágenes)** | `moondream`, `llama3.2-vision` | `ollama pull llama3.2-vision` |

   > **💡 Nota importante sobre la Visión:** 
   > Es **altamente recomendable descargar `moondream`**; nuestro sistema lo utilizará automáticamente para evitar que tu software colapse si intentas pasar una imagen en un modelo ligero de texto puro.
4. **Notion API**: Necesitas un **Internal Integration Secret** y acceso a las páginas (puedes crearlo en [notion.so/my-integrations](https://www.notion.so/my-integrations)).

## 🚀 Instalación

#### Probado en Fedora Linux 43 con ollama 0.25.0

1. Clona este repositorio:
   ```bash
   git clone https://github.com/Tamborconpatas/ollamanotion.git
   cd ollamanotion
   ```

2. Ejecuta el archivo instalador correspondiente a tu sistema operativo para descargar automáticamente dependencias y comprobar requisitos:
   - **En Windows (Doble clic o en consola):**
     ```cmd
     install.bat
     ```
   - **En macOS o Linux (Dar permisos y ejecutar):**
     ```bash
     chmod +x install.sh
     ./install.sh
     ```

3. Configura tus variables de entorno. Crea un archivo `.env` en la raíz:
   ```env
   NOTION_KEY=tu_llave_secreta_de_notion
   PAGE_ID=
   OLLAMA_URL=http://localhost:11434
   OLLAMA_MODEL=qwen2.5:3b
   ```

## 📖 Uso

Simplemente ejecuta el script principal:

```bash
node main.js
```

### 💡 Tips Pro:
- **Arrastrar Imágenes**: Cuando la app te pregunte si deseas adjuntar una imagen, arrastra el archivo desde tu carpeta directamente a la terminal.
- **Segunda Pasada**: Usa la opción de "Vista Previa" para revisar lo que escribió la IA antes de que se guarde definitivamente en tu Notion.


## 🤝 Contribuciones
¡Las sugerencias y pull requests son bienvenidos!

## 📝 Por Hacer
- [x] Integracion con otros API de IA (OpenAI, Anthropic, Google, Azure, AWS)
- [x] Integrar chunks para paginas grandes
- [x] Mejorar la funcionalidad de traducir
- [x] Hacer un instalador para diferentes sistemas
- [ ] Mejorar la vista previa de los cambios
- [ ] Mejorar interaccion con el usuario
- [ ] Hacer funcionar el motor de busqueda
- [ ] Hacer empaquetados para diferentes sistemas
- [ ] Poner otros idiomas

---

Desarrollado con ❤️ para un flujo de trabajo más inteligente, privado y libre de costo para uso personal.

## 📄 Licencia
Este proyecto está licenciado bajo la **MIT License** con la adición de la **Commons Clause 1.0**.

Esto significa que tienes permiso para usar, modificar y distribuir el código, pero **no puedes vender el software** ni proporcionar servicios comerciales (como hosting pagado o consultoría) cuyo valor principal derive de la funcionalidad de este software.

Para más detalles, revisa el archivo [LICENSE.md](LICENSE.md) en este repositorio.

Copyright (C) 2026 Tamborconpatas <Tambotconpatas@proton.me>

