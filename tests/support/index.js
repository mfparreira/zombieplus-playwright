const {test: base, expect} = require('@playwright/test')

const {LoginPage} = require ('../pages/LoginPage')
const {Toast} = require ('../pages/Components')
const {MoviesPage} = require ('../pages/MoviesPage')
const {LeadingPage} = require('../pages/LandingPage')

const test = base.extend({
    page: async ({page}, use) => {
        await use({
            ...page,
            landing: new LeadingPage(page),
            login: new LoginPage(page),
            movies: new MoviesPage(page),
            toast: new Toast(page)


        })
    }
})

export {test, expect}