

const { test, expect } = require('../support/')
const { faker } = require('@faker-js/faker');


test('deve cadastrar um lead na fila de espera', async ({ page }) => {

  const randomName = faker.person.fullName()
  const randomEmail = faker.internet.email()


  await page.landing.visit()
  await page.landing.openLeadModal()
  await page.landing.submitLeadForm(randomName, randomEmail)

  const message = 'Agradecemos por compartilhar seus dados conosco. Em breve, nossa equipe entrará em contato!'
  await page.toast.haveText(message)

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

  await page.landing.visit()
  await page.landing.openLeadModal()
  await page.landing.submitLeadForm(randomName, randomEmail)

  const message = 'O endereço de e-mail fornecido já está registrado em nossa fila de espera.'
  await page.toast.haveText(message)

});

test('nao deve cadastrar com email incorreto', async ({ page }) => {


  await page.landing.visit()
  await page.landing.openLeadModal()
  
  await page.landing.submitLeadForm('Marcelo Parreira', 'mfp_sk8.hotmail.com')


  await page.landing.alertHaveText('Email incorreto')
});


test('nao deve cadastrar com nome em branco', async ({ page }) => {


  await page.landing.visit()
  await page.landing.openLeadModal()
  await page.landing.submitLeadForm('', 'mfp_sk8@hotmail.com')
  await page.landing.alertHaveText('Campo obrigatório')
});

test('nao deve cadastrar com email em branco', async ({ page }) => {


  await page.landing.visit()
  await page.landing.openLeadModal()
  await page.landing.submitLeadForm('marcelo parreira', '')
  await page.landing.alertHaveText('Campo obrigatório')
});

test('nao deve cadastrar com email e nome em branco', async ({ page }) => {

  await page.landing.visit()
  await page.landing.openLeadModal()
  await page.landing.submitLeadForm('', '')
  await page.landing.alertHaveText(['Campo obrigatório','Campo obrigatório'])
});