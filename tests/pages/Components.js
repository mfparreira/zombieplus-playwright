const {expect} = require ('@playwright/test')
export class Toast {

    constructor(page){
        this.page = page
    }
        
    async haveText(mensagem) {
        //toastHaveText
        const toast = this.page.locator('.toast')
        await expect(toast).toContainText(mensagem)
        await expect(toast).not.toBeVisible({ timeout: 5000 })
  
    }
}