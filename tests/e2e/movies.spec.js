const { test, expect } = require('../support')

const data = require('../support/fixtures/movies.json')
const { executeSQL } = require('../support/database')

test.beforeAll(async () => {
    await executeSQL('DELETE from movies')
})


test('deve poder cadastrar um novo filme', async ({ page }) => {


    const movie = data.create

    await executeSQL(`DELETE from movies WHERE title = '${movie.title}';`)

    await page.login.do('admin@zombieplus.com', 'pwd123', 'Admin')
    await page.movies.createFilm(movie)
    const mensagem = `O filme '${movie.title}' foi adicionado ao catálogo.`
    await page.popup.haveText(mensagem)

})

test('deve poder remover um filme', async ({ page, request }) => {

    const movie = data.to_remove
    await request.api.postMovie(movie)
    await page.login.do('admin@zombieplus.com', 'pwd123', 'Admin')
    await page.getByRole('row', {name: movie.title}).getByRole('button').click()
    await page.click('.confirm-removal')
    await page.popup.haveText('Filme removido com sucesso.')

})



test('não deve quando o titulo já estiver cadastrado', async ({ page, request }) => {


    const movie = data.duplicate
    await request.api.postMovie(movie)
    await page.login.do('admin@zombieplus.com', 'pwd123', 'Admin')
    await page.movies.createFilm(movie)
    await page.popup.haveText(`O título '${movie.title}' já consta em nosso catálogo. Por favor, verifique se há necessidade de atualizações ou correções para este item.`)


})

test('não deve cadastrar quando os campos obrigatórios não são preenchidos', async ({ page }) => {

    await page.login.do('admin@zombieplus.com', 'pwd123', 'Admin')

    await page.movies.goForm()
    await page.movies.submit()

    await page.movies.alertHaveText([
        'Campo obrigatório',
        'Campo obrigatório',
        'Campo obrigatório',
        'Campo obrigatório'])
})


test('deve realizar busca pelo temo zumbi', async({page, request}) => {
    const movies = data.search

    movies.data.forEach(async (m) => {
        await request.api.postMovie(m)

    })
    await page.login.do('admin@zombieplus.com', 'pwd123', 'Admin')
    await page.movies.search(movies.input)

    await page.movies.tableHave(movies.output)
})
