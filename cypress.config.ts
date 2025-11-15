import { defineConfig } from 'cypress';

module.exports = defineConfig({
    e2e: {
        baseUrl: 'https://gauge.spookydoodle.com',
        setupNodeEvents(on, config) {
            // implement node event listeners here
        },
    },
})