import { defineConfig, createLogger } from 'vite'
import react from '@vitejs/plugin-react-swc'

const swcDeprecationPattern = /esbuild.*oxc|optimizeDeps\.esbuildOptions/

const logger = createLogger()
const originalWarn = logger.warn.bind(logger)
logger.warn = (msg, options) => {
  if (swcDeprecationPattern.test(msg)) return
  originalWarn(msg, options)
}

const originalConsoleWarn = console.warn
console.warn = (...args) => {
  if (args.some(a => typeof a === 'string' && swcDeprecationPattern.test(a))) return
  originalConsoleWarn(...args)
}

const originalStderrWrite = process.stderr.write.bind(process.stderr)
process.stderr.write = (chunk, ...args) => {
  if (typeof chunk === 'string' && swcDeprecationPattern.test(chunk)) return true
  return originalStderrWrite(chunk, ...args)
}

export default defineConfig({
  customLogger: logger,
  plugins: [react()],
  test: {
    environment: 'jsdom',
    globals: true,
    setupFiles: './src/test/setup.js',
  },
})
