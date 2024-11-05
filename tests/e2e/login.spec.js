const {test, expect} = require('../support')

test('deve logar como administrador', async ({page})=> {

    await page.login.visit()
    await page.login.submit('admin@zombieplus.com', 'pwd123')
    await page.movies.isLoggedIn()
})

test('nao deve logar com senha incorreta', async ({page})=> {

    await page.login.visit()
    await page.login.submit('admin@zombieplus.com', 'abc123')

    const mensagem = 'Oops!Ocorreu um erro ao tentar efetuar o login. Por favor, verifique suas credenciais e tente novamente.'
    await page.toast.haveText(mensagem)
})

test('nao deve logar quando o email não é preenchido', async ({page})=> {

    await page.login.visit()
    await page.login.submit('', 'abc123')

    const mensagem = 'Campo obrigatório'
    await page.login.alertHaveText(mensagem)
})


test('nao deve logar quando a senha não é preenchida', async ({page})=> {

    await page.login.visit()
    await page.login.submit('admin@zombieplus.com', '')

    const mensagem = 'Campo obrigatório'
    await page.login.alertHaveText(mensagem)
})

test('nao deve logar quando nenhum campoo é preenchido', async ({page})=> {

    await page.login.visit()
    await page.login.submit('', '')

    const mensagem = 'Campo obrigatório'
    await page.login.alertHaveText([mensagem,mensagem])
})

test('nao deve logar quando o email é inválido', async ({page})=> {

    await page.login.visit()
    await page.login.submit('ashuahsuahs.com.br', 'pwd123')

    const mensagem = 'Email incorreto'
    await page.login.alertHaveText(mensagem)
})