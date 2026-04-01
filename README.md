# 🚀 NotionOllama: Tu IA Personal y Privada para Notion

[![License: MIT + Commons Clause](https://img.shields.io/badge/License-MIT%20%2B%20Commons%20Clause-green.svg)](LICENSE.md)

NotionOllama es una herramienta CLI que conecta modelos de IA locales (Ollama) con tus páginas de Notion. Permite realizar ediciones inteligentes, resúmenes, generación de diagramas y análisis de imágenes (visión) directamente sobre tus páginas de Notion, manteniendo tus datos privados y sin suscripciones mensuales.

## ✨ Características Principales

- 🤖 **IA 100% Local**: Usa modelos como `qwen2.5` y `moondream` (visión) corriendo en tu propia máquina.
- 📋 **Menú Interactivo**: Interfaz elegante basada en `@clack/prompts` para una navegación rápida y sin errores.
- 👁️ **Visión Multimodal (Moondream)**: Arrastra y suelta imágenes en la terminal para que la IA las interprete y escriba sobre ellas en Notion.
- 📉 **Diagramas Mermaid**: Generación y actualización automática de diagramas de flujo y secuencias nativos de Notion.
- 🪄 **Herramientas Estilo Notion AI**:
  - Hacer más largo / Hacer más corto / Simplificar.
  - Edición con instrucciones personalizadas ("Ask AI").
  - Corregir ortografía y ajustar tono.
- 🧹 **Modos de Escritura**: Elige entre añadir al final, reemplazar la página completa o actualizar bloques específicos.
- 📜 **Historial de Páginas**: Recuerda tus últimas páginas de Notion visitadas para un acceso rápido.

## 🛠️ Requisitos Previos
1. **Node.js**: Debes tener [Node.js](https://nodejs.org/es/download) instalado.
2. **Ollama**: Debes tener [Ollama](https://ollama.com/download) instalado y corriendo (`ollama serve`).
3. **Modelos**: Descarga los modelos necesarios:
   ```bash
   ollama pull qwen2.5:3b  # O el modelo de tu preferencia
   ollama pull moondream   # Necesario para la función de visión
   ```
4. **Notion API**: Necesitas un **Internal Integration Secret** y acceso a las páginas (puedes crearlo en [notion.so/my-integrations](https://www.notion.so/my-integrations)).

## 🚀 Instalación

#### Probado en Fedora Linux 43 con ollama 0.25.0

1. Clona este repositorio:
   ```bash
   git clone https://github.com/Tamborconpatas/ollamanotion.git
   cd ollamanotion
   ```

2. Instala las dependencias:
   ```bash
   npm install
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
- [ ] Integracion con otros API de IA
- [ ] Integrar chunks para paginas grandes
- [ ] Mejorar la funcionalidad de traducir
- [ ] Hacer un instalador para diferentes sistemas
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

