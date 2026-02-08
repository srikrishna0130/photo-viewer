# Photo Viewer

A fast, modern web-based photo viewer built with React, TypeScript, and Vite. Optimized for LLM understanding and maintenance with clean architecture and comprehensive testing.

## Features

- 📁 **Folder Tree Navigation**: Browse photos organized by folder structure
- 🖼️ **Virtual Grid**: High-performance grid view using TanStack Virtual
- 🔍 **Fullscreen Viewer**: Navigate photos with keyboard and mouse
- ⚡ **Fast Loading**: Lazy loading and caching for optimal performance
- 🎨 **Modern UI**: Clean interface built with Tailwind CSS
- 🧪 **Fully Tested**: Comprehensive test coverage with Vitest

## Supported Formats

JPG, JPEG, PNG, GIF, WebP, BMP, SVG, TIFF, HEIC, HEIF

## Browser Requirements

- **Chrome/Edge 86+** (File System Access API required)
- Note: Firefox and Safari not currently supported due to API limitations

## Quick Start

```bash
# Install dependencies
npm install

# Run development server
npm run dev

# Run tests
npm test

# Build for production
npm run build
```

## Architecture

The codebase follows LLM-optimized principles:

### Directory Structure
```
src/
├── components/     # React components (< 50 lines each)
├── hooks/          # Custom React hooks
├── utils/          # Pure utility functions
├── types/          # TypeScript type definitions
├── services/       # Business logic services
├── workers/        # Web Workers for background tasks
└── test/           # Test setup and utilities
```

### Code Principles
- **Single Responsibility**: One purpose per file/function
- **Small Functions**: Max 50 lines, prefer 20-30
- **Type Safety**: Full TypeScript strict mode
- **Pure Functions**: Stateless logic where possible
- **Clear Naming**: Self-documenting code

## Development

### Scripts
- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run preview` - Preview production build
- `npm test` - Run tests in watch mode
- `npm run lint` - Run ESLint
- `npm run format` - Format code with Prettier

### Testing
Tests focus on core functionality:
- File filtering logic
- Tree building algorithm
- Image loading and caching
- Keyboard navigation
- Error handling

## Performance Targets

- Directory scan: < 2s for 1000 images
- Grid rendering: Smooth 60fps scrolling
- Fullscreen load: < 200ms for cached images
- Memory usage: < 500MB for 1000 images in view

## Contributing

This project follows strict code quality standards:
- ESLint with TypeScript strict rules
- Prettier for consistent formatting
- Functions must be < 50 lines
- 80%+ test coverage on utils/services
- No `any` types allowed

## License

ISC

## Technology Stack

- **React 19** - UI framework
- **TypeScript 5** - Type safety
- **Vite 7** - Build tool
- **TanStack Virtual** - Virtual scrolling
- **Tailwind CSS 4** - Styling
- **Vitest** - Testing framework
- **File System Access API** - Directory access
