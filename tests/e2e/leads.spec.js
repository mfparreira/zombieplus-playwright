

const { test, expect } = require('../support/')
const { faker } = require('@faker-js/faker');
const { executeSQL } = require('../support/database')

test.beforeAll(async () => {
    await executeSQL('DELETE from leads')
})


test('deve cadastrar um lead na fila de espera', async ({ page }) => {

  const randomName = faker.person.fullName()
  const randomEmail = faker.internet.email()


  await page.leads.visit()
  await page.leads.openLeadModal()
  await page.leads.submitLeadForm(randomName, randomEmail)

  const message = 'Agradecemos por compartilhar seus dados conosco. Em breve, nossa equipe entrará em contato.'
  await page.popup.haveText(message)

});

test('não deve cadastrar quando o email ja existe no banco', async ({ page, request }) => {

  const randomName = faker.person.fullName()
  const randomEmail = faker.internet.email()

  const newLead = request.post('http://localhost:3333/leads', {
    data: {
      name: randomName,
      email: randomEmail
    }
  })

  expect((await newLead).ok).toBeTruthy()

  await page.leads.visit()
  await page.leads.openLeadModal()
  await page.leads.submitLeadForm(randomName, randomEmail)

  const message = 'Verificamos que o endereço de e-mail fornecido já consta em nossa lista de espera. Isso significa que você está um passo mais perto de aproveitar nossos serviços.'
  await page.popup.haveText(message)

});

test('nao deve cadastrar com email incorreto', async ({ page }) => {


  await page.leads.visit()
  await page.leads.openLeadModal()
  
  await page.leads.submitLeadForm('Marcelo Parreira', 'mfp_sk8.hotmail.com')


  await page.leads.alertHaveText('Email incorreto')
});


test('nao deve cadastrar com nome em branco', async ({ page }) => {


  await page.leads.visit()
  await page.leads.openLeadModal()
  await page.leads.submitLeadForm('', 'mfp_sk8@hotmail.com')
  await page.leads.alertHaveText('Campo obrigatório')
});

test('nao deve cadastrar com email em branco', async ({ page }) => {


  await page.leads.visit()
  await page.leads.openLeadModal()
  await page.leads.submitLeadForm('marcelo parreira', '')
  await page.leads.alertHaveText('Campo obrigatório')
});

test('nao deve cadastrar com email e nome em branco', async ({ page }) => {

  await page.leads.visit()
  await page.leads.openLeadModal()
  await page.leads.submitLeadForm('', '')
  await page.leads.alertHaveText(['Campo obrigatório','Campo obrigatório'])
});