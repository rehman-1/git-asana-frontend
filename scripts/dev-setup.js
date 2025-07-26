#!/usr/bin/env node

/**
 * Development Setup Script
 * Helps with initial setup and testing of the Git-Asana Dashboard
 */

import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

console.log('🚀 Git-Asana Dashboard Development Setup');
console.log('=========================================\n');

// Check if required files exist
const requiredFiles = [
    'package.json',
    'src/App.jsx',
    'src/pages/Dashboard.jsx',
    'src/api/apiClient.js'
];

console.log('📋 Checking required files...');
let allFilesExist = true;

requiredFiles.forEach(file => {
    if (fs.existsSync(file)) {
        console.log(`✅ ${file}`);
    } else {
        console.log(`❌ ${file} - MISSING`);
        allFilesExist = false;
    }
});

if (!allFilesExist) {
    console.log('\n❌ Some required files are missing. Please ensure all files are present.');
    process.exit(1);
}

// Check package.json dependencies
console.log('\n📦 Checking dependencies...');
const packageJson = JSON.parse(fs.readFileSync('package.json', 'utf8'));
const requiredDeps = [
    'react',
    'react-dom',
    'axios',
    'recharts',
    'react-data-table-component',
    'react-datepicker',
    'lucide-react',
    'tailwindcss'
];

let allDepsPresent = true;
requiredDeps.forEach(dep => {
    if (packageJson.dependencies[dep] || packageJson.devDependencies[dep]) {
        console.log(`✅ ${dep}`);
    } else {
        console.log(`❌ ${dep} - MISSING`);
        allDepsPresent = false;
    }
});

if (!allDepsPresent) {
    console.log('\n⚠️  Some dependencies are missing. Run: npm install');
}

// API Configuration Check
console.log('\n🔗 API Configuration...');
const apiClientPath = 'src/api/apiClient.js';
if (fs.existsSync(apiClientPath)) {
    const apiClient = fs.readFileSync(apiClientPath, 'utf8');
    const apiBaseMatch = apiClient.match(/API_BASE\s*=\s*["']([^"']+)["']/);

    if (apiBaseMatch) {
        const apiBase = apiBaseMatch[1];
        console.log(`✅ API Base URL: ${apiBase}`);

        if (apiBase === 'http://localhost:8000') {
            console.log('ℹ️  Using default localhost API. Make sure your backend is running on port 8000.');
        }
    } else {
        console.log('⚠️  Could not detect API base URL in apiClient.js');
    }
}

// Development Tips
console.log('\n💡 Development Tips:');
console.log('==================');
console.log('1. Start your backend API server first (should run on http://localhost:8000)');
console.log('2. Run "npm run dev" to start the development server');
console.log('3. Open http://localhost:5173 in your browser');
console.log('4. Use the "Reload Data" button to fetch fresh data from your APIs');
console.log('5. Check browser console for any API errors');

// API Endpoints Summary
console.log('\n🔌 Expected API Endpoints:');
console.log('=========================');
const endpoints = [
    'POST /reload_all - Reload all data',
    'POST /api/git/report?start_date=YYYY-MM-DD&end_date=YYYY-MM-DD - Git commits',
    'POST /api/git/reload - Reload Git data',
    'GET  /api/asana/summary - Asana task summary',
    'POST /api/asana/reload - Reload Asana data',
    'POST /api/asana/efforts?start_date=YYYY-MM-DD&end_date=YYYY-MM-DD - Developer efforts',
    'POST /api/asana/developer_summary?start_date=YYYY-MM-DD&end_date=YYYY-MM-DD - Developer summary',
    'GET  /api/analytics?start_date=YYYY-MM-DD&end_date=YYYY-MM-DD - Analytics data'
];

endpoints.forEach(endpoint => {
    console.log(`  • ${endpoint}`);
});

console.log('\n🎯 Quick Start Commands:');
console.log('=======================');
console.log('npm install          # Install dependencies');
console.log('npm run dev          # Start development server');
console.log('npm run build        # Build for production');
console.log('npm run preview      # Preview production build');

console.log('\n✨ Setup complete! Happy coding! ✨\n');