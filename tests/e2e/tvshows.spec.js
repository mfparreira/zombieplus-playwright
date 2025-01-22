const { test, expect } = require('../support')

const data = require('../support/fixtures/tvshows.json')
const { executeSQL } = require('../support/database')
const { setDefaultAutoSelectFamilyAttemptTimeout } = require('net')


test.beforeAll(async () => {
    await executeSQL('DELETE from tvshows')
})


test('deve poder cadastrar um nova serie', async ({ page }) => {


    const tvshow = data.create

    await executeSQL(`DELETE from tvshows;`)

    await page.login.do('admin@zombieplus.com', 'pwd123', 'Admin')
    await page.tvshows.createTvshow(tvshow)
    const mensagem = `A série '${tvshow.title}' foi adicionada ao catálogo.`
    await page.popup.haveText(mensagem)

})

test('deve poder remover uma serie', async ({ page, request }) => {

    const tvshow = data.remove
    await request.api.postTvShow(tvshow)
    await page.login.do('admin@zombieplus.com', 'pwd123', 'Admin')
    await page.locator('a[href$="tvshows"]').click()
    await page.getByRole('row', {name: tvshow.title}).getByRole('button').click()
    await page.click('.confirm-removal')
    await page.popup.haveText('Série removida com sucesso.')

})



test('não deve quando o titulo já estiver cadastrado', async ({ page, request }) => {


    const tvshow = data.duplicate
    await request.api.postTvShow(tvshow)
    await page.login.do('admin@zombieplus.com', 'pwd123', 'Admin')
    await page.locator('a[href$="tvshows"]').click()
    await page.tvshows.createTvshow(tvshow)
    await page.popup.haveText(`O título '${tvshow.title}' já consta em nosso catálogo. Por favor, verifique se há necessidade de atualizações ou correções para este item.`)


})

test('não deve cadastrar quando os campos obrigatórios não são preenchidos', async ({ page }) => {

    await page.login.do('admin@zombieplus.com', 'pwd123', 'Admin')
    await page.locator('a[href$="tvshows"]').click()
    await page.tvshows.goForm()
    await page.tvshows.submit()

    await page.tvshows.alertHaveText([
        'Campo obrigatório',
        'Campo obrigatório',
        'Campo obrigatório',
        'Campo obrigatório',
        'Campo obrigatório (apenas números)'])
})


test('deve realizar busca pelo temo mandalorian', async({page, request}) => {
    const tvshow = data.to_search


    tvshow.data.forEach(async (t) => {
        await request.api.postTvShow(t)

    })
    await page.login.do('admin@zombieplus.com', 'pwd123', 'Admin')
    await page.locator('a[href$="tvshows"]').click()
    await page.tvshows.search(tvshow.input)

    await page.tvshows.tableHave(tvshow.output)
})
